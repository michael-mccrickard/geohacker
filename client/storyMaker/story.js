//story.js


$(document).ready(function(){
    $('.divStory').tooltip(); 
});


Story = {

	_init : function() {

		this.mode = new Blaze.ReactiveVar( "none" );

		this.bgElement = "img.storyBG";

		this.speed = 1.0;

	},

	start : function() {

		//default response

		this.play( this.scene );
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

	showPrompt : function( _text) {

        $("div#storyPromptText").removeClass("invisible");
    
        $("div#storyPromptText").text( _text );
	},

	hidePrompt : function() {

		$("div#storyPromptText").addClass("invisible");	
	}


}


