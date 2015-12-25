//home.js

Template.home.helpers({

    homeContent: function() {

        return game.user.template.get();
    },

});

Template.home.events({

  'click #divHomeUser': function(e) {

      e.preventDefault();  

      game.user.setMode( uProfile );

  },

  'click #divHomeHackPic': function(e) {

      e.preventDefault();  

      game.user.setMode( uHack );

  },

  'click #divHomeStatsPic': function(e) {

      e.preventDefault();  

      game.user.setMode( uStats );

  },

  'click #divHomeClockOutPic': function(e) {

      e.preventDefault();  

      game.user.setMode( uClockOut );

  },

  'click #divHomeMapPic': function(e) {

      e.preventDefault();  

//this method is temporary, just for dev

//it will wreck any mission / hack in progress

var countryCode = Meteor.user().profile.cc;

display = new Display();

mission = new Mission();

mission.code = "browse";

mission.browseCode = countryCode;

display.init( countryCode );

var mapCtl = display.ctl["MAP"];

mapCtl.level.set( mlCountry );

mapCtl.setStateOnly( sMapDone );

hack = new Hack();

c("before hack init")

hack.init();

map.selectedContinent = hack.continentCode;

map.selectedRegion = hack.regionCode;

map.selectedCountry = hack.countryCode;

c("before go")

Meteor.defer( function() { FlowRouter.go("/browseWorldMap"); } );

  },

});


