Template.stats.rendered = function() {

    display.scrollToTop();

    stopSpinner();

}

Stats = function() {

  this.template = new Blaze.ReactiveVar("me");

  this.updateFlag = new Blaze.ReactiveVar(false);

  this.topHackers = [];

  this.topBadges = [];

  this.dayOffset = 0;


  this.getTopHackers = function() {

    Meteor.call("getTopHackers", display.stats.dayOffset, function(err, result) {

      if (result) {

        display.stats.topHackers = Database.removeIfFieldValueEquals( result, "numberOfHacks", 0) 


      }

      display.stats.updateContent();

    });

  }

  this.getTopBadges = function() {

    Meteor.call("getTopBadges", display.stats.dayOffset, function(err, result) {

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


Template.hacksAndBadges.onCreated(function () {

  this.subscribe("registeredUsers");

  var self = this;

    self.subscribe('registeredUsers');

  self.autorun( function() {

      if (Template.instance().subscriptionsReady()) {

        display.stats.getTopHackers();
 
        display.stats.getTopBadges();

      }
  });

});

Template.hacksAndBadges.helpers({

    hackAgent: function() {

      display.stats.updateFlag.get();

      return display.stats.topHackers;
    },

    badgeAgent: function() {

      display.stats.updateFlag.get();

      return display.stats.topBadges;
    },

    rank: function( _index) {

      return (_index + 1)
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


Template.me.events({

  'click something': function(e) {

      e.preventDefault();  

      deselectAll();


  },

});