
Template.congrats.helpers({

  agentName: function() {

    return game.user.name.toUpperCase();
  },

  agentHackCount: function() {

    return game.user.assign.hacked.length;
  },


  assignName: function() {

    return game.user.assign.name.toUpperCase();
  },

  missionTotal: function() {

    return game.user.assign.pool.length + game.user.assign.hacked.length;
  },

   countryName: function() {

    return hack.getCountryName();
  },

  congratsBanner:  function() {

    //either MESSAGE HACKED or MISSION COMPLETE

    if (game.user.assign.pool.length == 0) return "MISSION COMPLETE";

    return "MESSAGE HACKED";
  },

  flagPic:  function() {

    return hack.getFlagPic();
  },

  hackReport1: function() {

    var s = "Message originated in " + hack.getCountryName() + "."; 

    return s.toUpperCase();s
  },

  hackReport2: function() {

      var s = "hack report:"

      return s.toUpperCase();
  },

  hackReport3: function() {

      var hackTime = (game.hackEndTime - game.hackStartTime) / 1000.0;

      var s = hackTime.toFixed(2) + " secs" ;

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

});

Template.congrats.events = {

    'click #btnNextHack': function (e) {

      e.preventDefault();

      hack.startNewFromMenu();

    },

    'click #btnMissionSelect': function (e) {

      e.preventDefault();

      Control.playEffect("startButton.mp3");

      Router.go( "/missionSelect" );

    }   


};



