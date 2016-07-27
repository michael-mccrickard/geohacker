gEditLesson = false;

doAlert = function() {

	alert("complete");
}

doNextLesson = function( _val) {

	if (_val == 1) doLesson2();

	if (_val == 3) doLesson4();

	if (_val == 4) doLesson4a();

	if (_val == 5) doLesson6();

	if (_val == 6) doLesson6a();
}

doLesson = function() {

	if (!game.lesson) {

		game.lesson = new LessonFactory();
	}

//need a definite way to turn on editing mode, but for now ...
gEditLesson = true;

	var g = game.lesson;

	g.mission = new Mission("ttp_africa");

	g.mapLevel = mlWorld;

	g.drawLevel = mlWorld;

	g.detailLevel = mlContinent;

	g.showMap();

	//opening sequence

	g.setMessage("africa", "intro1");

	g.setHeader("africa", "intro1");

	g.showBody("africa is home to 1.2 billion people.", 0.5, 1);

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

	g.tl.add( doLesson9, 2.2 );

	g.tl.play();

}

doLesson9 = function() {

	var g = game.lesson;

	g.showList();

}


LessonFactory = function() {


	display.ctl[ "MAP" ] = new ghMapCtl();

	this.mapCtl = display.ctl["MAP"];

	this.lessonMap = this.mapCtl.lessonMap;

	this.mapCtl.init();

	this.tl = new TimelineMax();

	//the temporary lesson/map levels and code

	this.mapLevel = "";

	this.drawLevel = "";

	this.detailLevel = "";

	this.code = "";

	this.mission = null;

	this.content = new Blaze.ReactiveVar("");

	//***************************************************************
	//					MAPPING FUNCTIONS
	//***************************************************************

	this.showMap = function() {

		display.worldMapTemplateReady = false;

		FlowRouter.go("/lessonMap");		
	}

	//************************************************************************************************
	//					TEXT FUNCTIONS  (old add[Animation] functions are at bottom of file)
	//************************************************************************************************



	this.setMessage = function( _text ) {

		$("#lessonMapMessageBox").text( _text );
	}

	this.setHeader = function( _text ) {

		$(".divTeachHeader").text( _text );
	}

	this.addSetHeader = function( _text) {

		this.tl.call( this.setHeader, [ _text ], this );
	}


	this.addSwitchTo = function( _which ) {

		this.tl.call( this.switchTo, [ _which ], this );
	}

	this.addFadeHeader = function( _which, _delay) {

		var s = ".divTeachHeader";

		//this.tl = new TimelineMax();

		//this.tl.pause();

		//this.tl.delay( _delay );

		if (_which == "in") this.tl.add( TweenMax.to(s, 0.5, {opacity: 1, ease:Power1.easeIn } ) );

		if (_which == "out") this.tl.add( TweenMax.to(s, 0.5, {opacity: 0, ease:Power1.easeIn } ) );

		//this.tl.play();

	}

	this.addResetBody = function(_lessonID)  {

		var s = ".divTeachBody";

		if (_lessonID) {

			this.tl.add( TweenMax.to(s, 1.0, {x: 800, ease:Power1.easeIn, onComplete: doNextLesson, onCompleteParams:[ _lessonID ]} ) );
		}
		else {

			this.tl.add( TweenMax.to(s, 1.0, {x: 800, ease:Power1.easeIn} ) );
		}	
	}

	this.resetBody = function( _delay, _lessonID  ) {

		var s = ".divTeachBody";

		this.tl = new TimelineMax();

		this.tl.pause();

		this.tl.delay( _delay );

		if (_lessonID) {

			this.tl.add( TweenMax.to(s, 1.0, {x: 800, ease:Power1.easeIn, onComplete: doNextLesson, onCompleteParams:[ _lessonID ]} ) );
		}
		else {

			this.tl.add( TweenMax.to(s, 1.0, {x: 800, ease:Power1.easeIn} ) );
		}

		this.tl.play();
	}

	this.showBody = function( _text, _delay, _lessonID ) {

		var s = ".divTeachBody";

		this.switchTo(s);

		$(s).text( _text ); 

		this.tl = new TimelineMax();

		this.tl.pause();

		this.tl.delay( _delay );

		if (_lessonID) {

			this.tl.add( TweenMax.to(s, 1.0, {x: -800, ease:Power1.easeOut, onComplete: doNextLesson, onCompleteParams:[ _lessonID ] } ) );
		}
		else {

			this.tl.add( TweenMax.to(s, 1.0, {x: -800, ease:Power1.easeOut} ) );			
		}

		this.tl.play();

	}

	this.addRevealList = function( _which ) {

		var s = ".divTeachBody";

		this.tl.add( TweenMax.staggerTo(s, 1.0, {x: -800, ease:Power1.easeOut}, 0.1 ) );

	}

	this.showList = function( _pos) {

		var s = ".divCountryListItem";

		this.switchTo(s);

		TweenMax.staggerTo(s, 1.0, {x: -800, ease:Power1.easeOut}, 0.1);
	}

	this.switchTo = function( _which ) {

		$(".divTeachBody").css("visibility", "hidden");

		$(".divTeachList").css("visibility", "hidden");

		$( _which ).css("visibility", "visible");	
	}

	//***************************************************************
	//					LABELING FUNCTIONS
	//***************************************************************

	this.clearLabels = function() {

		this.lessonMap.map.clearLabels();
	}


	this.labelArea = function(_level, _code) {

		this.lessonMap.map.clearLabels();

		this.level = _level;

		this.code = _code;

		this.lessonMap.labelMapObject( _level, _code);
	}

	this.doLabelRegion = function( _regionID )  {

		this.lessonMap.labelMapObject( mlRegion, _regionID, 0, 0, 16, "white" );
	}

	//***************************************************************
	//					ANIMATION BUILDING FUNCTIONS
	//***************************************************************

	this.addPulseCountry = function(_code, _region) {

		//pulse the country's opacity to draw attention to it

        var s = ".amcharts-map-area-" + _code;

		this.tl.add( TweenMax.to(s, 0.5, { opacity: 0 } ), "start1-" + _region );
		this.tl.add( TweenMax.to(s, 0.5, { opacity: 1 } ), "start2-" + _region );
	}

	this.addPulseRegion = function(_regionID) {

		//look up all the countries for the region

		var arr = db.ghC.find( {r: _regionID } ).fetch();

		for (var i = 0; i < arr.length; i++) { 		

			this.addPulseCountry( arr[i].c, _regionID );
		}
	}

	this.addListReveal = function() {

		var s = ".divCountryListItem";

		this.tl.add( TweenMax.staggerTo(s, 1.0, {x: -800, ease:Back.easeIn}, 0.1) );

	},

	this.addPulseRegionsInSequence	= function(_continentID) {

		//look up all the regions for the continent

		var arr = [];

		//the regions are in the db, of course, but not in the order that we want them

		if (_continentID == "africa") arr = ["nwaf", "neaf", "caf", "saf"];

		for (var i = 0; i < arr.length; i++) { 		

			this.tl.call( this.doLabelRegion, [ arr[i] ], this, arr[i] );

			this.addPulseRegion( arr[i] );
		}
	}

	//***************************************************************
	//				IMMEDIATE ACTION FUNCTIONS
	//***************************************************************

	this.showRegionCountriesOnContinent = function( _regionID ) {

		this.mapLevel = mlContinent;

		this.drawLevel = mlRegion;

		this.detailLevel = mlCountry;

		this.lessonMap.selectedRegion = _regionID;

		this.lessonMap.doCurrentMap();
	},



	this.zoomToContinent = function( _continent ) {


       var rec = db.getContinentRec( _continent );

var zoomLevel = rec.z1;
var zoomLatitude = rec.z2;
var zoomLongitude = rec.z3;

if (rec.lz1) zoomLevel = rec.lz1;
if (rec.lz2) zoomLatitude = rec.lz2;
if (rec.lz3) zoomLongitude = rec.lz3;

this.lessonMap.map.zoomDuration = 2;

		this.lessonMap.map.zoomToLongLat( zoomLevel, zoomLongitude, zoomLatitude);
	}

}  //END LESSONFACTORY()



	//***************************************************************
	//				EVENTS
	//***************************************************************


