//story.js

$(document).ready(function(){
    $('.divStory').tooltip(); 
});


Story =  function() {

	this.head = ".divStoryTitle";

	this.head1 = "div#headline1.divStoryTitle";

	this.head2 = "div#headline2.divStoryTitle";

	this.isLoaded = new Blaze.ReactiveVar(false);

	this.inventorySound = "inventory2.mp3"

	this.em = new ExerciseManager();

	this.mem = new MapboxExerciseManager();

	this.exerciseType = new Blaze.ReactiveVar(""); //ammap or mapbox

	this.tempAgentImage = null;

	this.regionFonts = ["cam_nwsa_nesa_ssa","nam","neu_weu","sas_aus_oce","eeu_cas","bal","eas_seas", "swas_mea","neaf_nwaf_caf_saf"];

	this.cityNameElement = "div.divCityNameText";


//*********************************************************************************
//
//	BASIC FUNCTIONS CALLED BY STORY INSTANCES IN THEIR CORRESPONDING FUNCTIONS
//  ( this.init() in a story instance object calls this._init() , e.g.)
//
//*********************************************************************************

	this._init = function( _code, _scene ) {

		this.reset();

		this.code = _code;

		this.name = "story" + _code;

		this.scenePreselect = "";

		if (_scene) this.scenePreselect = _scene;

		this.fullName = "";

		if (!game.user.sms) game.user.sms = new StoryMessaging();

		this.mode = new Blaze.ReactiveVar( "none" );  //select, scene, chat, map or exercise

		this.chars = [];  //array for the indices

		this.tokens = []; //array for the indices

		this.labels = []; //array for the indices	

		this.labelCount = 3;  //default; change by setting this same property in the story instance	

		this.charObjs = [];  //this array holds the chars for the current scene

		this.tokenObjs = [];  //this array holds the tokens for the current scene

		this.soundObjs = [];  //this array holds the sounds for the story

		this.labelObjs = [];

		this.location = "";  //the country we're in or other locale like "base"

		this.scene = "";   //the name of the scene (cue) that is currently or about to play

		this.chat = "";  //name of the chat object to play

		this.flags = {};   //the boolean flags that track the user's progress in the mission

		this.preloads = [];

 		this.storyButtonBGElements = ["#storyButtonMap", "#storyButtonBase"];

 		this.storyButtonBaseElement = "img#imgStoryButtonBase";

  		this.storyButtonMapElement = "img#imgStoryButtonMap";		

		this.inventoryButtons = [];

		this.inventorySize = 0;

		this.bgElement = "img.storyBG";

		this.buttonStripElement = "div.divStoryButtons";

		this.locked_sound_file = "locked.mp3";

		this.baseButtonPic = new Blaze.ReactiveVar("");

		this.speed = 1.0;

		this.buttonStripHeightFactor = 0.135;

		this.tempEntity = null;

		this.exercise = new Exercise();

		this.mapboxExercise = new MapboxExercise();

 		this.storyButton = "Base";

 		this.congrats = new StoryCongrats();

 		//first subscribe to the records that supply any actual agent IDs (agents in the db) that we need for the story

		this.storyAgentSub = Meteor.subscribe("storyAssets_StoryAgent", _code, function() { Session.set("sStoryAgentReady", true ) });

	},

	this.finishSubscriptions = function( ) {

		//create the array of agent IDs, so that we can get their user records (for their pics)

		var _arr = Database.makeSingleElementArray( db.ghStoryAgent.find().fetch(), "uid" );

		//this sub will return the user records for the IDs found in _arr

		this.storyAgentRecordSub = Meteor.subscribe("storyAssets_StoryAgentRecord", _arr, function() { Session.set("sStoryAgentRecordReady", true ) });

 		this.storySub = Meteor.subscribe("storyAssets_Story", story.code, function() { Session.set("sStoryReady", true ) });

		this.locationSub = Meteor.subscribe("storyAssets_Location", story.code, function() { Session.set("sLocationReady", true ) });

		this.charSub = Meteor.subscribe("storyAssets_Char", story.code, function() { Session.set("sCharReady", true ) });

		this.tokenSub = Meteor.subscribe("storyAssets_Token", story.code, function() { Session.set("sTokenReady", true ) });

		this.storyFlagSub = Meteor.subscribe("storyAssets_StoryFlag", story.code, function() { Session.set("sStoryFlagReady", true ) });

		this.cueSub = Meteor.subscribe("storyAssets_Cue", story.code, function() { Session.set("sCueReady", true ) });

		this.chatSub = Meteor.subscribe("storyAssets_Chat", story.code, function() { Session.set("sChatReady", true ) });

		this.storySoundSub = Meteor.subscribe("storyAssets_StorySound", story.code, function() { Session.set("sStorySoundReady", true ) });

	},


	this.reset = function() {
	
		Session.set("sStoryReady", false);

  		Session.set("sLocationReady", false);

  		Session.set("sCharReady", false);

   		Session.set("sTokenReady", false);

   		Session.set("sStoryAgentReady", false);

   		Session.set("sStoryAgentRecordReady", false);

   		Session.set("sStoryFlagReady", false);

   		Session.set("sCueReady", false);

   		Session.set("sChatReady", false);

   		Session.set("sStorySoundReady", false);

   		this.isLoaded.set( false );

      	if (!this.storyAgentSub) return;

       	this.storySub.stop();
       	this.storyAgentSub.stop();
       	this.storyAgentRecordSub.stop();
       	this.locationSub.stop();
       	this.charSub.stop();
       	this.tokenSub.stop();
       	this.storyFlagSub.stop();
       	this.cueSub.stop();
       	this.chatSub.stop();
       	this.storySoundSub.stop();

       	browseMap.reset();

       	game.user.sms.conversation.remove( {} );

       	this.killSound(); 

	},

	this.createStoryFromData = function() {


		this.setEntityArrays();

		this.createChars();

		this.createTokens();

		this.createFlags();

		this.createSounds();

		this.cueSource = db.ghCue.find().fetch();

		this.chatSource = db.ghChat.find().fetch();		//we will have to filter out the recs we need, for each chat


		var _rec = db.ghStory.findOne( { c: this.code } );

		this.baseButtonPic.set( _rec.btn );  

		this.baseBGPic = _rec.bg;  

		this.fullName = _rec.n;

		//now that we have the fullName of the story, we can register this event

		Database.registerEvent( eGSMissionStart, game.user._id, this.fullName);	

		this.inventorySize = _rec.i;

		if (this.inventorySize) this.makeInventoryArray( this.inventorySize );

		if (sed) sed.recordID.set( _rec._id );

		//create the preloads array

		this.preloads = [];

		var _obj = null;

		var _arr = Meteor.users.find({}).fetch();

		for (var i = 0; i < _arr.length; i++) {

			this.preloads.push( _arr[i].profile.av );
		}

		_arr = db.ghStory.find( { c: this.code } ).fetch();

		for (var i = 0; i < _arr.length; i++) {

			var _obj = _arr[i];

			if (_obj.bg) this.preloads.push( _obj.bg );

			if (_obj.btn) this.preloads.push( _obj.btn );			
		}

		_arr = db.ghLocation.find( { c: this.code } ).fetch();

		for (var i = 0; i < _arr.length; i++) {

			_obj = _arr[i];

			this.preloads.push( _obj.p );		
		}			

		_arr = db.ghChar.find( { c: this.code } ).fetch();

		for (var i = 0; i < _arr.length; i++) {

			var _obj = _arr[i];

			this.preloads.push( _obj.p );		
		}	

		_arr = db.ghToken.find( { c: this.code } ).fetch();

		for (var i = 0; i < _arr.length; i++) {

			var _obj = _arr[i];

			this.preloads.push( _obj.p );		
		}

		this.updatePreloads();

		Meteor.defer( function() { story.setPreloadCallback(); } );	

	}

	this.setPreloadCallback = function() {

		imagesLoaded( document.querySelector('#preloadStoryFiles'), function( instance ) {

        	story.init();

  			//story.isLoaded.set( true );

  			FlowRouter.go("/story");

        });	
	}

	this.updatePreloads = function() {

		var _val = Session.get("sUpdatePreloads");

		Session.set("sUpdatePreloads", !_val);
	}

//*********************************************************************************
//
//				INVENTORY
//
//*********************************************************************************

	this.makeInventoryArray = function( _num ) {

		for (var i = 0;  i < _num; i++) {

			this.inventoryButtons.push(i);
		}
	},

	this._addInventoryItem = function( _name ) {

		if ( this[ _name ].movable == false) return;

		var _item = new InventoryItem( this[ _name ] );

		this.inv.add( _item );

		this.playEffect( this.inventorySound )

		this[ _name ].fadeOut(250);

		var _s = "story.flags.has_" + _name + " = 1";

		eval(_s);

	},

	this._removeInventoryItem = function( _name ) {

		this.inv.remove( _name );

		//currently, all item removals launch another scene, so no need to draw it here

		//this[ _name ].draw();

		this.playEffect( this.inventorySound )

		this[ _name ].fadeIn(150);

		var _s = "story.flags.gave_" + _name + " = 1";

		eval(_s);
	},

	this.refuseItem = function( _name) {

		story.silenceAll();

		story[ _name ].add( { "top": "0.1", "left":"0.47"} );

		//story[ _name ].fadeIn();

		story.da = story.charObjs[0];

		Meteor.setTimeout( function() { story.da.say("Sorry, I cannot use that."); }, 1000 );

		Meteor.setTimeout( function() { story.addInventoryItem(_name); }, 2000 );	




	}

//*********************************************************************************
//
//				LOAD / CREATE ENTITIES FROM DATA
//
//*********************************************************************************

	


	//when we make the arrays, we have to add one to the count (allows for the default char and default token)
	//Default token not used yet, not sure what it would be
	
	this.setEntityArrays = function() {

		var _tokenCount = db.ghToken.find().fetch().length;

		this.tokens = this.makeArray(_tokenCount + 1);

		var _charCount = db.ghChar.find().fetch().length;

		this.chars = this.makeArray(_charCount + 1);

		this.labels = this.makeArray(this.labelCount + 1);
	},

	this.makeArray = function( _val ) {

		var _arr = [];

		for (var i = 0; i < _val; i++ ) {

			_arr.push(i);
		}

		return _arr;
	},

	this.createSounds = function() {

		var _arr = db.ghStorySound.find().fetch();

		for (var i = 0; i < _arr.length; i++) {

			var _file = getFileFromPath( _arr[i].u );

			var _index = _file.indexOf("-");

		   _arr[i].n = _file.substr(_index + 1);
		}

		this.soundObjs = _arr;
	}

	this.createChars = function() {

		var _arr = db.ghChar.find().fetch();

		//We start this array at 1, b/c we want the array index to correspond
		//to the desired Char index.  We don't use zero b/c that is reserved for the default agent

		for (var i = 1; i <= _arr.length; i++) {

			//we have to decrement the index, so that we access zeroth element
			//up to the last one

			var _obj = _arr[i - 1];

			_name = _obj.sn;

			//story.twain = new Char(1);

			var _str = "story." + _name + " = new Char()";

			eval( _str );

			//story.twain.init( _obj );

			_str = "story." + _name + ".init( _obj, " + i + " )";

			eval(  _str );		
		}	
	},

	this.createTokens = function() {

		var _arr = db.ghToken.find( {} ).fetch();


		for (var i = 0; i < _arr.length; i++) {

			var _obj = _arr[i];

			_name = _obj.sn;

			//story.computer = new Token();

			var _str = "story." + _name + " = new Token()";

			eval( _str );

			//story.computer.init( _obj, _index );

			var _index = 0;

			//the index on the tokens is one plus the array index
			//(we don't use zero for consistency with the Chars)

			_index = i + 1;

			_str = "story." + _name + ".init( _obj, " + _index + " )";

			eval(  _str );	

		} //end for loop thru records	
	},


	this.createFlags = function() {

		var _arr = db.ghStoryFlag.find().fetch();

		for (var i = 0; i < _arr.length; i++) {

			this.flags[ _arr[i].n ] = false;
		}
	}

//*********************************************************************************
//
//				PLAYING SCENES
//
//*********************************************************************************

	this.playPreselect = function( _scene ) {

		this.scenePreselect = "";

		this.play( _scene );
	}


	this.play = function( _name ) {


		//the default scene already set story.cue in the calling function

		if ( _name != "default" ) {

			this.scene = _name; 

			var _index = Database.getObjectIndexWithValue( this.cueSource, "n", this.scene);
	 
			this.cue = this.cueSource[_index].d;	
		}

		this.mode.set( "scene" );


		//do we need to change the bg?

		var _changeBGFlag = false;

		if ( $(this.bgElement).attr("src") != this.background ) {

			_changeBGFlag = true;

			this.disableButtons();

			this.fadeOutChars();

			this.fadeOutTokens();

			this.fadeOutBG();

			Meteor.setTimeout( function() { story.finishPlay( _changeBGFlag ); }, 1100);

			return;				
		}

		this.finishPlay( _changeBGFlag );
	},

	this.finishPlay = function( _changeBGFlag) {

		this.resetScene();

		$(this.bgElement).attr( "src", this.background );

		if ( $(this.bgElement).css("opacity") == 0) this.fadeInBG();

		Meteor.setTimeout( function() { story.playScene(); }, 1001);	

		Meteor.setTimeout( function() { story.showCityName(); }, 2001);

		if (_changeBGFlag) Meteor.setTimeout( function() { story.enableButtons(); }, 2002);

	},


	this.playScene = function() {

		if (ved) ved.updateScreen( this.scene );

		this.restoreBG();

		this.playBGLoop( this.location );

		this.cutScene = new CutScene( this.scene );

		this.cutScene.play( this.cue );
	},

	this.resetScene = function() {

		this.tokenObjs = [];

		this.charObjs = [];

		this.labelObjs = [];
	},

	this.getBackground = function( _countryCode ) {

		if (_countryCode == "base") return this.baseBGPic;

		var _rec = db.ghLocation.findOne( { c: this.code, n: _countryCode } );

		if (!_rec.p) {

			var _pic = db.getCapitalPic( _countryCode );

			if (_pic) {

				return _pic
			}
			else {

				console.log("No location rec found for country " + _countryCode);

				return "";				
			}
		}

		return _rec.p;
	}

//*********************************************************************************
//
//				DEFAULT SCENE
//
//*********************************************************************************

	this.addDefaultAgent = function( _countryID ) {

		Meteor.subscribe("agentsInThisCountry", _countryID, function() { 

			var _rec =  Meteor.users.findOne( { 'profile.cc': _countryID } ); 

			create_story_defaultAgent( _rec );

			story.finishPlayDefaultScene();
		 
		 });	
	},

	this.playDefaultScene = function( _countryCode) {

		this.background = this.getBackground( _countryCode);

		this.addDefaultAgent( this.location );
	},

	this.finishPlayDefaultScene = function() {

		story.scene = "default"; 

		story.cue = storyDefault_cue( story.scene );

		story.play( story.scene );
	}


//*********************************************************************************
//
//				NAVIGATION
//
//*********************************************************************************

	this.cleanScene = function() {

		  if (this.cutScene) this.cutScene.stop();

          this.unhiliteAllButtons();

          this.fadeOutAll();

          this.hidePrompt();

          this.hideCityName();

          this.silenceAll();
	
	}

	this.navigationReady = function() {

		//if (Meteor.user().profile.st == usAdmin) return true;

		if ( parseFloat( $(this.buttonStripElement).css("opacity") ) < 1.0 ) return false;

		return true;
	}


	this.goBase = function() {

          this.cleanScene();

          this.hiliteButton("Base");

          story.mode.set("scene");

          this.go("base");

	},

	this.goMap = function() {

		  if (this.navigationReady() == false) return;

          this.cleanScene();

          this.hiliteButton('Map');

          browseMap.reset();

          browseMap.mode.set( "story" );

          this.playEffect( "storyMap.mp3") 

          display.playLoop("mapLoop.mp3")

          var _map = browseMap.worldMap;

          if (this.location != "base") {

          	_map.selectedCountry.set( this.location );

          	_map.selectedRegion = db.getRegionCodeForCountry( this.location );

          	_map.selectedContinent = db.getContinentCodeForCountry( this.location );

          	_map.mapLevel = mlCountry;
          }

          Meteor.setTimeout( function() { story.mode.set("map"); }, 250 );
	},

	this.handleNavigationInParent = function( _mode )  {

		if (_mode == "chat" || _mode == "map") return true;

		if (this.scenePreselect) {

			this.playPreselect( this.scenePreselect );

			return true;
		}

		return false;
	},

	this.returnToScene = function() {

		this.mode.set("scene")

		this.playBGLoop( this.location );
	}

//*********************************************************************************
//
//				CHAT
//
//*********************************************************************************

	this.doChat = function( _shortName ) {

		if ( !this.checkForChat() ) return;

        this.silenceAll();

        this.hidePrompt();

        if (_shortName) {
			
			game.user.sms.createTarget( story[ _shortName ] );	
		}
		else {

			//if no _shortName was passed, then we are just testing the chat
			//so create a dummy target

			game.user.sms.createHelperTarget();		
		}

      	game.user.sms.startThread();

		this.chat = this.getChat( _shortName );	

		if ( this[ _shortName ].movable == 0 ) this.chat = storyDefault_chat_cantTalkNow; 


		//if we're testing, then get the chat from smed

        if (!_shortName) this.chat = smed.chatName;


		this.chatSource = db.ghChat.find( { s: this.chat } ).fetch();

		//this default chats are not in the db

		if (this.chat == "storyDefault_chat_cantTalkNow") this.chatSource = storyDefault_chat_cantTalkNow;

		if (this.chat == "storyDefault_chat_reportToBase") this.chatSource = storyDefault_chat_reportToBase;
		
		if (_shortName) {

			this.mode.set("chat");

			game.user.sms.startChat( this.chatSource );

			display.playEffect("messaging.mp3")

      		Meteor.setTimeout( function() { display.animateScrollToBottom(); }, 300 );		
		}
		else {

			//In testing mode, we're in the editStory template, so we need to switch,
			//then start the chat

      		story.mode.set("chat");

			FlowRouter.go("/story");

      		Meteor.setTimeout( function() { 			

				game.user.sms.startChat( story.chatSource ); 

			}, 500 );				
		}

	},

//*********************************************************************************
//
//				LABELS
//
//*********************************************************************************

this.addLabel = function( _index, _text, _obj) {

	var _label = new StoryLabel( _index, _text, _obj );

	_label.add();

	this.labelObjs.push( _label );
}

this.showLabel = function( _ID ) {

	var _label = this.getLabelByID( _ID);

	_label.place();

	_label.show();
}

this.getLabelByID = function( _ID ) {

	var _arrIndex = Database.getObjectIndexWithValue( this.labelObjs, "index", _ID);

	return this.labelObjs[ _arrIndex ];
}


//*********************************************************************************
//
//				DRAW THE SCREEN AND ELEMENTS
//
//*********************************************************************************

	this.draw = function() {

		var _width = 90.0 / parseFloat( this.inventoryButtons.length + 2 );  //plus two for the MAP and BASE buttons

		$(".storyButton").css("width", _width + "%");

		var _obj = getDimensionsFromFilename( this.baseButtonPic.get() );

		this.inv.dimensionButtonImage( this.storyButtonBaseElement, _obj );

		var _src = $( this.storyButtonMapElement ).attr("src");

		_obj = getDimensionsFromFilename( _src );

		this.inv.dimensionButtonImage( this.storyButtonMapElement, _obj );

		this.hiliteButton( this.storyButton );

		if (ved) ved.conformInventory();
	},


	this.fadeInBG = function() {

		$(this.bgElement).velocity( "fadeIn", {duration: 1000} );
	},

	this.fadeOutBG = function() {

		$(this.bgElement).velocity( "fadeOut", {duration: 1000} );
	},

	this.fadeInChars = function() {

		for (var key in this.charObjs) {

		    this.charObjs[ key ].fadeIn();	    
		}
	},

	this.fadeInTokens = function() {

		for (var key in this.tokenObjs) {

		    this.tokenObjs[ key ].fadeIn();    
		}
	},

	this.fadeOutChars = function() {

		for (var key in this.charObjs) {

		    this.charObjs[ key ].fadeOut();	    
		}
	},

	this.fadeOutTokens = function() {

		for (var key in this.tokenObjs) {

		    this.tokenObjs[ key ].fadeOut();    
		}
	},

	this.fadeInAll = function() {

		this.fadeInChars();

		this.fadeInTokens();
	},

	this.fadeOutAll = function() {

		this.fadeOutChars();

		this.fadeOutTokens();
	},

	this.hideChars = function() {

		for (var key in this.charObjs) {

		    this.charObjs[ key ].hide();

		    this.charObjs[ key ].q();		    
		}
	},

	this.showChars = function() {

		for (var key in this.charObjs) {

		    this.charObjs[ key ].show();	    
		}
	},

	this.showTokens = function() {

		for (var key in this.tokenObjs) {

		    this.tokenObjs[ key ].show();    
		}
	},

	this.hideTokens = function() {

		for (var key in this.tokenObjs) {

		    this.tokenObjs[ key ].hide();    
		}
	},

	this.silenceChars = function() {

		for (var key in this.charObjs) {

		    this.charObjs[ key ].q();	    
		}
	},

	this.silenceTokens = function() {

		for (var key in this.tokenObjs) {

		    this.tokenObjs[ key ].q();    
		}
	},

	this.hideAll = function() {

		this.hideChars();

		this.hideTokens();
	},

	this.showAll = function() {

		this.showChars();

		this.showTokens();
	},

	this.silenceAll = function() {

		this.silenceChars();

		this.silenceTokens();
	},

	this.hidePrompt = function() {

		$("div#storyPromptText").addClass("invisible");	
	},

	this.showPrompt = function( _text) {

        $("div#storyPromptText").removeClass("invisible");
    
        $("div#storyPromptText").text( _text );
	},

	this.prompt = function( _text) {

		this.showPrompt( _text );
	},

	this.brightness = function(_val, _element) {

		if (!_element) _element = this.bgElement;

		$( _element ).css("filter", "brightness(" + _val + "%)")
	}

	this.restoreBrightness = function(_element) {

		if (!_element) _element = this.bgElement;

		$(_element).addClass("restoreBrightness");
	}

	this.dimBrightness = function(_element) {

		if (!_element) _element = this.bgElement;

		$(_element).addClass("dimBrightness");
	}

//*********************************************************************************
//
//				SOUND FUNCTIONS
//
//*********************************************************************************

	this.playStorySound = function( _file ) { this.playSound( _file ) };

	this.playStorySoundLoop = function( _file ) { this.playLoop( _file ) };

	this.stopStorySoundLoop = function( _file ) { this.stopLoop() };

	//The basic scheme for the 3 sound players is:

	//player (no number) = effect (sound in public folder > interface sounds: inventory sound, button sounds, etc)

	//player2 = story sound (scripted sound effects) AND effect2 (sound in public folder)  

	//player3 = story loop (bg loops)  AND story sound2 (the occasional scripted sound that overlaps an already playing one)

	//The "AND" cases above are intended to be rare instances

	this.playEffect = function( _file ) {
	
		display.playEffect( _file );
	}

	this.playEffect2 = function( _file ) {
	
		display.playEffect2( _file );
	}

	this.playSound = function( _file ) {

		var _soundIndex = Database.getObjectIndexWithValue( this.soundObjs, "n", _file); 

		display.playEffect2( this.soundObjs[ _soundIndex].u );
	}

	this.playSound2 = function( _file ) {

		var _soundIndex = Database.getObjectIndexWithValue( this.soundObjs, "n", _file); 

		display.playEffect3( this.soundObjs[ _soundIndex].u );
	}

	this.playLoop = function( _file ) {

		var _soundIndex = Database.getObjectIndexWithValue( this.soundObjs, "n", _file); 

		display.playLoop( this.soundObjs[ _soundIndex].u );
	}

	this.stopLoop = function() {

		display.stopLoop();
	}

	this.killSound = function() {

		display.stopEffects();

		game.stopMusic();
	}

	this.playMusic = function() {

		game.startMusic();
	}



//*********************************************************************************
//
//				INTERFACE FUNCTIONS
//
//*********************************************************************************

	this.showHeadline = function( _text1, _text2, _color) {

		if ( _text1) $( this.head1 ).text( _text1 );

		if ( _text2) $( this.head2 ).text( _text2 );	
		
		if (_color) $( this.head ).css("color", _color);	

		if ( $( this.head ).css("opacity") == 0 ) $( this.head ).velocity( "fadeIn", {_duration: 1000} );
	}

	this.hideHeadline = function() {

		if ( $( this.head ).css("opacity") == 1) $( this.head ).velocity( "fadeOut", {_duration: 1000} );		
	}

	this.hiliteButton = function( _name ) {

		var _sel = "img#storyButton" + _name + ".imgStoryButton.imgStoryButtonBG";

		$( _sel ).attr("src", Control.hilitedBackdrop());

		this.storyButton = _name;
		
	},

	this.unhiliteAllButtons = function( ) {

		for (var i = 0; i < story.storyButtonBGElements.length; i++) {

			var _sel = this.storyButtonBGElements[i];

			$( _sel ).attr("src", Control.featuredBackdrop());
		}
		
	}

	this.blurBG = function() {

		$(story.bgElement).addClass("blur");
	}

	this.restoreBG = function() {

		$(story.bgElement).removeClass("blur");
	}

	this.showCityName = function() {

		var _fontName = "scannerFont";

		//there may be a custom name (something other than the capital)

		var _name = this.getCityName( this.location );

		//If we're not, we look up the capital name, assuming we are not on base.
		//We also need the right font name based on region

		if (this.location != "base") {

			var _region = db.getRegionCodeForCountry( this.location );

			//don't replace the custom name, if we have one

			if (!_name) _name = db.getCapitalName( this.location );

			for (var i = 0; i < this.regionFonts.length; i++) {

				var _str = this.regionFonts[i];

				var _arr = _str.split("_");

				if ( _arr.indexOf( _region) != -1) {

					_fontName = _str;

					break;
				}
			}			
		}

		//we must be on base

	if (!_name) _name = ""; 

		//now apply the text and font

		$(this.cityNameElement).css("font-family", _fontName);

		$(this.cityNameElement).text(_name);	

		$(this.cityNameElement).velocity( { opacity: 0.7}, {duration: 1000}  );	

	}

	this.hideCityName = function() {

		$(this.cityNameElement).velocity( { opacity: 0.0}, {duration: 1000}  );		
	}

	this.disableButtons = function() {

		$(this.buttonStripElement).velocity( { opacity: 0.75}, {duration: 1}  );	
	}

	this.enableButtons = function() {

		$(this.buttonStripElement).velocity( { opacity: 1.0}, {duration: 500}  );	
	}

	this._doExercise = function() { 

		this.silenceAll();

		this.hidePrompt();

		this.hideCityName();

		this.fadeOutBG();
	}

	this.completeMission = function() {

		Database.registerEvent( eGSMissionComplete, game.user._id, story.fullName);
	}
	
}

//end of Story object




Tracker.autorun( function(comp) {

  if ( Session.get("sStoryReady") &&  

  		Session.get("sLocationReady")  && 

  		Session.get("sCharReady")  && 

   		Session.get("sTokenReady") &&

   		Session.get("sStoryAgentRecordReady") &&

   		Session.get("sStoryFlagReady") &&

   		Session.get("sCueReady") &&

   		Session.get("sChatReady") &&

   		Session.get("sStorySoundReady")

      ) {

  		console.log("story data ready")

		if (typeof story === 'undefined') return;

		if (story.isLoaded.get() ) return;

		story.isLoaded.set( true );

		console.log("calling createStoryFromData")
    	
    	story.createStoryFromData();
 		
 		} 

  console.log("story data not ready")

});  

