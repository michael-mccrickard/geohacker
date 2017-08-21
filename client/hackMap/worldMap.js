

//**********************************************************************************
//                     World Map Object 
//**********************************************************************************

var worldMap = null;

var areaTop = 0;
var areaLeft = 0;
var areaWidth = 0;
var areaHeight = 0;

var tl = null;

WorldMap = function( _mapCtl ) {

    //media files

    this.map_country_success_sound = "map_success.mp3";

    this.map_fail_sound = "map_fail.mp3";

    this.map_locked_sound = "map_locked.mp3";

    this.map_sound = "map_open.mp3";

    this.map_region_success_sound = "map_region_success.mp3";

    this.map_continent_success_sound = "map_continent_success.mp3";

    //selection vars    

    this.mapObjectClicked = ''; 

    this.selectedContinent = '';

    this.selectedRegion = '';

    this.selectedCountry = new Blaze.ReactiveVar('');

    //objects

    this.dp = null;  //data provider for the ammap map object

    this.map = null;  //the ammap map object

    this.mm = this.mm || new MapMaker();  //object that calls the ammap library to create the displayed map

    this.mapCtl = _mapCtl;   //the control object in map.js


    //misc

    this.customData = '';

    this.clickEvent = null;

    this.mapObjectClicked = null;

    this.zoomDone = false;

    this.prevMapState = sIcon;

    this.mapFilename = '';

    this.imgSrc = null;

    this.mapLoaded = false;

    this.animation1Done = false;

    this.animation2Started = false;

    //set the module var for the event handlers

    worldMap = this;

    this.doCurrentMap = function( _which ) {

c("doCurrentMap");

        //reset this each time, b/c it disappears if switch hack/display objects

        worldMap = this;
  

        //Otherwise the user just clicked on the map button to try and identify the appropriate country,
        //so we need to display the map at the appropriate level: world, continent, or region

        var level = this.mapCtl.level.get();

        if (level == mlNone || level == mlWorld) {

            this.doMap( "world", mlWorld);

            this.mapCtl.setState( sIDContinent );  
        }

        if (level == mlContinent) {

            this.doMap( this.selectedContinent, level);

            this.mapCtl.setState( sIDRegion );  

        }

        if (level == mlRegion) {

            this.doMap( this.selectedRegion, level );
        
            this.mapCtl.setState( sIDCountry );             
        }

        if (level == mlCountry) {  //this is just a replay of the map zooming in on the correct country (browse mode)

           this.doMap( this.selectedRegion, mlRegion);

           //reset level back to country, so that the label uses the correct coords

           this.mapCtl.level.set( mlCountry );

           this.mapCtl.setState( sMapDone );

            var mapObject = this.map.getObjectById( this.selectedCountry.get() );

            this.map.clickMapObject(mapObject);
        }    
    }




    this.doMap = function(_code, _level) {

        //initialize variables related to the map

        var rec = null;

        this.mapCtl.level.set( _level );

        this.zoomDone = true;  //this is used to keep the zoomCompleted event from triggering b4 we're ready

        var lockMap = false;  //used to lock down the map when we don't want the user to change it by clicking

        var state = this.mapCtl.getState();


        //initialize the map object and basic map variables

        this.map = new AmCharts.AmMap();

        //map = this.map;

        this.map.fontFamily = "Lucida Console, Monaco, monospace";

        this.map.pathToImages = "packages/mikemccrickard_ammap/lib/images/";

        this.map.balloon.fontSize = 16;

        this.dp = {

            mapVar: AmCharts.maps.worldLow, 
        }

        //Set the map areas based on map level

        this.dp.areas = this.mm.getJSONForMap(_code, _level, lockMap);

        if (_level == mlContinent) rec = db.getContinentRec(_code);

        if (_level == mlRegion) rec = db.getRegionRec(_code);

        if (_level == mlContinent || _level == mlRegion) {

            this.dp.zoomLevel = rec.z1,
            this.dp.zoomLatitude = rec.z2,
            this.dp.zoomLongitude =  rec.z3

        }

        //set the data provider and areas settings

        this.map.dataProvider = this.dp;

        this.dp.images = [];

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

        //if (_level == mlContinent) this.mapCtl.addContinentTags(this.map.dataProvider, 16, rec.c);

        //if (_level == mlRegion) this.mapCtl.addRegionTags( this.selectedRegion, this.map.dataProvider, 48, rec.c);


        //lock out clicks on the map if we need to test the selection
        //(this is also why we pass testingFlag to getJSONForMap(); so it won't write zoom values to the areas if testing)
        if (lockMap) {

            this.map.areasSettings.autoZoom = false;
        }

        //set the ballon text (popup text) for each area (this will be continent, region or country)
        this.map.areasSettings.balloonText = "[[customData]]";

        // when the zoom is done (going to continent or region) then we need to adjust the zoom on the new map
        this.map.addListener("zoomCompleted", handleZoomCompleted);

        // handle the clicks on any map object
        this.map.addListener("clickMapObject", handleClick);

        this.map.write("divMap");

    }

    //**********************************************************************************
    //                      UTILITY FUNCTIONS
    //**********************************************************************************

    //label the clicked map object and pos it appropriately

    this.labelMapObject = function(_fontSize, _col, _x, _y) {

        var level = this.mapCtl.level.get();

        var _code;

        var _name = "";

        var rec;

        var x, y;

        var _align = "";

        if (level == mlContinent) {

            _code = db.getContinentCodeForCountry( this.mapObjectClicked ); 

            rec = db.getContinentRec( _code );
        }

        if (level == mlRegion) {

            _code = db.getRegionCodeForCountry( this.mapObjectClicked ); 

            rec = db.getRegionRec( _code );
        }


        //Look up in the db where to place the label 
        //(this is what all this code does except for the last line)

        if (level == mlContinent || level == mlRegion) {

            //do any continents have label pos data?

            x = this.map.divRealWidth / 2;

            y = this.map.divRealHeight / 2;        

            _col = "yellow";    

            //some region labels have specific colors

            if (rec.rl_co) _col = rec.rl_co; 

            _align = "middle";             
        }

        if (level == mlCountry) {

            rec = db.getCountryRec( this.mapObjectClicked ); 

            if (typeof rec.wl !== undefined) {

                if (rec.wl == 1) _col = "white";
            }


            if (rec) {

                //Some countries don't have hard-coded label positions but most do

                if (this.mapCtl.getState() == sCountryOK) {

                    if (typeof rec.xl2 !== 'undefined') {

                        x = rec.xl2 * this.map.divRealWidth;

                        y = rec.yl2* this.map.divRealHeight;
                    }
                    else {  //no label pos data?  then just center it

                        if (rec.llon !== undefined) {

                            x = this.map.longitudeToX( rec.llon );

                            y = this.map.latitudeToY( rec.llat );
                        }
                        else {

                            x = this.map.divRealWidth / 2;

                            y = this.map.divRealHeight / 2;   

                        }
                  }                 
                }
                else {

                    if (rec.xl != undefined) {

                        x = rec.xl * this.map.divRealWidth;

                        y = rec.yl * this.map.divRealHeight;
                    }
                    else {  //no label pos data?  then just center it

                        x = this.map.divRealWidth / 2;

                        y = this.map.divRealHeight / 2;    
                    }  
                }
            }
        }
         
       _name = rec.n;    
        
        if (typeof _fontSize == 'undefined') _fontSize = 24;

        if (typeof _col == 'undefined') _col = "black";

         if (level == mlCountry) {

            _col = getTextColorForBackground( db.getCountryRec( this.mapObjectClicked ).co );

            //hard-coded exceptions, weird cases

            var _arr = ["SB","FK","JM"]

            if (_arr.indexOf( this.mapObjectClicked) != -1) _col = "white";
        }   

        if (_x) x = _x;

        if (_y) y = _y;       

        Meteor.defer( function() { hackMap.worldMap.map.addLabel(x, y, _name.toUpperCase(), _align, _fontSize, _col); } );
    }


    //**********************************************************************************
    //                      BACKUP THE MAP (move to previous level)
    //**********************************************************************************

    //Redraw the map using the previous level

    this.backupMap = function() {

        var level = this.mapCtl.level.get();

        var state = this.mapCtl.getState();


        if (level == mlContinent) {
            
            this.mapCtl.setState( sIDContinent );

            this.doMap("world", mlWorld);

            this.map.validateData();

            refreshMap();

            return;
        }

        if (level == mlRegion) {

            this.mapCtl.setState( sIDRegion );

            this.doMap( this.selectedContinent, mlContinent );

            this.map.validateData();

            this.labelMapObject();

            refreshMap();

            return;
        }   

        if (level == mlCountry) {

            this.mapCtl.setState( sIDCountry );

            this.doMap(this.selectedRegion, mlRegion);

            this.map.validateData();

            this.labelMapObject();

            refreshMap();

            return;
        }     

    }

    //functions that close the map call this to see if the map state was
    //temporarily changed as the result of a map backup.  The user might successfully
    //identify the continent, say, but then back the map up (using the icon buttons on the left)
    //and then exit.  In this case, we want the map to be back on the selected (correct) continent
    //when they return

    this.checkMapState = function() {

        if (this.prevMapState != sIcon) {

            this.mapCtl.setState( this.prevMapState );

            var state = this.prevMapState;

            if (state == sIDRegion) this.mapCtl.level.set( mlContinent );

            if (state == sIDCountry) this.mapCtl.level.set( mlRegion );

            this.prevMapState = sIcon;
        }
    }

    //check the clicked map object against the hack data
    //if choice is good, then redraw the map in an unlocked state
    //in case the user wants to "drill down"

    this.checkSelectedArea = function() {

        var state = this.mapCtl.getState();

        var theContinent = hack.continentCode;

        var theRegion = hack.regionCode;

        var theCountry = hack.countryCode;


        Session.set("mapSpinnerOn", false);


        if (state == sTestContinent) {

            if (this.selectedContinent == theContinent) {

                this.doMapSuccess(mlContinent);

                this.mapCtl.setState( sContinentOK );

                this.doMap(this.selectedContinent, mlContinent);
            }
            else {

                this.doMapFail();

                this.mapCtl.setState( sContinentBad );       
            }
        }

        if (state == sTestRegion) {

            if (this.selectedRegion == theRegion) {

                this.doMapSuccess(mlRegion);

                this.mapCtl.setState( sRegionOK );

                this.doMap( this.selectedRegion, mlRegion );
            }
            else {

                this.doMapFail();

                this.mapCtl.setState( sRegionBad );       
            }
        }

        if (state == sTestCountry) {

            if (this.selectedCountry.get() == theCountry) {

                if (gEditLabels) {
                    
                    showMessage("sequence paused for label editing");

                    return;
                }    
                else {

                    this.doCorrectSequence();
                }
            }
            else {

                this.doMapFail();

                this.mapCtl.setState( sCountryBad );         
            }
        }

        refreshMap();
    }


    this.doCorrectSequence = function() {

        //A sound file (from the sound control) might be playing in the bg

        if (hacker.ctl["SOUND"].getState() == sPlaying) hacker.ctl["SOUND"].pause();

        display.disableHomeButton();

        this.mapCtl.setState( sCountryOK );

        hack.mode = mHackDone;

        //lock out the map so the user doesn't mess up our ending sequence

        if (!gEditLabels) $("#divMap").css("pointer-events","none");

        //update the user's record in the database (country successfully hacked)

        game.user.countryHacked( hack.countryCode );
        
        //start the success sequence with all the animations and sound effects.

        //we start two "processes" going here simultaneously, one to pre-load the detailed country map,
        //so that we can zoom it out from our regular map, and one to start the sequence.  In almost every case,
        //the map will load before we need it, but we can't just assume that.  

        //So two vars, this.mapLoaded and this.animationDone are used to coordinate.  (animationDone refers to the animations
        //that occur before we zoom out the country map).  Once the animations are done, this.hackDone() checks to see if 
        //if the map has been loaded. If so, it proceeeds with the second half: this.hackDone2().  
        //If not, it returns and lets the imagesLoaded callback in preloadCountryMap() (map.js)
        //start hackDone2().  preloadCountryMap uses a similar but reversed logic.

        this.mapCtl.preloadCountryMap( hack.getCountryFilename().toLowerCase() );

        this.doMapSuccess( mlCountry );

        refreshMap();

    }

    //**********************************************************************************
    //                      MAP TRANSITIONS AND SOUNDS
    //**********************************************************************************

    this.doMapSuccess = function(_which) {
        
c("doMapSuccess")

       game.pauseMusic();

       if (_which == mlContinent) {

            display.playEffect(this.map_continent_success_sound);

            //sContinentFeatured indicates a map clue; go ahead and bump up the state to sIDRegion

            if ( this.mapCtl.getState() == sContinentFeatured ) this.mapCtl.setStateOnly( sIDRegion );

        }

       if (_which == mlRegion) {

            display.playEffect(this.map_region_success_sound);

            //sRegionFeatured indicates a map clue; go ahead and bump up the state to sIDCountry

            if ( this.mapCtl.getState() == sRegionFeatured ) this.mapCtl.setStateOnly( sIDCountry );

        }
       
        if (_which == mlCountry) {

            //save the total time for the hack report

            var hackEndTime = new Date().getTime();

            game.hackTotalTime = (hackEndTime - game.hackStartTime) / 1000.0;

            display.playEffect(this.map_country_success_sound);

            this.hackDone();

        }
    }

    this.doMapFail = function() {

        display.playEffect(this.map_fail_sound);
        
    }

    //When the user clicks an area, they will either get a "success" or "fail" message and an OK button
    //If they got the country correct, the OK button will take them to debriefing. 
    //This happens in the event handler for OK.

    //In all other cases (id'ing the continent or region or a fail), OK will call this function to update the map state accordingly

    //After doing the proper updates, we go back to the main screen

    this.nextMapState = function() {

        //Essentially we just have to update the map state so that the map object knows what the user
        //will need to do on their next trip to the map.
        //Likewise we need to set the map level, so that
        //the map will get drawn correctly on their next visit

        var state = this.mapCtl.getState();

        if (state == sContinentOK) {

            this.mapCtl.setState( sIDRegion );
        }        

        if (state == sRegionOK) {

            this.mapCtl.setState( sIDCountry );
        }


        //for the failure states, we also undo the user's area choice

        if (state == sContinentBad) {

            this.mapCtl.setState( sIDContinent );

            this.mapCtl.level.set( mlWorld );

            this.selectedContinent = "";
        }

        if (state == sRegionBad) {

            this.mapCtl.setState( sIDRegion );

            this.mapCtl.level.set( mlContinent );

            this.selectedRegion = "";
        }

        if (state == sCountryBad) {

            this.mapCtl.setState( sIDCountry );

           this.mapCtl.level.set( mlRegion );

            this.selectedCountry.set( "" );
        }


        FlowRouter.go("/main");
    }

    //Store the map coordinates

    this.hackDone = function() {   

        this.mapLoaded = false;

        this.animationDone = false;  

        tl = new TimelineLite();

        hacker.mapStatus.setAndShow(' ');

        //Falling letter effect (country's name at top of screen)

         $( ".droppingText" ).letterDrop();

        //pulse the country's opacity to draw attention to it

        var s = ".amcharts-map-area-" + hack.countryCode;

        $(s).velocity({

            opacity: 0

        },{
            duration: 500,
            loop: 2,
        });

        Meteor.setTimeout( function() { hackMap.worldMap.hackDone2(); }, 750 );
    }

    this.hackDone2 = function() {

        //zoom the word HACKED in, pause, then continue zooming larger with a fade-out

        var container = $("#demo");

        container.css("display","block");

        var word="HACKED";

        var delay1 = 2.0;

        var delay2 = 2.0;

        var element = $("<h3>" + word + "</h3>").appendTo(container);

        var duration = 1.5;

        Meteor.setTimeout( function() { display.playEffect2("trans3.mp3"); }, 1000 );

        //set opacity and scale to 0 initially. We set z to 0.01 just to kick in 3D rendering in the browser which makes things render a bit more smoothly.
        tl.set(element, {autoAlpha: 0, scale: 0, z: 0.01});


        //the SlowMo ease is like an easeOutIn but it's configurable in terms of strength and how long the slope is linear. See http://www.greensock.com/v12/#slowmo and http://api.greensock.com/js/com/greensock/easing/SlowMo.html
        tl.to(element, duration, {scale:1.2,  ease:SlowMo.ease.config(0.25, 0.9) }, delay1)

          //notice the 3rd parameter of the SlowMo config is true in the following tween - that causes it to yoyo, meaning opacity (autoAlpha) will go up to 1 during the tween, and then back down to 0 at the end. 
          .to(element, duration, {autoAlpha:1, ease:SlowMo.ease.config(0.25, 0.9, true),  }, delay2);


        tl.add( function() { hackMap.worldMap.hackDone3() }, 3.0 );

    }

    this.hackDone3 = function() {
    
        this.mapFilename = hack.getCountryMapURL( hack.getCountryName() );

        this.imgSrc = display.getImageFromFile( this.mapFilename );

        //these values get used below when we size the detailed map

        areaTop = $("#divMap").position().top;
        areaLeft = $("#divMap").position().left;
        areaWidth = $("#divMap").width();
        areaHeight = $("#divMap").height();

    //Redraw the map at half size over on the left

        hackMap.worldMap.map.clearLabels();


        $("#divMap").velocity({

             width: "43%", left: "10.5%"

        },{
            duration: 1000,

            complete: function(elements) { hackMap.worldMap.hackDone4(); }
        });
    }



    this.hackDone4 = function() {

        this.animationDone = true;

        if (!this.mapLoaded) {

            //we will have to wait for the map to finish loading, so set the
            //flag that indicates that we are ready and then return

            hackMap.worldMap.animatonDone = true;

            return;
        }

        hackMap.worldMap.doMapStuff();      

        //if we're editing the label position, then we pause here, otherwise just continue

        if (!gEditLabels) this.hackDone4a();

    }

    this.hackDone4a = function() {

        display.playEffect( "new_debrief.mp3");   

        var imageWidth = 4;
        var imageHeight = 4;

        var targWidth = 0;
        var targHeight = 0;


        targWidth = areaWidth * 0.49;

        var sideBorder = areaWidth * 0.015;

        //targHeight = (targWidth / this.imgSrc.width ) * this.imgSrc.height; 

targHeight = areaHeight * 0.75;

        //Clamp the width if necessary and determine the position on the screen

        if (targHeight > areaHeight) targHeight = areaHeight;

        areaTop = display.menuHeight - 10;


        var top = (areaHeight / 2 ) - (imageHeight / 2);

        var left = areaLeft + (targWidth / 2) - (imageWidth / 2);

        $("#mapImage").css("top", top);

        $("#mapImage").css("left", left);

        $("#mapImage").css("width", imageWidth);

        $("#mapImage").css("height", imageHeight);


        var deltaLeft = '+=' + ((targWidth / 2) + sideBorder) + 'px';

        var deltaTop = "-=" + ((targHeight / 2) + areaTop)  + "px";

        var deltaHeight = '+=' + (targHeight) + 'px';

        var deltaWidth = '+=' + (targWidth - 4) + 'px';

        $("#mapImage").attr("src", this.mapFilename);     

        tl.to( $("#mapImage"), 1.0, {

                left: deltaLeft,
                top: deltaTop,
                height: deltaHeight,
                width: deltaWidth,
        });


        Meteor.setTimeout( function() { hackMap.worldMap.hackDone5(); }, 2000 ); 
    }


    this.hackDone5 = function() {

        //Welcome agent sequence

        var _ticket = game.user.getTicket( hack.countryCode );

        centerDivOnDiv2(".divTV", $(".tvScreen").innerWidth(), ".divTVAndText" )

        //Hide the letters that dropped down to spell the country name

        $(".letterDropH1").css("opacity", 0);

        //remove the HACKED zooom-out element

        $("div#demo").css("display","none");

        //If this is the first time they've hacked this country (ticket.count == 1) then
        //we add the welcoming agent to the user's network, BUT ...
        //if the country has no dedicated welcome agent; we default to the GIC

        if ( (_ticket.count == 1 && game.user.hasChiefInNetwork && hack.welcomeAgentIsChief) || _ticket.count > 1) {


            Meteor.setTimeout( function() { hacker.mapStatus.setThisAndType("AGENT " + hack.getWelcomeAgent().username.toUpperCase() + " IS ALREADY IN YOUR NETWORK"); }, 6500 );

            hackMap.setStateOnly( sMapDone );

        }
        else {
         
            Meteor.setTimeout( function() { hacker.mapStatus.setThisAndType("NEW AGENT ADDED TO YOUR NETWORK"); }, 100 );

      }

        //fade in the agent's snapshot

        var div = $(".divWelcomeAgent")  

        Meteor.setTimeout( function() { display.playEffect3("agentAdded.mp3") }, 100); 

        tl.to(div, 0.1, { opacity: 1.0, delay: 0.0 } ); 


        //delay this some more so that OK button does not appear before fade-in of agent profile?

        Meteor.setTimeout( function() { hackMap.setStateOnly( sMapDone ) }, 100 );                


     } //END HACKDONE5
   
    this.doMapStuff = function() {

        this.mapCtl.level.set( mlCountry );

        this.zoomDone = true;

        //this will preserve the zoom level when validateData() is called

        this.map.dataProvider.zoomLongitude = this.map.zLongTemp;

        this.map.dataProvider.zoomLatitude =  this.map.zLatTemp;

        this.map.dataProvider.zoomLevel =  this.map.zLevelTemp;

        this.map.validateData();

        this.labelMapObject(14, "black");
    }         

}  //end WorldMap Object


