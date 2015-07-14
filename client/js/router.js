var debrief_sound = "debrief.mp3";

pageRefreshed = false;

Router.configure({
  layoutTemplate: 'layout'
});

//*********************************************
//      START
//*********************************************

Router.route('/start', function () {

  this.render('start');

    name: "start";
});


Router.route('/missionSelect', function () {

  this.render('missionSelect');

    name: "missionSelect";
});


//*********************************************
//      CONGRATS
//*********************************************

Router.route('/congrats', {

  action: function() {

    pageRefreshed = false;

    game.pauseMusic();

    hack.playAnthem();

    this.render("congrats");

  }
 
});

//*********************************************
//      MAIN
//*********************************************

Router.route('/main', function () {

    this.render('main');

    name:  "main";
});

//*********************************************
//      WORLD MAP
//*********************************************

Router.route('/worldMap', function () {

  name: "worldMap";

  pageRefreshed = false;

  this.render('worldMap');
});

//*********************************************
//      BROWSE WORLD MAP
//*********************************************

Router.route('/browseWorldMap', function () {

  name: "browseWorldMap";

  pageRefreshed = false;

  this.render('browseWorldMap');
});

//*********************************************
//      DEBRIEF
//*********************************************

Router.route('/debrief', function () {

  name: "debrief"

  pageRefreshed = false;

  this.render('debrief');
});

//*********************************************
//      CLOSEUP
//*********************************************

Router.route('/closeup', function () {

  name: "closeup"

  pageRefreshed = false;

  this.render('closeup');
});

//*********************************************
//      EDITOR
//*********************************************

Router.route('/editor', {

  action: function() {

    pageRefreshed = false;

    this.wait( Meteor.subscribe("allImages") );
    this.wait( Meteor.subscribe("allTexts") );
    this.wait( Meteor.subscribe("allSounds") );
    this.wait( Meteor.subscribe("allVideos") );
    this.wait( Meteor.subscribe("allWebs") );
    this.wait( Meteor.subscribe("allDebriefs") );

  
    if ( this.ready() ) {

      this.render("editor");
    }
    else {
      this.render("waiting");
    }
  }
});

Router.route('/selectCountry', function () {

    if (display) {

      if (display.ctl["SOUND"]) display.ctl["SOUND"].pauseFeaturedContent();
    }

    this.wait( Meteor.subscribe("continent") );
    this.wait( Meteor.subscribe("region") );
    this.wait( Meteor.subscribe("country") );

    if ( this.ready() ) {

      this.render("selectCountry");
    }
    else {

      this.render("waiting");
    }

});

//*********************************************
//      WAITING
//*********************************************


Router.route('/waiting', function () {
  this.render('waiting');
});

//*********************************************
//      User Directory
//*********************************************

Router.route('/userDirectory',  {

  // Subscriptions or other things we want to "wait" on. This also
  // automatically uses the loading hook. That's the only difference between
  // this option and the subscriptions option above.
  waitOn: function () {
    return Meteor.subscribe("registeredUsers");
  },

  // A data function that can be used to automatically set the data context for
  // our layout. This function can also be used by hooks and plugins. For
  // example, the "dataNotFound" plugin calls this function to see if it
  // returns a null value, and if so, renders the not found template.

  data: function() {
    templateData = { ghUser: Meteor.users.find().fetch() };
    return templateData;
  },

});


//*********************************************
//      ROUTE HOOKS
//*********************************************

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


//*********************************************
//      FUNCTIONS
//*********************************************

function startMusic() {

  Meteor.setTimeout(function () { game.startMusic(); 2000 } );  

  game.setMusicPlayerListener();

}


function refreshDebriefWindow() {

  Meteor.setTimeout(function () {refreshWindow("router-debrief"); 100} );
}

function doRefreshCloseupWindow() {

  var _src = display.feature.imageSrc;

  if (display.feature.getName() == "MAP") {

    var _filename = hack.getCountryFilename() + "_map.jpg"

    _src = Control.getImageFromFile( _filename );
  }

  Meteor.setTimeout(function () {refreshCloseupWindow( _src ); 100} );
}

function checkHackScreen() {

  if (display) display.checkMainScreen();

}

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




