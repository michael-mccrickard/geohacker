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

      if (display == null) {

        display = new Display();

        display.init( Meteor.user().profile.cc )

      }

      Meteor.defer( function() { FlowRouter.go("/browseWorldMap"); } );

  },

});