//**********************************************************************************
//                      EVENT HANDLERS
//**********************************************************************************


function handleClick(_event) {

    display.playEffect( worldMap.map_sound );

    hacker.updateContent();  //foce the icons to update

    worldMap.zoomDone = false;

    worldMap.map.clearLabels();

    worldMap.mapObjectClicked = _event.mapObject.id;


    //Once an area has tested OK, user can keep on clicking on the map (drill down),
    //so we have to switch the state on the fly like this ...

    var state = worldMap.mapCtl.getState();

    if (state == sContinentOK) {

        worldMap.mapCtl.setStateOnly( sIDRegion );
    }

    if (state == sRegionOK) {

        worldMap.mapCtl.setStateOnly( sIDCountry );
    }

    //if they are clicking after getting the country wrong; then
    //flip the state back to sIDCountry  
    //(this is not possible at the three higher levels, because we are zoomed in too far)

    if (state == sCountryBad) {

        worldMap.mapCtl.setStateOnly( sIDCountry );
    }  


    //read the state again, b/c we may have changed it

    state = worldMap.mapCtl.getState();

    //here we set the module vars for the area and the customData var for labelMapObject

    //this will be the user's first click on the map, trying to pick the right continent ..

    if (state == sIDContinent) {

        var _code = db.getContinentCodeForCountry(worldMap.mapObjectClicked);  //in database.js

        worldMap.selectedContinent = _code;

        worldMap.customData = _event.mapObject.customData;

    }

    //In this case, they are either trying to pick the right region (after getting the continent correct)

    //OR, the continent has tested correct and the user has chosen to "drill down" rather than click OK

    //(we switched them from sContinentOK to sIDRegion above, so that the system knows to go into "ready-to test" mode)

    if (state == sIDRegion) {

        var _code = db.getRegionCodeForCountry(worldMap.mapObjectClicked);   //in database.js

        worldMap.selectedRegion = _code;

        worldMap.customData = _event.mapObject.customData;

    }

    //Similarly, they are either trying to pick the right country (after getting the region correct)

    //OR, the region has tested correct and the user has chosen to "drill down" rather than click OK

    //(we switched them from sRegionOK to sIDCountry above, so that the system knows to go into "ready-to test" mode)

    //OR, this is just a replay of the successful hack or an auto-hack 

    if (state == sIDCountry || state == sMapDone) {

        if (_event.mapObject.objectType == "MapImage") {  //simulate the click on the country

            var _mapObj = worldMap.mapCtl.getCountryObject( worldMap.map.dataProvider, worldMap.mapObjectClicked );

            worldMap.map.selectObject( _mapObj );
        }

        worldMap.selectedCountry.set( worldMap.mapObjectClicked );

        worldMap.customData = _event.mapObject.customData;

    }

}

