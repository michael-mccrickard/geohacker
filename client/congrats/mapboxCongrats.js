//exercise.js
Template.mapboxCongrats0.rendered = function() {

	//Create the ghMapbox object which will create the map object; then the
	//on.load callback will call this.mapboxReady()

//simulate the mission object already having the correct sequence
//the sequence object has a hardcoded mission object for now

mission = new Mission();

	display.fadeInElement("#mbCongratsInfo", 1000);

	Meteor.setTimeout( function() { display.fadeOutElement("#mbCongratsInfo", 1000);}, 4000 );	

	Meteor.setTimeout( function() { FlowRouter.go("mapboxCongrats1") }, 4500)	

	//Meteor.setTimeout( function() { $("#mbCongratsInfo").css("display", "none"); }, 4500)	

	//Meteor.setTimeout( function() { display.mapboxCongrats = new ghMapboxCongrats( mission.sequence ); }, 4501 );	
}

Template.mapboxCongrats1.rendered = function() {

	display.fadeInElement("#mbCongratsHeader2", 1000);

	Meteor.setTimeout( function() { display.fadeOutElement("#mbCongratsHeader2", 1000);}, 2000 );	

	Meteor.setTimeout( function() { FlowRouter.go("mapboxCongrats") }, 3501);	
}

Template.mapboxCongrats.rendered = function() {

	display.mapboxCongrats = new ghMapboxCongrats( mission.sequence );
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

ghSequenceMove = function() {

 	this.start = [10.523, 35.648];

 	this.finish =  [10.523, 35.648];

 	this.startZoom = 2.1;

 	this.finishZoom = 2.1;

 	this.startPitch = 0;

 	this.finishPitch = 0;

 	this.startBearing = 0;

 	this.finishBearing = 0;
}

ghMapboxSequence = function() {

 	this.continent = "";

 	this.region = "";

 	this.dt = "";

 	this.picType = 0;

 	this.textType = 0;

	this.iconWidth = 64;

	this.iconHeight = 64;

 	this.move = [];

 	//***************

	this.continent = "north_america";

	this.region = "cam";

	this.dt = "ldr";

	this.textType = cCountry;

	this.picType = cLeader;


	//move 0

	var _move = new ghSequenceMove();

 	_move.start = [-79, 8.6];

 	_move.finish = [-92.9, 21.4];

 	_move.startZoom = 7.7;

 	_move.finishZoom = 7.7;

 	_move.startBearing = -56.7;

 	_move.finishBearing = -56.7;

 	_move.startPitch = 60;

 	_move.finishPitch = 60;

 	this.move.push( _move );

 	//move 1
/*
	var _move = new ghSequenceMove();

 	_move.finish = [-84.6, 15.5];

 	_move.finishZoom = 5.17;

 	_move.finishBearing = -10.9;

 	_move.finishPitch = 60;

 	this.move.push( _move );
*/

}
 

 ghMapboxCongrats = function(_seq) {

 	this.seq = _seq;

 	this.moveIndex = 0;

 	this.move = this.seq.move[0];

 	this.startDelay = 1000;

 	this.flashIndex = 0;

    mapboxgl.accessToken = Meteor.settings.public.mapboxToken;
	
	this.map = new mapboxgl.Map({

    	container: 'mmapCongrats',

    	style: 'mapbox://styles/geohackergame/cj6jgede667t62sqjhsgy8xft',

    	center: this.move.start,

    	zoom: this.move.startZoom, // starting zoom

    	bearing: this.move.startBearing,

    	pitch: this.move.startPitch  //,

    	//maxBounds: [ [-170, -90], [190, 90] ]

    });

	this.map.getCanvas().style.cursor = 'pointer';

	this.map.on('load', function () { 

		var _map = display.mapboxCongrats;

		_map.subscribeToData();

	});

	this.map.on('moveend', function(e){

		var _map = display.mapboxCongrats;

		if (_map.moveIndex < _map.seq.move.length - 1) {

			_map.startDelay = 0;

			_map.moveIndex++;

			_map.move = _map.seq.move[ _map.moveIndex ];

			_map.fly();
		}
		else {

			//display.fadeOutElement("div#mmapOuterDiv", 2500);
		}
	});

	this.subscribeToData = function() {


 	Session.set("sCongratsImageDataReady", false);

	Session.set("sCongratsTextDataReady", false);

	Session.set("sCongratsAnthemDataReady", false);

		Meteor.subscribe("congratsImages", this.seq.continent, this.seq.region, this.seq.dt, function() { 

 			Session.set("sCongratsImageDataReady", true);

		 });

		Meteor.subscribe("congratsTexts", this.seq.continent, this.seq.region, this.seq.dt, function() { 

 			Session.set("sCongratsTextDataReady", true);

		 });			
	}

	this.subscribeToAnthems = function() {

		Session.set("sCongratsAnthemDataReady", false);

		Meteor.subscribe("congratsAnthems", function() { 

 			Session.set("sCongratsAnthemDataReady", true);

		 });

	}

	this.startSequence = function() {

		display.mapboxCongrats.finishSequence();

		Meteor.setTimeout( function() { display.fadeOutElement("div#mmapOuterDiv", 500); }, 14000 );
	}

	this.finishSequence = function() {

		game.pauseMusic();

		var _arr = db.ghSound.find( { dt: "ant"} ).fetch();

		var _url = Database.getRandomElement( _arr ).u;

		display.playEffect( _url );

		this.showIcons();

		display.fadeInElement("div#mmapOuterDiv", 1000);

		this.fly();
	}

	this.fly = function() {

		Meteor.setTimeout( function() { display.mapboxCongrats.map.flyTo({

		        // These options control the ending camera position
		        center: display.mapboxCongrats.move.finish,

		        zoom: display.mapboxCongrats.move.finishZoom,

				bearing: display.mapboxCongrats.move.finishBearing,

		        speed: 0.1, // make the flying slow
		        
		        curve: 1, // change the speed at which it zooms out

		        // This can be any easing function: it takes a number between
		        // 0 and 1 and returns another number between 0 and 1.
		        easing: function (t) {
		            return Math.sin(t * Math.PI / 2);
		        }
		    });

		}, this.startDelay);

	}


	this.showIcons = function() {

		var _arrRegion = db.ghR.find( { z: this.seq.continent } ).fetch();

		if (this.seq.region.length) {

			_arrRegion = [ this.seq.region ];
		}
		else {

			_arrRegion = Database.makeSingleElementArray( _arrRegion, "c");
		}

		for (var i = 0; i < _arrRegion.length; i++) {

			var _region = _arrRegion[i];


			var _arr = db.ghC.find( { r: _region } ).fetch();


			for (var j = 0; j < _arr.length; j++ ) {

				var _obj = db.ghC.findOne( { c: _arr[j].c } );

				var _lon = _obj.clo;

				var _lat = _obj.cla;

				var _lngLat = [_lon, _lat];

				var _labelText = "";

				if (this.seq.textType == cLeader) _labelText = db.getLeaderName( _obj.c );

				if (this.seq.textType == cCountry) _labelText =_obj.n;				

				this.addLabel( _obj.c, _lngLat, _labelText, "show", _obj.ll_co)

				var _URL = "";

				if (this.seq.picType == cFlag) _URL  = db.getFlagPicByCode( _obj.c );

				if (this.seq.picType == cLeader) _URL  = db.getLeaderPic( _obj.c );

				  // create a HTML element for each feature
				  var el = document.createElement('div');
				  el.className = 'marker';
				  
				  el.style = "background-size: cover; background-image: url(" + _URL + ");width: " + this.seq.iconWidth + "px;height: " + this.seq.iconHeight + "px;border-radius: 10%;cursor: pointer;";

				  // make a marker for each feature and add to the map
				  new mapboxgl.Marker(el, { offset: [-1 * this.seq.iconWidth / 2, -1 * this.seq.iconHeight / 2] })
				  .setLngLat( [_lon, _lat] )
				  .addTo( display.mapboxCongrats.map );



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

		if (typeof display === 'undefined') return;

		console.log("calling subscribeToAnthems")

//display.mapboxCongrats.startSequence();


		  display.mapboxCongrats.subscribeToAnthems(); 
  } 
  else {

  	console.log("congrats map data not ready")

  }

});  

Tracker.autorun( function(comp) {

  if (Session.get("sCongratsAnthemDataReady")) {

        console.log("congrats anthem data ready")

		if (typeof display === 'undefined') return;

		console.log("calling startSequence")

		  display.mapboxCongrats.startSequence(); 
  } 
  else {

  	console.log("congrats anthem data not ready")

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

