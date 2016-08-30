switchLesson = function(_continentID, _missionCode) {

	FlowRouter.go("/waiting");

	Meteor.setTimeout( function() { doLesson(_continentID, _missionCode); }, 250 );
}


goLessonMenu = function() {

	FlowRouter.go("/waiting");

	game.lesson = game.lesson || new LessonFactory();

	game.lesson.init();

	game.lesson.state.set( "menu" );

	Meteor.setTimeout( function() { game.lesson.showMap(); }, 250 );
}

showLessonMenu = function() {

	var g = game.lesson;

	g.setTextColor( "yellow" );

	g.quiz.inProgress.set( false );

	g.setMessage("LEARN THE WORLD");

	g.setHeader("");

	var _text1 = "";

	var _text2 = ""

	var _text3 = "CHOOSE A CONTINENT";

	g.showBody(_text1, _text2, _text3, 0.1 );

	g.lessonMap.doThisMap(mlWorld, mlWorld, mlContinent, null, null);
}

showContinentMenu = function(_code) {

	var _continentID = db.getContinentCodeForCountry( _code );

	var g = game.lesson;

	game.user.lessonSequenceCode.set( _continentID );

	g.state.set("continentMenu");

	
}

doNextLesson = function( _val) {

	if (_val == 1) doLesson2();

	if (_val == 3) doLesson4();

	if (_val == 4) doLesson4a();

	if (_val == 5) doLesson6();

	if (_val == 6) doLesson6a();

	//quiz

	if (_val == 10) game.lesson.quiz.doQuestion();
}


doLesson = function(_continentID, _missionCode) {

	game.lesson = game.lesson || new LessonFactory();

	game.lesson.init();

	game.user.mode = uLearn;

	hack = game.lesson.hack;

	var g = game.lesson;

	g.state.set( "learn" );

	g.setTextColor( "yellow" );

	g.quiz.inProgress.set( false );

	g.index = -1;

	g.continent = _continentID;

g.lessonGroup = _continentID;

	g.code = _missionCode;

	g.name = db.getContinentRec( _continentID).n;

	g.lessonMap.selectedContinent = _continentID;

	g.setMission( _missionCode );

	var rec = db.getContinentRec( _continentID );

	g.pop = rec.p;

	g.count = rec.cnt;

	g.rcount = db.ghR.find( { z: _continentID }).fetch().length; 

	g.note = g.lnote;

	g.mapLevel = mlWorld;

	g.drawLevel = mlWorld;

	g.detailLevel = mlContinent;

	g.showMap();

	//uncomment next two lines ...
	//for dev work on the capsule positions and country labels

//doLessonList();

//return;	

	var _readyFlag = false;

	if (game.lesson.mission.type == "quizOnly") {

		doLessonQuiz();

		return;
	}

	//opening sequence

	g.switchTo(".divTeachBody");

	g.setMessage(g.name, "intro1");

	//g.setHeader(g.name, "intro1");


	var _text1 = g.name + " is home to ";

	var _text2 = g.pop;

	var _text3 = " people";

	//the last param is lessonID, which showBody will use to 
	//call doNextLesson in its callback

	g.showBody(_text1, _text2, _text3, 0.5, 1 );

	//g.showBody( g.name + " is home to " + g.pop + " people.", 0.5, 1);

}

doLessonList = function() {

	game.lesson.setHeader( game.lesson.mission.name );

	game.lesson.switchTo(".divTeachList");

	Meteor.setTimeout( function() { game.lesson.lessonMap.doMap(mlContinent, mlContinent, mlCountry);}, 500);

	Meteor.setTimeout( function() { doLesson9(); }, 500);
}

doLessonQuiz = function( _readyFlag ) {

	game.lesson.setHeader( game.lesson.mission.name );

	game.lesson.switchTo(".divTeachList");

	Meteor.setTimeout( function() { game.lesson.lessonMap.doMap(mlContinent, mlContinent, mlCountry);}, 500);

	//Meteor.setTimeout( function() { game.lesson.visited.set( game.lesson.items) }, 500);

	Meteor.setTimeout( function() { game.lesson.revealList() }, 500);

	Meteor.setTimeout( function() { doLesson9() }, 501);
}



doLesson2 = function() {

	game.lesson.zoomToContinent( game.lesson.continent );

	Meteor.setTimeout( function() { doLesson3(); }, 3200);

}

doLesson3 = function() {

	var g = game.lesson;

	g.resetBody(0, 3);
}

doLesson4 = function() {

	var g = game.lesson;

	var _text1 = g.name + " is composed of ";

	var _text2 = g.count;

	var _text3 = " major countries.";

	g.showBody(_text1, _text2, _text3, 0, 4 );

}

doLesson4a = function() {

	Meteor.setTimeout( function() { game.lesson.lessonMap.doThisMap( mlContinent, mlContinent, mlCountry, game.lesson.continent) }, 500 );

	Meteor.setTimeout( function() { doLesson5(); }, 501);	
}

doLesson5 = function() {

	var g = game.lesson;

	g.resetBody(2.5, 5);

}

doLesson6 = function() {

	var g = game.lesson;

	var _text1 = "The " + g.count + " countries are divided into "

	var _text2 = g.rcount;

	var _text3 = " regions";

	//the last param is lessonID, which showBody will use to 
	//call doNextLesson in its callback

	g.showBody(_text1, _text2, _text3, 0, 6 );

	//g.showBody( + g.rcount + " regions.", 0, 6);

}

doLesson6a = function() {

	var g = game.lesson;

	g.lessonMap.doThisMap( mlContinent, mlContinent, mlRegion, g.continent);

	Meteor.setTimeout( function() { doLesson7(); }, 501);	
}

doLesson7 = function() {

	var g = game.lesson;

	g.tl = new TimelineMax();

	g.tl.pause();	

	g.tl.delay(0.5);

	g.addPulseRegionsInSequence( g.continent );

	g.tl.add( doLesson8, g.rcount );

	g.tl.play();
}

doLesson8 = function() {

	var g = game.lesson;

	g.tl = new TimelineMax();

	g.tl.pause();	

	g.tl.delay(0.5);	

	g.addFadeHeader("out");

	g.addResetBody();

	var s = "The Ten Largest Countries in";

	if (g.continent == "oceania") s = "The Seven Largest Countries in";

	g.addSetHeader("The Ten Largest Countries in " + g.name);

	g.addFadeHeader("in");

	g.addSwitchTo( ".divTeachList" );

	g.tl.add( doLesson9, 2.0 );

	g.tl.play();

}

doLesson9 = function() {

	var g = game.lesson;

	g.tl = new TimelineMax();

	g.tl.pause();

	g.addSwitchTo(".divTeachList");

	g.addRevealList();

	g.addSetHeader( "click the name of each country", "+=1.5" );

	g.tl.play();
}
