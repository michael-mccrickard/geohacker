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

		this.charObjs = [];  //this array holds the chars for the current scene

		this.tokenObjs = [];  //this array holds the tokens for the current scene

		this.soundObjs = [];  //this array holds the sounds for the story

		this.location = "";  //the country we're in or other locale like "base"

		this.scene = "";   //the name of the scene (cue) that is currently or about to play

		this.chat = "";  //name of the chat object to play

		this.flags = {};   //the boolean flags that track the user's progress in the mission

 		this.storyButtonBGElements = ["#storyButtonMap", "#storyButtonBase"];

 		this.storyButtonBaseElement = "img#imgStoryButtonBase";

  		this.storyButtonMapElement = "img#imgStoryButtonMap";		

		this.inventoryButtons = [];

		this.inventorySize = 0;

		this.bgElement = "img.storyBG";

		this.buttonStripElement = "div.divStoryButtons";

		this.baseButtonPic = new Blaze.ReactiveVar("");

		this.speed = 1.0;

		this.buttonStripHeightFactor = 0.135;

		this.tempEntity = null;

		this.exercise = new Exercise();

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

//need to do this with value from the db, story record (in autoRun?)

		this.setEntityArrays();

		this.createChars();

		this.createTokens( "c" );  //content (sub-tokens)

		this.createTokens( "cb" );  //content bg (sub-tokens)

		this.createTokens( "n" );  //normal

		this.createFlags();

		this.createSounds();

		this.cueSource = db.ghCue.find().fetch();

		this.chatSource = db.ghChat.find().fetch();		//we will have to filter out the recs we need, for each chat

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

	this.initStoryProperties = function() {

		var _rec = db.ghStory.findOne( { c: this.code } );

		this.baseButtonPic.set( _rec.btn );  

		this.baseBGPic = _rec.bg;  

		this.fullName = _rec.n;

		this.inventorySize = _rec.i;

		if (this.inventorySize) this.makeInventoryArray( this.inventorySize );

		if (sed) sed.recordID.set( _rec._id );

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

	},

	this._removeInventoryItem = function( _name ) {

		this.inv.remove( _name );

		this[ _name ].draw();

		this.playEffect( this.inventorySound )

		this[ _name ].fadeIn(150);


	},

