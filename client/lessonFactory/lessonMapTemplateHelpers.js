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

var fullHeight = 900;


function scaleMe( _val ) {

   var _w = $(window).height();

   _val = _val * (_w / fullHeight);

   return _val + "px";

}

Template.lessonMap.helpers({

  body1FontSize: function() {

      return scaleMe(38);
  },

  body2FontSize: function() {

      return scaleMe(144);
  },

  body3FontSize: function() {

      return scaleMe(72);
  },

  headerColor: function() {

    return game.lesson.headerColor.get();
  },

  messageColor: function() {

    return game.lesson.messageColor.get();
  },  

  allVisited: function() {

    if (game.lesson.state.get() == "menu" || game.lesson.state.get() == "continentMenu" ) return false;

    if (game.lesson.quiz.state.get() == "decideNextStep") return false;

    if ( game.lesson.visited.length() == game.lesson.items.length ) return true;

    return false;

  },

  lesson: function() {

     return LessonSequence.makeMenuArray( game.user.lessonSequenceCode.get() );
  },

  lessonShortName: function() {

    return game.lesson.mission.shortName;
  },

  nextLessonShortName: function() {

    var _wm = game.lesson.worldMenu;

     var _index = _wm.lessonIndex + 1;

     var _mission = new Mission(  _wm.lessonGroup[ _index ] )

     return ( _mission.shortName );
  },

  hasNextLesson: function() {

    var _wm = game.lesson.worldMenu;

    if (_wm.lessonIndex < _wm.lessonGroup.length - 1) return true;

    return false;
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

    if (game.lesson.quiz.state.get() == "decideNextStep") return true;

    return false;
  },

  divTeachWidth: function() { return Session.get("gWindowWidth") * 0.49},

  mapWidth: function() { return Session.get("gWindowWidth") * 0.49},

  mapHeight: function() { 

    var h = Session.get("gWindowHeight") - display.menuHeight;

    return h * 0.98;

  },

  nextOrEndText: function() {

      var _state = game.lesson.quiz.state.get();

      if ( _state == "readyForNext") return "NEXT";

      if ( _state == "quizEnd" || _state == "examEnd") return "OK"; 

  },

  quizInProgress: function() {

    return game.lesson.quiz.inProgress.get();
  },

  quizDisplayItem: function() {

    return game.lesson.quiz.displayItem.get();
  },

  quizReadyForNextOrEnd: function()  {

    var _state = game.lesson.quiz.state.get();

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

      game.lesson.quiz.start();
  },

  'click #btnNextLesson': function (evt, template) {

      Control.playEffect("new_feedback.mp3");

      var _wm = game.lesson.worldMenu;

      _wm.lessonIndex++;

     switchLesson( _wm.selectedContinent, _wm.lessonGroup[ _wm.lessonIndex ]);
  },

  'click #btnReview': function (evt, template) {

      switchLesson( game.lesson.continent, game.lesson.mission.code );
  },

  'click #btnRetakeQuiz': function (evt, template) {

      game.lesson.quiz.retake();
  },

  'click #btnNextOrEnd': function (evt, template) {

      Control.playEffect("new_feedback.mp3");

      var _state = game.lesson.quiz.state.get();

      if ( _state == "readyForNext") game.lesson.quiz.doQuestion();

      if ( _state == "quizEnd") game.lesson.quiz.start();     

      if ( _state == "examEnd") game.lesson.quiz.finishExam();
  },

    'click #btnReturnToMenu2': function (evt, template) {

        game.user.goHome();
    },
}

//*************************************************************************
//              RENDERED CALLBACK
//*************************************************************************


Template.lessonMap.rendered = function () {
  
    stopSpinner();

    if (!game.lesson) return;

    if (display.worldMapTemplateReady == false) {

      display.worldMapTemplateReady = true;

c("lessonMap rendered, state follows")
c(game.lesson.state.get())

      if (game.lesson.state.get() == "learn") Meteor.setTimeout( function() { display.ctl["MAP"].lessonMap.doCurrentMap() }, 250 );

      if (game.lesson.state.get() == "resuming") Meteor.setTimeout( function() { resumeLesson(); }, 250 );

      Meteor.setTimeout( function() { display.ctl["MAP"].lessonFinishDraw() }, 251 );

    }
}
