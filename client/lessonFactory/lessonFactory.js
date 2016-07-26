gEditLesson = false;

doLesson = function() {

	if (!game.lesson) {

		game.lesson = new LessonFactory();
	}

//need a definite way to turn on editing mode, but for now ...
gEditLesson = true;

	game.lesson.mission = new Mission("ttp_africa");

	game.lesson.mapLevel = mlWorld;

	game.lesson.drawLevel = mlWorld;

	game.lesson.detailLevel = mlContinent;

	game.lesson.showMap();

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

	//***************************************************************
	//					TEXT FUNCTIONS
	//***************************************************************

	this.showMessage = function( _text ) {

		$("#lessonMapMessageBox").text( _text );
	}

	this.showHeader = function( _text ) {

		$(".divTeachHeader").text( _text );
	}

	this.showBody = function( _text ) {

		this.content.set("body");

		Meteor.setTimeout( function() { $(".divTeachBody").text( _text ); }, 100);
	}

	this.showList = function( ) {

		this.content.set("list");

		var s = ".divCountryListItem";

		Meteor.setTimeout( function() { TweenMax.staggerTo(s, 1.0, {x: -800, ease:Back.easeIn}, 0.1) } );
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

		this.lessonMap.labelMapObject( mlRegion, _regionID );
	}

	//***************************************************************
	//					ANIMATION BUILDING FUNCTIONS
	//***************************************************************

	this.addPulseCountry = function(_code, _region) {

		//pulse the country's opacity to draw attention to it

        var s = ".amcharts-map-area-" + _code;

		this.tl.add( TweenLite.to(s, 0.5, { opacity: 0 } ), "start1-" + _region );
		this.tl.add( TweenLite.to(s, 0.5, { opacity: 1 } ), "start2-" + _region );
		this.tl.add( TweenLite.to(s, 0.5, { opacity: 0 } ), "start3-" + _region );
		this.tl.add( TweenLite.to(s, 0.5, { opacity: 1 } ), "start4-" + _region );
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