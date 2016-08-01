gEditLesson = false;

doLesson = function() {

	if (!game.lesson) {

		game.lesson = new LessonFactory();
	}

	game.user.mode = uLearn;

	hack = game.lesson.hack;

	var g = game.lesson;

	g.index = -1;

g.lessonMap.selectedContinent = "africa";

	g.setMission("ttp_africa");

	g.mapLevel = mlWorld;

	g.drawLevel = mlWorld;

	g.detailLevel = mlContinent;

	g.showMap();
 
//doLessonPrep();

//return;
	//opening sequence

	g.setMessage("africa", "intro1");

	g.setHeader("africa", "intro1");

	g.showBody("africa is home to 1.2 billion people.", 0.5, 1);

}

doLessonPrep = function() {

game.lesson.setHeader("TOP TEN AFRICA");

game.lesson.switchTo(".divTeachList");

	Meteor.setTimeout( function() { game.lesson.lessonMap.doMap(mlContinent, mlContinent, mlCountry);}, 500);

Meteor.setTimeout( function() { doLesson10(); }, 500);
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

	this.hack = new Hack();

	this.code = "";

	this.mission = null;

	this.tempItems = [];

	this.items = [];

	this.index = 0;  //index into the list of countries (items)

	this.content = new Blaze.ReactiveVar("");

	this.updateFlag = new Blaze.ReactiveVar( false );

	this.selectedCountry = "";


	this.updateContent = function() {

		var _val = this.updateFlag.get();

		this.updateFlag.set( !_val );
	}

	this.redrawList = function() {

		this.tempItems = this.mission.items;

		this.items = [];

		this.updateContent();

		Meteor.setTimeout( function() { game.lesson.redrawList2(); }, 100 );
	}

	this.redrawList2 = function() {

		this.items = this.tempItems;

		this.updateContent();

		Meteor.setTimeout( function() { game.lesson.fadeList("in"); }, 100 );
	}

	this.setMission = function( _code) {

		this.mission = new Mission( _code );

		this.items = this.mission.items;
	}

	this.showCapsule = function( _ID ) {

		this.selectedCountry = _ID;

		hack.initForLearn( _ID );

		this.selectListItem( _ID );

		var rec = db.getCountryRec( _ID );

		this.lessonMap.doThisMap( mlContinent, mlRegion, mlCountry, this.lessonMap.selectedContinent, rec.r);	

		var x = 0;

		var y = 0;

		if (rec.llon !== undefined) {

			x = this.lessonMap.map.longitudeToX( rec.llon );

			y = this.lessonMap.map.latitudeToY( rec.llat );
		}
		else {

			if (rec.xl3 !== undefined) {

				x = rec.xl3;

				y = rec.yl3;
			}			
		}


		this.lessonMap.labelMapObject(mlCountry, _ID, x, y, 12, "black");

		var s = ".divLearnCountry";

		var map = this.lessonMap.map;

		if (rec.cpLon !== undefined) {

			x = this.lessonMap.map.longitudeToStageX( rec.cpLon );

			y = this.lessonMap.map.latitudeToStageY( rec.cpLat );
		}
		else {

			if (rec.xc !== undefined) {

				x = map.divRealWidth * rec.xc;

				y = map.divRealWidth * rec.yc;
			}			
		}


		Meteor.setTimeout( function() { $(".divLearnCountry").offset( { top: y , left: x } ); }, 100 );			


		Meteor.setTimeout( function() { game.lesson.fadeCapsule("in"); }, 101 );
	}

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

	this.fadeCapsule = function( _which ) {

		var s = ".divLearnCountry";

		if (_which == "in") TweenMax.to(s, 0.5, {opacity: 1, ease:Power1.easeIn } );

		if (_which == "out") TweenMax.to(s, 0.5, {opacity: 0, ease:Power1.easeIn } );
	}

	this.addFadeCapsule = function( _which, _pos ) {

		var s = ".divLearnCountry";

		if (_which == "in") this.tl.add( TweenMax.to(s, 0.5, {opacity: 1, ease:Power1.easeIn } ), _pos );

		if (_which == "out") this.tl.add( TweenMax.to(s, 0.5, {opacity: 0, ease:Power1.easeIn } ), _pos );
	}


	this.addSwitchTo = function( _which ) {

		this.tl.call( this.switchTo, [ _which ], this );
	}

	this.addFadeHeader = function( _which, _pos) {

		var s = ".divTeachHeader";

		if (_which == "in") this.tl.add( TweenMax.to(s, 0.5, {opacity: 1, ease:Power1.easeIn } ), _pos );

		if (_which == "out") this.tl.add( TweenMax.to(s, 0.5, {opacity: 0, ease:Power1.easeIn } ), _pos );

	}

	this.addFadeList = function( _which, _pos) {

		var s = ".divTeachList";

		if (_which == "in") this.tl.add( TweenMax.to(s, 0.5, {opacity: 1, ease:Power1.easeIn } ), _pos );

		if (_which == "out") this.tl.add( TweenMax.to(s, 0.5, {opacity: 0, ease:Power1.easeIn } ), _pos );

	}

	this.addFadeUnselectedList = function( _which, _pos) {

		var s = ".listItem";

		if (_which == "in") this.tl.add( TweenMax.to(s, 0.5, {opacity: 1, ease:Power1.easeIn } ), _pos );

		if (_which == "out") this.tl.add( TweenMax.to(s, 0.5, {opacity: 0, ease:Power1.easeIn } ), _pos );

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

	this.addRevealList = function( ) {

		var s = ".divCountryListItem";

		this.tl.add( TweenMax.staggerTo(s, 1.0, {x: -800, ease:Power1.easeOut}, 0.1 ) );

	}

	this.revealList = function( ) {

		var s = ".divCountryListItem";

		TweenMax.staggerTo(s, 1.0, {x: -800, ease:Power1.easeOut}, 0.1 );

	}

	this.repositionList = function() {

		var s = ".divCountryListItem";

		this.switchTo(s);

		$(s).css("position","relative");	

		$(s).css("left","-800px");	
	}

	this.fadeList = function( _which) {

		var s = ".divCountryListItem";

		this.repositionList();

		var _opacity = "1";

		if (_which == "out") _opacity = "0";

		TweenMax.staggerTo(s, 1.0, {opacity: _opacity, ease:Power1.easeOut}, 0.1 );
	}

	this.addFlyListItemToMap = function( _ID ) {

		var s = "#" + _ID + "-ListItem";

		var itemX = $(s).offset().left;

		var itemY = $(s).offset().top;

		var itemWidth = $(s).width();

		var _lon, _lat, _x, _y;

		var m = game.lesson.lessonMap.map;

		var obj = m.getObjectById( _ID );

		_lat = m.getAreaCenterLatitude( obj );

		_lon = m.getAreaCenterLongitude( obj );

		//the first time thru, the CSS is different on the list items

		var _offset = 800;

		if (this.index != 0) _offset = 0;

		_x = m.longitudeToX(_lon) - (itemX + itemWidth/2) - _offset;   //800 = amt this div is shifted over;

		_y = m.latitudeToY(_lat) - itemY - $(s).height()/2  + 55;  //55 = height of menubar

		this.tl.add( TweenMax.to(s, 1.0, {x: _x, y: _y, scale: 0.45, ease:Power1.easeIn} ) );		
	}

	this.selectListItem = function( _which ) {

		var s = ".divCountryListItem";

		//remove the selected class and re-color all

		$(s).removeClass("listItemSelected");

		$(s).addClass("listItem");		

		$(s).css("color", "white");

		//now select the which item

		s = "#" + _which + "-ListItem";

		$(s).addClass("listItemSelected");

		$(s).removeClass("listItem");		

		$(s).css("color", "yellow");

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

	if (!gEditLesson && !gEditCapsulePos) return;

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

	var map = game.lesson.lessonMap.map;

	var _x = 0;

	var _y = 0;

	if (gEditCapsulePos) {

		_x = $(".divTeachCapsule").offset().left;

		_y = $(".divTeachCapsule").offset().top;
	}
	else {

		_x = map.allLabels[0].x;

		_y = map.allLabels[0].y;	
	}


	if (_code == 37) {  //left

	   if (gEditCapsulePos) {

	   		_x = _x * 0.98;
	   		
	   		moveCapsule( { top: _y, left: _x });

	   		return;
	   }

	   map.allLabels[0].x = _x * 0.98;

	   moveLabel();
	}

	if (_code == 38) {  //down

	   if (gEditCapsulePos) {

	   		_y = _y * 0.98;

	   		moveCapsule( { top: _y, left: _x });

	   		return;
	   }

	   map.allLabels[0].y = _y * 0.98;

	   moveLabel();
	} 

	if (_code == 39) {  //right

	   if (gEditCapsulePos) {

	   		_x = _x * 1.02;
	   		
	   		moveCapsule( { top: _y, left: _x });

	   		return;
	   }

	   map.allLabels[0].x = _x * 1.02;

	   moveLabel();
	}

	if (_code == 40) {  //up

	   if (gEditCapsulePos) {

	   		_y = _y * 1.02;

	   		moveCapsule( { top: _y, left: _x });

	   		return;
	   }

	   map.allLabels[0].y = _y * 1.02;

	   moveLabel();
	}

}

function moveLabel() {

	var map = game.lesson.lessonMap.map;

	var _x = map.allLabels[0].x;

	var _y = map.allLabels[0].y;

    map.clearLabels();

    Meteor.defer( function() { display.ctl["MAP"].lessonMap.labelMapObject( game.lesson.level, game.lesson.code, _x, _y ); } );      

}

function moveCapsule( _obj) {

	$(".divTeachCapsule").offset( _obj );
}

function updateLabelRecord() {

	//showMessage("updating label pos in db");

    Meteor.defer( function() { updateLabelPosition2( ); } );
	
}

updateLabelPosition2 = function(_which) {

	var _map = game.lesson.lessonMap.map

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