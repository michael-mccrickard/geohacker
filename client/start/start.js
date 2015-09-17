BlazeLayout.setRoot('body');

/*
if (Accounts._resetPasswordToken) {
  Session.set('sResetPassword', Accounts._resetPasswordToken);
}
*/

//Iron.Location.configure({useHashPaths: true});

Accounts.onResetPasswordLink( function(token) { 

    Session.set('sResetPassword', token);  

});

/*
Accounts.onResetPasswordLink(function (t, d)
{
    //token = t;
    //done = d;

    Meteor.setTimeout( function() { Session.set('sResetPassword', t) }, 500);  

    Meteor.setTimeout( function() { FlowRouter.go("resetPassword") }, 501);
});
*/

gHackPreselect = "";

FS.debug = true;
//****************************************************************
//                 PRE-STARTUP
//****************************************************************

 //determines what is displayed on the start screen: login or register

Session.set("sLoginNow", true);

Session.set("sLoginPrompt", "CLOCK IN TO BEGIN YOUR SHIFT...");

Session.set("sLoginPromptTextColor", "yellowText");

Session.set("sRegistrationPrompt", "APPLY TO BECOME A GEOHACKER AGENT...");

Session.set("sRegistrationPromptTextColor", "yellowText");

Session.set("sBadPasswordEntered", false);

//Session.set("sResetPassword", "");

Session.set("isIOS", false);


//these are the "gatekeepers" to our subscribed data;
//they ensure that we don't try to access any collection before 
//they are ready

  Session.set("sWaitingOnCoreData", true);

  Session.set("sUReady", false);

  Session.set("sZReady", false);

  Session.set("sCReady", false);

  Session.set("sRReady", false);

  Session.set("sIReady", false);

  Session.set("sTReady", false);

  Session.set("sWReady", false);

  Session.set("sVReady", false);

  Session.set("sSReady", false);

  Session.set("sDReady", false);

  Session.set("sMReady", false);

  Session.set("sFReady", false);

  Session.set("sAReady", false);

  Session.set("sImagesReady", false);

  Session.set("sScanningDone", false);

  Session.set("sFeatureImageLoaded", false);    

  Session.set("sYouTubeOn", false);   

  Session.set("sDisplayReady", false); 

  Blaze._allowJavascriptUrls();

//****************************************************************
//                  STARTUP
//****************************************************************

Meteor.startup(function() {



  Session.set("gWindowHeight", $(window).height() );

  Session.set("gWindowWidth", $(window).width() );

//globals

  game = new Game();

  db = new Database();

  db.initCore();

  db.initControls();

  hack = null;

  ytplayer = null;

  display = null;

  editor = null;

  mission = null;



  //****************************************************************
  //                  SUBSCRIBE TO CORE DATA
  //****************************************************************

//only for super-admin?

  Meteor.subscribe("registeredUsers", function() { Session.set("sUReady", true ) });

  //core data for game

  Meteor.subscribe("continent", function() { Session.set("sZReady", true ) });

  Meteor.subscribe("region", function() { Session.set("sRReady", true ) });

  Meteor.subscribe("country", function() { Session.set("sCReady", true ) });

  Meteor.subscribe("allFlags", function() { Session.set("sFReady", true ) });

  Meteor.subscribe("ghAvatar", function() { Session.set("sAReady", true ) });

  //Callback for user login

  Accounts.onLogin( function() { game.user = game.createGeohackerUser(); });


  //start screen

  FlowRouter.go("/start"); 


}); 



//****************************************************************
//                  WAIT FOR CORE DATA
//****************************************************************

Tracker.autorun( function(comp) {

  if (Session.get("sZReady") && Session.get("sRReady") && Session.get("sCReady") && Session.get("sFReady") && Session.get("sUReady")  && Session.get("sAReady")) {

    Session.set("sWaitingOnCoreData", false);

    if (Meteor.userId() != null && game.user)  game.user.setAvatarURL();
  
    c("core data ready")

    return;
  }

  c("core data not ready")

});

//****************************************************************
//                 MISCELLANEOUS
//****************************************************************

//testing hacks

ps = function(_val) {

  gHackPreselect = _val;
}

nops = function() {

	gHackPreselect = "";
}

//****************************************************************
//                  HELPERS
//****************************************************************

Template.start.helpers({

  isIOS: function() {

     return ( navigator.userAgent.match(/iPad|iPhone|iPod/g) ? true : false );
  },

  waitingOnCoreData:  function() {

    return Session.get("sWaitingOnCoreData");

  },

  loginStatus:  function() {

    if (game.loginStatus.get() == false) return "this terminal available.";

    return "agent " + game.user.name + " is clocked in.";
  },

  startButtonClass: function() {

    if (game.loginStatus.get() == false) return "faded"

    return "";

  }

})


//****************************************************************
//                  EVENTS
//****************************************************************

Template.start.events = {

    'click #GoHack': function (e) { 

      e.preventDefault();

      //should check for class faded on the button here and return if found

      if (game.user == null) game.user = game.createGeohackerUser(); //game.loginMe("Michael");

      //go to Continue / Select Mission screen

      Control.playEffect("startButton.mp3");

      FlowRouter.go("/missionSelect");


    }
};

Template.start.rendered = function () {

  Meteor.setTimeout(function () { game.startMusic(); 2000 } );  

  game.setMusicPlayerListener();
}
//****************************************************************
//          HACKS
//****************************************************************


dofix = function() {


  //db.ghU.update( {_id: _user.id }, { $set: { a: game.user.atlas }});
}


//****************************************************************
//          UNUSED
//****************************************************************

/*

//These are be used to pause the music
//when the app loses focus

window.addEventListener('blur', pauseSound);

window.addEventListener('pagehide', pauseSound);

document.addEventListener('webkitvisibilitychange', pauseSound);

document.addEventListener('visibilitychange', pauseSound);
*/