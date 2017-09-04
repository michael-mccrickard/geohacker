
var deadline = 0;


Template.mapboxCongrats0.rendered = function() {

	//Create the ghMapbox object which will subscribe to the data
	//Once the data has come in, the Tracker.autorun will switch templates
	//and template.rendered will start the sequence

/*
mission = new Mission("pg");
*/

	mission.sequence = new ghMapboxSequence( mission.code, cLeader, cCountry); 

	display.mapboxCongrats = new ghMapboxCongrats( mission.sequence );

	var _time = parseInt( (mission.finish - mission.start) / 1000 );

	_time = _time.toFixed(2);

	$("#mbCongratsMission").text( mission.name.toUpperCase() );

	var _s = game.user.assign.hacked.length + " countries hacked in " + (_time) + " seconds"

	$("#mbCongratsStats").text( _s.toUpperCase() );	

	$("#mbCongratsAgent").text( "AGENT " + game.user.name.toUpperCase() );	

	$("#mbCongratsPic").attr("src", game.user.avatar() );	

	display.fadeInElement("#mbCongratsInfo", 1000);

	var _delay = 4500;

	deadline = _delay + Date.now();

}

Template.mapboxCongrats.rendered = function() {

	display.mapboxCongrats.drawMap();
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




 ghMapboxCongrats = function(_seq) {

 	this.seq = _seq;

 	this.moveIndex = 0;

 	this.move = this.seq.move[0];

 	this.startDelay = 1000;

 	this.flashIndex = 0;

 	Session.set("sCongratsImageDataReady", false);

	Session.set("sCongratsTextDataReady", false);

	Session.set("sCongratsAnthemDataReady", false);

	this.arrCountries = Database.getCountryCodes( this.seq.code );

	Meteor.subscribe("congratsImages", this.arrCountries, this.seq.dt, function() { 

			Session.set("sCongratsImageDataReady", true);

	 });

	Meteor.subscribe("congratsTexts", this.arrCountries, this.seq.dt, function() { 

			Session.set("sCongratsTextDataReady", true);

	 });	

	//write the headline based on the seq

	this.headline = new Headline("mapboxCongrats")

	this.headlineText = "";

	var _s = "The "; 

	if (this.seq.picType == cLeader) _s = _s + "leaders of ";

	if (this.seq.picType == cCountry) _s = _s + "nations of ";

	_s = _s + mission.congratsName;


	this.headlineText = _s + " salute Agent " + game.user.name + "!"; 


	this.drawMap = function() {

	  mapboxgl.accessToken = Meteor.settings.public.mapboxToken;
		
		this.map = new mapboxgl.Map({

	    	container: 'mmapCongrats',

	    	style: 'mapbox://styles/geohackergame/cj72b3kyb1h9f2rqna4gxk70b',

	    	center: this.move.start,

	    	zoom: this.move.startZoom, // starting zoom

	    	bearing: this.move.startBearing,

	    	pitch: this.move.startPitch  //,

	    	//maxBounds: [ [-170, -90], [190, 90] ]

	    });

		this.map.getCanvas().style.cursor = 'pointer';

		this.map.on('load', function () { 

			var _map = display.mapboxCongrats;

			_map.startSequence();


		});

		this.map.on('moveend', function(e){

			var _map = display.mapboxCongrats;

			_map.startDelay = 0;

			_map.moveIndex++;

			if (_map.moveIndex == _map.seq.move.length) {

				Meteor.setTimeout( function() { display.fadeOutElement("div#mmapOuterDiv", 500); }, 1000 );

				Meteor.setTimeout( function() { FlowRouter.go("/congrats") }, 1501 ) ;

				return;					
			}

			_map.move = _map.seq.move[ _map.moveIndex ];

			_map.fly();


		});

	}

	this.subscribeToData = function() {

	}

	this.subscribeToAnthems = function() {

		Session.set("sCongratsAnthemDataReady", false);

		var _arr = Database.getCountryCodes( this.seq.code );

		Meteor.subscribe("congratsAnthems", this.arrCountries, function() { 

 			Session.set("sCongratsAnthemDataReady", true);

		 });

	}

	this.startSequence = function() {

		display.fadeOutElement("#mbCongratsInfo", 1000);	

		display.mapboxCongrats.startSequence2();

		Meteor.setTimeout( function() { display.mapboxCongrats.headline.setThisAndType( display.mapboxCongrats.headlineText ) }, 2000 );
	}

	this.startSequence2 = function() {

		game.pauseMusic();

		var _arr = db.ghSound.find( { dt: "ant"} ).fetch();

		var _url = Database.getRandomElement( _arr ).u;

		display.playEffect( _url );

		this.showIcons();

		display.fadeInElement("div#mmapOuterDiv", 1000);

		this.fly();
	}

	this.fly = function() {
//return;

		Meteor.setTimeout( function() { display.mapboxCongrats.map.flyTo({

		        // These options control the ending camera position
		        center: display.mapboxCongrats.move.finish,

		        zoom: display.mapboxCongrats.move.finishZoom,

				bearing: display.mapboxCongrats.move.finishBearing,

		        speed: display.mapboxCongrats.move.speed, // make the flying slow

		        pitch: display.mapboxCongrats.move.finishPitch,
		        
		        curve: 1, // change the speed at which it zooms out

		        // This can be any easing function: it takes a number between
		        // 0 and 1 and returns another number between 0 and 1.

		        easing: function (t) {
		        
		            return t;
		        }
		    });

		}, this.startDelay);

	}


	this.showIcons = function() {


		for (var j = 0; j < this.arrCountries.length; j++ ) {

			var _obj = db.ghC.findOne( { c: this.arrCountries[j] } );

			var _lon = _obj.clo;

			var _lat = _obj.cla;

			var _lngLat = [_lon, _lat];

			var _labelText = "";

			if (this.seq.textType == cLeader) _labelText = db.getLeaderName( _obj.c );

			if (this.seq.textType == cCountry) _labelText =_obj.n;				

this.seq.iconWidth = 64;

this.seq.iconHeight = 64;

var _arrBig = ["CA","US","MX","GL","AR","BR", "CN", "IN", "RU"];

if ( _arrBig.indexOf( _obj.c ) != -1) {

this.seq.iconWidth = 128;

this.seq.iconHeight = 128;
}



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

		var _factor = 1;

		var _offsetFactor = 1;

		if (this.seq.iconWidth == 128) {

			_factor = 2;

			_offsetFactor = 1.25;

var _arrFar = ["GL", "CA", "RU", "TR"];

if ( _arrFar.indexOf(_id) != -1) {

	_factor = 2.5;
	
	_offsetFactor = 2.1;

	if (_id == "TR") _offsetFactor = 7.0;

}

		}

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
			          [3, 12 * _factor],

			          [6, 16 * _factor],

			          [9, 24 * _factor],

			          [12, 36 * _factor]
			        ]
			      },
			      "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
			      "text-anchor": "center",
			      "text-offset": [0, 2.5 * _offsetFactor],
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


		if (Date.now() < deadline) {

			//we still have a little time to kill ...

			var _delay = deadline - Date.now();

			if (_delay > 1000) {

				Meteor.setTimeout( function() { display.fadeOutElement("#mbCongratsInfo", 1000);}, _delay - 1000 );	
			}
			else {
				
				display.fadeOutElement("#mbCongratsInfo", 1000);

				_delay += 1000 - _delay;

			}

			Meteor.setTimeout( function() { FlowRouter.go("/mapboxCongrats"); }, _delay);
		}
		else {

			display.fadeOutElement("#mbCongratsHeader", 1000);

			Meteor.setTimeout( function() { FlowRouter.go("/mapboxCongrats"); }, 1001);
		}

	}

  else {

  	console.log("congrats anthem data not ready")

  }

});  

mb = function() {

	var _map = display.mapboxCongrats.map;

	var _s = "lng: " + _map.transform._center.lng + "  lat: " + _map.transform._center.lat + "  zoom: " + _map.getZoom() + "   bearing: " + _map.getBearing()  + "   pitch: " + _map.getPitch(); 

	console.log( _s );
}

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

