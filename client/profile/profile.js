//profile.js

Template.profile.helpers({

    flag: function() {

        return db.getFlagPicByCode( game.user.profile.cc );
    },

    country: function() {

    	return db.getCountryName( game.user.profile.cc ).toUpperCase();
    },

    utext: function() {

    	return game.user.profile.text;
    },

});

Template.profile.events({

  'click #divHomeUser': function(e) {

      e.preventDefault();  

      game.user.setMode( uProfile );

  },

});