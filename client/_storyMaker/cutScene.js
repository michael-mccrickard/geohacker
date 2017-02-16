CutScene = function( _name ) {
	
	this.name = _name;

	this.index = -1;

	this.c = "";

	this.play = function( _cue) {
 
		this.cue = _cue;

		this.playNext();
	}

	this.playNext = function() {

		if (ved) ved.updateScreen();

		this.index++;

		if (this.index == this.cue.length) return;

		this.c = this.cue[ this.index ];

		if (this.c == "wait") {

			story.showPrompt("Click anywhere to continue.")

			return;
		}

		if ( this.c.substr(0,5) == "delay") {

			this.val = parseInt( this.c.substr(6) );

			Meteor.setTimeout( function() { story.cutScene.playNext(); }, this.val * story.speed );
		}
		else {

			eval( this.c );

			this.playNext();
		}
	}


}