//this function gets called by the ammap object when
//the zoom-in finishes as the result of a user click (or simulated click)

function handleZoomCompleted() { 

    var _rec;

    var _code;

    //this event can fire on it's own as a result of the map being drawn the first time

    if (worldMap.zoomDone == true) return;


    var state = worldMap.mapCtl.getState();

    var level = worldMap.mapCtl.level.get();

    //this is only true when we are doing a "replay" of the map solving 
    //(user is re-visiting map after hacking successfully)
    //       OR 
    //user selected "Auto-hack..."

    if (state == sMapDone)  {

        worldMap.mapCtl.setState( sTestCountry );

        worldMap.labelMapObject();

        worldMap.checkSelectedArea();

        return;
    }

    //possibly the user might click on a country after correctly id'ing the "hacked" country

    if (state >= sCountryOK ) return;


    //User's first click; trying to pick the right continent

    //we switch to test mode and redraw the map in a locked state

    //(gets locked out by doMap b/c state is sTest[Area])

    if (state == sIDContinent) {

        worldMap.mapCtl.setState( sTestContinent );

        _code = db.getContinentCodeForCountry( worldMap.mapObjectClicked );  //in data_handling.js

        worldMap.doMap(_code, mlContinent);

        worldMap.labelMapObject();

        refreshMap();

        worldMap.checkSelectedArea();

        return;
    }
    
    //User's 2nd click; trying to pick the right region

    //We do the same routine as above, but at the region level

    if (state == sIDRegion) {

        worldMap.mapCtl.setState( sTestRegion );

        _code = db.getRegionCodeForCountry( worldMap.mapObjectClicked );   //in data_handling.js

        worldMap.doMap(_code, mlRegion);

        worldMap.labelMapObject();

        refreshMap();

        worldMap.checkSelectedArea();

        return;
    }

    //User's 3rd click; trying to pick the right country

    //We do the same routine as above, but at the country level

    if (state == sIDCountry) {

        //since the zoom in to the country happens with autozoom and not
        //by our handling some event, we have to set the map level manually

        worldMap.mapCtl.level.set( mlCountry );

        worldMap.mapCtl.setState( sTestCountry );

        worldMap.labelMapObject();

        //worldMap.mapCtl.addCountryTags( worldMap.mapObjectClicked, worldMap.map.dataProvider, 96);

        worldMap.map.dataProvider.zoomLongitude = worldMap.map.zLongTemp;

        worldMap.map.dataProvider.zoomLatitude =  worldMap.map.zLatTemp;

        worldMap.map.dataProvider.zoomLevel =  worldMap.map.zLevelTemp;

        worldMap.map.validateData();

        refreshMap();

        worldMap.checkSelectedArea();

        return;
    }

}

