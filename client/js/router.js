var debrief_sound = "debrief.mp3";

pageRefreshed = false;


//*********************************************
//      START
//*********************************************

FlowRouter.route('/start', {

  name: "start",

  action: function (params, queryParams) { BlazeLayout.render('layout', { content: "start" } ) },

  //triggersEnter: [startMusic]

});


FlowRouter.route('/missionSelect', {

  name: "missionSelect",

  action: function (params, queryParams) { BlazeLayout.render('layout', { content: "missionSelect" } ) },

});


//*********************************************
//      CONGRATS
//*********************************************

FlowRouter.route('/congrats', {

  action: function() {

    pageRefreshed = false;

    game.pauseMusic();

    hack.playAnthem();

    BlazeLayout.render('layout', { content: "congrats" } );

  }
 
});

//*********************************************
//      HOME
//*********************************************

FlowRouter.route('/home', {

    action: function (params, queryParams) { BlazeLayout.render('layout', { content: "home" } ) },

    name:  "home",

    subscriptions: function(params, queryParams) {

      this.register("editImages", Meteor.subscribe("allImages") );

      this.register("allUsers", Meteor.subscribe("registeredUsers") );
    },
});

//*********************************************
//      MAIN
//*********************************************

FlowRouter.route('/main', {

    action: function (params, queryParams) { BlazeLayout.render('layout', { content: "main" } ) },

    name:  "main"
});

//*********************************************
//      WORLD MAP
//*********************************************

FlowRouter.route('/worldMap', {

  name: "worldMap",

  action: function (params, queryParams) { pageRefreshed = false; BlazeLayout.render('layout', { content: "worldMap" } ); },
});

//*********************************************
//      BROWSE WORLD MAP
//*********************************************

FlowRouter.route('/browseWorldMap', {

  name: "browseWorldMap",

  action: function (params, queryParams) { pageRefreshed = false; BlazeLayout.render('layout', { content: "browseWorldMap" } ); },
});

//*********************************************
//      DEBRIEF
//*********************************************

FlowRouter.route('/debrief', {

  name: "debrief",

  action: function (params, queryParams) { pageRefreshed = false; BlazeLayout.render('layout', { content: "debrief" } ); },
});

//*********************************************
//      CLOSEUP
//*********************************************

FlowRouter.route('/closeup', {

  name: "closeup",

  action: function (params, queryParams) {  pageRefreshed = false; BlazeLayout.render('layout', { content: "closeup" } ); },
});

//*********************************************
//      EDITOR
//*********************************************

FlowRouter.route('/editor', {

  subscriptions: function(params, queryParams) {

    this.register("editImages", Meteor.subscribe("allImages") );
    this.register("editTexts", Meteor.subscribe("allTexts") );
    this.register("editSounds", Meteor.subscribe("allSounds") );
    this.register("editVideos", Meteor.subscribe("allVideos") );
    this.register("editWebs", Meteor.subscribe("allWebs") );
    this.register("editDebriefs", Meteor.subscribe("allDebriefs") );
  },

  action: function() {

    pageRefreshed = false;

    BlazeLayout.render('layout', { content: "editor" } );

  }
});

FlowRouter.route('/selectCountry', {

  subscriptions: function(params, queryParams) {

    this.register("editContinent", Meteor.subscribe("continent") );
    this.register("editRegion", Meteor.subscribe("region") );
    this.register("editCountry", Meteor.subscribe("country") );
  },

  action: function (params, queryParams) { 
    
    if (display) {

      if (display.ctl["SOUND"]) display.ctl["SOUND"].pauseFeaturedContent();
    }

    BlazeLayout.render('layout', { content: "selectCountry" });

  }

});

//*********************************************
//      WAITING
//*********************************************


FlowRouter.route('/waiting', {

  action: function (params, queryParams) { BlazeLayout.render('layout', { content: "waiting" } ) }
});

//*********************************************
//      User Directory
//*********************************************

FlowRouter.route('/userDirectory',  {

  subscriptions: function(params, queryParams) {

    this.register("allUsers", Meteor.subscribe("registeredUsers") );
  },

  action: function (params, queryParams) { BlazeLayout.render('layout', { content: "userDirectory" } ) }

});


//*********************************************
//      ROUTE HOOKS
//*********************************************
/*
//  START

Router.onAfterAction(startMusic, {
  
  only: ['start']

});

//  MAIN

Router.onAfterAction(checkHackScreen, {
  
  only: ['main']

});


//  DEBRIEF

Router.onAfterAction(refreshDebriefWindow, {
  
  only: ['debrief']

});


Router.onAfterAction(playDebriefSound, {
  
  only: ['debrief']

});

//  CLOSEUP

Router.onBeforeAction(checkForFeature, {
  
  only: ['closeup']

});

Router.onAfterAction(doRefreshCloseupWindow, {
  
  only: ['closeup']

});


//  EDITOR

Router.onBeforeAction(switchToEditor, {
  
  only: ['selectCountry', 'editor']

});

Router.onAfterAction(doSelectCountryWindow, {
  
  only: ['selectCountry']


});

//  WORLD MAP


Router.onAfterAction(drawWorldMap, {
  
  only: ['worldMap']

});

*/

//*********************************************
//      FUNCTIONS
//*********************************************


function checkForFeature() {

  //if there is no control featured, then don't jump to
  //a close-up view

  if (display.feature.getName().length == 0) {

    Control.playEffect( display.locked_sound_file );

    this.redirect("/main");
  }

  this.next();
}

/*
function doRefreshCloseupWindow() {

  //if there is no control featured, then don't refresh
  //the close-up view

  if (display.feature.getName().length == 0) return;

  Meteor.setTimeout(function () {display.closeUp.draw(); 100} );
}
*/

/*
function checkHackScreen() {

  if (display) display.checkMainScreen();

}
*/

function playDebriefSound() {

  Control.playEffect( debrief_sound );
}


function switchToEditor() {

   if (db == null) {

      db = new Database();

      db.initCore();

      db.initControls();
  }

  if (editor == null) editor = new Editor();

  editor.controlType = cNone;

  if (hack == null)  hack = new Hack();

  hack.mode = mEdit;

  display.closeOutMain();

  this.next();
}


function drawWorldMap() {

  display.closeOutMain();
}



function doSelectCountryWindow() {

  Meteor.defer( function() { editor.loadScroll(); })

  Meteor.defer( function() { conformButtons(); })  
}




