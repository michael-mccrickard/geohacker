Session.set("sBadgeCount", 0);

Template.congrats.rendered = function () {

  var ratio = game.user.assign.hacked.length / (game.user.assign.hacked.length + game.user.assign.pool.length) * 100.0;

  Session.set('percentageProgress', ratio);

}

Template.congrats.badge = function() { 

  var _obj = new BadgeList();

  Session.set("sBadgeCount", _obj.length)

  return ( _obj.generateList() );
}



Template.congrats.helpers({

  assignName: function() {

    return game.user.assign.name.toUpperCase();
  },

  countriesHacked: function() {

    var hackedSoFar =  game.user.assign.hacked.length;

    var total = game.user.assign.pool.length + game.user.assign.hacked.length;

    return (hackedSoFar + " out of " + total + " countries hacked.").toUpperCase();
  },

  getTotal: function() {

    return 360.0;
  },

  getProgress: function() {

    var p = ( 360.0 / (game.user.assign.pool.length + game.user.assign.hacked.length) ) * game.user.assign.hacked.length;

    //progress indicator has a bug, where it essentially displays 0% progress
    //if you give it a 100% progress input

    if (game.user.assign.pool.length == 0) p--;

    return (p);
  },

  missionPercentage: function() {

    var ratio = game.user.assign.hacked.length / (game.user.assign.hacked.length + game.user.assign.pool.length) * 100.0;

    if (ratio >= 100.0) return 100;

    return ratio.toPrecision(2);

  },

  countryName: function() {

    return hack.getCountryName().toUpperCase();
  },

  congratsBanner:  function() {

    //either MESSAGE HACKED or MISSION COMPLETE

    if (game.user.assign.pool.length == 0) return "MISSION COMPLETE";

    return "MESSAGE HACKED";
  },

  flagPic:  function() {

    return hack.getFlagPic();
  },


  hackedCount: function() {

    var count = game.user.getTicketCount( hack.countryCode );

    return count;
  },

  hackReport1: function() {

    var s = "Message originated in " + hack.getCountryName() + "."; 

    return s.toUpperCase();s
  },

  hackReport2: function() {

      var s = "hack report"

      return s.toUpperCase();
  },

  hackReport3: function() {

      var s = game.hackTotalTime.toFixed(2) + " secs" ;

      return s.toUpperCase();
  },

  hackReport4: function() {

      var s = display.loader.totalClueCount.toString();

      return s.toUpperCase();
  },

  headlineColorClass: function() {

    if (game.user.assign.pool.length == 0) return "greenText";

    return "yellowText";
  },

  missionNotDone: function() {

      if (game.user.assign.pool.length > 0) return true;

      return false;
  },

  missionProgress: function() {

    var hackTotal = game.user.assign.pool.length + game.user.assign.hacked.length;

    var ratio = game.user.assign.hacked.length / hackTotal * 100.0;

    if (ratio >= 100.0) return 100;

    return ratio.toPrecision(2);
  },

  needBlankBadge: function() {

    if ( Session.get("sBadgeCount") < 4 ) return true;

    return false;
  },


});

Template.congrats.events = {

    'click #btnNextHack': function (e) {

      e.preventDefault();

      hack.startNewFromMenu();

    },

    'click #btnMissionSelect': function (e) {

      e.preventDefault();

      Control.playEffect("startButton.mp3");

      FlowRouter.go( "/missionSelect" );

    }   


};



