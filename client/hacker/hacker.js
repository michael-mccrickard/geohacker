
//************************************************************
//                  HACKER  (constructor)
//************************************************************


Hacker = function() {

    this.name = "hacker";

    this.feature = new Feature();

    this.closeUp = new CloseUp();

    this.cue = new Headline( "cue" );
    
    this.status = new Headline( "status" );

    this.mapStatus = new Headline( "map" );

    this.scanner = new Scanner();

    this.TV = new TV();

//    this.weather = new Weather();

    this.news = new News();

    this.helper = new Helper();

    this.debrief = null;

    this.debriefItems = [];

    this.memeIsFeatured = new Blaze.ReactiveVar( false );


    //media files

    this.fb_sound_file = "msg.mp3";

    this.scan_sound_file = "token.mp3";

    this.blink_sound_file = "blink.mp3";

    this.locked_sound_file = "locked.mp3";

    this.soundPlayingPic = "vu_meter1.gif";  //used as the image by debrief when the type is language

    this.playControlPic = "play_icon_square.jpg";

    this.pauseControlPic = "pause_icon_square.jpg";


    //misc

    this.mainTemplateReady = false;

    this.worldMapTemplateReady = false;

    this.loadedControlName = new Blaze.ReactiveVar( "" );

    this.updateFlag = new Blaze.ReactiveVar(false);

    //arrays

    //all the controls used by the hacker

    this.ctlName = ["SOUND", "MEME", "VIDEO", "WEB"];  


    this.ctl = [];  //the array of control objects

    
    //create the loader

    this.loader = new NewLoader();

    this.clues = new Meteor.Collection(null);

    this.arrClues = [];  //the parallel array to this.clues, use it to rebuild the collection between jumps to the map / home screen, etc.

    //*********************************************
    //      Startup functions
    //*********************************************


    this.init = function(_code) {

        //reset vars and re-do controls

        this.loader.totalClueCount = 0;

        this.helper.init( _code );

        this.makeControls(_code);

        this.makeDebriefCollection( _code );
    }

    this.makeDebriefCollection = function( _code ) {

        var _debriefCollection = new MemeCollection( "debrief" );

        _debriefCollection.make( _code );

        this.debriefItems = _debriefCollection.items;
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

                if (_name == "MEME") this.ctl[ _name ] = new MemeCtl(); 

                if (_name == "SOUND") this.ctl[ _name ] = new Sound();        

                if (_name == "VIDEO") this.ctl[ _name ] = new VideoCtl();      

            }

            //initialize it and set the control state to sIcon
            //and then set the country code

            this.ctl[ _name ].init();

            if (col) this.ctl[ _name ].setCountry(_code, col);

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

            $("img#scanButton").attr("src", "./tvScannerGray.png");

            this.TV.stopIdle();

        }

        if (this.loader.totalClueCount == 0) {

            hackMap.disableButton();
        }
        else {

            hackMap.enableButton();            
        }
    },

    this.playSequence = function() {

        this.loader.state = "play";

        this.setScannerButtonImage( this.pauseControlPic );

        this.loader.go();
    }

    this.pauseSequence = function() {

        this.loader.state = "pause";

        this.setScannerButtonImage( this.playControlPic );
    }
    
    this.setScannerButtonImage = function( _url ) {

        $("img#scanButtonContentA").attr("src", _url);
    }


    //*********************************************
    //      Utility functions
    //*********************************************

    this.updateContent = function() {

        var _val = this.updateFlag.get();

        this.updateFlag.set( !_val );        
    }

    this.reset = function() {

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

        //if (hack.mode == mReady || hack.mode == mScanning) this.scanner.draw();

        if (this.feature.on() ) {

            //this.scanner.hide();

            this.feature.item.show();
        }

        this.restoreClues();
    }

    this.redimension = function() {

        this.dimensionControls();

        if ( this.feature.on() ) {

            if (!this.feature.item) return;

            this.feature.item.redimension();

            if (this.feature.item.getName() == "VIDEO") {

                if ( this.feature.item.video) this.feature.item.video.show();

            }
        }
    }



    //*********************************************
    //      main template functions
    //*********************************************

    this.loadMain = function() {

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
          //will call this.redraw()

          hacker.loader.state = "play";  //set this so that template.rendered will start up the loader

          FlowRouter.go("/main");

        });
    }


    this.closeOutMain = function() {

         $('body').removeClass('noscroll');

         this.scanner.hide();

         this.news.stop();

    }


    this.doHeadlines = function() {

c("doHeadlines")

        this.status.setAndShow();

        this.cue.setAndType();
    }

    this.hideAgentHint = function() {

        $('img.clsHelperAgentButton').tooltip('hide');
    }

    //*********************************************
    //      Control functions
    //*********************************************

    this.suspendMedia = function() {

        if (this.feature.on() ) {

            var _name = this.feature.item.getName();

            c("hacker.suspendMedia is suspending " + _name )

            if (this.feature.item.ctl) this.feature.item.ctl.suspend();

            if ( _name == "VIDEO" || _name == "SOUND" ) game.pauseMusic();

            return;
        }
    }

    //*********************************************
    //     Debriefs
    //*********************************************
 
    this.setDebrief = function(){

        var _meme = null;

        _meme = MemeCollection.getDebriefItem( this.debriefItems );

        this.debrief = new Debrief( _meme );
    }



    /****************************************************************************
    /  The statment below is no longer true, but we may re-enable that feature
    /****************************************************************************
    */

    //once a sound control has started playing, we don't automatically kill it
    //until we need to play another sound or a video with sound, so sometimes
    //a stray sound is still playing

    this.suspendBGSound = function() {

        if (!hacker.ctl["SOUND"]) return;

        if (hacker.ctl["SOUND"].getState() == sPlaying) {

            c("display is suspending the bg sound")

            hacker.ctl["SOUND"].pause();
        }
    }


    this.dimensionControls = function() {

        for (i = 0; i < this.ctlName.length; i++) {

            var _name = this.ctlName[i];

            this.ctl[ _name ].setPicDimensions();
        }
    }


    this.setControls = function( _state) {

        //have to use ctlName array for the length, b/c ctl is an associative array with length = 0

        for (i=0; i < this.ctlName.length; i++) {

            this.ctl[ this.ctlName[i] ].setState( _state );
        }
        
    }

    //the loader calls this to reset already loaded controls back to their loaded state
    //after we run the scanning animations

    this.resetControls = function() {

        //have to use ctlName array for the length, b/c ctl is an associative array with length = 0

        for (i=0; i < this.ctlName.length; i++) {

            var _name = this.ctlName[i];


            if (this.ctl[ _name ].loadedCount == 0) {

                this.ctl[ _name ].setState( sIcon );
            }
            else {

                if (_name == "SOUND" || _name == "VIDEO") {
 
                   this.ctl[ _name ].setState( sPaused );                       
                }
                else {

                    //loadCount > 1 and not a media type

                    this.ctl[ _name ].setState( sLoaded )
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

            if ( _name == "SOUND" || _name == "VIDEO") {

                ctl.setState( sPaused );
            }
            else {

              ctl.setState( sLoaded );           
            }
        }    
    }

     //*********************************************
    //     Clues
    //*********************************************   



    this.addClue = function( _obj ) {

        this.clues.insert( _obj );

    }

    this.restoreClues = function() {

        var _len = this.clues.find().fetch().length;

       if ( _len) {


            for (i = 0; i < _len; i++) {

                $("div#m" + i).velocity( "fadeIn", {duration: 250} );

            }

            this.loader.arrangeRows();
        }
    }

}


