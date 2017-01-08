//story.js


$(document).ready(function(){
    $('.divStory').tooltip(); 
});


Story = {

//*********************************************************************************
//
//	BASIC FUNCTIONS CALLED BY STORY INSTANCES IN THEIR CORRESPONDING FUNCTIONS
//  ( this.init() in a story instance object calls this._init() , e.g.)
//
//*********************************************************************************

	_init : function( _name ) {

		this.name = _name;

		this.mode = new Blaze.ReactiveVar( "none" );

		this.charObjs = [];  //this array holds the chars for the current scene

		this.tokenObjs = [];  //this array holds the tokens for the current scene

		this.location = "";  //the country we're in or other locale like "base"

		this.scene = "";   //the name of the scene that is currently or about to play

		this.flags = {};   //the boolean flags that track the user's progress in the mission

 		this.storyButtonBGElements = ["#storyButtonMap", "#storyButtonBase"];

	this.inventoryButtons = [1,2,3];

		this.bgElement = "img.storyBG";

		this.buttonStripElement = "div.divStoryButtons";

		this.sceneButtonPic = new Blaze.ReactiveVar("");

		this.speed = 1.0;

		this.buttonStripHeightFactor = 0.135;

		this.inv = new Inventory();

 		this.storyButton = "Base";

	},

	_addInventoryItem : function( _name ) {

		if ( this[ _name ].movable == false) return;

		var _item = new InventoryItem( this[ _name ] );

		this.inv.add( _item );

		this[ _name ].fadeOut(250);

	},

	_removeInventoryItem : function( _name ) {

		this.inv.remove( _name );

		this[ _name ].fadeIn(250);		
	},

	_play : function( _name ) {

		this.scene = _name;

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


//*********************************************************************************
//
//				PLAYING SCENES
//
//*********************************************************************************

	finishPlay : function() {

		this.resetScene();

		$(this.bgElement).attr( "src", this.background );

		if ( $(this.bgElement).css("opacity") == 0) this.fadeInBG();

		Meteor.setTimeout( function() { story.playScene(); }, 1001);	

	},

	playScene : function() {

		this.cutScene = new CutScene( this.scene );

		this.cutScene.play( this.cue );		f
	},

	resetScene : function() {

		this.tokenObjs = [];

		this.charObjs = [];
	},


//*********************************************************************************
//
//				DEFAULT SCENE
//
//*********************************************************************************

	addDefaultAgent : function( _countryID ) {

		var _rec = hack.getWelcomeAgentFor( _countryID );

		if (!_rec) {

			showMessage( "No default agent found for country ID " + _countryID);

			return;
		}

		this.da = new story_defaultAgent( _rec );
	
	},

	playDefaultScene : function() {

		this.background = db.getCapitalPic( this.location );

		this.addDefaultAgent( this.location );

		this.scene = "default"; 

		this.cue = storyDefault_cue( this.scene );

		this._play( this.scene );

	},


//*********************************************************************************
//
//				NAVIGATION
//
//*********************************************************************************

	goBase : function() {

          this.unhiliteAllButtons();

          this.hiliteButton("Base");

          this.go("base");
	},

	goMap : function() {

		  this.unhiliteAllButtons();

          this.hiliteButton('Map');

          this.hideAll();

          this.silenceAll();

          this.hidePrompt();

          browseMap.mode.set( "story" );

          Meteor.setTimeout( function() { story.mode.set("map"); }, 250 );
	},

//*********************************************************************************
//
//				CHAT
//
//*********************************************************************************

	doChat : function( _sel, _shortName ) {

		var _name = this.name + "_chat_" + this.scene;


		//we evaluate this so that js will see the string _name as an object

		eval( "game.user.sms.startChat(" + _name + ")" );

        this.silenceAll();

        this.hidePrompt();

      	game.user.sms.createTarget( story[ _shortName ] );

      	game.user.sms.startThread();

      	this.mode.set("chat");

      	Meteor.setTimeout( function() { display.animateScrollToBottom(); }, 300 );

	},

//*********************************************************************************
//
//				DRAW THE SCREEN AND ELEMENTS
//
//*********************************************************************************

	draw : function() {

		this.hiliteButton( this.storyButton );
	},


	fadeInBG : function() {

		$(this.bgElement).velocity( "fadeIn", {duration: 1000} );
	},

	fadeOutBG : function() {

		$(this.bgElement).velocity( "fadeOut", {duration: 1000} );
	},

	fadeInChars : function() {

		for (var key in this.charObjs) {

		    this.charObjs[ key ].fadeIn();	    
		}
	},

	fadeInTokens : function() {

		for (var key in this.tokenObjs) {

		    this.tokenObjs[ key ].fadeIn();    
		}
	},

	fadeOutChars : function() {

		for (var key in this.charObjs) {

		    this.charObjs[ key ].fadeOut();	    
		}
	},

	fadeOutTokens : function() {

		for (var key in this.tokenObjs) {

		    this.tokenObjs[ key ].fadeOut();    
		}
	},

	fadeOutAll: function() {

		this.fadeOutChars();

		this.fadeOutTokens();
	},

	hideChars : function() {

		for (var key in this.charObjs) {

		    this.charObjs[ key ].hide();

		    this.charObjs[ key ].q();		    
		}
	},

	showChars : function() {

		for (var key in this.charObjs) {

		    this.charObjs[ key ].show();	    
		}
	},

	showTokens : function() {

		for (var key in this.tokenObjs) {

		    this.tokenObjs[ key ].show();    
		}
	},

	hideTokens : function() {

		for (var key in this.tokenObjs) {

		    this.tokenObjs[ key ].hide();    
		}
	},

	silenceChars : function() {

		for (var key in this.charObjs) {

		    this.charObjs[ key ].q();	    
		}
	},

	silenceTokens : function() {

		for (var key in this.tokenObjs) {

		    this.tokenObjs[ key ].q();    
		}
	},

	hideAll : function() {

		this.hideChars();

		this.hideTokens();
	},

	showAll : function() {

		this.showChars();

		this.showTokens();
	},

	silenceAll : function() {

		this.silenceChars();

		this.silenceTokens();
	},

	hidePrompt : function() {

		$("div#storyPromptText").addClass("invisible");	
	},

	showPrompt : function( _text) {

        $("div#storyPromptText").removeClass("invisible");
    
        $("div#storyPromptText").text( _text );
	},

	prompt : function( _text) {

		this.showPrompt( _text );
	},


//*********************************************************************************
//
//				INTERFACE FUNCTIONS
//
//*********************************************************************************

	hiliteButton : function( _name ) {

		var _sel = "img#storyButton" + _name + ".imgStoryButton.imgStoryButtonBG";

		$( _sel ).attr("src", Control.hilitedBackdrop());

		this.storyButton = _name;
		
	},

	unhiliteAllButtons : function( ) {

		for (var i = 0; i < story.storyButtonBGElements.length; i++) {

			var _sel = this.storyButtonBGElements[i];

			$( _sel ).attr("src", Control.featuredBackdrop());
		}
		
	},

}

//end of Story object

story_defaultAgent = function( _rec ) {

	var _obj = {

		name: _rec.username,
		shortName: "da",         //default agent
		pic: _rec.profile.av,
		ID: _rec._id,
		top: "47%",
		left: "47%",
		index: 0
	}

	this.init( _obj );	
}

story_defaultAgent.prototype = new Char();

