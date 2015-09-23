
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

  hackedCount: function() {

    var count = game.user.getTicketCount( hack.countryCode );

    return count;
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

  genius: function() {

    if (display.loader.totalClueCount == 1) return true;

    return false;
  },

  goldInvestigator: function() {

    if (display.loader.totalClueCount >= 9) return true;

    return false;
  },

  silverInvestigator: function() {

    if (display.loader.totalClueCount >= 6 && display.loader.totalClueCount < 9) return true;

    return false;
  },

  bronzeInvestigator: function() {

    if (display.loader.totalClueCount >= 3 && display.loader.totalClueCount < 6) return true;

    return false;
  },

  goldSpeedster: function() {

    var hackTime = (game.hackEndTime - game.hackStartTime) / 1000.0;

    if (hackTime < 10.0) return true;

    return false;
  },

  silverSpeedster: function() {

    var hackTime = (game.hackEndTime - game.hackStartTime) / 1000.0;

    if (hackTime >= 10.0 && hackTime < 20.0) return true;
  
    return false;
  },

  bronzeSpeedster: function() {

    var hackTime = (game.hackEndTime - game.hackStartTime) / 1000.0;

    if (hackTime >= 20.0 && hackTime < 30.0) return true;
  
    return false;
  },

  goldScholar: function() {

    var hackTime = (game.hackEndTime - game.hackStartTime) / 1000.0 / 60.0;

    if (hackTime >= 15.0) return true;
  
    return false;
  },

  silverScholar: function() {

    var hackTime = (game.hackEndTime - game.hackStartTime) / 1000.0 / 60.0;

    if (hackTime >= 8.0  && hackTime < 15.0) return true;
  
    return false;
  },

  bronzeScholar: function() {

    var hackTime = (game.hackEndTime - game.hackStartTime) / 1000.0 / 60.0;

    if (hackTime >= 3.0  && hackTime < 8.0) return true;
  
    return false;
  },

  firstTimeCountry: function() {

    if (game.user.getTicketCount( hack.countryCode ) == 1) return true;

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



