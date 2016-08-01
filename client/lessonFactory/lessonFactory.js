gEditLesson = false;

doLesson = function(_continentID, _missionCode) {

	if (!game.lesson) {

		game.lesson = new LessonFactory();
	}

	game.user.mode = uLearn;

	hack = game.lesson.hack;

	var g = game.lesson;

	g.index = -1;

	g.continent = _continentID;

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

//uncomment these to jump straight to the list (helpful for editing country labels and capsules)
 
doLessonPrep();

return;
	//opening sequence

	//need a better way to determine what to set the initial text to ...

	g.setMessage(_continentID, "intro1");

	g.setHeader(_continentID, "intro1");

	//the last param is lessonID, which showBody will use to 
	//call doNextLesson in its callback

	g.showBody( g.continent + " is home to " + g.pop + " people.", 0.5, 1);

}

doLessonPrep = function() {

	game.lesson.setHeader( game.lesson.mission.name );

	game.lesson.switchTo(".divTeachList");

	Meteor.setTimeout( function() { game.lesson.lessonMap.doMap(mlContinent, mlContinent, mlCountry);}, 500);

	Meteor.setTimeout( function() { doLesson9(); }, 500);
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

	this.country = "";

	this.continent = "";

	this.region = "";

	this.pop = 0;  //population

	this.count = 0;  //country count

	this.rcount = 0;  //region count

	this.note = "";  //any note needed to explain something basic abt the lesson ("We include Russia as part of Asia". e.g.)


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

		this.country = _ID;

		hack.initForLearn( _ID );

		this.selectListItem( _ID );

		var rec = db.getCountryRec( _ID );

		this.region = rec.r;

		this.lessonMap.doThisMap( mlContinent, mlRegion, mlCountry, this.lessonMap.selectedContinent, this.region);	

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

		if (_continentID == "europe") arr = ["neu", "weu", "eeu", "bal"];

		for (var i = 0; i < arr.length; i++) { 		

			this.tl.call( this.doLabelRegion, [ arr[i] ], this, arr[i] );

			this.addPulseRegion( arr[i] );
		}
	}

	//***************************************************************
	//				IMMEDIATE ACTION FUNCTIONS
	//***************************************************************

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

	this.showRegionCountriesOnContinent = function( _regionID ) {

		this.mapLevel = mlContinent;

		this.drawLevel = mlRegion;

		this.detailLevel = mlCountry;

		this.region = _regionID;

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

