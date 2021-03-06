FlowRouter.route('/newBrowse2', {

  name: "newBrowse2",

  action: function (params, queryParams) { 

    $('body').addClass('noscroll'); 

    BlazeLayout.render('layout', { content: "newBrowse2" } ) 
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

FlowRouter.route('/dataChecker', {

    name: "dataChecker",

    action: function (params, queryParams) { 

      BlazeLayout.render('layout', { content: "dataChecker" } ) 
    },
});

FlowRouter.route('/faq', {

    name: "dataChecker",

    action: function (params, queryParams) { 

      BlazeLayout.render('layout', { content: "faq" } ) 
    },
});  

FlowRouter.route('/globeMap', {

  name: "globeMap",

  action: function (params, queryParams) { 

    BlazeLayout.render('layout', { content: "globeMap" } ) 
  },

});

FlowRouter.route('/help', {

    name: "help",

    action: function (params, queryParams) { 

      BlazeLayout.render('layout', { content: "help" } ) 
    },

});

FlowRouter.route('/help2', {

    name: "help2",

    action: function (params, queryParams) { 

      BlazeLayout.render('layout', { content: "help2" } )

    }
});

FlowRouter.route('/intro', {

    action: function (params, queryParams) { 

      BlazeLayout.render('layout', { content: "intro" } ) 
    },

});

FlowRouter.route('/learnCountry', {

    action: function (params, queryParams) { 

      BlazeLayout.render('layout', { content: "learnCountry" } ) 
    },

});

FlowRouter.route('/meme', {

  name: "meme",

  action: function (params, queryParams) { 

    BlazeLayout.render('layout', { content: "meme" } ) 
  },

});


FlowRouter.route('/missionSelect', {

  name: "missionSelect",

  action: function (params, queryParams) { 

   BlazeLayout.render('layout', { content: "missionSelect" } ) 

 },

});

FlowRouter.route('/mapboxCongrats', {

  name: "mapboxCongrats",

  action: function (params, queryParams) { 

    BlazeLayout.render('layout', { content: "mapboxCongrats" } ) 
  },

});

FlowRouter.route('/missionCongrats', {

  name: "missionCongrats",

  action: function (params, queryParams) { 

    BlazeLayout.render('layout', { content: "missionCongrats" } ) 
  },

});

FlowRouter.route('/mapboxCongrats1', {

  name: "mapboxCongrats1",

  action: function (params, queryParams) { 

    BlazeLayout.render('layout', { content: "mapboxCongrats1" } ) 
  },

});

FlowRouter.route('/privacy', {

    name: "dataChecker",

    action: function (params, queryParams) { 

      BlazeLayout.render('layout', { content: "privacy" } ) 
    },
});  

FlowRouter.route('/start', {

  name: "start",

  action: function (params, queryParams) { 

    BlazeLayout.render('layout', { content: "start" } ) 
  },

});

FlowRouter.route('/story', {

    name: "story",

    action: function (params, queryParams) { 

      $('body').addClass('noscroll'); 

      BlazeLayout.render('layout', { content: "story" } )

    }
});

FlowRouter.route('/storyManager', {

    name: "storyManager",

    action: function (params, queryParams) { 

      BlazeLayout.render('layout', { content: "storyManager" } )

    }
});

FlowRouter.route('/story_messaging', {

  name: "story_messaging",

  action: function (params, queryParams) { 

    BlazeLayout.render('layout', { content: "story_messaging" } ) 
  },

});


//*********************************************
//      CONGRATS
//*********************************************

FlowRouter.route('/congrats', {

    name: "congrats",

  action: function() {

    $('body').removeClass('noscroll');

    game.pauseMusic();

    display.playEffect("congrats.mp3")

    BlazeLayout.render('layout', { content: "congrats" } );

  }
 
});

//*********************************************
//      HOME
//*********************************************

FlowRouter.route('/home', {

  action: function (params, queryParams) { 

    hacker.closeOutMain();

    BlazeLayout.render('layout', { content: "home" } );

  },

  name:  "home",


});

//*********************************************
//      MAIN
//*********************************************

FlowRouter.route('/main', {

    action: function (params, queryParams) { 

      name: "main",

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

  hacker.closeOutMain();

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

    name: "closeup",

    action: function (params, queryParams) { 

    BlazeLayout.render('layout', { content: "closeup" } ) 

   },
  });

//*********************************************
//      EDITORS
//*********************************************

FlowRouter.route('/editor', {

  action: function (params, queryParams) { 

  $('body').removeClass('noscroll');

   BlazeLayout.render('layout', { content: "editor" } ) 

 },
});

FlowRouter.route('/selectCountry', {

  action: function (params, queryParams) { 

    BlazeLayout.render('layout', { content: "selectCountry" });

  }

});

FlowRouter.route('/editStory', {

  action: function (params, queryParams) { 

    $('body').removeClass('noscroll'); 

    BlazeLayout.render('layout', { content: "editStory" });

  }

});

FlowRouter.route('/editChat', {

  action: function (params, queryParams) { 

    $('body').removeClass('noscroll'); 

    BlazeLayout.render('layout', { content: "story_messaging_editor" });

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


FlowRouter.route('/storyPreload', {

  action: function (params, queryParams) { BlazeLayout.render('layout', { content: "storyPreload" } ) }
});



function checkForFeature() {

  //if there is no control featured, then don't jump to
  //a close-up view

  if (hacker.feature.item.getName().length == 0) {

    display.playEffect( hacker.locked_sound_file );

    this.redirect("/main");
  }

}




function doSelectCountryWindow() {

  Meteor.defer( function() { conformButtons(); })  
}




