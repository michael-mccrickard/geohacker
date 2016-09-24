Template.stats.rendered = function() {

    display.scrollToTop();

    stopSpinner();
/*
      var _obj = new BadgeList();

      arrBadge1 =  _obj.generateStatsList();

      nextBadge();
*/
}

arrBadge1 = [];

arrBadge2 = [];

var badgeIndex = -1;

scrollIndex = 0;

updateBadgeContent = function() {

  var _val = Session.get("sUpdateBadges");

  Session.set("sUpdateBadges", !_val);
}

nextBadge = function() {

    badgeIndex++;

    if (arrBadge1[badgeIndex]) {

        arrBadge2.push( arrBadge1[ badgeIndex ] );      

        updateBadgeContent();
    }

    if (badgeIndex != arrBadge1.length) {

       Meteor.setTimeout( function() { nextBadge(); }, 200 );
    }
    else {

      scrollIndex = 0;

      scrollMe();

    }

}

function scrollMe() {

  window.scrollTo( 0, scrollIndex);

  scrollIndex = scrollIndex + 6;

  Meteor.setTimeout( function() { scrollMe(); }, 25);
}

Template.stats.helpers({

    statsBadge: function() {

      var _obj = new BadgeList();

Session.set("sBadgeCount", _obj.length)

      return( _obj.generateStatsList() );
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
    }

});

Template.stats.events({

  'click something': function(e) {

      e.preventDefault();  

      deselectAll();


  },

});