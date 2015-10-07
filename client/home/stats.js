
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

  'click something': function(e) {

      e.preventDefault();  

      deselectAll();


  },

});