//*************************************************************************
//              TEMPLATE HELPERS FOR BROWSE WORLD MAP
//*************************************************************************
Template.browseWorldMap.helpers({
  
  storyMode: function() {

    if (browseMap.mode.get() == "story") return true;

    return false;
  },

  notExerciseMode: function() {

    if (browseMap.mode.get() == "exercise") return false;

    return true;
  },

  exerciseMode: function() {

    if (browseMap.mode.get() == "exercise") return true;

    return false;
  },

  browseMapHeadline: function() {

    if (browseMap.mode.get() == "exercise") return "";     

    if (browseMap.mode.get() == "story") return "CLICK ANY COUNTRY TO GO THERE";      

     return "PICK A COUNTRY TO EXPLORE";
  },

  browseMapLeft: function() {

//return ( $(window).width() * 0.03) + "px";

    if (browseMap.mode.get() == "exercise") return "16px";

    return "0px";

  },

  browseMode: function() {

    if (browseMap.mode.get() == "browse") return true;

    return false;

  },

  getDebriefType: function() {

      return ( db.getDebriefType( this, browseMap.worldMap.selectedCountry.get() ) );
  },

  getText: function() {

      return ( db.getTagText( this, browseMap.worldMap.selectedCountry.get() ) );
  },

  getTagURL: function() {

      return ( db.getTagURL( this, browseMap.worldMap.selectedCountry.get() ) );
  },

  continentName: function() { 

    var updateFlag = browseMap.worldMap.updateFlag.get();

    var map =  browseMap.worldMap;

    if (map.selectedContinent.length) return db.getContinentName( map.selectedContinent );

  },

  regionName: function() { 

    var updateFlag = browseMap.worldMap.updateFlag.get();

    var map =  browseMap.worldMap;

    if (map.selectedRegion.length) return db.getRegionName( map.selectedRegion );
  },

  continentIcon: function() { 

    var updateFlag = browseMap.worldMap.updateFlag.get();

    var map =  browseMap.worldMap;

    if (map.selectedContinent.length) {

      return map.selectedContinent + "_icon.png";
    }
  },

  regionIcon: function()  { 

    var updateFlag = browseMap.worldMap.updateFlag.get();

    var map =  browseMap.worldMap;

    if (map.selectedRegion.length) {

      return map.selectedRegion + "_icon.png";
    }

  },

  labelYCorrection: function() {

    var level = browseMap.worldMap.updateFlag.get();

    var map =  browseMap.worldMap;

    if (map.selectedRegion.length) {

        var rec = db.ghR.find( {c: map.selectedRegion } ).fetch();

        if (rec[0].lc < 0) {

          var height = $("#browseRegionIcon").height();

          var correction = (rec[0].lc * height) / 100;

          return (correction + "px");
        }
        else {

          return "0px";
        }
      }
  },

  mapWidth: function() { 

    if (browseMap.mode.get() == "exercise")  return Session.get("gWindowWidth") * 0.6;

    return Session.get("gWindowWidth") * 0.89;

  },

  exerciseClueWidth: function() { 

    return Session.get("gWindowWidth") * 0.37;

  },

  mapHeight: function() { 

    var _factor = 0.98;

    var _mode = browseMap.mode.get();

    if ( _mode == "story" || _mode == "exercise") _factor = 0.81;

    var h = (Session.get("gWindowHeight") - display.menuHeight) * _factor;

    return h;

  }
});


Template.browseWorldMap.events = {

  'click #browseRegionIcon': function (evt, template) {

    display.playEffect("mapBackup.mp3");

    var d = browseMap.worldMap;

    d.doClearButton(0);

    d.backupMap( mlRegion );

    d.doLabelRegion( d.selectedRegion )
  },

  'click #browseContinentIcon': function (evt, template) {

    display.playEffect("mapBackup.mp3");

    var d = browseMap.worldMap;

    d.doClearButton(0);

    d.backupMap( mlContinent );

    d.labelAllRegions();
  },

  'click #browseWorldIcon': function (evt, template) {

    display.playEffect("mapBackup.mp3");

    var d = browseMap.worldMap;

    d.doClearButton(0);

    d.backupMap( mlWorld );
  },

  'click #browseMapClose': function (evt, template) {

      display.playEffect("new_feedback.mp3");

      //we are returning from a trip to the map (off the home screen)

      if (game.user.mode == uBrowseMap) {

          //countryCode wasn't set, so we must have been browsing

          FlowRouter.go("/home")

          game.user.goHome();

          return;
      }
  },

  'click .imgMapTag': function (evt, template) {

      display.playEffect("new_feedback.mp3");

      browseMap.worldMap.mapTagImage = evt.target.src;
  },

  'click #tagClear': function (evt, template) {

      var _ticket = game.user.getTicket( browseMap.worldMap.selectedCountry.get() );

      _ticket.tag.length = 0;

      db.updateUserHacks();

      browseMap.worldMap.doCurrentMap();
  }
}


testmap = function() {

    mapboxgl.accessToken = 'pk.eyJ1IjoiZ2VvaGFja2VyZ2FtZSIsImEiOiJjajF0bmdsazEwMHRpMndxa3g5ejA3azBkIn0.hj99DCrI-6Ikb90g3T2p-w';
map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/geohackergame/cj20h0zm0001a2spl2bixyn11',
    //center: [16.614, 38.134],
    //zoom: 1.5 // starting zoom

    center: [31.33, -6.298],
    zoom:  3.8// starting zoom   
    });


    map.on('style.load', function () {

          map.addSource("lake_labels", {
              "type": "geojson",
              "data": {
                  "type": "FeatureCollection",
                  "features": [

                  {
                      "type": "Feature",
                      "geometry": {
                          "type": "Point",
                          "coordinates": [33.164, -1.232]
                      },

                      "properties": {
                        "title": "Lake Victoria"
                      }
                  },

                  {
                      "type": "Feature",
                      "geometry": {
                          "type": "Point",
                          "coordinates": [28.5, -6.186]
                      },

                      "properties": {
                        "title": "Lake Tanganyika"
                      }
                  },

                  {
                      "type": "Feature",
                      "geometry": {
                          "type": "Point",
                          "coordinates": [34.450, -12.117]
                      },

                      "properties": {
                        "title": "Lake Malawi"
                      }
                  },                                 
                ] 
              }
            });

          map.addLayer({
              "id": "lake_labels",
              "type": "symbol",
              "source": "lake_labels",
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
                  "text-anchor": "center"

              }
          });
        });

}

//*************************************************************************
//              RENDERED CALLBACK
//*************************************************************************


Template.browseWorldMap.rendered = function () {
  
/*

Meteor.setTimeout( function() { testmap() } , 500 );
    stopSpinner();

return;
*/

    //get ready to show the country on the map

    if (game.user.mode == uBrowseCountry) {

        browseMap.worldMap.mapLevel = mlCountry;

    }

    var _showNames = true;

    if (game.user.mode == uStory || game.user.mode == uEditStory ) {

      story.fadeOutAll();

      if (story.mode.get() == "exercise") {

        story.em.go();

        return;
      }

      story.blurBG();
    }

    Meteor.setTimeout( function() { browseMap.worldMap.doCurrentMap( true ) }, 250 );  //show the names on the map, by default

    Meteor.setTimeout( function() { browseMap.finishDraw() }, 251 );


}
