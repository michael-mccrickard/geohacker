Headline = function( _type ) {

	this.text = "";

	this.hType = _type;

	this.counter = 0;

	this.len = 0;

    this.state = sPaused;

    this.typing_sound_file = "textReveal.mp3";


	if ( _type == "status") this.ele = "div.divStatus";
	
	if ( _type == "cue" ) this.ele = "div.divCue";

    if ( _type == "map" ) this.ele = "div.mapMessages";


	this.set = function( _text ) {

		if (this.hType == 'status') this.setStatus(_text);

		if (this.hType == 'cue') this.setCue(_text);

        if (this.hType == 'map') this.setMap(_text);
	}

    this.setMap = function( _text ) {

        $( this.ele ).addClass("invisible");

        if ( !_text) {

            this.text = Session.get("gMapStatus");
        }
        else {

            this.text = _text;
        }
    }

    this.setStatus = function(_text) {

        if (_text) {

            this.text = _text;

            return;
        }

        if (hack.mode == mReady) this.text = "Mission: " + game.user.assign.name;

        if (hack.mode == mDataFound) {

            if (display.loader.totalClueCount == 1) {

                this.text = "STREAM " + hack.messageID;
            }
        }

        if (hack.mode == mHackDone) {

            this.text = "STREAM FROM " + hack.getCountryName() + " WAS HACKED."
        }

        if (hack.mode == mBrowse) this.text = "Geohacker: Agent " + game.user.name + " is browsing " + mission.name;

    }


    this.setCue = function() {

        this.text = "";

        if (hack.mode == mReady && display.loader.totalClueCount == 0) {

            this.text = "CLICK THE SCAN BUTTON TO BEGIN HACKING ..." 
        
        }

        if (hack.mode == mScanning) {

            if (display.loader.totalClueCount == 1)  this.text = 'Scanning for foreign transmissions ...';  

            if (display.loader.totalClueCount > 1) this.text  = 'Scanning for additional messages linked to this strean ...';
        }

        if (hack.mode == mDataFound) {

            if (display.loader.totalClueCount == 1) {

                this.text = ('Stream ' + hack.messageID + ' intercepted');  
            }

             if (display.loader.totalClueCount > 1) this.text = 'Additional data found linked to stream ' + hack.messageID;
        }

        if (hack.mode == mHackDone) {

            this.text = "Intercepted stream successfully hacked.";
        }

        if (display.moreDataAvailable() == false) {

            this.text  = "Geo-locate the stream using the map ...";
        }

        if (hack.mode == mBrowse) this.text = "All data linked to " + hack.getCountryName() + " is loaded. ";

        if (this.text  == "") this.text  = "Scan for more data or use the map to geo-locate the stream ..."

        $( this.ele ).addClass("invisible");

        $( this.ele ).text( this.text );      

    },

    this.show = function() {

        this.center();

    	var ele = this.ele;

    	if (this.hType == "cue") {

	        this.typingDone();

	        Meteor.setTimeout(function () { $( ele ).removeClass("invisible"); }, 100 );

    	}

    	if (this.hType == "status" || this.hType == "map") {

      		$( this.ele ).text( this.text );  		
    		
    		$( this.ele ).removeClass("invisible");
    	}
    },

    this.setAndType = function() {
        
        this.set();

        this.type();
    },

    this.setAndShow = function( _text ) {

        this.set( _text );

        this.show();
    },

    this.type = function() {

        this.state = sPlaying;

        var ele = this.ele;  

        if (this.hType == "cue") Meteor.setTimeout(function () { display.cue.typeMessage( ele ); }, 500 );

        if (this.hType == "map") Meteor.setTimeout(function () { display.mapStatus.typeMessage( ele ); }, 500 );

        if (this.hType == "status") Meteor.setTimeout(function () { display.status.typeMessage( ele ); }, 500 );
    },

    this.typeMessage = function( _ele ) {

        this.center();

        if (hack.mode != mScanning) {

            //for the map, only play the typing sound, if we're in ID status,
            //otherwise we are cutting off a cool sound effect

            if (this.hType == "map" && display.ctl["MAP"].isIDStatus() ) {

               Control.playEffect( this.typing_sound_file );
            }


            if (this.hType != "map")  Control.playEffect( this.typing_sound_file );
        }

        $( _ele ).text("");       

        $( _ele ).removeClass("invisible");

        this.counter = 0;

        this.len = this.text.length;

        this.setChar( _ele );

    },

    this.setChar = function( _ele) {

        var _str =  $( _ele ).text(); 

        if (this.counter == this.len) {

            this.typingDone();

            return;
        }

        var _char = this.text[ this.counter++ ];

        $( _ele ).text(  _str + _char );

        if (this.hType == "cue") Meteor.setTimeout( function() { display.cue.setChar( _ele ); }, 10);   

        if (this.hType == "map") Meteor.setTimeout( function() { display.mapStatus.setChar( _ele ); }, 10);           

        if (this.hType == "status") Meteor.setTimeout( function() { display.status.setChar( _ele ); }, 10);       

    },

    this.typingDone = function() {

        this.state = sPaused;

        if (this.hType == "cue") {

            //if (hack.mode == mReady && display.loader.totalClueCount == 0) display.blinkScannerButton();

            if (hack.mode == mDataFound) {

                hack.mode = mReady;
            }

        }
    },

    this.center = function( _which ) {

        //Top and bottom text

        var fullScreenWidth = $(window).width();

        var fullScreenHeight = $(window).height();

        var leftMargin = fullScreenWidth * 0.02;

        var fullBackdropWidth = $("img.featuredBackdrop").width();

        $( this.ele ).text( this.text );

        //map
        if (this.hType == "map") {

            var divWidth = $(this.ele).width();

            $(this.ele).css("left", ( fullScreenWidth/2 ) - ( divWidth/2 ) + "px");   
        }


        //cue
        if (this.hType == "cue") {

	        if (_which != "window-resize") $( this.ele ).addClass("invisible");

	        var divWidthCueString = $( this.ele ).css("width");

	        var divWidthCue = parseFloat( divWidthCueString.substr(0, divWidthCueString.length - 2));

	        $( this.ele ).css("left", leftMargin + (fullBackdropWidth/2 - (divWidthCue)/2) + "px"); 

        }


        //status
		if (this.hType == "status") {

		    //if (_which != "window-resize") $( this.ele ).addClass("invisible");

	        var divWidthStatusString =  $( this.ele ).css("width");

	        var divWidthStatus = parseFloat( divWidthStatusString.substr(0, divWidthStatusString.length - 2));

	        $( this.ele ).css("left", leftMargin + (fullBackdropWidth/2 - (divWidthStatus)/2) + "px");  		
		}



    }

}