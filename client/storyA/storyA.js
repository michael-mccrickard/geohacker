

storyA = function() {

//*********************************************************************************
//
//				PROPERTIES
//
//*********************************************************************************

	this.init = function() {

		this.location = "base";  //base, FR, ML, NL

		this.sceneButtonPic.set("storyA_scene.jpg");
	}

//*********************************************************************************
//
//				DEFAULT SCENE 
//
//*********************************************************************************

	this.getDefaultChat = function() {

		if (!this.flags.knowsQuest) return "storyDefault_chat_preintro";

		if (!this.flags.visitedGuard) return "storyA_chat_missionToMona";

		return "storyA_chat_missionInfo";
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

				this.flags.gave_painting = true;

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

		this.location = _ID;


		if (_ID == "base") {

			this.background = "starryBG.jpg";

			if ( !this.flags.didExercise1 ) {

				this.play("intro");

				return;
			}

			if ( !this.flags.knowsQuest) {

				this.play("missionToMona");

				return;
			}

			if ( !this.flags.visitedGuard || !this.flags.visitedVanGogh ||  !this.flags.has_passcode ||  !this.flags.has_mona ||  !this.flags.gave_painting ) {

				this.play("missionInfo");

				return;
			}
		}

		if ( _ID == "FR") {

			this.background = "louvre.jpg";

			if ( !this.flags.visitedGuard ) {

					this.play("firstGuardVisit");

					return;		
			}

			if ( this.flags.has_passcode ) {

					this.play("secondGuardVisit");

					return;						
			}
		}

		if ( _ID == "NL") {

			this.background = "vanGoghHouse.jpg";

			if ( !this.flags.visitedGuard ) {

				this.playDefaultScene( );

				return;	
			}

			if ( !this.flags.has_passcode) {

				this.play("vanGogh");

				return;
			}
		}

		if ( _ID == "ML") {

			this.background = "timbuktu_1.jpg";

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

