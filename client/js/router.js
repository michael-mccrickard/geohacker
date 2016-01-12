var debrief_sound = "debrief.mp3";

pageRefreshed = false;


//*********************************************
//      START
//*********************************************
FlowRouter.route('/', {

    action: function (params, queryParams) { BlazeLayout.render('layout', { content: "start" } ) },

});



FlowRouter.route('/start', {

  name: "start",

  action: function (params, queryParams) { BlazeLayout.render('layout', { content: "start" } ) },

  subscriptions: function(params, queryParams) {

      this.register("images", Meteor.subscribe("allImages") );

      this.register("debriefs", Meteor.subscribe("allDebriefs") );

      this.register("texts", Meteor.subscribe("allTexts") );
  },

});


FlowRouter.route('/missionSelect', {

  name: "missionSelect",

  action: function (params, queryParams) { 

   display.closeOutMain();

   BlazeLayout.render('layout', { content: "missionSelect" } ) 

 },

});


//*********************************************
//      CONGRATS
//*********************************************

FlowRouter.route('/congrats', {

  action: function() {

    pageRefreshed = false;

    $('body').removeClass('noscroll');

    game.pauseMusic();

    Control.playEffect("congrats1.mp3")

    BlazeLayout.render('layout', { content: "congrats" } );

  }
 
});

//*********************************************
//      HOME
//*********************************************

FlowRouter.route('/home', {

  action: function (params, queryParams) { 

    if (display) display.closeOutMain();

    BlazeLayout.render('layout', { content: "home" } ) 

  },

    name:  "home",

    subscriptions: function(params, queryParams) {

      this.register("images", Meteor.subscribe("allImages") );

      this.register("users", Meteor.subscribe("registeredUsers") );
    },
});

//*********************************************
//      MAIN
//*********************************************

FlowRouter.route('/main', {

    action: function (params, queryParams) { 

      $('body').addClass('noscroll'); 

      BlazeLayout.render('layout', { content: "main" } ) 
    },

    name:  "main"
});

//*********************************************
//      WORLD MAP
//*********************************************

FlowRouter.route('/worldMap', {

  name: "worldMap",

  action: function (params, queryParams) { 

   display.closeOutMain();

   BlazeLayout.render('layout', { content: "worldMap" } ) 

 },
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

  action: function (params, queryParams) { 

    if (display.feature.getName() == "SOUND") {

       if (display.feature.ctl.getState() == sPaused) {

           display.feature.ctl.setState( sPlaying );
           
           display.feature.set( "SOUND" );

           display.feature.loadAgain( "SOUND" );
       }

       return;
    }

    pageRefreshed = false; 

    BlazeLayout.render('layout', { content: "closeup" } ); 
  },

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

  action: function (params, queryParams) { 

   pageRefreshed = false;

   display.closeOutMain();

   BlazeLayout.render('layout', { content: "editor" } ) 

 },
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

      display.closeOutMain();
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


  action: function (params, queryParams) { $('body').removeClass('noscroll'); BlazeLayout.render('layout', { content: "userDirectory" } ) }

});

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

}

function playDebriefSound() {

  Control.playEffect( debrief_sound );
}


function doSelectCountryWindow() {

  Meteor.defer( function() { editor.loadScroll(); })

  Meteor.defer( function() { conformButtons(); })  
}




