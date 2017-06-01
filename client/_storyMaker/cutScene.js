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

		//Prepend the story object to any command that does not have the display object already prepended

		this.c = this.fixParentObject( this.c );

		var _subj = this.getSubject( this.c );


		if ( this.checkForSay( this.c ) ) {

			if ( this.checkForSameSay( _subj, -2) ) {

				var _s = "story." + _subj + ".q()";

				Meteor.setTimeout( function() { 

					story.cutScene.playNow(); 

				}, 500);

				return;
			}
		}


		this.playNow();

	}

	this.fixParentObject = function( _s ) {

		//Prepend the story object to any command that does not have the display object already prepended

		if ( _s.substr( 0, 6) != "story." && _s.substr( 0, 8) != "display." ) return ( "story." + _s);

		return _s;		
	}

	this.checkForSameSay = function( _subj, _offset) {

		if (this.index < 2 ) return false;

		var _s = this.fixParentObject( this.cue[ this.index + _offset ]  );

		//c("string examined in checkForSameSay is " + _s );

		if ( this.checkForSay( _s ) ) {

			var _subj2 = this.getSubject( _s  );

			if ( _subj == _subj2) {

				c("checkForSameSay returning true")	

				return true;				
			}
			
		}

		//c("checkForSameSay returning false")

		return false;
	}

	//this one is a little tricky b/c we have say, sayLeft and sayRight

	this.checkForSay = function( _s ) {

		//c("_s in checkForSay is " + _s)

		var _verb = this.getVerb( _s);

		//c("verb returned to checkForSay is " + _verb)

		if ( _verb == "say" || _verb == "sayRight" || _verb == "_sayLeft") {

			return true;
		}

		return false;
	}

	this.getSubject = function( _s ) {

		if (_s.length < 6) return _s;

		if ( _s.substr(0, 6) == "story." ) {

			var _arr = _s.split(".");

			return _arr[1];
		}

		return _s; 	
	}

	this.getVerb = function( _s ) {

		if (_s.length < 6) return _s;

		var _indexForParen = _s.indexOf("(");

		//lop off the object b/c it may have a "." in it

		if (_indexForParen != -1) {

			_s = _s.substr(0, _indexForParen);
		}		

		var _arr = _s.split(".");

		if ( _arr.length == 2) return _arr[1];

		var _s2 = _arr[2];

		var _index = _s2.indexOf("(");

		if (_index != -1) {

			return _s2.substr(0, _index);
		}

		return _s2;

	}

	this.playNow = function( _c ) {

		if (this.running == false) return;

		if (!_c) _c = this.c;

c( _c );

		eval( _c );

		this.playNext();		
	}


}


