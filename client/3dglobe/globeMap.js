Template.globeMap.rendered = function() {

  GoogleMaps.load( {'key': Meteor.settings.public.GOOGLE_MAPS_KEY } );

  Meteor.setTimeout( function() { initializeGlobeMap(); }, 500 );
}

Template.globeMap.helpers({
	

  mapWidth: function() { 

    return Session.get("gWindowWidth") * 0.95;

  },

  mapHeight: function() { 

    var _factor = 0.98;

    var h = (Session.get("gWindowHeight") - display.menuHeight) * _factor;

    return h;

  }


})


initializeGlobeMap = function() {
    var options = { zoom: 3.0, position: [47.19537,8.524404] };
    var earth = new WE.map('earth_div', options); 

var _accessToken = Meteor.settings.public.mapboxToken;

var _style = "https://api.mapbox.com/styles/geohackergame/cj5vclxku03e22rph9e6wti30/tiles/256/{z}/{x}/{y}?access_token=" + _accessToken;

var _base = WE.tileLayer(_style,{
          
        }).addTo(earth);


_style = "https://api.mapbox.com/styles/v1/geohackergame/cj5vc8wvg1fl52stl8mos906w/tiles/256/{z}/{x}/{y}?access_token=" + _accessToken;

var _shapes = WE.tileLayer(_style, {} ).addTo(earth);

/*
var arr = db.ghC.find().fetch();

for (var i = 0; i < arr.length; i++) {

      var _name = arr[i].n.toUpperCase();

      var _font = "arial 18px bold";

      var _width = getTextWidth(_name, _font);

      var marker = WE.marker([ arr[i].cla, arr[i].clo ]).addTo(earth);

      marker.bindPopup('<div style="color:black; font-face:Arial; font-size:14px; font-weight:bold; text-align: left;";>' + _name + '</div>', _width, false);
    }

*/

  }


showInfo = function(e) {

  var geocoder = new google.maps.Geocoder;

  var latlng = {lat: e.latitude, lng: e.longitude};
      
  geocoder.geocode({'location': latlng}, function(results, status) {
            if (status === 'OK') {
              if (results[1]) {


                console.log( results[1]);

              } else {
                 c('No results found');
              }
            } else {
              c('Geocoder failed due to: ' + status);
            }
          });
  }


getTextWidth = function(text, font) {
    // re-use canvas object for better performance
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}
