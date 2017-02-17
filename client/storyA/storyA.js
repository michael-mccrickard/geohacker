

storyA = function() {

//*********************************************************************************
//
//				PROPERTIES
//
//*********************************************************************************

	this.init = function() {

		this.location = "base";  //base, FR, ML, NL
	}

//*********************************************************************************
//
//				CHATS 
//
//*********************************************************************************


	this.getChat = function( _shortName ) {

//return "test";

		//we can return a specific chat name here based on the scene,
		//the flags, etc.

		if (!this.flags.knowsQuest) return "intro";

		if ( this.scene == "default") {

			if (!this.flags.awareOfPasscode) return "missionToMona";

			return "missionInfo";
		}

		if (this.scene == "nelsonGetsPainting") {

			if (_shortName == "nelson") return this.scene;

			return "intro";
		}

		//If we have have reached this point, we assume the chat name is the same
		//as the scene name

		return this.scene;
	}

//*********************************************************************************
//
//				INVENTORY 
//
//*********************************************************************************

	this.addInventoryItem = function( _name) {

		if (_name == "passcode") {

			this.flags.has_passcode = true;
		}

		if (_name == "mona") {

			this.flags.has_mona = true;
		}

		this._addInventoryItem( _name );
	}

	this.removeInventoryItem = function( _name) {

		var _obj = {};

		this._removeInventoryItem( _name );

		if (_name == "passcode") {

			if (this.scene == "secondGuardVisit") {

				this.flags.gave_passcode = true;

				this.play( "guardGetsPasscode");

				return;
			}
		}

		if (_name == "mona") {

			if (this.scene == "nelsonGetsPainting") {

				this.flags.gave_mona = true;

				this.play("nelsonAndMark");

				return;
			}
		}
		
	}	

//*********************************************************************************
//
//				NAVIGATION 
//
//*********************************************************************************

	this.go = function( _ID ) {

		var _mode = this.mode.get();

		if (_mode == "chat" || _mode == "map") return;
		

		this.location = _ID;

		this.background = this.getBackground( _ID );

this.play("testScene");

return;

		if (_ID == "base") {

			if ( !this.flags.didExercise1 ) {

				this.play("intro");

				return;
			}

			if ( !this.flags.knowsQuest) {

				this.play("missionToMona");

				return;
			}

			if (  !this.flags.gave_mona ) {

				this.play("missionInfo");

				return;
			}
		}

		if ( _ID == "FR") {

			if ( !this.flags.awareOfPasscode || !this.flags.awareOfVanGogh  ) {

					this.play("firstGuardVisit");

					return;		
			}

			if ( this.flags.has_passcode && !this.flags.has_mona ) {

					this.play("secondGuardVisit");

					return;						
			}
		}

		if ( _ID == "NL") {

			if ( !this.flags.awareOfPasscode ) {

				this.playDefaultScene( );

				return;	
			}

			if ( !this.flags.has_passcode) {

				this.play("vanGogh");

				return;
			}
		}

		if ( _ID == "ML") {

			if ( this.flags.has_mona ) {

				this.play("nelsonGetsPainting");

				return;
			}
		}

		this.playDefaultScene( );

	}

//*********************************************************************************
//
//				EXERCISES 
//
//*********************************************************************************

	this.doExercise = function(_val) {

		this.mode.set( "exercise" );
	}

}


storyA.prototype = new Story();

