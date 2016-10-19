//**********************************************************************************
//                     MAP FOR BROWSING
//
//  This is a "passive" version of the map, just for browsing the world and it's
//  different areas.  The map zooms in appropriately with each click and backs up normally
//  but doesn't check the clicks against the hack data, therefore no success or fail messages.
//
//**********************************************************************************

var worldMap = null;

/*
var areaTop = 0;
var areaLeft = 0;
var areaWidth = 0;
var areaHeight = 0;
*/

BrowseWorldMap = function( _mapCtl ) {

    //selection vars    

    this.mapObjectClicked = ''; 

    this.selectedContinent = '';

    this.selectedRegion = '';

    this.selectedCountry = new Blaze.ReactiveVar('');

    //map extents and details

    this.mapLevel = mlNone;

    this.drawLevel = null;

    this.detailLevel = null;
    

    //objects

    this.map = null;

    this.dp = null;

    this.mm = this.mm || new BrowseMapMaker();

    this.mapCtl = _mapCtl;

    //misc

    this.updateFlag = new Blaze.ReactiveVar(false);

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

    this.mapTagImage = "";

    this.map_sound = "browseMapFeedback.mp3";

    //set the module var for the event handlers

    worldMap = this;

    this.reset = function() {

        this.mapLevel = mlWorld;

        this.drawLevel = mlWorld;

        this.detailLevel = mlContinent;        
    }

    //the rendered callback for this template calls this function after a slight delay
    //to draw the map (by calling doMap with the right params)

    this.doCurrentMap = function() {

        this.doClearButton(0);

        //reset this each time, b/c it disappears if we switch hack/display objects

        worldMap = this;

        var level = this.mapLevel;

        if (level == mlNone || level == mlWorld) {

            //this.mapCtl.level.set( mlContinent );

            this.mapLevel = mlWorld;

            this.drawLevel = mlWorld;

            this.detailLevel = mlContinent;

            this.doThisMap( this.mapLevel, this.drawLevel, this.detailLevel, null, null);
        }

        if (level == mlContinent) {

            //this.mapCtl.level.set( mlRegion );

            this.doThisMap( mlContinent, mlContinent, mlRegion, this.selectedContinent, null);
        }


        if (level == mlRegion) {

           //this.mapCtl.level.set( mlCountry );

            this.doThisMap( mlRegion, mlRegion, mlCountry, this.selectedContinent, this.selectedRegion );        
        }

        if (level == mlCountry) {  //this is just a replay of the map zooming in on the correct country (browse mode)

           this.doThisMap( mlRegion, mlRegion, mlCountry, this.selectedContinent, this.selectedRegion);

           //set level to country, so that the label uses the correct coords

           this.mapCtl.level.set( mlCountry );

            var mapObject = null;

            if (this.selectedCountry.get().length) mapObject = this.map.getObjectById( this.selectedCountry.get() );

            //prevent zoomCompleted from jumping us to the browse data screen

            this.zoomOnlyOnClick = true;

            //prevent the zoomDone test from kicking us out of zoomComplete prematurely

            this.zoomDone = false;

            if (mapObject) {

                this.map.clickMapObject(mapObject);
        
            }
            else {

                c("No map object in doCurrentMap() in BrowseWorldMap.js")
            }
        }

    }

    this.doThisMap = function(_mapLevel, _drawLevel, _detailLevel, _continentID, _regionID) {

        //reset this each time, b/c it disappears if we switch hack/display objects

        worldMap = this;

        this.selectedContinent = "";

        this.selectedRegion = "";

        this.mapLevel = _mapLevel;

        this.drawLevel = _drawLevel;

        this.detailLevel = _detailLevel;


        if (_continentID) this.selectedContinent = _continentID;

        if (_regionID) this.selectedRegion = _regionID;


        var z1 = 1.0;

        var z2 = 44.241616;

        var z3 = 10.325;

        if (_mapLevel == undefined) {

            showMessage("No map level in browseWorldMap.doMap().")

            return;
        }

        if (_mapLevel == mlContinent && this.selectedContinent.length == 0 ) {

            showMessage("No continent selected for map level continent.  Cannot draw map in browseWorldMap.js");
            
            return;     
        }

        if (_mapLevel == mlRegion && this.selectedRegion.length == 0 ) {

            showMessage("No region selected for map level region.  Cannot draw map in browseWorldMap.js");
            
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


        this.dp.areas = this.mm.getJSONForMap(this.selectedContinent, this.selectedRegion, _mapLevel, _drawLevel, _detailLevel, z1, z2, z3);

        this.dp.images = [];

        //set the data provider and areas settings

        this.map.balloon.fontSize = 16;

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
        
        this.map.areasSettings.balloonText = "[[customData]]";


        // when the zoom is done (going to continent or region) then we need to adjust the zoom on the new map
        this.map.addListener("zoomCompleted", handleZoomCompleted);

        // handle the clicks on any map object
        this.map.addListener("clickMapObject", handleClick);

        this.map.write("browseDivMap");

    }



    this.doClearButton = function(_val) {

        if (_val) {

            $("#tagClear").removeClass("disabled");
        }
        else {

            $("#tagClear").addClass("disabled");        
        }

    }

    //**********************************************************************************
    //                      UTILITY FUNCTIONS
    //**********************************************************************************

    this.labelAllRegions = function() {

        var arr = db.ghR.find( { z: this.selectedContinent } ).fetch();

        for (var i = 0; i < arr.length; i++) {      

            this.doLabelRegion ( arr[i].c );
        }
    }

    this.doLabelRegion = function( _regionID )  {

         this.region = _regionID;

         var _color = "white";

         var rec = db.getRegionRec( _regionID);

         if (rec.rll_co !== undefined) _color = rec.rll_co;

        this.labelMapObject( mlRegion, _regionID, 0, 0, 16, _color );
    }

    this.doLabelCountry = function( _countryID )  {

         this.country = _countryID;

         var _color = "black";

         var rec = db.getCountryRec( _countryID);

         if (rec.ll_co !== undefined) _color = rec.ll_co;

        this.labelMapObject( mlCountry, _countryID, 0, 0, 24, _color );
    }


    this.labelMapObject = function(_level, _code, _x, _y, _fontSize, _col) {

        var level = _level;

        var _name = "";

        var rec;

        var x, y;


        //Look up in the db where to place the label 
        //(this is what all this code does except for the last line)

        if (level == mlContinent) {

            rec = db.getContinentRec( _code );                           
        }

        if (level == mlRegion) {

            rec = db.getRegionRec( _code );


            if (rec.llon !== undefined) {

                x = this.map.longitudeToX( rec.llon );

                y = this.map.latitudeToY( rec.llat );
            }
            else {

                if (rec.xl3 !== undefined) {

                    x = rec.xl3;

                    y = rec.yl3;
                }           
            }  
        }

        if (level == mlCountry) {

            rec = db.getCountryRec( _code ); 

            if (typeof rec.wl !== undefined) {

                if (rec.wl == 1) _col = "white";
            }


            if (rec.xl != undefined) {

                x = rec.xl * this.map.divRealWidth;

                y = rec.yl * this.map.divRealHeight;
            }
            else {  //no label pos data?  then just center it

                x = this.map.divRealWidth / 2;

                y = this.map.divRealHeight / 2;    
            }  
/*

            This is the method used by the browseWorldMap, which works well when you are displaying the country
            in the context of the region.  Or it works well in the half-width map view that the Learn module uses.
            MOST OF THE TIME it works well in this full-width map (at the region level)  
            Is there no way to tweak the lat, long values so they work here consistently?

            if (rec.llon !== undefined) {

                x = this.map.longitudeToX( rec.llon );

                y = this.map.latitudeToY( rec.llat );
            }
            else {

                if (rec.xl3 !== undefined) {

                    x = rec.xl3;

                    y = rec.yl3;
                }           
            }
*/
        }

        if (rec) {

            _name = rec.n;

        }
        
        if (typeof _fontSize == 'undefined') _fontSize = 24;

        if (typeof _col == 'undefined') _col = "black";

         if (level == mlCountry) {

            _col = getTextColorForBackground( db.getCountryRec( _code ).co );
        }   

        if (_x) x = _x;

        if (_y) y = _y;       

        Meteor.defer( function() { display.ctl["MAP"].browseWorldMap.map.addLabel(x, y, _name.toUpperCase(), "", _fontSize, _col); } );
    }




    //**********************************************************************************
    //                      BACKUP THE MAP (move to previous level)
    //**********************************************************************************

    //Redraw the map using the previous level

    this.backupMap = function( _level) {


        if (_level == mlWorld) {

            this.doThisMap(mlWorld, mlWorld, mlContinent);

            this.map.validateData();

            this.mapCtl.level.set( mlWorld );

            this.selectedContinent = "";

            this.selectedRegion = "";

            this.selectedCountry.set( "");

            refreshMap();

            return;
        }

        if (_level == mlContinent) {

            this.doThisMap( mlContinent, mlContinent, mlRegion, this.selectedContinent, this.selectedRegion );

            this.map.validateData();

            refreshMap();

            this.mapCtl.level.set( mlContinent );

            this.selectedRegion = "";

            this.selectedCountry.set( "");

            this.labelMapObject();

            return;
        }   

        if (_level == mlRegion) {

            this.doThisMap( mlRegion, mlRegion, mlCountry, this.selectedContinent, this.selectedRegion );

            this.map.validateData();

            refreshMap();

            this.mapCtl.level.set( mlRegion );

            this.selectedCountry.set( "");

            this.labelMapObject();

            return;
        }     


    }

    this.updateContent = function() {

        var _val = this.updateFlag.get();

        this.updateFlag.set( !_val );
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

        worldMap.mapLevel = mlContinent;

        worldMap.drawLevel = mlContinent;

        worldMap.detailLevel = mlRegion;

    }

    if (level == mlContinent) {

        var _code = db.getRegionCodeForCountry(worldMap.mapObjectClicked);   //in database.js

        worldMap.selectedRegion = _code;

        worldMap.customData = _event.mapObject.customData;

        this.mapLevel = mlRegion;

        this.drawLevel = mlRegion;

        this.detailLevel = mlCountry;
    }

    if (level == mlRegion) {

        worldMap.selectedCountry.set( worldMap.mapObjectClicked );

        worldMap.customData = _event.mapObject.customData;
    }

    if (level == mlCountry) { 
       
        //If a different country was previously selected and we're still at the country
        //level, then the user can click on a nearby country.  We want the map to re-center and re-label
        //in this case, but not jump to browsing


        if (worldMap.selectedCountry.get() != worldMap.mapObjectClicked) {

c("handleclick in browsemap is exiting b/c selected country has changed -- mlCountry level")

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

c("handleclick in browsemap is exiting b/c zoomOnlyOnClick -- mlcountry level")

            worldMap.mapCtl.level.set(mlRegion); 

            worldMap.zoomOnlyOnClick = false;

            return;
        }

c("worldMap.mapObjectClicked just b4 browseCountry is " + worldMap.mapObjectClicked)

        game.user.browseCountry( worldMap.mapObjectClicked, "browseWorldMap" );

    }

}




function handleZoomCompleted() { 

    var _rec;

    var _code;

    if (worldMap.zoomDone == true)  {

        c("handleZoomCompleted in browsemap is returning b/c zoomDone is true")

        return; 
    }
    else {

        c("zoomDone is false in browseMap.zoomCompleted")
    }

    worldMap.zoomDone = true;

    
    var level = worldMap.mapCtl.level.get();

c("worldMap.mapObjectClicked in handleZoomCompleted is " + worldMap.mapObjectClicked)

    var _continentCode = db.getContinentCodeForCountry( worldMap.mapObjectClicked );

    var _regionCode = db.getRegionCodeForCountry( worldMap.mapObjectClicked );

    if (level == mlWorld) {
  
        worldMap.doThisMap(mlContinent, mlContinent, mlRegion, _continentCode, null);

        worldMap.labelAllRegions();

        worldMap.mapCtl.level.set( mlContinent )

        refreshMap();

        return;
    }

    if (level == mlContinent) {
   
        worldMap.doThisMap(mlRegion, mlRegion, mlCountry, _continentCode, _regionCode);

        worldMap.doLabelRegion( _regionCode);

        worldMap.mapCtl.level.set( mlRegion )

        refreshMap();

        return;
    }


    if (level == mlRegion) {

        worldMap.doClearButton(1);

        //since the zoom in to the country happens with autoZoom and not
        //by our handling some event, we have to set the map level manually

        worldMap.mapCtl.level.set( mlCountry );

        worldMap.doLabelCountry( worldMap.mapObjectClicked );

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
    Meteor.setTimeout( function() { display.ctl["MAP"].browseFinishDraw(); }, 250);
}

dbm = function() {

  var ctl = display.ctl["MAP"];

  var s = "map.level = " + ctl.level.get() + "\n\r";

  s = s + "map.state = " + ctl.getState("MAP") + "\n\r";

  var map = display.ctl["MAP"].browseWorldMap;

  s = s + "selectedContinent = " + map.selectedContinent + "\n\r";

  s = s + "selectedRegion = " + map.selectedRegion + "\n\r";

  s = s + "selectedCountry = " + map.selectedCountry.get() + "\n\r";

  return s;
}