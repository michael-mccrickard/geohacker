//profile.js

Template.profile.helpers({

    flag: function() {

        return db.getFlagPicByCode("US");
    },

    country: function() {

    	return "UNITED STATES";
    }

});

Template.profile.events({

  'click #divHomeUser': function(e) {

      e.preventDefault();  

      game.user.setMode( uProfile );

  },

});