
//Debugging hacks

gHackPreselect = "";

//Meteor.subscribe("registeredUsers");  

//****************************************************************
//                 PRE-STARTUP
//****************************************************************
Blaze._allowJavascriptUrls();

BlazeLayout.setRoot('body');

//callback for the start-up from an emailed "resert password" link

Accounts.onResetPasswordLink( function(token) { 

    Session.set('sResetPassword', token);  

});

//Callback for user login

Accounts.onLogin( function() { 

//not tested, modal not implemented either
/*
  if (Meteor.userId == "SWjqzgXy9rGCYvpRF")  {

      //activate special modal here

  }
*/

  console.log("creating game.user in Accounts.login")

  game.user = game.createGeohackerUser(); 

  LessonFactory.updateLessons();

});



 //determines what is displayed on the start screen: login or register

Session.set("sLoginNow", true);

Session.set("sLoginPrompt", "IF YOU ARE ALREADY AN AGENT, CLOCK IN ...");

Session.set("sLoginPromptTextColor", "yellowText");

Session.set("sRegistrationPrompt", "APPLY TO BECOME A GEOHACKER AGENT...");

Session.set("sRegistrationPromptTextColor", "yellowText");

Session.set("sBadPasswordEntered", false);

Session.set("sProcessingApplication", false);

Session.set("isIOS", false);


//these are the "gatekeepers" to our subscribed core data;
//they ensure that we don't try to access any collection before 
//they are ready

  Session.set("sWaitingOnCoreData", true);

  Session.set("sZReady", false);

  Session.set("sCReady", false);

  Session.set("sRReady", false);

  Session.set("sFReady", false);  //flags (for stats screen)

  Session.set("sTReady", false);  //tags

  Session.set("sXReady", false);  //all texts (to identify tags, also for capital name for new user wall)

  Session.set("sCapitalsReady", false);  //all capital images (in case the user is new; one will go on their wall) 

  Session.set("sCapitalsTextReady", false);  //all capital images (in case the user is new; one will go on their wall) 


  //country data editor

  Session.set("sEditImageReady", false );

  Session.set("sEditSoundReady", false );

  Session.set("sEditTextReady", false );

  Session.set("sEditVideoReady", false );

  Session.set("sEditWebReady", false );

  Session.set("sEditDebriefReady", false ); 


  //story data editor

  Session.set("sStoryEditMode", "visual" );

  Session.set("sAllStoriesReady", false );

  Session.set("sAllLocationsReady", false );

  Session.set("sAllScenesReady", false );

  Session.set("sAllCharsReady", false );

  Session.set("sAllTokensReady", false );

  Session.set("sAllStoryAgentsReady", false );

  Session.set("sAllStoryFlagsReady", false );

  Session.set("sAllCuesReady", false );

  Session.set("sAllChatsReady", false );

  Session.set("sAllStorySoundsReady", false );

  Session.set("sUpdateVisualEditor", false);

  //playing stories

  Session.set("sStoryReady", false );

  Session.set("sLocationReady", false );

  Session.set("sSceneReady", false );

  Session.set("sCharReady", false );

  Session.set("sTokenReady", false );

  Session.set("sStoryAgentReady", false );

  Session.set("sStoryAgentRecordReady", false );

  Session.set("sStoryFlagReady", false );

  Session.set("sCueReady", false );

  Session.set("sChatReady", false );

  Session.set("sStorySoundReady", false );

  Session.set("sUpdateStoryPreloads", false);
  
  //display-related

  Session.set("sImagesReady", false); 

  Session.set("sYouTubeOn", false);   

  Session.set("sDisplayReady", false); 

  Session.set("sCongratsImageDataReady", false);

  Session.set("sCongratsTextDataReady", false);
  
  //user's home area

  Session.set("sUserContinent","");

  Session.set("sUserRegion", "");

  Session.set("sHomeContent", "");

  Session.set("sProfiledUserID","");

  Session.set("sUserMessageTargetID","");

  //agents
  
  Session.set("sChiefUserReady", false);

  Session.set("sAgentsInNetworkReady", false);

  Session.set("sAgentHelpersReady", false);

 //music

 Session.set("sMusicReady", false ); 

