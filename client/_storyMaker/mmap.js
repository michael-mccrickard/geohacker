 testmap = function() {

	story.showMapboxMap.set(1);

	Meteor.setTimeout( function() { if (!story.mapbox) story.mapbox = new ghMapbox(); }, 1000 );

}

 ghMapbox = function() {

 	this.flashIndex = 0;

    mapboxgl.accessToken = Meteor.settings.public.mapboxToken;
	
	this.map = new mapboxgl.Map({

    	container: 'mmap',
    	style: 'mapbox://styles/geohackergame/cj2ki5knb000d2rl2iveavihh',

    	center: [10.523, 35.648],
    	zoom: 1.3, // starting zoom

    	maxBounds: [ [-170, -90], [190, 90] ]

    });

	this.map.getCanvas().style.cursor = 'pointer';

	this.map.on('load', function () { 

		story.mapboxReady();
	});


	this.hideLabel = function(_layerID) {

		this.map.setLayoutProperty(_layerID, 'visibility', 'none');
	}

	this.showLabel = function(_layerID) {

		this.map.setLayoutProperty(_layerID, 'visibility', 'visible');
	}

	this.addLabel = function( _layerName, _arr, _title) {

          this.map.addSource(_layerName, {

              "type": "geojson",
              "data": {
                  "type": "FeatureCollection",
                  "features": [

                  {
                      "type": "Feature",
                      "geometry": {
                          "type": "Point",
                          "coordinates": _arr
                      },

                      "properties": {
                        "title": _title
                      }
                  }
              	]
              }
           });

          this.addLabelLayer(_layerName);
    }

	this.addLabelLayer = function( _id, _visibleFlag ) {

		var _layerID = "l_" + _id;

		var _visible = "none";

		if (_visibleFlag) _visible = "visible";

		this.map.addLayer({

			  "id": _layerID,
			  "type": "symbol",
			  "source":  _id,
			  "minzoom": 3,
			  "maxzoom": 21,
			  "paint": {
			    "text-color": "#00008B"
			  },
			  "layout": {

			      "text-field": "{title}",
			      "text-size": {
			        "stops": [

			          // zoom is 3 -> fontsize will 8px
			          [3, 12],

			          [6, 16],

			          [9, 24],

			          [12, 36]
			        ]
			      },
			      "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
			      "text-anchor": "center",
			      "visibility": _visible

			  }
		});

	}

	this.fillCountries = function( _arrRegions )  {

		var _map = story.mapbox.map;

		_map.setPaintProperty('admin_level_2', 'line-opacity', 0);

		_map.setPaintProperty('admin_level_3', 'line-opacity', 0);

		var newline = "\n\r";

		 var _s0 = 'story.mapbox.map.addLayer(' + newline;

		  var _s1 = '{' + newline + '"id": "';

		  var _s2 = '",' + newline + '"type": "fill",' + newline + '"source": "composite",'  + newline + '"source-layer": "ne_10m_admin_0_countries_1-drrv7p",'  + newline + '"filter": ['  + newline +'"==",'  + newline + '"ADM0_A3_IS",'  + newline + '"';  
		  
		  var _s3 =  '"' + newline + '],' + newline + '"layout": {' + newline + '"visibility": "visible"' + newline + '},' + newline + '"paint": {' + newline + '"fill-color": "';

		  var _s4 = '"' + newline + '}' + newline + '}, "lakes"' + newline + ');' + newline;

		  var _s = "";


		  var _arr = db.ghC.find( { r: { $in: _arrRegions  } }).fetch();

		  for (var i = 0; i < _arr.length; i++) {

			    _s = "";

			    var _obj = _arr[i];

			    var _code = _obj.d;  //the 3 letter code

			    var _name = _obj.c;

			    var _color = _obj.co;


			    _s = _s + _s0 + _s1 + _name + _s2 + _code + _s3 + _color + _s4;

				eval( _s );

		  }

	  }


	  this.setLayerClickHandler = function( _layer, _function) {

	      this.map.on('click', 'lakes', _function);

      }

      this.flashCountry = function(_ID, _times) {

      	this.map.setPaintProperty(_ID, "fill-opacity-transition": { "duration": 0.5 } );

      	this.map.setPaintProperty(_ID, 'fill-opacity', 1);

      	this.flashIndex = 0;

      	this.flashLength= 3;

      	if (_times) this.flashLength = _times;

		Meteor.setTimeout( function() { story.mapbox.doFlash(_ID) }, 100 );

	  }

	  this.doFlash = function(_ID) {

	  	 if (this.flashIndex > this.flashLength) {

	  	 	this.map.setPaintProperty(_ID, 'fill-opacity', 1);  

	  	 	return;
	  	 }

      	 if (this.map.getPaintProperty(_ID, 'fill-opacity') == 1) {

      		this.map.setPaintProperty(_ID, 'fill-opacity', 0); 

      		this.flashIndex++;   

      	 }	  	
      	 else {

      		this.map.setPaintProperty(_ID, 'fill-opacity', 1);  
      	 }
			
		 Meteor.setTimeout( function() { story.mapbox.doFlash(_ID) }, 500 );

      }

}




