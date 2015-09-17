
//************************************************************
//                  DISPLAY  (constructor)
//************************************************************


Display = function() {

    this.feature = new Feature();

    this.closeUp = new CloseUp();

    this.cue = new Headline( "cue" );
    
    this.status = new Headline( "status" );

    this.mapStatus = new Headline( "map" );

    //media files

    this.beep_sound = "beep3.wav";

    this.fb_sound_file = "msg.mp3";

    this.scan_sound_file = "token.mp3";

    this.blink_sound_file = "blink.mp3";

    this.locked_sound_file = "locked.mp3";

    //layout constants

    this.menuHeight = 50;

    //misc

    this.timerID = 0;

    this.mainTemplateReady = false;

    this.worldMapTemplateReady = false;

    //arrays

    //to do: merge the functionality of these two arrays, if possible

    //all the possible controls\ names
    //Does the order for these still need to match the constants for these in constants.js?  For editing?

    this.ctlName = ["MAP", "SOUND", "TEXT", "IMAGE", "VIDEO", "WEB"];  

    //the session var used by the main template
    
    Session.set("sCtlName", ["SOUND", "TEXT", "IMAGE", "VIDEO", "WEB"]);


    this.ctl = [];  //the array of control objects

    
    //create the loader

    this.loader = this.loader || new NewLoader();

    //set the session variable that lets the menu know we can edit now

    Session.set("sDisplayReady", true);

    //*********************************************
    //      Startup functions
    //*********************************************


    this.init = function(_code) {

        //reset any session vars that need it

        Session.set("sYouTubeOn", false);

        //reset vars and re-do controls and map

        this.mainTemplateReady = false;

        this.loader.totalClueCount = 0;

        this.makeControls(_code);
        
        this.feature.setBackground( sIcon );

    }

    this.browse = function( _code) {

        this.feature.clear();    
        
        this.reset();

        this.init(_code);

        this.fullyLoadControls();

        this.loadMainForBrowsing();
    }

    this.makeControls = function(_code) {

        //create the array of controls for this country

        var i = 0;

        for (i = 0; i < this.ctlName.length; i++) {

            var _name = this.ctlName[i];

            var col = db.getCollectionForName( _name );


            //we only create the control if it doesn't already exist

            if (this.ctl[ _name ] == undefined) {

                if (_name == "WEB") this.ctl[ _name ] = new Web();
                
                if (_name == "IMAGE") this.ctl[ _name ] = new ghImage();       

                if (_name == "TEXT") this.ctl[ _name ] = new Text(); 

                if (_name == "SOUND") this.ctl[ _name ] = new Sound();        

                if (_name == "VIDEO") this.ctl[ _name ] = new Video(); 

                if (_name == "MAP") this.ctl[ _name ] = new ghMap();        

            }

            //initialize it and set the control state to sIcon
            //and then set the country code

            this.ctl[ _name ].init();

            if (col) this.ctl[ _name ].setCountry(_code, col);

            if ( _name == "MAP") continue;  //MAP manages it's own states

            this.ctl[ _name ].setState( sIcon );

        }
    }

    //*********************************************
    //      Data functions
    //*********************************************

    this.moreDataAvailable = function() {

        for (i = 0; i < this.ctlName.length; i++) {

            var ctl = this.ctl[ this.ctlName[i] ];

            if ( ctl.fullCount  > ctl.loadedCount  )  {

                return true;
            }
        }

        return false;
    }


    //*********************************************
    //      Scanner and Map functions
    //*********************************************

    this.checkMainScreen = function() {

        if (this.moreDataAvailable() == false) {

            $("img#scanButton").addClass('faded');

            $("img#scanButton").attr("src", "./tvScanner.png");

        }

        if (hack.mode == mBrowse) {
            
            this.ctl["MAP"].enableButton();    

            Meteor.defer( function() { display.redraw(); } );

            return;
        }

        if (this.loader.totalClueCount == 0) {

            this.ctl["MAP"].disableButton();
        }
        else {

            this.ctl["MAP"].enableButton();            
        }
    },

    this.blinkScannerButton = function() {

        this.blinking = true;

        this.blinkingButton = "img#scanButton";

        this.normalImage = "./tvScannerYellow.png";

        this.arrow = "#scanArrow";

        this.blinkButton( this.blinkingButton, this.normalImage, "./tvScannerGreen.png", this.arrow, 750);

    },

    this.blinkMapButton = function() {

        this.blinking = true;

        this.blinkingButton = "img#mapButton";

        this.normalImage = "./newGlobeIconYellow.png";

        this.arrow = "#mapArrow";

        this.blinkButton( this.blinkingButton, this.normalImage, "./newGlobeIconGreen.png", this.arrow, 750);

    },

    this.blinkButton = function(_button, _normalPic, _hilitePic, _arrow, _speed) {

       if (!this.blinking) return;

       $(_button).attr("src", _normalPic);

        $(_arrow).addClass("invisible");      

       Meteor.setTimeout( function() { display.doHilite(_button, _normalPic, _hilitePic, _arrow, _speed); }, _speed)

    },

    this.doHilite = function(_button, _normalPic, _hilitePic, _arrow, _speed) {

       if (!this.blinking) return;

       Control.playEffect( this.blink_sound_file);

        $(_button).attr("src", _hilitePic);

        $(_arrow).removeClass("invisible");       

        Meteor.setTimeout( function() { display.blinkButton(_button, _normalPic, _hilitePic, _arrow, _speed); }, _speed);

    },

    this.stopBlinking = function() {

        this.blinking = false;

        $(this.arrow).addClass("invisible");      

       $( this.blinkingButton ).attr("src", this.normalImage);
    }

    //*********************************************
    //      Utility functions
    //*********************************************

    this.reset = function() {

        this.stopBlinking();   

        this.feature.reset();

    }

    this.redraw = function() {

        this.dimensionControls();

        if (this.feature.on() ) {

            this.feature.draw()
        }
        else {

            this.feature.drawBG();
        }
    }

    //*********************************************
    //      main template functions
    //*********************************************

    this.loadMain = function() {

        this.mainTemplateReady = false;

        for (i=0; i < this.ctlName.length; i++) {

            var _name = this.ctlName[i];

            var ctl = this.ctl[ _name ];

            //assign the src value for the icon

            $("#p" +_name).attr("src", ctl.iconPic);

             //assign the src value for the scanning gif

            $("#p" +_name + "2").attr("src", ctl.scanningPic);           
        }

        imagesLoaded( document.querySelector('#preloadMain'), function( instance ) {
          
          //now that the images are loaded, go to main and the template.rendered event
          //will call this.drawMain()

          FlowRouter.go("/main");

        });
    }

    this.loadMainForBrowsing = function() {

        this.mainTemplateReady = false;

        for (i=0; i < this.ctlName.length; i++) {

            var _name = this.ctlName[i];

            if (_name == "MAP") continue;

            var ctl = this.ctl[ _name ];

            //assign the src value for the icon

            $("#p" +_name).attr("src", ctl.getControlPic() );
        }

        imagesLoaded( document.querySelector('#preloadMain'), function( instance ) {
          
          //now that the images are loaded, go to main and the template.rendered event
          //will call this.drawMain()

          FlowRouter.go("/main");

        });
    }

    this.closeOutMain = function() {

         Control.stopSound("effects");  //an anthem may be playing

         this.stopBlinking();  

    }


    this.doHeadlines = function() {

        this.status.setAndShow();

        this.cue.setAndType();
    }

    //*********************************************
    //      Control functions
    //*********************************************


    this.dimensionControls = function() {

        for (i = 0; i < this.ctlName.length; i++) {

            var _name = this.ctlName[i];

            if (_name == "MAP") continue;

            this.ctl[ _name ].setPicDimensions();
        }
    }

    this.showFeaturedContent = function(_name ) {

        if ( _name == "SOUND" || _name == "VIDEO") {

            this.ctl[ _name ].playFeaturedContent();
        }
        else {

            this.feature.loadAgain( _name );

            this.feature.draw();
        }

    } 

    this.setControls = function( _state) {

        //have to use ctlName array for the length, b/c ctl is an associative array with length = 0

        for (i=0; i < this.ctlName.length; i++) {

            if (this.ctlName[i] != "MAP") this.ctl[ this.ctlName[i] ].setState( _state );
        }

        
    }

    //the loader calls this to reset already loaded controls back to their loaded state
    //after we run the scanning animations

    this.resetControls = function() {

        //have to use ctlName array for the length, b/c ctl is an associative array with length = 0

        for (i=0; i < this.ctlName.length; i++) {

            var _name = this.ctlName[i];

            if ( _name != "MAP") {

                if (this.ctl[ _name ].loadedCount == 0) {

                    this.ctl[ _name ].setState( sIcon );
                }
                else {

                    if (_name == "SOUND" || _name == "VIDEO") {

                        this.ctl[ _name ].setState( sPaused );                       
                    }
                    else {
                        this.ctl[ _name ].setState( sLoaded );
                    }
                    
                }
            }
        }
    }

    this.fullyLoadControls = function() {

        //load up the controls

        var i = 0;

        for (i = 0; i < this.ctlName.length; i++) {        

            var _name = this.ctlName[i];

            var ctl = this.ctl[ _name ];

            ctl.loadedCount = ctl.fullCount;

            ctl.setIndex( 0 );

            if ( _name == "MAP") continue;  //nothing to load for the map

            if ( _name == "SOUND" || _name == "VIDEO") {

                ctl.setState( sPaused );
            }
            else {

              ctl.setState( sLoaded );           
            }
        }    
    }

}


