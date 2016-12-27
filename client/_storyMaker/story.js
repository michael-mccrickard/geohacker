//story.js


$(document).ready(function(){
    $('.divStory').tooltip(); 
});


Story = {

	_init : function( _name ) {

		this.name = _name;

		this.mode = new Blaze.ReactiveVar( "none" );

		this.bgElement = "img.storyBG";

		this.buttonStripElement = "div.divStoryButtons";

		this.speed = 1.0;

		this.buttonStripHeightFactor = 0.135;

		this.inv = new Inventory();

	},

	_addInventoryItem : function( _name ) {

c("adding item " + _name + " to inv in story.js")

		if ( this[ _name ].movable == false) return;

		var _item = new InventoryItem( this[ _name ] );

		this.inv.add( _item );

		this[ _name ].fadeOut(250);

	},

	_removeInventoryItem : function( _name ) {

c("removing item " + _name + " from inv in story.js")

		this.inv.remove( _name );

		this[ _name ].fadeIn(250);		
	},

	_chat : function( _sel, _shortName ) {

        this.silenceAll();

        this.hidePrompt();

      	game.user.sms.createTarget( story[ _shortName ] );

      	game.user.sms.startThread();

      	this.mode.set("chat");

      	Meteor.setTimeout( function() { display.animateScrollToBottom(); }, 300 );

	},



	draw : function() {

//need to store which button is hilited (2 will be the default hilited button)

		//this.hiliteButton(2);
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

	finishPlay : function() {

		this.resetScene();

		$(this.bgElement).attr( "src", this.background );

		if ( $(this.bgElement).css("opacity") == 0) this.fadeInBG();

		Meteor.setTimeout( function() { story.playScene(); }, 1001);	

	},

	playScene : function() {

		this.cutScene = new CutScene( this.scene );

		this.cutScene.play( this.cue );		
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


	resetScene : function() {

		this.tokenObjs = [];

		this.charObjs = [];
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

	hiliteButton : function( _val ) {

		var _sel = "img#storyButton" + _val + ".imgStoryButton.imgStoryButtonBG";

		$( _sel ).attr("src", Control.hilitedBackdrop());
		
	},

	unhiliteAllButtons : function( ) {

		for (var i = 0; i < story.storyButtons.length; i++) {

			var _sel = "img#storyButton" + i + ".imgStoryButton.imgStoryButtonBG";

			$( _sel ).attr("src", Control.featuredBackdrop());
		}
		
	},

}


