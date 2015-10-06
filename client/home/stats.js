
Template.stats.helpers({

    userCreatedAt: function() {

        return Meteor.user().createdAt.toLocaleDateString();
    },

    userHackCount: function() {

    	return game.user.lifetimeHackCount();
    },

    userCountryCount: function() {

    	return game.user.uniqueCountryCount();
    },

    userMissionCount: function() {

    	return game.user.lifetimeMissionCount();
    }

});

Template.stats.events({

  'click #divHomeHackPic': function(e) {

      e.preventDefault();  

      deselectAll();

      Session.set("sHomeContent", "missionListing")

	  $("#divHomeHackPic").css("border-color","red");

  },

});