$(document).keydown(function(e) {

	if (!gEditLesson) return;

    switch(e.which) {

       case 37:  //left arrow

        nudgeLabel( e.which );

        break;

      case 38: //arrow key up

        nudgeLabel( e.which );

        break;

      case 39:  //right arrow

        nudgeLabel( e.which );

        break;


      case 40: //arrow key down

        nudgeLabel( e.which );

        break;

	  case 83: //s

	    updateLabelRecord();

		break;
    }
});

//***************************************************************
//            EDIT LABELS MODE
//***************************************************************

function nudgeLabel(_code) {

	var map = display.ctl["MAP"].lessonMap.map;

	var _x = map.allLabels[0].x;

	var _y = map.allLabels[0].y;

	if (_code == 37) {  //left

	   map.allLabels[0].x = _x * 0.98;

	   moveLabel();
	}

	if (_code == 38) {  //down

	   map.allLabels[0].y = _y * 0.98;

	   moveLabel();
	} 

	if (_code == 39) {  //right

	   map.allLabels[0].x = _x * 1.02;

	   moveLabel();
	}

	if (_code == 40) {  //up

	   map.allLabels[0].y = _y * 1.02;

	   moveLabel();
	}

}

function moveLabel() {

	var map = display.ctl["MAP"].lessonMap.map;

	var _x = map.allLabels[0].x;

	var _y = map.allLabels[0].y;

    map.clearLabels();

    Meteor.defer( function() { display.ctl["MAP"].lessonMap.labelMapObject( game.lesson.level, game.lesson.code, _x, _y ); } );      

}

