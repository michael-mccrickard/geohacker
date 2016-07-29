doNextLesson = function( _val) {

	if (_val == 1) doLesson2();

	if (_val == 3) doLesson4();

	if (_val == 4) doLesson4a();

	if (_val == 5) doLesson6();

	if (_val == 6) doLesson6a();
}

doLesson2 = function() {

	game.lesson.zoomToContinent("africa");

	Meteor.setTimeout( function() { doLesson3(); }, 3200);

}

doLesson3 = function() {

	var g = game.lesson;

	g.resetBody(0, 3);
}

doLesson4 = function() {

	var g = game.lesson;

	g.showBody("Africa is composed of 50 countries.", 0, 4);

}

doLesson4a = function() {

	Meteor.setTimeout( function() { game.lesson.lessonMap.doThisMap( mlContinent, mlContinent, mlCountry, "africa") }, 500 );

	Meteor.setTimeout( function() { doLesson5(); }, 501);	
}

doLesson5 = function() {

	var g = game.lesson;

	g.resetBody(2.5, 5);

}

doLesson6 = function() {

	var g = game.lesson;

	g.showBody("The 50 countries are divided into 4 regions.", 0, 6);

}

doLesson6a = function() {

	var g = game.lesson;

	g.lessonMap.doThisMap( mlContinent, mlContinent, mlRegion, "africa");

	Meteor.setTimeout( function() { doLesson7(); }, 501);	
}

doLesson7 = function() {

	var g = game.lesson;

	g.tl = new TimelineMax();

	g.tl.pause();	

	g.tl.delay(0.5);

	g.addPulseRegionsInSequence( "africa" );

	g.tl.add( doLesson8, 4.5 );

	g.tl.play();
}

doLesson8 = function() {

	var g = game.lesson;

	g.tl = new TimelineMax();

	g.tl.pause();	

	g.tl.delay(0.5);	

	g.addFadeHeader("out");

	g.addResetBody();

	g.addSetHeader("The Ten Largest Countries in Africa");

	g.addFadeHeader("in");

	g.addSwitchTo( ".divTeachList" );

	g.tl.add( doLesson9, 2.0 );

	g.tl.play();

}

doLesson9 = function() {

	var g = game.lesson;

	g.revealList();

	//Meteor.setTimeout( function() { doLesson11(); }, 2000);		

}

//*****************************************************************************
//			AUTOMATED TOP TEN REVIEW
//*****************************************************************************

doLesson11 = function() {

	var g = game.lesson;

	g.index++;

	if (g.index == 10) return;

	var ID = game.lesson.items[ g.index ];

	hack.initForLearn( ID );

	g.selectListItem( ID );



	var rec = db.getCountryRec( ID );

	g.lessonMap.doThisMap( mlContinent, mlRegion, mlCountry, g.lessonMap.selectedContinent, rec.r);

	g.tl = new TimelineMax();

	g.tl.pause();

	g.addFlyListItemToMap(ID);

	g.addFadeUnselectedList("out");

	g.addFadeHeader("out");

	var rec = db.getCountryRec( ID );

	g.addSetHeader( db.getCountryName( ID ) + " is in " + db.getRegionName( rec.r ) );

	g.addFadeHeader("in");

	g.tl.add( doLesson12, "+=0.1" );

	g.tl.play();
}

doLesson12 = function() {

	var g = game.lesson;

	g.tl = new TimelineMax();

	g.tl.pause();

	g.addFadeCapsule("in");

g.tl.add( doLesson13, "+=0.5" );	

	g.tl.play();
}

doLesson13 = function() {

	var g = game.lesson;

	g.tl = new TimelineMax();

	g.tl.pause();

g.addFadeCapsule("out", "+=0.5" );	

	g.addFadeHeader("out");

	g.addSetHeader("The Ten Largest Countries in Africa");

	g.addFadeHeader("in");

	g.tl.add( doLesson14, "+=0.1" );	

	g.tl.play();
}

doLesson14 = function() {

	var g = game.lesson;

	g.redrawList();

Meteor.setTimeout( function() { doLesson11(); }, 1500);
}


