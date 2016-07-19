gEditLesson = false;

doLesson = function() {

	if (!game.lesson) {

		game.lesson = new LessonFactory();
	}

//need a definite way to turn on editing mode, but for now ...

gEditLesson = true;

	game.lesson.doContinent( "africa" );
}

LessonFactory = function() {


	display.ctl[ "MAP" ] = new ghMapCtl();

	this.mapCtl = display.ctl["MAP"];

	this.lessonMap = this.mapCtl.lessonMap;

	this.mapCtl.init();

	this.tl = new TimelineLite();

	//the temporary lesson level and code

	this.level = "";

	this.code = "";

	this.clearLabels = function() {

		this.lessonMap.map.clearLabels();
	}

	
	this.doContinent = function( _continent ) {

		//the overall level as used by all the lessonMap.js / mapMaker.js code

		this.mapCtl.level.set( mlContinent );

		this.lessonMap.selectedContinent = _continent;
		
		display.worldMapTemplateReady = false;

		FlowRouter.go("/lessonMap");
	}

	this.labelArea = function(_level, _code) {

this.lessonMap.map.clearLabels();

		this.level = _level;

		this.code = _code;

		this.lessonMap.labelMapObject( _level, _code);
	}

	this.pulseCountry = function(_code) {

		//pulse the country's opacity to draw attention to it

        var s = ".amcharts-map-area-" + _code;

		this.tl.add( TweenLite.to(s, 0.5, { opacity: 0 } ), "start1" );
		this.tl.add( TweenLite.to(s, 0.5, { opacity: 1 } ), "start2" );
		this.tl.add( TweenLite.to(s, 0.5, { opacity: 0 } ), "start3" );
		this.tl.add( TweenLite.to(s, 0.5, { opacity: 1 } ), "start4" );
	}

	

	this.pulseRegion = function(_regionID) {

		//look up all the countries for the region

		this.tl.clear();

		var arr = db.ghC.find( {r: _regionID } ).fetch();

		for (var i = 0; i < arr.length; i++) { 		

			this.pulseCountry( arr[i].c );
		}

		this.tl.play();
	}

	this.zoomToContinent = function( _continent ) {

		if ( _continent == "africa")  this.lessonMap.map.zoomTo(3.9);
	}

}

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