//navigation

 Session.set("sCodeFromGlobe","");


//****************************************************************
//                  STARTUP
//****************************************************************

Meteor.startup(function() {

  $(window).bind('beforeunload', function() {
      game.closeOutGuest();
  });

  Session.set("gWindowHeight", $(window).height() );

  Session.set("gWindowWidth", $(window).width() );

//globals

  game = new Game();

  db = new Database();

  display = new Display();

  nav = new Navigator();

  hack = new Hack();

  hackMap = new HackMap();

  browseMap = new BrowseMap();

  lessonMap = new LessonMap();

  hacker = new Hacker();

  youtube = new YouTube();

  storyManager = new StoryManager();

  story = new Story();   

  ytplayer = null;

  mission = null;

  //editors

  editor = null;

  sed = null;   //story editor

  smed = null;  //story messaging editor

  ved = null;  //visual story editor


  db.initCore();

  db.initControls();


  //****************************************************************
  //                  SUBSCRIBE TO CORE DATA
  //****************************************************************


  //core data for game

  Meteor.subscribe("continent", function() { Session.set("sZReady", true ) });

  Meteor.subscribe("region", function() { Session.set("sRReady", true ) });

  Meteor.subscribe("country", function() { Session.set("sCReady", true ) });

  Meteor.subscribe("allFlags", function() { Session.set("sFReady", true ) })

 // Meteor.subscribe("ghTag", function() { Session.set("sTReady", true ) });  

//Meteor.subscribe("allTexts", function() { Session.set("sXReady", true ) });  

  Meteor.subscribe("allCapitals", function() { Session.set("sCapitalsReady", true ) });  

  Meteor.subscribe("allCapitalsText", function() { Session.set("sCapitalsTextReady", true ) });  

  //Meteor.subscribe("allImages", function() { Session.set("sEditImageReady", true ) });  

  //Meteor.subscribe("allWebs", function() { Session.set("sEditWebReady", true ) });

  Meteor.subscribe("allMusic", function() { Session.set("sMusicReady", true ) });   

  Meteor.subscribe("chiefUser", function() { Session.set("sChiefUserReady", true ) });  



  Tracker.autorun(function(){
      Meteor.subscribe("conversation");
  });

//  Meteor.subscribe('userPresence');

  //start screen

//ps("HN")

  FlowRouter.go("/start"); 



}); 



//****************************************************************
//                  WAIT FOR CORE DATA
//****************************************************************

Tracker.autorun( function(comp) {

  if (Session.get("sZReady") && 
      Session.get("sRReady") && 
      Session.get("sCReady") && 
      Session.get("sFReady") &&   
  /*    Session.get("sTReady") &&   */ 
   /*   Session.get("sXReady") &&  */
      Session.get("sCapitalsReady") &&  
      Session.get("sCapitalsTextReady") && 
      Session.get("sMusicReady") &&
      Session.get("sChiefUserReady") //&& 
      //Session.get("sEditImageReady")
       
  ) {

    Session.set("sWaitingOnCoreData", false);
  
    c("core data ready")

    game.startMusic();

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
  }

})


//****************************************************************
//                  EVENTS
//****************************************************************

Template.start.rendered = function () {

  stopSpinner();

  game.setMusicPlayerListener();

  if (game.user == null && Meteor.user() != null) {

      console.log("creating game user in start.rendered event")

      game.user = game.createGeohackerUser();

      LessonFactory.updateLessons();
  }
  else {

    console.log("game.user follows");
    console.log(game.user);
  }
}


//****************************************************************
//          TESTING / DEBUGGING
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