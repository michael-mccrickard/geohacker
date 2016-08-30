//**********************************************************************************
//                     MAP FOR LESSONS
//
//  
//  
//  
//
//**********************************************************************************

var worldMap = null;


LessonMap = function( _mapCtl ) {

    //selection vars    

    this.mapObjectClicked = ''; 

    this.selectedContinent = '';

    this.selectedRegion = '';

    this.selectedCountry = new Blaze.ReactiveVar('');

    //objects

    this.dp = null;

    this.mm = this.mm || new LessonMapMaker();

    this.mapCtl = _mapCtl;

    //misc

    this.customData = '';

    this.clickEvent = null;

    this.mapObjectClicked = null;

    //for use with recording the center points of the countries

    this.centerLong = 0;

    this.centerLat = 0;

    //the handleZoomComplete function (called by the zoomCompleted event)
    //needs regulation b/c we re-draw the map at the end of the zoom, which causes
    //the event to fire again. We only want to execute our code in handleZoomComplete 
    //on the first occurence (after the actual zoom)

    this.zoomDone = false;

    //slightly different case, when we initially simulate the click on the browse map country
    //(in the case where the browse country is previously selected) then we want to execute part
    //of the code in handleZoomComplete but not all of it (don't want to jump back to browse data screen)

    this.zoomOnlyOnClick = false;

    this.map_sound = "browseMapFeedback.mp3";

    //set the module var for the event handlers

    worldMap = this;

    //the rendered callback for this template calls this function after a slight delay
    //to draw the map (by calling doMap with the right params)

    this.doCurrentMap = function() {

        //reset this each time, b/c it disappears if we switch hack/display objects

        worldMap = this;

        var _mapLevel = game.lesson.mapLevel;

        var _drawLevel = game.lesson.drawLevel;

        var _detailLevel = game.lesson.detailLevel;
 
        this.doMap(_mapLevel, _drawLevel, _detailLevel);

    }

    this.doThisMap = function(_mapLevel, _drawLevel, _detailLevel, _continentID, _regionID, _dontIdentify) {

        //reset this each time, b/c it disappears if we switch hack/display objects

        worldMap = this;

        this.selectedContinent = "";

        this.selectedRegion = "";

        game.lesson.mapLevel = _mapLevel;

        game.lesson.drawLevel = _drawLevel;
        
        game.lesson.detailLevel = _detailLevel;


        if (_continentID) this.selectedContinent = _continentID;

        if (_regionID) this.selectedRegion = _regionID;


        this.doMap(_mapLevel, _drawLevel, _detailLevel, _dontIdentify);

    }

    this.doThisMapFromTL = function( _arr ) {

        if (_arr[0]) game.lesson.mapLevel = _arr[0];

        if (_arr[1]) game.lesson.drawLevel = _arr[1];
    
        if (_arr[2]) game.lesson.detailLevel = _arr[2];

        if (_arr[3]) this.selectedContinent = _arr[3];

        if (_arr[4]) this.selectedRegion = _arr[4];

        game.lesson.lessonMap.doMap(game.lesson.mapLevel, game.lesson.drawLevel, game.lesson.detailLevel, game.lesson.lessonMap.selectedContinent);

    }

    this.doMap = function(_mapLevel, _drawLevel, _detailLevel, _dontIdentify) {

        var z1 = 1.0;

        var z2 = 44.241616;

        var z3 = 10.325;

        if (_mapLevel == undefined) {

            showMessage("No map level in lessonMap.doMap().")

            return;
        }

        if (_mapLevel == mlContinent && this.selectedContinent.length == 0 ) {

            showMessage("No continent selected for map level continent.  Cannot draw map in lessonMap.js");
            
            return;     
        }

        if (_mapLevel == mlRegion && this.selectedRegion.length == 0 ) {

            showMessage("No region selected for map level region.  Cannot draw map in lessonMap.js");
            
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

        this.map.creditsPosition = "top-left";

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

        //set the ballon text (popup text) for each area (this will be continent, region or country)

        if (_dontIdentify === undefined) {

            if (game.lesson.quiz.inProgress.get() ) {

                _dontIdentify = true;
            }
            else {
                 _dontIdentify = false;               
            }
        }

        if ( _dontIdentify ) this.map.areasSettings.balloonText = "";


        // when the zoom is done (going to continent or region) then we need to adjust the zoom on the new map
        this.map.addListener("zoomCompleted", handleZoomCompleted);

        // handle the clicks on any map object
        this.map.addListener("clickMapObject", handleClick);

        this.map.write("lessonDivMap");

    }

    //**********************************************************************************
    //                      UTILITY FUNCTIONS
    //**********************************************************************************

    //label the clicked map object and pos it appropriately

    this.labelMapObject = function(_level, _code, _x, _y, _fontSize, _col) {

        //var level = this.mapCtl.level.get();

        var _code;

        var _name = "";

        var _rot = 0;

        var _alpha = 1.0;

        var _bold = false;

        var rec;


        //Look up in the db where to place the label 
        //(this is what all this code does except for the last line)

        if (_level == mlContinent) {

            rec = db.getContinentRec( _code );                           
        }

        if (_level == mlRegion) {

            rec = db.getRegionRec( _code );
        }

        if (_level == mlCountry) {

            _bold = true;

            rec = db.getCountryRec( _code ); 
        }

        if (rec) {
            
            _name = rec.n;

            var _nameLen = _name.length;

            if ( _level == mlRegion) {

                if (_x == 0) {  //passing in zeros for the coordinates means "get them from the db"

                    if (rec.llon !== undefined) {

                       // _x = this.map.longitudeToStageX( rec.llon);

                       // _y = this.map.latitudeToStageY( rec.llat);

                        var loc = this.map.coordinatesToStageXY( rec.llon, rec.llat);

                        _x = loc.x;

                        _y = loc.y;

                    }
                    else {

                        _x = rec.xl * this.map.divRealWidth;

                        _y = rec.yl * this.map.divRealHeight;

                    }
                }


            }


            if ( _level == mlCountry & !_x ) {

                var obj = this.map.getObjectById( _code );

                _lat = this.map.getAreaCenterLatitude( obj );

                _lon = this.map.getAreaCenterLongitude( obj );

                _x = this.map.longitudeToX(_lon) - _nameLen * (_fontSize / 2);

                _y = this.map.latitudeToY(_lat);
            }

            if (rec.ll_co !== undefined) _col = rec.ll_co;

            if (rec.ll_r !== undefined) _rot = rec.ll_r;

        }

        if (_fontSize == undefined) {

            if (_level <= mlRegion) _fontSize = 24;

            if (_level == mlCountry) _fontSize = 12;           
        }

        if (_col == undefined) {

            if (_level <= mlRegion) _col = "white";

            if (_level == mlCountry) _col = "black";       
        }

        Meteor.defer( function() {display.ctl["MAP"].lessonMap.map.addLabel(_x, _y, _name.toUpperCase(), "", _fontSize, _col, _rot, _alpha, _bold); } );
    }


    //**********************************************************************************
    //                      BACKUP THE MAP (move to previous level)
    //**********************************************************************************

    //Redraw the map using the previous level

    this.backupMap = function() {

        var level = this.mapCtl.level.get();


        if (level == mlContinent) {

            this.doMap("world", mlWorld);

            this.map.validateData();

            refreshMap();

            this.labelMapObject();

            return;
        }

        if (level == mlRegion) {

            this.doMap( this.selectedContinent, mlContinent );

            this.map.validateData();

            refreshMap();

            this.labelMapObject();

            return;
        }   

        if (level == mlCountry) {

            this.doMap(this.selectedRegion, mlRegion);

            this.map.validateData();

            refreshMap();

            this.labelMapObject();

            return;
        }     

    }

}  //end browseWorldMap Object


//**********************************************************************************
//                      EVENT HANDLERS
//**********************************************************************************

function handleClick(_event) {

    var ev = _event.event;

    var _code = "";

    Control.playEffect( worldMap.map_sound );

    //allow zoomComplete to set the new map level and redraw the map
    //when the zoom is complete

    //worldMap.zoomDone = false;

    //worldMap.map.clearLabels();

    worldMap.mapObjectClicked = _event.mapObject.id;

    var g = game.lesson;

    var level = game.lesson.mapLevel;

    
    if ( g.quiz.inProgress.get() == false ) return;


    if (g.quiz.type == "quizFindRegionOfCountry") {

        _code = db.getRegionCodeForCountry(worldMap.mapObjectClicked);   //in database.js

        if (_code == g.quiz.answer) {

            g.quiz.doCorrectAnswer();
        }
        else {

            g.quiz.doIncorrectAnswer( worldMap.mapObjectClicked );
        }
    }

    if (g.quiz.type == "quizFindCountryInRegion") {

        if (worldMap.mapObjectClicked == g.quiz.answer) {

            g.quiz.doCorrectAnswer();
        }
        else {

            g.quiz.doIncorrectAnswer( worldMap.mapObjectClicked );
        }
    }

}




function handleZoomCompleted() { 

return;

    var _rec;

    var _code;

    if (worldMap.zoomDone == true)  return; 

    var level = worldMap.mapCtl.level.get();

    if (level == mlWorld) {

        _code = db.getContinentCodeForCountry( worldMap.mapObjectClicked );  //in database.js

        worldMap.doMap(_code, mlContinent);

        worldMap.labelMapObject();

        refreshMap();

        return;
    }

    if (level == mlContinent) {

        _code = db.getRegionCodeForCountry( worldMap.mapObjectClicked );   //in database.js

        worldMap.doMap(_code, mlRegion);

        worldMap.labelMapObject();

        refreshMap();

        return;
    }


    if (level == mlRegion) {

        worldMap.doClearButton(1);

        //since the zoom in to the country happens with autoZoom and not
        //by our handling some event, we have to set the map level manually

        worldMap.mapCtl.level.set( mlCountry );

        worldMap.labelMapObject();

        worldMap.zoomDone = true;

        worldMap.mapCtl.addCountryTags( worldMap.mapObjectClicked, worldMap.map.dataProvider, 96);

        worldMap.map.dataProvider.zoomLongitude = worldMap.map.zLongTemp;

        worldMap.map.dataProvider.zoomLatitude =  worldMap.map.zLatTemp;

        worldMap.map.dataProvider.zoomLevel =  worldMap.map.zLevelTemp;

        worldMap.map.validateData();

        refreshMap();

        return;
    }

    //this is necessary for the initial zoom-in (when a country has already been selected)

    if (level == mlCountry) {

        worldMap.labelMapObject();

        refreshMap();

        return;
    }

}


function refreshMap() {
    Meteor.setTimeout( function() { display.ctl["MAP"].lessonFinishDraw(); }, 250);
}

dbm = function() {

  var ctl = display.ctl["MAP"];

  var s = "map.level = " + ctl.level.get() + "\n\r";

  s = s + "map.state = " + ctl.getState("MAP") + "\n\r";

  var map = display.ctl["MAP"].lessonMap;

  s = s + "selectedContinent = " + map.selectedContinent + "\n\r";

  s = s + "selectedRegion = " + map.selectedRegion + "\n\r";

  s = s + "selectedCountry = " + map.selectedCountry.get() + "\n\r";

  return s;
}