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

    pic: function() {

    	return game.user.profile.pic;
    },

    picText: function() {

    	return game.user.profile.picText;
    },

});

Template.profile.events({

  'click #divHomeUser': function(e) {

      e.preventDefault();  

      game.user.setMode( uProfile );

  },

});