function refreshMap() {
    Meteor.setTimeout( function() { hackMap.finishDraw(); }, 250);
}


$.fn.letterDrop = function() {
  // Chainability
  return this.each( function() { 
  
  var obj = $( this );
  
  var drop = {
    arr : obj.text().split( '' ),
    
    range : {
      min : 1,
      max : 9
    },
    
    styles : function() {
      var dropDelays = '\n', addCSS;
      
       for ( i = this.range.min; i <= this.range.max; i++ ) {
         dropDelays += '.ld' + i + ' { animation-delay: 0.' + i*2 + 's; }\n';  
       }
      
        addCSS = $( '<style>' + dropDelays + '</style>' );
        $( 'head' ).append( addCSS );
    },
    
    main : function() {
      var dp = 0;
      obj.text( '' );
      
      $.each( this.arr, function( index, value ) {

        dp = dp.randomInt( drop.range.min, drop.range.max );
        
        if ( value === ' ' )
          value = '&nbsp';
        
          obj.append( '<span class="letterDrop ld' + dp + '">' + value + '</span>' );
        
      });
          
    }
  };
   
  Number.prototype.randomInt = function ( min, max ) {
    return Math.floor( Math.random() * ( max - min + 1 ) + min );
  };
  
  
  // Create styles
  drop.styles();


    // Initialise
    drop.main();
  });

}
