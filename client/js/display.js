
//************************************************************
//                  DISPLAY  (constructor)
//************************************************************


Display = function() {

    this.feature = new Feature();

    this.closeUp = new CloseUp();

    this.cue = new Headline( "cue" );
    
    this.status = new Headline( "status" );

    this.mapStatus = new Headline( "map" );

    this.scanner = new Scanner();

    this.TV = new TV();

    this.weather = new Weather();

    this.browser = new Browser();

    this.meme = new Meme();

    this.help = new Help();

    //media files

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

    this.loadedControlName = new Blaze.ReactiveVar( "" );

    this.countryCode = "";  //To enable us to tell when the country has changed in browse mode

    this.soundPlayingPic =  "vu_meter1.gif";  //should match the prop in sound.js (used by debrief when there is no sound control)

    this.updateFlag = new Blaze.ReactiveVar(false);

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

        this.countryCode = _code;

        //reset any session vars that need it

        Session.set("sYouTubeOn", false);

        //reset vars and re-do controls and map

        this.loader.totalClueCount = 0;

        this.makeControls(_code);

    }

    this.browse = function( _code) {

        this.fullyLoadControls();

        FlowRouter.go("/newBrowse");
        
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
                
                if (_name == "IMAGE") this.ctl[ _name ] = new ghImageCtl();       

                if (_name == "TEXT") this.ctl[ _name ] = new Text(); 

                if (_name == "SOUND") this.ctl[ _name ] = new Sound();        

                if (_name == "VIDEO") this.ctl[ _name ] = new Video(); 

                if (_name == "MAP") this.ctl[ _name ] = new ghMapCtl();        

            }

            //initialize it and set the control state to sIcon
            //and then set the country code

            this.ctl[ _name ].init();

            if (col) this.ctl[ _name ].setCountry(_code, col);

            if ( _name == "MAP") continue;  //MAP manages it's own states

            this.ctl[ _name ].setState( sIcon );

        }
    }

    this.initMap = function() {

        var _name = "MAP";

        this.ctl[ _name ] = new ghMapCtl();        

        this.ctl[ _name ].init();
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

            //$("img#scanButton").addClass('faded');

            $("img#scanButton").attr("src", "./tvScannerGray.png");

            this.TV.stopIdle();

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

    this.updateContent = function() {

        var _val = this.updateFlag.get();

        this.updateFlag.set( !_val );        
    }

    this.reset = function() {

        this.stopBlinking();   

        this.loadedControlName.set( "" );

        this.scanner.show();

        //We do this when the scanner is first created
        //and again whenever we start a new mission.
        //We don't do it in startIdle, b/c most of the time
        //there will a control loaded into the center when idle starts up

        this.scanner.centerState.set( "idle" )

        this.feature.reset();

    }

    this.redraw = function() {

        this.dimensionControls();

        if (hack.mode == mReady || hack.mode == mScanning) this.scanner.draw();

        if (this.feature.on() ) {

            this.feature.draw()
        }
    }

    this.scrollToBottom = function() {

        document.documentElement.scrollTop = document.body.scrollTop = $(document).height();
    }

    this.scrollToTop = function() {

        document.documentElement.scrollTop = document.body.scrollTop = 0;
    }

    this.enableHomeButton = function() {

        $("#navHomeButton").removeClass("disabled");

        $("#imgNavHomeButton").css("opacity", "1.0");
    }

    this.disableHomeButton = function() {

        $("#navHomeButton").addClass("disabled");

        $("#imgNavHomeButton").css("opacity", "0.35");
    }

    this.homeButtonDisabled = function() {

        if ( $("#navHomeButton").hasClass("disabled") ) return true;

        return false;
    }

    //*********************************************
    //      main template functions
    //*********************************************

    this.loadMain = function() {

//        this.mainTemplateReady = false;

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
 
//        this.mainTemplateReady = false;

        for (i=0; i < this.ctlName.length; i++) {

            var _name = this.ctlName[i];

            if (_name == "MAP") continue;

            var ctl = this.ctl[ _name ];

            //assign the src value for the icon

            if (_name != "TEXT") $("#p" +_name).attr("src", ctl.getControlPic() );
        }

        imagesLoaded( document.querySelector('#preloadMain'), function( instance ) {
          
          //now that the images are loaded, go to main and the template.rendered event
          //will call this.drawMain()

          FlowRouter.go("/main");

        });
    }

    this.closeOutMain = function() {

         this.stopBlinking();  

         $('body').removeClass('noscroll');

         this.scanner.hide();

         this.weather.stop();

    }


    this.doHeadlines = function() {

        this.status.setAndShow();

        this.cue.setAndType();
    }

    //*********************************************
    //      Control functions
    //*********************************************

    this.suspendMedia = function() {

        if (this.feature.on() ) {

            c("display.suspendMedia is suspending " + this.feature.getName() )

            if (this.feature.ctl) this.feature.ctl.suspend();
        }

        if (game.user.mode == uBrowseCountry && this.ctl["VIDEO"] ) this.ctl["VIDEO"].suspend();

        if ( game.user.mode == uHelp ) {

            ytplayer.stopVideo();

            Session.set("sYouTubeOn", false);
        }

    }

    this.suspendBGSound = function() {

        if (!display.ctl["SOUND"]) return;

        if (display.ctl["SOUND"].getState() == sPlaying) {

            c("display is suspending the bg sound")

            display.ctl["SOUND"].pause();
        }
    }

    this.resumeMedia = function() {

          if (this.feature.on() ) {

            c("display is resuming the media, if necessary")

            if (this.feature.getName() == "VIDEO")  this.feature.ctl.play();

            if (this.feature.getName() == "AUDIO")  this.feature.ctl.play();


        }      
    }


    this.dimensionControls = function() {

        for (i = 0; i < this.ctlName.length; i++) {

            var _name = this.ctlName[i];

            if (_name == "MAP") continue;

            this.ctl[ _name ].setPicDimensions();
        }
    }

    this.showFeaturedContent = function(_name ) {

        if ( _name == "SOUND" || _name == "VIDEO") {

            c("showFeaturedContent is playing the media file")
            
            this.ctl[ _name ].play();
        }
        
        this.feature.setImageSource( _name );

        this.feature.draw();

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