function updateLabelRecord() {

	//showMessage("updating label pos in db");

    Meteor.defer( function() { updateLabelPosition2( ); } );
	
}

updateLabelPosition2 = function(_which) {

	var _map = display.ctl["MAP"].lessonMap.map

    var totalWidth = _map.divRealWidth;

    var totalHeight =  _map.divRealHeight;

    var x = _map.allLabels[0].x;

//c("x in updateLabelPosition is " + x)

    var y = _map.allLabels[0].y;

    x =  x  / totalWidth;

//c("x normalized in updateLabelPosition is " + x)

    y =  y  / totalHeight;

    var _level = game.lesson.level;

    var _code = game.lesson.code;

    var xName = "xl";

    var yName = "yl";

//db.updateRecord2 = function (_type, field, ID, value) 

    if (_level == mlContinent) {

        var rec = db.getContinentRec( _code );

        db.updateRecord2( cContinent, "xl", rec._id, x);

        db.updateRecord2( cContinent, "yl", rec._id, y);

        console.log("continent " + _code + " label updated to " + x + ", " + y);
    }

    if (_level == mlRegion) {

        var rec = db.getRegionRec( _code );

        db.updateRecord2( cRegion, "xl", rec._id, x);

        db.updateRecord2( cRegion, "yl", rec._id, y);

        console.log("region " + _code + " label updated to " + x + ", " + y);
    }
    

}

	//this.tl.call( this.doLabelRegion, [ arr[i] ], this, arr[i] );

/*
	this.addShowMessage = function( _text, _pos ) {

		this.tl.call( this.showMessage, [ _text ], this, _pos );
	}

	this.addShowHeader = function( _text, _pos ) {

		this.tl.call( this.showHeader, [ _text ], this, _pos );
	}

	this.addShowBody = function( _text, _pos, _lessonID ) {

		this.tl.call( this.showBody, [ _text, _lessonID ], this, _pos );
	}

	this.addShowList = function( _pos ) {

		this.tl.call( this.showList,[], this, _pos );

	}

	this.addResetBody = function(_pos, _lessonID)  {

		this.tl.call( this.resetBody,[_lessonID], this, _pos );		
	}
*/