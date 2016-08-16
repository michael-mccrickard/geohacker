//*************************************************************************
//              TEMPLATE HELPERS FOR LESSON MAP
//*************************************************************************
//*************************************************************************
//              RENDERED CALLBACK
//*************************************************************************

 
Template.lessonMap.rendered = function () {
    
    stopSpinner();

    if (display.worldMapTemplateReady == false) {

      display.worldMapTemplateReady = true;

      Meteor.setTimeout( function() { display.ctl["MAP"].lessonMap.doCurrentMap( ) }, 250 );

      Meteor.setTimeout( function() { display.ctl["MAP"].finishLessonDraw() }, 251 );

    }
}


var scaleFactor = 216/360;

var widthBreakpoint = 1301;

function scaleMe( _val ) {

   var _w = $(window).width();

   if (_w < widthBreakpoint) return (scaleFactor * _val) + "px";

   return _val + "px";

}

Template.lessonMap.helpers({

  LCWidth: function() {

   return scaleMe( 360 );

  },

  LCHeight: function() {

   return scaleMe( 200 );
  },  

  HTBaseFontSize: function() {

   return scaleMe( 28 );
  },

  capitalWidth: function() {

   return scaleMe( 232 );
  },
  
  learnRightWidth: function() {

   return scaleMe( 96 );
  }, 

  flagHeight: function() {

   return scaleMe( 58 );
  },  

  leaderHeight: function() {
   return scaleMe( 128 );
  },  

  allVisited: function() {

    if (game.lesson.quizState.get() == "decideNextStep") return false;

    if ( game.lesson.visited.length() == game.lesson.items.length ) return true;

    return false;

  },

  lessonShortName: function() {

    return game.lesson.mission.shortName;
  },

  countryListItem: function() {

      var _val = game.lesson.updateFlag.get();

      return game.lesson.items;
    
  },

  countryListItemID: function() {

      return this + "-ListItem";
    
  },

  countryName: function( _code) {

    return db.getCountryName( _code );
  },

  decideNextStep: function() {

    if (game.lesson.quizState.get() == "decideNextStep") return true;

    return false;
  },

  divTeachWidth: function() { return Session.get("gWindowWidth") * 0.49},

  mapWidth: function() { return Session.get("gWindowWidth") * 0.49},

  mapHeight: function() { 

    var h = Session.get("gWindowHeight") - display.menuHeight;

    return h * 0.98;

  },

  nextOrEndText: function() {

      var _state = game.lesson.quizState.get();

      if ( _state == "readyForNext") return "NEXT";

      if ( _state == "quizEnd" || _state == "examEnd") return "OK"; 

  },

  quizInProgress: function() {

    return game.lesson.quizInProgress.get();
  },

  quizDisplayItem: function() {

    return game.lesson.quizDisplayItem.get();
  },

  quizReadyForNextOrEnd: function()  {

    var _state = game.lesson.quizState.get();

     if ( _state == "readyForNext" || _state == "quizEnd" || _state == "examEnd" ) return true;

     return false;
  },

  visited: function() {

    if ( isInReactiveArray( this, game.lesson.visited ) ) return true;

    return false;
  },



});


Template.lessonMap.events = {

  'click #lessonMapClose': function (evt, template) {

      Control.playEffect("new_feedback.mp3");

      FlowRouter.go("/main");
  },

  'click #btnQuiz': function (evt, template) {

      Control.playEffect("new_feedback.mp3");

      game.lesson.doQuiz();
  },

  'click #btnReview': function (evt, template) {

      switchLesson( game.lesson.continent, game.lesson.mission.code );
  },

  'click #btnRetakeQuiz': function (evt, template) {

      game.lesson.retakeQuiz();
  },

  'click #btnNextOrEnd': function (evt, template) {

      Control.playEffect("new_feedback.mp3");

      var _state = game.lesson.quizState.get();

      if ( _state == "readyForNext") game.lesson.doQuizQuestion();

      if ( _state == "quizEnd") game.lesson.doQuiz();     

      if ( _state == "examEnd") game.lesson.finishExam();
  },
}

//*************************************************************************
//              RENDERED CALLBACK
//*************************************************************************


Template.lessonMap.rendered = function () {
  
    stopSpinner();

    if (!display) return;

    if (display.worldMapTemplateReady == false) {

      display.worldMapTemplateReady = true;

      Meteor.setTimeout( function() { display.ctl["MAP"].lessonMap.doCurrentMap() }, 250 );

      Meteor.setTimeout( function() { display.ctl["MAP"].lessonFinishDraw() }, 251 );

    }
}
