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

    this.selectedCountry = '';

    //objects

    this.dp = null;

    this.mm = this.mm || new MapMaker();

    this.mapCtl = _mapCtl;

    //misc

    this.customData = '';

    this.clickEvent = null;

    this.mapObjectClicked = null;

    this.zoomDone = false;

    this.zoomOnlyOnClick = false;

    this.noClick = false;

    this.mapTagImage = "";

    //set the module var for the event handlers

    worldMap = this;

    //the rendered callback for this template calls this function after a slight delay
    //to draw the map (by calling doMap with the right params)

    this.doCurrentMap = function() {

        //reset this each time, b/c it disappears if switch hack/display objects

        worldMap = this;

        var level = this.mapCtl.level.get();

        if (level == mlNone || level == mlWorld) {

            this.doMap( "world", mlWorld);
        }

        if (level == mlContinent) {

            this.doMap( this.selectedContinent, level);
        }


        if (level == mlRegion) {

            this.doMap( this.selectedRegion, level );        
        }

        if (level == mlCountry) {  //this is just a replay of the map zooming in on the correct country (browse mode)

           this.doMap( this.selectedRegion, mlRegion);

           //reset level back to country, so that the label uses the correct coords

           this.mapCtl.level.set( mlCountry );

            var mapObject = this.map.getObjectById( this.selectedCountry );

            this.zoomOnlyOnClick = true;

            this.map.clickMapObject(mapObject);
        }    
    }


    this.doMap = function(_code, _level) {

        //initialize variables related to the map

        var rec = null;

        this.mapCtl.level.set( _level );

        this.zoomDone = true;  //this is used to keep the zoomCompleted event from triggering b4 we're ready


        //initialize the map object and basic map variables

        this.map = new AmCharts.AmMap();

        //map = this.map;

        this.map.fontFamily = "Lucida Console, Monaco, monospace";

        this.map.pathToImages = "packages/mikemccrickard_ammap/lib/images/";

        this.dp = {

            "mapVar": AmCharts.maps.worldLow, 
        }

        this.dp.images = [];

        //Set the map areas based on map level

        this.dp.areas = this.mm.getJSONForMap(_code, _level, false);

        if (_level == mlContinent) rec = db.getContinentRec(_code);

        if (_level == mlRegion) rec = db.getRegionRec(_code);

        if (_level == mlContinent || _level == mlRegion) {

            this.dp.zoomLevel = rec.z1,
            this.dp.zoomLatitude = rec.z2,
            this.dp.zoomLongitude =  rec.z3

        }

        //images

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

        };
/*
        var image = new AmCharts.MapImage();

        image.top = 102;
        
        image.left = 0;

        image.width = 256;

        image.height = 256;
        
        image.imageURL = "http://localhost:3000/putin_tag.png";
        
        this.dp.images.push(image);
*/

        //set the ballon text (popup text) for each area (this will be continent, region or country)
        this.map.areasSettings.balloonText = "[[customData]]";

        // when the zoom is done (going to continent or region) then we need to adjust the zoom on the new map
        this.map.addListener("zoomCompleted", handleZoomCompleted);

        // handle the clicks on any map object
        this.map.addListener("clickMapObject", handleClick);

        // handle the clicks on any map object
//        this.map.addListener("ondrop", handleDrop);

        this.map.write("browseDivMap");

    }

    //**********************************************************************************
    //                      UTILITY FUNCTIONS
    //**********************************************************************************

    //label the clicked map object and pos it appropriately

    this.labelMapObject = function(_fontSize, _col) {

        var level = this.mapCtl.level.get();

        var _code;

        var _name = "";

        var rec;

        var x, y;

        //Look up in the db where to place the label 
        //(this is what all this code does except for the last line)

        if (level == mlContinent) {

            _code = db.getContinentCodeForCountry( this.mapObjectClicked ); 

            rec = db.getContinentRec( _code );                           
        }

        if (level == mlRegion) {

            _code = db.getRegionCodeForCountry( this.mapObjectClicked );   

            rec = db.getRegionRec( _code );
        }

        if (level == mlCountry) {

            rec = db.getCountryRec( this.mapObjectClicked ); 
        }

        if (rec) {

            //most of the countries don't have hard-coded label positions
            //but some do

            if (rec.xl != undefined) {

                x = rec.xl * this.map.divRealWidth;

                y = rec.yl * this.map.divRealHeight;
            }
            else {  //no label pos data?  then just center it

                x = this.map.divRealWidth / 2;

                y = this.map.divRealHeight / 2;    
            }

            _name = rec.n;
        }

        if (_fontSize == undefined) _fontSize = 24;

        if (_col == undefined) _col = "white";

        Meteor.defer( function() {display.ctl["MAP"].browseWorldMap.map.addLabel(x, y, _name.toUpperCase(), "", _fontSize, _col); } );
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

c("handleClick event")

    //The weird early click
    //event (that occurs when the map is first drawn) is a problem

    if (worldMap.noClick == true) {

        worldMap.noClick = false;

        return;
    }

    Control.playEffect( worldMap.map_sound );

    worldMap.zoomDone = false;

    worldMap.map.clearLabels();

    worldMap.mapObjectClicked = _event.mapObject.id;

    level = worldMap.mapCtl.level.get();

    //here we set the module vars for the area and the customData var for labelMapObject

    if (level == mlWorld) {

        var _code = db.getContinentCodeForCountry(worldMap.mapObjectClicked);  //in data_handling.js

        worldMap.selectedContinent = _code;

        worldMap.customData = _event.mapObject.customData;

    }

    if (level == mlContinent) {

        var _code = db.getRegionCodeForCountry(worldMap.mapObjectClicked);   //in database.js

        worldMap.selectedRegion = _code;

        worldMap.customData = _event.mapObject.customData;

    }

    if (level >= mlRegion) {

        worldMap.selectedCountry = worldMap.mapObjectClicked;

        worldMap.customData = _event.mapObject.customData;

    }

    if (level >= mlCountry) {

        //if the map was already centered on another country, we need to let the map
        //re-center onto this new country and not jump straight to browsing it

        if (worldMap.mapObjectClicked != worldMap.selectedCountry) {

            worldMap.selectedCountry = worldMap.mapObjectClicked;

            return;

        }

        worldMap.zoomDone = true;  //prevent the errors that happen when this template disappears

        display.worldMapTemplateReady = true;  //ditto

        game.user.browseCountry( worldMap.mapObjectClicked );

    }

}


function handleZoomCompleted() { 

    var _rec;

    var _code;

    if (worldMap.zoomDone == true) return;

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

        //since the zoom in to the country happens with autozoom and not
        //by our handling some event, we have to set the map level manually

        worldMap.mapCtl.level.set( mlCountry );

        worldMap.labelMapObject();

        refreshMap();

        return;
    }

    //this is necessary for the initial zoom-in (if a country was already selected for browsing)

    if (level == mlCountry) {

        worldMap.labelMapObject();

        refreshMap();

        return;
    }

}

function handleDrop(_event) {

    c("drop");
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

  s = s + "selectedCountry = " + map.selectedCountry + "\n\r";

  return s;
}