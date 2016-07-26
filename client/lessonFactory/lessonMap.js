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

    this.doThisMap = function(_mapLevel, _drawLevel, _detailLevel, _continentID, _regionID) {

        //reset this each time, b/c it disappears if we switch hack/display objects

        worldMap = this;

        this.selectedContinent = "";

        this.selectedRegion = "";

        game.lesson.mapLevel = _mapLevel;

        game.lesson.drawLevel = _drawLevel;
        
        game.lesson.detailLevel = _detailLevel;


        if (_continentID) this.selectedContinent = _continentID;

        if (_regionID) this.selectedRegion = _regionID;


        this.doMap(_mapLevel, _drawLevel, _detailLevel);

    }

    this.doMap = function(_mapLevel, _drawLevel, _detailLevel) {

        var z1 = 0;

        var z2 = 0;

        var z3 = 0;

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

//need a new user mode:  uLearn

if (_mapLevel == mlContinent && gEditLesson) {

    if (rec.lz1) this.dp.zoomLevel = z1 = rec.lz1;
    if (rec.lz2) this.dp.zoomLatitude = z2 = rec.lz2;
    if (rec.lz3) this.dp.zoomLongitude = z3 = rec.lz3;

}

c("map level in doMap is " + _mapLevel)


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

            autoZoom: true,
            rollOverOutlineColor: "#000000",
            color: "#BBBB00",
            selectedColor: "#BBBB00",
            selectedOutlineColor: "#FFFFFF"

        };


        //set the ballon text (popup text) for each area (this will be continent, region or country)
        this.map.areasSettings.balloonText = "[[customData]]";


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

            rec = db.getCountryRec( _code ); 
        }

        if (rec) {
            
            _name = rec.n;

            if ( _x == undefined) {

                      //the area may or may not have label pos data

                    if (rec.xl != undefined) {

                        _x = rec.xl * this.map.divRealWidth;

                        _y = rec.yl * this.map.divRealHeight;
                    }          

            }
        }

        if (_fontSize == undefined) _fontSize = 24;

        if (_col == undefined) _col = "white";


        Meteor.defer( function() {display.ctl["MAP"].lessonMap.map.addLabel(_x, _y, _name.toUpperCase(), "", _fontSize, _col); } );
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

    Control.playEffect( worldMap.map_sound );

    //allow zoomComplete to set the new map level and redraw the map
    //when the zoom is complete

    worldMap.zoomDone = false;

    worldMap.map.clearLabels();

    worldMap.mapObjectClicked = _event.mapObject.id;

    var level = worldMap.mapCtl.level.get();

    //here we set the module vars for the area and the customData var for labelMapObject

    if (level == mlWorld) {

        var _code = db.getContinentCodeForCountry(worldMap.mapObjectClicked);  //in database.js

        worldMap.selectedContinent = _code;

        worldMap.customData = _event.mapObject.customData;

    }

    if (level == mlContinent) {

        var _code = db.getRegionCodeForCountry(worldMap.mapObjectClicked);   //in database.js

        worldMap.selectedRegion = _code;

        worldMap.customData = _event.mapObject.customData;

    }

    if (level == mlRegion) {

        worldMap.selectedCountry.set( worldMap.mapObjectClicked );

        worldMap.customData = _event.mapObject.customData;

        if (_event.mapObject.objectType == "MapImage") {  //simulate the click on the country

            var _mapObj = worldMap.mapCtl.getCountryObject( worldMap.map.dataProvider, worldMap.mapObjectClicked );

            worldMap.map.selectObject( _mapObj );

            return;
        }
    }

    if (level == mlCountry) { 
        
        //If a different country was previously selected and we're still at the country
        //level, then the user can click on a nearby country.  We want the map to re-center and re-label
        //in this case, but not jump to browsing



        if (worldMap.selectedCountry.get() != worldMap.mapObjectClicked) {

            worldMap.selectedCountry.set( worldMap.mapObjectClicked );

            //in ths case, we need zoomComplete to redraw and validate, so reset the level
            //and unset the zoomDone flag

            worldMap.mapCtl.level.set( mlRegion );

            worldMap.zoomDone = false;

            return;
        }

        //we set this flag when we simulate the click on the country
        //so that the autoZoom will just center the map on the country
        //but we can exit before the jump to the browse screen

        if (worldMap.zoomOnlyOnClick) {

            worldMap.mapCtl.level.set(mlRegion); 

            worldMap.zoomOnlyOnClick = false;

            return;
        }

        game.user.browseCountry( worldMap.mapObjectClicked );

    }

}




function handleZoomCompleted() { 

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