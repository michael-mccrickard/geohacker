Headline = function( _type ) {

	this.text = "";

	this.hType = _type;

	this.counter = 0;

	this.len = 0;

    this.state = sPaused;

    this.typing_sound_file = "textReveal.mp3";


	if ( _type == "status") {

        this.ele = "div.divStatus";
	
         this.typing_sound_file = "agentMessage2.mp3";
    }
    
	if ( _type == "cue" ) this.ele = "div.divCue";

    if ( _type == "map" ) this.ele = "div.mapMessages";

    if ( _type == "welcomeAgent" ) this.ele = "div.divTVText.divTVTextLower";

    if (_type == "welcomeAgent")  this.typing_sound_file = "agentMessage2.mp3";

    if (_type == "intro")  this.ele = ".divIntroHeadline";

    if (_type == "mapboxCongrats") this.ele = "#congratsMapHeadlineStatus";



	this.set = function( _text ) {

		if (this.hType == 'status') this.setStatus(_text);

		if (this.hType == 'cue') this.setCue(_text);

        if (this.hType == 'map') this.setMap(_text);

        if (this.hType == 'welcomeAgent') this.text = _text;      

        if (this.hType == 'intro') this.text = _text;     

        if (this.hType == 'mapboxCongrats') this.text = _text;     
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

        if (hack.mode == mHackDone) {

            this.text = "STREAM FROM " + hack.getCountryName() + " WAS HACKED."
        }

        if (game.user.mode == uBrowseCountry) this.text = "Agent " + game.user.name + " is browsing " + hack.getCountryName();

    }


    this.setCue = function() {

        this.text = "";

        if (hack.mode == mReady && hacker.loader.totalClueCount == 0) {

            this.text = "Preparing mission ..." 
        
        }

        if (hack.mode == mScanning) {

            if (hacker.loader.totalClueCount == 1)  this.text = 'Scanning for incoming transmissions ...';  

            if (hacker.loader.totalClueCount > 1) this.text  = 'Accessing another message from stream ...';
        }

        if (hack.mode == mDataFound) {

            if (hacker.loader.totalClueCount == 1) {

                var _date = new Date();

                this.text = ('Stream intercepted at ' + _date.toLocaleString());  
            }

            var _name = "";

            if (hacker.feature.item) {

                _name = hacker.feature.item.name.get()
            }

             if (hacker.loader.totalClueCount > 1) this.text = 'Additional ' + _name  + ' data decrypted from stream';
        }

        if (hack.mode == mHackDone) {

            this.text = "Intercepted stream successfully hacked";
        }

        if (hacker.moreDataAvailable() == false) {

            this.text  = "Geo-locate the stream using the map ...";
        }

        if (this.text  == "") this.text  = "Click the globe if you know which country this is ..."

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
        else {
    	
      		$( this.ele ).text( this.text );  		
    		
    		$( this.ele ).removeClass("invisible");
    	}
    },

    this.setAndType = function() {
      
        this.set();

        this.type();
    },

    this.setThisAndType = function( _str ) {
       
        this.set( _str );

        this.type();
    },

    this.setAndShow = function( _text ) {

        this.set( _text );

        this.show();
    },

    this.type = function() {

        this.state = sPlaying;

        var ele = this.ele;  

        if (this.hType == "cue") Meteor.setTimeout(function () { hacker.cue.typeMessage( ele ); }, 500 );

        if (this.hType == "map") Meteor.setTimeout(function () { hacker.mapStatus.typeMessage( ele ); }, 500 );

        if (this.hType == "status") Meteor.setTimeout(function () { hacker.status.typeMessage( ele ); }, 500 );

        if (this.hType == "welcomeAgent") Meteor.setTimeout(function () { game.user.headline.typeMessage( ele ); }, 500 );

        if (this.hType == "intro") Meteor.setTimeout(function () { game.intro.headline.typeMessage( ele ); }, 500 );

        if (this.hType == "mapboxCongrats") Meteor.setTimeout(function () { display.mapboxCongrats.headline.typeMessage( ele ); }, 500 );
    },

    this.typeMessage = function( _ele ) {

        //this case seems to be stray message from the main screen

        if (game.user.mode == uBrowseMap) return;
        

        if (this.type != "welcomeAgent") this.center();

        if (hack.mode != mScanning) {

            display.playEffect2( this.typing_sound_file );
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

        if (this.hType == "cue") Meteor.setTimeout( function() { hacker.cue.setChar( _ele ); }, 10);   

        if (this.hType == "map") Meteor.setTimeout( function() { hacker.mapStatus.setChar( _ele ); }, 10);           

        if (this.hType == "status") Meteor.setTimeout( function() { hacker.status.setChar( _ele ); }, 10);  

        if (this.hType == "welcomeAgent") Meteor.setTimeout(function () { game.user.headline.setChar( _ele ); }, 10 );     

        if (this.hType == "intro") Meteor.setTimeout(function () { game.intro.headline.setChar( _ele ); }, 10 );   

        if (this.hType == "mapboxCongrats") Meteor.setTimeout(function () { display.mapboxCongrats.headline.setChar( _ele ); }, 10 );   

    },

    this.typingDone = function() {

        this.state = sPaused;

        if (this.hType == "cue") {

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
		if (this.hType == "status" || this.hType == "mapboxCongrats") {

		    //if (_which != "window-resize") $( this.ele ).addClass("invisible");

            if (this.hType == "mapboxCongrats") fullBackdropWidth = $(window).width();

	        var divWidthStatusString =  $( this.ele ).css("width");

	        var divWidthStatus = parseFloat( divWidthStatusString.substr(0, divWidthStatusString.length - 2));

	        $( this.ele ).css("left", leftMargin + (fullBackdropWidth/2 - (divWidthStatus)/2) + "px");  		
		}



    }

}