//*********************************************************************************
//
//				LOAD / CREATE ENTITIES FROM DATA
//
//*********************************************************************************



	//when we make the arrays, we have to add one to the count (allows for the default char and default token)
	//Default token not used yet, not sure what it would be
	
	this.setEntityArrays = function() {

		var _tokenCount = db.ghToken.find( { t: "n" } ).fetch().length;

		this.tokens = this.makeArray(_tokenCount + 1);

		var _charCount = db.ghChar.find().fetch().length;

		this.chars = this.makeArray(_charCount + 1);
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

	this.createTokens = function( _type ) {

		var _arr = db.ghToken.find( { t: _type } ).fetch();


		for (var i = 0; i < _arr.length; i++) {

			var _obj = _arr[i];

			_name = _obj.sn;

			//story.computer = new Token(1);

			var _str = "story." + _name + " = new Token()";

			eval( _str );

			//story.computer.init( _obj, _index );

			var _index = 0;

			//the index on the normal tokens is one plus the array index
			//(we don't use zero for consistency with the Chars)

			if (_type == "n") _index = i + 1;

			_str = "story." + _name + ".init( _obj, " + _index + " )";

			eval(  _str );	


			//if this is a "normal" token, then we check to see if there are any content
			//tokens to be added to it's content property (all the content tokens were created first)

			if (_type == "n") {

				var _arrC = db.ghToken.find( { w: _name } ).fetch();

				if (_arrC.length) {

					//story.computer.content = {};

					_str = "story." + _name + ".content = {};"

					eval( _str );

					_str = "story." + _name + ".contentBG = {};"

					eval( _str );

					//this array is treated normally

					for (var j = 0; j < _arrC.length; j++) {	
						
						//story.computer.content["bunnies"] = story.bunnies;

						if ( _arrC[j].t == "c") _str = "story." + _name + ".content['" + _arrC[j].sn + "'] = story." + _arrC[j].sn + ";"
						
						if ( _arrC[j].t == "cb") _str = "story." + _name + ".contentBG['" + _arrC[j].sn + "'] = story." + _arrC[j].sn + ";"

						eval( _str)
					}				
				} //end if array of content tokens is non-empty

			}  //end if normal	

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

		if ( $(this.bgElement).attr("src") != this.background ) {

			this.fadeOutChars();

			this.fadeOutTokens();

			this.fadeOutBG();

			Meteor.setTimeout( function() { story.finishPlay(); }, 1100);

			return;				
		}

		this.finishPlay();
	},

	this.finishPlay = function() {

		this.resetScene();

		$(this.bgElement).attr( "src", this.background );

		if ( $(this.bgElement).css("opacity") == 0) this.fadeInBG();

		Meteor.setTimeout( function() { story.playScene(); }, 1001);	

	},


	this.playScene = function() {

		if (ved) ved.updateScreen( this.scene );

c("story loc in playScene is " + story.location)

		this.playBGLoop( this.location );

		this.cutScene = new CutScene( this.scene );

		this.cutScene.play( this.cue );
	},

	this.resetScene = function() {

		this.tokenObjs = [];

		this.charObjs = [];
	},

	this.getBackground = function( _countryCode ) {

		if (_countryCode == "base") return this.baseBGPic;

		var _rec = db.ghLocation.findOne( { c: this.code, n: _countryCode } );

		if (!_rec) {

			showMessage("No location rec found for country " + _countryCode);

			return "";
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

			story.da = new story_defaultAgent( _rec );

			story.scene = "default"; 

			story.cue = storyDefault_cue( story.scene );

			story.play( story.scene );
		 
		 });	
	},

	this.playDefaultScene = function() {

		this.background = db.getCapitalPic( this.location );

		this.addDefaultAgent( this.location );

	},


//*********************************************************************************
//
//				NAVIGATION
//
//*********************************************************************************

	this.goBase = function() {

          this.unhiliteAllButtons();

          this.hiliteButton("Base");

          this.silenceAll();

          this.hidePrompt();

          story.mode.set("scene");

          this.go("base");

	},

	this.goMap = function() {

		  this.unhiliteAllButtons();

          this.hiliteButton('Map');

          this.hideAll();

          this.silenceAll();

          this.hidePrompt();

          browseMap.mode.set( "story" );

          this.playEffect( "storyMap.mp3")

          display.playLoop("mapLoop.mp3")

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

		//if we're testing, then get the chat from smed

        if (!_shortName) this.chat = smed.chatName;


		this.chatSource = db.ghChat.find( { s: this.chat } ).fetch();

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
//				DRAW THE SCREEN AND ELEMENTS
//
//*********************************************************************************

	this.draw = function() {

		var _width = 90.0 / parseFloat( this.inventoryButtons.length + 2 );  //plus two for the MAP and BASE buttons

		$(".storyButton").css("width", _width + "%");

		var _obj = getDimensions( this.baseButtonPic.get() );

		this.inv.dimensionButtonImage( this.storyButtonBaseElement, _obj );

		var _src = $( this.storyButtonMapElement ).attr("src");

		_obj = getDimensions( _src );

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

//*********************************************************************************
//
//				SOUND FUNCTIONS
//
//*********************************************************************************

	this.playStorySound = function( _file ) { this.playSound( _file ) };

	this.playStorySoundLoop = function( _file ) { this.playLoop( _file ) };

	this.stopStorySoundLoop = function( _file ) { this.stopLoop() };

	//The basic scheme for the 3 sound players is:

	//player (no number) = effect (sound in public folder) (interface sounds: inventory sound, button sounds, etc)

	//player2 = story sound AND effect2 (sound in public folder)  (scripted sound effects)

	//player3 = story loop AND story sound2  (bg loops + the occasional scripted sound that overlaps an already playing one)

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

//*********************************************************************************
//
//				EXERCISES 
//
//*********************************************************************************

	this.doExercise = function() {

		//just in case ...

		story.silenceAll();

		//need to decide the name by scene

		var _name = "whereIsContinent"

		this.em.start(_name)
	}

}

//end of Story object

story_defaultAgent = function( _rec ) {

	var _obj = {

		n: capitalizeAllWords( _rec.username ),
		sn: "da",         //default agent
		top: "47%",
		l: "47%",
		p: _rec.profile.av,
		t: "g",               //process this agent like a guest
		ID: story.name + "_" + getRandomString()
	}

	this.init( _obj, 0 );	//default agent is always index zero
}

story_defaultAgent.prototype = new Char();

Tracker.autorun( function(comp) {

  if ( Session.get("sStoryAgentReady")

      ) {

  	console.log("story agent data ready")

     if (typeof story == 'undefined') return;

  	story.finishSubscriptions( );
  } 

  console.log("story agent data not ready")

});  


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

     if (typeof story == 'undefined') return;

    story.initStoryProperties();

  	story.init();

  	story.isLoaded.set( true );

  	FlowRouter.go("/story");
  } 

  console.log("story data not ready")

});  