Template.stats.rendered = function() {

    display.scrollToTop();

    stopSpinner();

}

Stats = function() {

  this.template = new Blaze.ReactiveVar("me");

  this.updateFlag = new Blaze.ReactiveVar(false);

  this.topHackers = [];

  this.topBadges = [];


  this.getTopHackers = function() {

    Meteor.call("getTopHackers", function(err, result) {

      if (result) {

        display.stats.topHackers = Database.removeIfFieldValueEquals( result, "numberOfHacks", 0) 


      }

      display.stats.updateContent();

    });

  }

  this.getTopBadges = function() {

    Meteor.call("getTopBadges", 0, function(err, result) {

      if (result) {

        display.stats.topBadges = result; 
      }

      display.stats.updateContent();

    });
  }

  this.updateContent = function() {

    var _val = this.updateFlag.get();

    this.updateFlag.set( !_val );
  }
  
}

Template.alltime.onCreated(function () {

  //this.subscribe("registeredUsers");

  display.stats.getTopHackers();
 
display.stats.getTopBadges();
});

Template.alltime.helpers({

    hackAgent: function() {

      display.stats.updateFlag.get();

      return display.stats.topHackers;
    },

    badgeAgent: function() {

      display.stats.updateFlag.get();

      return display.stats.topBadges;
    }

});


Template.stats.helpers({

    statsContent: function() {

      return display.stats.template.get();
    }

});

Template.me.helpers({

    statsBadge: function() {

      var _obj = new BadgeList();

      Session.set("sBadgeCount", _obj.length)

      return ( _obj.generateStatsList() );
    },

    userCreatedAt: function() {

        return Meteor.user().profile.createdAt;
    },

    userHackCount: function() {

      return game.user.lifetimeHackCount();
    },

    userCountryCount: function() {

      return game.user.uniqueCountryCount();
    },

    userMissionCount: function() {

      return game.user.lifetimeMissionCount();
    },
});

Template.alltime.helpers({

    statsBadge: function() {

      var _obj = new BadgeList();

      Session.set("sBadgeCount", _obj.length)

      return ( _obj.generateStatsList() );
    },
});


Template.stats.events({

  'click something': function(e) {

      e.preventDefault();  

      deselectAll();


  },

});