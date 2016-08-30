

LessonFactory = function() {

	this.init = function() {

		display.ctl[ "MAP" ] = new ghMapCtl();

		this.mapCtl = display.ctl["MAP"];

		this.lessonMap = this.mapCtl.lessonMap;

		this.mapCtl.init();

		this.tl = new TimelineMax();

		//the temporary lesson/map levels and codes

		this.lessonGroup = "";

		this.mapLevel = "";

		this.drawLevel = "";

		this.detailLevel = "";

		this.hack = new Hack();

		this.code = "";

		this.mission = null;

		this.items = [];  //Contrary to the normal policy of keepings all array names singular
						  //this is just a source array that is never manipulated, so this is like
						  //a reminder of it's non-scalar nature

		this.name = "";

		this.index = 0;  //index into the list of countries (items)

		this.lessonNumber = 0;

		this.lessonLimit = 0;  //actually applies to each group of continent lessons, not any particular lesson itself, 
								//but we lack an appropriate
								//entity to attach this to, so this is where it is for now


		this.content = new Blaze.ReactiveVar("");

		this.updateFlag = new Blaze.ReactiveVar( false );

		this.country = "";

		this.continent = "";

		this.region = "";

		this.pop = 0;  //population

		this.count = 0;  //country count

		this.rcount = 0;  //region count

		this.visited = new ReactiveArray();  //for keeping track of which countries the user has clicked on

		this.note = "";  //any note needed to explain something basic abt the lesson ("We include Russia as part of Asia". e.g.)

		//QUIZ OBJECT

		this.quiz = new Quiz(this);



		//FORMAT PROPERTIES

		this.messageColor = new Blaze.ReactiveVar( "yellow" );

		this.headerColor = new Blaze.ReactiveVar( "yellow" );

	}



	//***************************************************************
	//					MISCELLANEOUS FUNCTIONS
	//***************************************************************

	this.setTextColor = function( _which ) {

		this.messageColor.set( _which );

		this.headerColor.set( _which );


	}

	this.hideTeachLayout = function() {

		$(".divTeachBody").css("display","none");

		$(".divTeachList").css("display","none");
	
	}

	this.showTeachLayout = function() {

		$(".divTeachBody").css("display","block");

		$(".divTeachList").css("display","block");
	
	}
	
	this.updateContent = function() {

		var _val = this.updateFlag.get();

		this.updateFlag.set( !_val );
	}


	this.setMission = function( _code) {

		this.mission = new Mission( _code );

		this.items = this.mission.items;

		if (this.continent == "africa")  this.lessonLimit = 5;

		if (this.continent == "asia")  this.lessonLimit = 4;

		if (this.continent == "europe")  this.lessonLimit = 4;

		if (this.continent == "north_america")  this.lessonLimit = 2;

		if (this.continent == "south_america")  this.lessonLimit = 2;		

		if (this.continent == "oceania")  this.lessonLimit = 1;	

		this.lessonNumber = this.mission.shortName.substr( this.mission.shortName.length - 1, 1);

		this.lessonNumber = parseInt(this.lessonNumber);	
	}

	this.pushID = function( _ID ) {

		if (isInReactiveArray( _ID, this.visited ) == false) {

			this.visited.push( _ID );
		}
	}

	//***************************************************************
	//					MAPPING FUNCTIONS
	//***************************************************************

	this.showMap = function() {

		display.worldMapTemplateReady = false;

		FlowRouter.go("/lessonMap");		
	}

	//************************************************************************************************
	//					TEXT FUNCTIONS 
	//************************************************************************************************

	this.setMessage = function( _text ) {

		$("#lessonMapMessageBox").text( _text );
	}

	this.setHeader = function( _text ) {

		$(".divTeachHeader").text( _text );
	}

	this.addSetHeader = function( _text, _pos) {

		this.tl.call( this.setHeader, [ _text ], this, _pos );
	}

	this.fadeCapsule = function( _which ) {

		var s = ".divLearnCountry";

		if (_which == "in") { TweenMax.to(s, 0.5, {opacity: 1, ease:Power1.easeIn } ); }

		if (_which == "out") { TweenMax.to(s, 0.5, {opacity: 0, ease:Power1.easeIn } ); }
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

			this.tl.add( TweenMax.staggerTo(s, 1.0, {x: 800, ease:Power1.easeIn, onComplete: doNextLesson, onCompleteParams:[ _lessonID ]} ), 0.2 );
		}
		else {

			this.tl.add( TweenMax.staggerTo(s, 1.0, {x: 800, ease:Power1.easeIn} ), 0.2 );
		}

		this.tl.play();
	}

	this.showBody = function( _text1, _text2, _text3, _delay, _lessonID ) {

		var s = ".divTeachBody";

		this.switchTo(s);

		$(".divTeachBody1").text( _text1 ); 

		$(".divTeachBody2").text( _text2 ); 

		$(".divTeachBody3").text( _text3 ); 

		this.tl = new TimelineMax();

		this.tl.pause();

		this.tl.delay( _delay );

		if (_lessonID) {

			this.tl.add( TweenMax.staggerTo(s, 1.0, {x: -800, ease:Power1.easeOut, onComplete: doNextLesson, onCompleteParams:[ _lessonID ] }, 0.1 ) );
		}
		else {

			this.tl.add( TweenMax.staggerTo(s, 1.0, {x: -800, ease:Power1.easeOut} ), 0.1 );			
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

		$(".divTeachBody").css("display", "none");

		$(".divTeachList").css("display", "none");

		$( _which ).css("display", "block");	
	}

	//***************************************************************
	//					LABELING FUNCTIONS
	//***************************************************************

	this.clearLabels = function() {

		this.lessonMap.map.clearLabels();
	}


	this.labelArea = function(_level, _code, _x, _y) {

		this.lessonMap.map.clearLabels();

		this.level = _level;

		this.code = _code;

		if (_level == mlRegion) this.region = _code;

		if (_level == mlCountry) this.country = _code;

		this.lessonMap.labelMapObject( _level, _code, _x, _y);
	}

	this.doLabelRegion = function( _regionID )  {

		 this.region = _regionID;

		 var _color = "white";

		 var rec = db.getRegionRec( _regionID);

		 if (rec.rll_co !== undefined) _color = rec.rll_co;

		this.lessonMap.labelMapObject( mlRegion, _regionID, 0, 0, 16, _color );
	}

	this.doLabelCountry = function( _countryID )  {

		 this.country = _countryID;

		 var _color = "black";

		 var rec = db.getCountryRec( _countryID);

		 if (rec.ll_co !== undefined) _color = rec.ll_co;

		this.lessonMap.labelMapObject( mlCountry, _countryID, 0, 0, 12, _color );
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

		//the regions are in the db, of course, but not necessarily in the order that we want them

		if (_continentID == "africa") arr = ["nwaf", "neaf", "caf", "saf"];

		if (_continentID == "europe") arr = ["neu", "eeu", "weu", "bal"];

		if (_continentID == "north_america") arr = ["nam", "mam", "cam"];

		if (_continentID == "south_america") arr = ["nwsa", "nesa", "ssa"];

		if (_continentID == "oceania") arr = ["oce", "aus"];

		if (_continentID == "asia") arr = ["cas", "mea","swas","sas","eas","seas"];

		for (var i = 0; i < arr.length; i++) { 		

			this.tl.call( this.doLabelRegion, [ arr[i] ], this, arr[i] );

			this.addPulseRegion( arr[i] );
		}
	}

	//***************************************************************
	//				IMMEDIATE ACTION FUNCTIONS
	//***************************************************************

	this.pulseCountry = function( _ID) {

		this.tl = new TimelineMax();

		this.tl.pause();

		this.addPulseCountry( _ID );

		this.tl.play();
	}

	this.pulseRegion = function( _ID) {

		this.tl = new TimelineMax();

		this.tl.pause();

		this.addPulseRegion( _ID );

		this.tl.play();
	}

	this.hideCapsule = function() {

		$(".divLearnCountry").css("display", "none");

		$(".divLearnCountry").css("opacity", 0.0);
	}

	this.showCountryAndCapsule = function( _ID ) {

		this.country = _ID;

		var rec = db.getCountryRec( _ID );

		this.region = rec.r;

		this.lessonMap.doThisMap( mlContinent, mlRegion, mlCountry, this.lessonMap.selectedContinent, this.region, false);	

		this.showCapsule( _ID );
	}

	this.showCapsule = function( _ID ) {

		Control.playEffect2( "button_1.mp3" );

		this.pushID( _ID );

		this.hideCapsule();

		this.country = _ID;

		hack.initForLearn( _ID );

		this.selectListItem( _ID );

		var rec = db.getCountryRec( _ID );

		this.region = rec.r;

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

		x = 200;

		y = 200;

		var s = ".divLearnCountry";

		var map = this.lessonMap.map;

		if (rec.cpLon !== undefined) {

            var loc = map.coordinatesToStageXY( rec.cpLon, rec.cpLat);

            x = loc.x;

            y = loc.y;
		}
		else {

			if (rec.xc !== undefined) {

				x = map.divRealWidth * rec.xc;

				y = map.divRealWidth * rec.yc;
			}			
		}

		$(".divLearnCountry").css("display", "flex");

		Meteor.setTimeout( function() { $(".divLearnCountry").offset( { top: y , left: x } ); }, 200 );			

		Meteor.setTimeout( function() { game.lesson.fadeCapsule("in"); }, 201 );

		var regionName = db.getRegionRec( this.region ).n;

		this.setMessage( rec.n + " is in " + regionName);

		this.pulseCountry( _ID);
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



LessonFactory.updateLessons = function() {

     //basic update for now; check for existence of lessonScore objects
     //and add if they are not found

     var _user = game.user;

     if ( !_user.profile.lesson )  {

     	_user.profile.lesson = [];
     }


     var _dirty = false;

     var lp = new LessonPack();

     for (var i = 0; i < lp.item.length; i++ ) {

     	//is there an object with this id in the array?

     	if ( findObjectWithID( lp.item[i], _user.profile.lesson ) == null ) {

     		//then add it

     		var ls = new LessonScore( lp.item[i] );

     		_user.profile.lesson.push( ls );

     		_dirty = true;
     	}
     }

     if (_dirty) {

     	db.updateUserLessons();
     }
}
