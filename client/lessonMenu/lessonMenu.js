

WorldMenu = function( _lessonFactory) {

	this.lf = _lessonFactory;

	this.mm = new LessonMapMaker();

	this.selectedContinent = "";

	this.selectedRegion = "";

	this.lessonGroupCode = "";

	this.lessonGroup = [];

	this.lessonCode = "";

	this.lessonIndex = 0;


	this.doThisMap = function(_mapLevel, _drawLevel, _detailLevel) {

        var z1 = 1.0;

        var z2 = 44.241616;

        var z3 = 10.325;

        if (_mapLevel == undefined) {

            showMessage("No map level in drawWorldMenu().")

            return;
        }

        if (_mapLevel == mlContinent && this.selectedContinent.length == 0 ) {

            showMessage("No continent selected for map level continent.  Cannot draw map in worldMenu.doThisMap()");
            
            return;     
        }

        if (_mapLevel == mlRegion && this.selectedRegion.length == 0 ) {

            showMessage("No region selected for map level region.  Cannot draw map in worldMenudoThisMap()");
            
            return;     
        }

        if (this.selectedContinent.length == 0 && this.selectedRegion.length > 0) {

            var tempRec = db.getRegionRec( this.selectedRegion );
            
            this.selectedContinent = tempRec.z;
        }      

        //initialize variables related to the map

        var rec = null;


        this.zoomDone = true;  //this is used to keep the zoomCompleted event from redrawing / validating map 
                                //before we're ready


        //initialize the map object and basic map variables

        this.map = new AmCharts.AmMap();

        this.map.fontFamily = "Lucida Console, Monaco, monospace";

        this.map.pathToImages = "packages/mikemccrickard_ammap/lib/images/";

        this.dp = {

            "mapVar": AmCharts.maps.worldLow, 
        }

        //Set the map areas based on map level


        if (_mapLevel == mlContinent) rec = db.getContinentRec( this.selectedContinent );

        if (_mapLevel == mlRegion) rec = db.getRegionRec( this.selectedRegion );

        if (_mapLevel == mlContinent || _mapLevel == mlRegion) {

            this.dp.zoomLevel = z1 = rec.z1,
            this.dp.zoomLatitude = z2 = rec.z2,
            this.dp.zoomLongitude = z3 = rec.z3            

        }

        
        //we zoom in a little tighter for the learning mode

        if (_mapLevel == mlContinent && game.user.mode == uLearn) {

            if (rec.lz1) this.dp.zoomLevel = z1 = rec.lz1;
            if (rec.lz2) this.dp.zoomLatitude = z2 = rec.lz2;
            if (rec.lz3) this.dp.zoomLongitude = z3 = rec.lz3;

        }

        this.dp.areas = this.mm.getJSONForMap(this.selectedContinent, this.selectedRegion, _mapLevel, _drawLevel, _detailLevel, z1, z2, z3);

        this.dp.images = [];

        //set the data provider and areas settings

        this.map.dataProvider = this.dp;

        this.map.creditsPosition = "bottom-left";

        this.map.zoomControl.zoomControlEnabled = false;

        this.map.zoomControl.panControlEnabled = false;

        this.map.zoomControl.homeButtonEnabled = false;

        this.map.addClassNames = true;

        this.map.areasSettings = {

            autoZoom: false,
            rollOverOutlineColor: "#000000",
            color: "#BBBB00",
            selectedColor: "#BBBB00",
            selectedOutlineColor: "#FFFFFF"

        };
        
        this.map.areasSettings.balloonText = "[[customData]]";


        // when the zoom is done (going to continent or region) then we need to adjust the zoom on the new map
        //this.map.addListener("zoomCompleted", handleZoomCompleted);

        // handle the clicks on any map object
        this.map.addListener("clickMapObject", handleClick);

        this.map.write("divLessonMenuMap");

    }

    this.showContinentMenu = function(_continentID) {

		this.selectedContinent = _continentID;

		var g = game.lesson;

		game.user.lessonSequenceCode.set( _continentID );

		g.state.set("continentMenu");

		rec = db.getContinentRec( _continentID );

		var zoomLevel = rec.z1;
		var zoomLatitude = rec.z2;
		var zoomLongitude = rec.z3;

		this.map.zoomToLongLat(zoomLevel, zoomLongitude, zoomLatitude);
	}

}

function handleClick( _event ) {

	var g = game.lesson;

	if (g.state.get() == "menu"  || g.state.get() == "continentMenu"  ) {

		var _continentID = db.getContinentCodeForCountry( _event.mapObject.id );

var _ls = new LessonSequence( _continentID );

g.worldMenu.lessonGroup = _ls.item;

        g.worldMenu.showContinentMenu( _continentID );

        return;
    }
}


Template.lessonMenu.helpers({

	alreadyDone: function() {

		if (this.s > 0) return true;

		return false;
	},

	mapWidth: function() { return Session.get("gWindowWidth") * 0.95},

  	mapHeight: function() { 

	    var h = Session.get("gWindowHeight") - display.menuHeight;

	    return h * 0.7;

  	},

  showContinentMenu: function() {

     if (game.lesson.state.get() == "continentMenu") return true;

     return false;
  },

  showMenu: function() {

     if (game.lesson.state.get() == "menu") return true;

     return false;
  },

  lesson: function() {

     return LessonSequence.makeMenuArray( game.user.lessonSequenceCode.get() );
  },

  lessonShortName: function() {

    return game.lesson.mission.shortName;
  },

  message: function() {

  	var _state = game.lesson.state.get();

  	if (_state == "menu") return "CHOOSE A CONTINENT";

  	if (_state == "continentMenu") return "CHOOSE A LESSON";

  }

});


Template.home.events({

	  'click .btnGoLesson': function (evt, template) {

	  	  var wm = game.lesson.worldMenu;

        var _lessonGroupCode = $(evt.target).attr("data-continent");

        var _lessonCode = evt.target.id;

        var _lessonIndex = parseInt( $(evt.target).attr("data-index") );


        if ( (wm.lessonGroupCode  == _lessonGroupCode) && (wm.lessonCode  == _lessonCode) && (wm.lessonIndex  == _lessonIndex) ){

            initiateResumeLesson();

            return;
        }

        wm.lessonGroupCode = _lessonGroupCode;

        wm.lessonCode = _lessonCode;

        wm.lessonIndex = _lessonIndex;

	      switchLesson(wm.lessonGroupCode, wm.lessonCode);
	  },

	  'click .btnReturnToMenu': function (evt, template) {

	  		game.lesson.worldMenu.selectedContinent = "";

	  		game.lesson.showLessonMenu();
	  },
 });


//*************************************************************************
//              RENDERED CALLBACK
//*************************************************************************


Template.lessonMenu.rendered = function () {
  
    stopSpinner();

    if (!game.lesson) return;

    Meteor.setTimeout( function() { game.lesson.showLessonMenu(); }, 250 );

    //Meteor.setTimeout( function() { display.ctl["MAP"].lessonFinishDraw() }, 251 );

}
