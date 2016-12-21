//story.js


$(document).ready(function(){
    $('.divStory').tooltip(); 
});


Story = {

	_init : function() {

		this.mode = new Blaze.ReactiveVar( "none" );

		this.bgElement = "img.storyBG";

		this.buttonStripElement = "div.divStoryButtons";

		this.speed = 1.0;

		this.buttonStripHeightFactor = 0.135;

	},

	start : function() {

		//default response

		this.play( this.scene );
	},

	_chat : function( _sel, _shortName ) {

        story.silenceAll();

      	game.user.sms.createTarget( story[ _shortName ] );

      	game.user.sms.startThread();

      	story.mode.set("chat");

      	Meteor.setTimeout( function() { display.animateScrollToBottom(); }, 300 );

	},

	draw : function() {

		this.hiliteButton(1);
	},

	_play : function( _name ) {

		this.scene = _name;

		this.mode.set( "scene" );

		$(this.bgElement).attr( "src", this.background );	

		this.cutScene = new CutScene( _name );

		this.cutScene.play( this.cue );		
	},

	fadeInBG : function() {

		$(this.bgElement).velocity( "fadeIn", {duration: 1000} );
	},

	fadeOutBG : function() {

		$(this.bgElement).velocity( "fadeOut", {duration: 1000} );
	},

	fadeInChars : function() {

		for (var i = 0; i < this.charObjs.length; i++) {

			this.charObjs[i].fadeIn();
		}
	},

	fadeInTokens : function() {

		for (var i = 0; i < this.tokenObjs.length; i++) {

			this.tokenObjs[i].fadeIn();
		}
	},

	fadeOutChars : function() {

		for (var i = 0; i < this.charObjs.length; i++) {

			this.charObjs[i].fadeOut();
		}
	},

	fadeOutTokens : function() {

		for (var i = 0; i < this.tokenObjs.length; i++) {

			this.tokenObjs[i].fadeOut();
		}
	},

	fadeOutAll: function() {

		this.fadeOutChars();

		this.fadeOutTokens();
	},

	hideChars : function() {

		for (var i = 0; i < this.charObjs.length; i++) {

			this.charObjs[i].hide();
		}
	},

	showChars : function() {

		for (var i = 0; i < this.charObjs.length; i++) {

			this.charObjs[i].show();
		}
	},

	showTokens : function() {

		for (var i = 0; i < this.tokenObjs.length; i++) {

			this.tokenObjs[i].show();
		}
	},

	hideTokens : function() {

		for (var i = 0; i < this.tokenObjs.length; i++) {

			this.tokenObjs[i].hide();
		}
	},

	silenceChars : function() {

		for (var i = 0; i < this.charObjs.length; i++) {

			this.charObjs[i].q();
		}
	},

	silenceTokens : function() {

		for (var i = 0; i < this.tokenObjs.length; i++) {

			this.tokenObjs[i].q();
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

		for (var i = 0; i < story.buttons.length; i++) {

			var _sel = "img#storyButton" + i + ".imgStoryButton.imgStoryButtonBG";

			$( _sel ).attr("src", Control.featuredBackdrop());
		}
		
	},

}


