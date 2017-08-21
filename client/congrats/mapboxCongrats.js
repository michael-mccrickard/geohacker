//exercise.js
Template.mapboxCongrats.rendered = function() {

	//Create the ghMapbox object which will create the map object; then the
	//on.load callback will call this.mapboxReady()

	Meteor.setTimeout( function() { display.mapboxCongrats = new ghMapboxCongrats(); }, 1000 );	
}

Template.mapboxCongrats.helpers({

	MMapLeft: function() {

	 	return $(window).width() * 0.05;
	},

	MMapWidth: function() {

	 	return $(window).width() * 0.92;
	},

	MMapHeight: function() {

	 	return $(window).height() * 0.9;

	}

});


mapFeatureCongrats = function(_ID, _name, _type) {

	if (_ID) this.ID = _ID;

	if (_name) this._name = _name;

	if (_type) this.ID = _type;

}
 

 ghMapboxCongrats = function() {

 	this.flashIndex = 0;

 	this.continent = "";

 	this.region = "";

 	this.dt = "";

 	this.picType = 0;

 	this.textType = 0;


    mapboxgl.accessToken = Meteor.settings.public.mapboxToken;
	
	this.map = new mapboxgl.Map({

    	container: 'mmapCongrats',

    	style: 'mapbox://styles/geohackergame/cj6jgede667t62sqjhsgy8xft',

    	center: [10.523, 35.648],
    	zoom: 3.1, // starting zoom

    	maxBounds: [ [-170, -90], [190, 90] ]

    });

	this.map.getCanvas().style.cursor = 'pointer';

	this.map.on('load', function () { 

		var _map = display.mapboxCongrats;

		_map.continent = "asia";

		_map.region = "";

		_map.dt = "ldr";

		_map.textType = cLeader;

		_map.picType = cLeader;

		_map.iconWidth = 64;

		_map.iconHeight = 64;

		_map.subscribeToData();

	});

	this.subscribeToData = function() {


 	Session.set("sCongratsImageDataReady", false);

	Session.set("sCongratsTextDataReady", false);

		Meteor.subscribe("congratsImages", this.continent, this.region, this.dt, function() { 

c("data received for congrats images")

 			Session.set("sCongratsImageDataReady", true);

		 });


		Meteor.subscribe("congratsText", this.continent, this.region, this.dt, function() { 

c("data received for congrats text")

 			Session.set("sCongratsTextDataReady", true);

		 });			
	}

	this.startSequence = function() {


	}


	this.showIcons = function() {
c("showIcons")
		var _arrRegion = db.ghR.find( { z: this.continent } ).fetch();

		if (this.region.length) {

			_arrRegion = [ this.region ];
		}
		else {

			_arrRegion = Database.makeSingleElementArray( _arrRegion, "c");
		}

c("arrRegion in showIcons follows")
c(_arrRegion)

		for (var i = 0; i < _arrRegion.length; i++) {

			var _region = _arrRegion[i];
c("region code in showICons is " + _region)

			var _arr = db.ghC.find( { r: _region } ).fetch();
c("arr of countries with region code " +  _region + " follows")
c(_arr)

			for (var j = 0; j < _arr.length; j++ ) {

				var _obj = db.ghC.findOne( { c: _arr[j].c } );

				var _lon = _obj.clo;

				var _lat = _obj.cla;

				var _lngLat = [_lon, _lat];

				var _labelText = "";

				if (this.textType == cLeader) _labelText = db.getLeaderName( _obj.c );

				if (this.textType == cCountry) _labelText =_obj.n;				

				this.addLabel( _obj.c, _lngLat, _labelText, "show", _obj.ll_co)

				var _URL = "";

				if (this.picType == cFlag) _URL  = db.getFlagPicByCode( _obj.c );

				if (this.picType == cLeader) _URL  = db.getLeaderPic( _obj.c );

				  // create a HTML element for each feature
				  var el = document.createElement('div');
				  el.className = 'marker';
				  
				  el.style = "background-size: cover; background-image: url(" + _URL + ");width: " + this.iconWidth + "px;height: " + this.iconHeight + "px;border-radius: 10%;cursor: pointer;";

				  // make a marker for each feature and add to the map
				  new mapboxgl.Marker(el, { offset: [-1 * this.iconWidth / 2, -1 * this.iconHeight / 2] })
				  .setLngLat([_lon, _lat])
				  .addTo(display.mapboxCongrats.map);



			}
		}


	}

	this.showIcon = function(_ID, _lng, _lat, _size) {

		var _map = display.mapboxCongrats.map;
		    
		c("showIcon ID is " + _ID)

		_map.addLayer({
		    "id": _ID,
		    "type": "symbol",
		 	"source": {
		                "type": "geojson",
		                "data": {
		                    "type": "FeatureCollection",
		                    "features": [{
		                        "type": "Feature",
		                        "geometry": {
		                            "type": "Point",
		                            "coordinates": [_lng, _lat]
		                        }

		                    }]
		                }
		            }
		});

	}

	this.hideLabel = function(_layerID) {

		this.map.setLayoutProperty(_layerID, 'visibility', 'none');
	}

	this.showLabel = function(_layerID) {

		this.map.setLayoutProperty(_layerID, 'visibility', 'visible');
	}

	this.addLabel = function( _layerName, _arr, _title, _visibleFlag, _color) {

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

          this.addLabelLayer(_layerName, _visibleFlag, _color);
    }

	this.addLabelLayer = function( _id, _visible, _color ) {

		var _layerID = "l_" + _id;

		var _visibleFlag = "none";

		if (_visible == "show") {

			_visibleFlag = "visible";
		}

		var _textColor = "#00008B";

		if (_color !== undefined) _textColor = _color;

		this.map.addLayer({

			  "id": _layerID,
			  "type": "symbol",
			  "source":  _id,
			  "minzoom": 3,
			  "maxzoom": 21,
			  "paint": {
			    "text-color": _textColor,
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
			      "text-offset": [0, 2.5],
			      "text-anchor": "top",
			      "visibility": _visibleFlag

			  }
		});

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


Tracker.autorun( function(comp) {

  if (Session.get("sCongratsImageDataReady") && Session.get("sCongratsTextDataReady")) {

          console.log("congrats map data ready")
c("calling showIcons")
		  display.mapboxCongrats.showIcons(); 
  } 
  else {

  	console.log("congrats map data not ready")

  }

});  

/*
				_map.addLayer({
				    "id": _ID,
				    "type": "symbol",
				    "source": "markers",
				    "layout": {
				        "icon-image": "{marker-symbol}-15",
				        "text-field": "{title}",
				        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
				        "text-offset": [0, 0.6],
				        "text-anchor": "top"
				    }
				});

*/


/*   Adding picture as an image layer

		display.mapboxCongrats.map.addSource('testID', {
		   type: 'image',
		   url: 'https://s3.amazonaws.com/gh-resource/ghImage/Hassanal_Bolkiah.jpg',
		   coordinates: [
               [-80.425, 46.437],
               [-71.516, 46.437],
               [-71.516, 37.936],
               [-80.425, 37.936]
		   ]
		});

		display.mapboxCongrats.map.addLayer({

			  "id": "testLayerID",
			  "type": "raster",
			  "source":  "testID",
			  "minzoom": 3,
			  "maxzoom": 21,

			  "layout": {

			      "visibility": "visible"

			  }
		});
*/

