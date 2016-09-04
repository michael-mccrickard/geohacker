FlowRouter.route('/newBrowse', {

  name: "newBrowse",

  action: function (params, queryParams) { 

    BlazeLayout.render('layout', { content: "newBrowse" } ) 
  },

});


//*********************************************
//      START
//*********************************************
FlowRouter.route('/', {

    action: function (params, queryParams) { 

      BlazeLayout.render('layout', { content: "start" } ) 
    },

});

FlowRouter.route('/start', {

  name: "start",

  action: function (params, queryParams) { 

    BlazeLayout.render('layout', { content: "start" } ) 
  },

});

FlowRouter.route('/intro', {

    action: function (params, queryParams) { 

      $('body').addClass('noscroll'); 

      BlazeLayout.render('layout', { content: "intro" } ) 
    },

});

FlowRouter.route('/introVideo', {

    action: function (params, queryParams) { 

      $('body').addClass('noscroll'); 

      BlazeLayout.render('layout', { content: "introVideo" } ) 
    },

});

FlowRouter.route('/learnCountry', {

    action: function (params, queryParams) { 

      BlazeLayout.render('layout', { content: "learnCountry" } ) 
    },

});

FlowRouter.route('/start2', {

  name: "start2",

  action: function (params, queryParams) { 

    BlazeLayout.render('layout', { content: "start2" } ) 
  },

});


FlowRouter.route('/missionSelect', {

  name: "missionSelect",

  action: function (params, queryParams) { 

   if (display) display.closeOutMain();

   BlazeLayout.render('layout', { content: "missionSelect" } ) 

 },

});


FlowRouter.route('/help2', {

    name: "help2",

    action: function (params, queryParams) { 

      BlazeLayout.render('layout', { content: "help2" } )

    }
});

FlowRouter.route('/dataChecker', {

    name: "dataChecker",

    action: function (params, queryParams) { 

      BlazeLayout.render('layout', { content: "dataChecker" } ) 
    },


});

//*********************************************
//      CONGRATS
//*********************************************

FlowRouter.route('/congrats', {

  action: function() {

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

    display.closeOutMain();

    BlazeLayout.render('layout', { content: "home" } );

  },

  name:  "home",


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

  if (display) display.closeOutMain();

   BlazeLayout.render('layout', { content: "worldMap" } ) 

 },
});


//*********************************************
//      BROWSE WORLD MAP
//*********************************************

FlowRouter.route('/browseWorldMap', {

  name: "browseWorldMap",

  action: function (params, queryParams) { 

    BlazeLayout.render('layout', { content: "browseWorldMap" } ); },
});

//*********************************************
//      LESSON MAP
//*********************************************

FlowRouter.route('/lessonMap', {

  name: "lessonMap",

  action: function (params, queryParams) { 

      $('body').addClass('noscroll'); 

    BlazeLayout.render('layout', { content: "lessonMap" } ); },
});

//*********************************************
//      DEBRIEF
//*********************************************

FlowRouter.route('/debrief', {

  name: "debrief",

  action: function (params, queryParams) { 

    BlazeLayout.render('layout', { content: "debrief" } ); },
});

//*********************************************
//      CLOSEUP
//*********************************************

FlowRouter.route('/closeup', {

    action: function (params, queryParams) { 

    BlazeLayout.render('layout', { content: "closeup" } ) 

   },
  });

//*********************************************
//      EDITOR
//*********************************************

FlowRouter.route('/editor', {

  action: function (params, queryParams) { 

   BlazeLayout.render('layout', { content: "editor" } ) 

 },
});

FlowRouter.route('/selectCountry', {

  action: function (params, queryParams) { 

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
//      USER DIRECTORY
//*********************************************

FlowRouter.route('/userDirectory',  {


  action: function (params, queryParams) { 

    $('body').removeClass('noscroll'); 

    BlazeLayout.render('layout', { content: "userDirectory" } );

  }

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




function doSelectCountryWindow() {

  Meteor.defer( function() { editor.loadScroll(); })

  Meteor.defer( function() { conformButtons(); })  
}




