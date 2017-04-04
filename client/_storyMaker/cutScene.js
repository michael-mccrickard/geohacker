CutScene = function( _name ) {
	
	this.name = _name;

	this.index = -1;

	this.c = "";

	this.running = false;

	this.play = function( _cue) {
 		
 		this.running = true;

		this.cue = _cue;

		this.playNext();
	}

	this.stop = function() {

		this.running = false;
	}

	this.playNext = function() {

		if (ved) ved.updateScreen();

		if (this.running == false) return;

		this.index++;

		if (this.index == this.cue.length) return;

		this.c = this.cue[ this.index ];

//c(this.c)

		if (this.c == "wait") {

			story.showPrompt("Click anywhere to continue.")

			return;
		}


		if (this.c == "exit") {

			return;
		}

		if ( this.c.substr(0,5) == "delay") {

			this.val = parseInt( this.c.substr(6) );

			Meteor.setTimeout( function() { story.cutScene.playNext(); }, this.val * story.speed );

			return;
		}

		if ( this.c.substr( 0, 10) == "playEffect") {

			this.c = "display." + this.c;

			this.playNow();

			return;
		}

		if ( this.c.substr( 0, 9) == "stopMusic" ) {

			this.c = "game." + this.c;

			this.playNow();

			return;
		}

		if ( this.c.substr( 0, 6) != "story." && this.c.substr( 0, 8) != "display.") this.c = "story." + this.c;

		this.playNow();


	}

	this.playNow = function( _c ) {

		if (this.running == false) return;

		if (!_c) _c = this.c;

c( _c );

		eval( _c );

		this.playNext();		
	}


}


