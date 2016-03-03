
Template.stats.helpers({

    statsBadge: function() {

      var _obj = new BadgeList();

      Session.set("sBadgeCount", _obj.length)

      return ( _obj.generateStatsList() );
    },

    userCreatedAt: function() {

       if (!Meteor.user().createdAt) return "UNKNOWN";

        return Meteor.user().createdAt;
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