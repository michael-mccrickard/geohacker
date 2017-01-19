

storyA = function() {

//*********************************************************************************
//
//				PROPERTIES
//
//*********************************************************************************

	this.init = function() {

		this.location = "base";  //base, FR, ML, NL



//hasQuest is the one mandatory flag
/*
		this.flags["didExercise1"] = false;

		this.flags["hasQuest"] = false;	

		this.flags["hasVisitedGuard"] = false;

		this.flags["hasVisitedVanGogh"] = false;

		this.flags["hasPasscode"] = false;

		this.flags["hasGivenPasscode"] = false;

		this.flags["hasPainting"] = false;

		this.flags["hasGivenPainting"] = false;
*/

		this.sceneButtonPic.set("storyA_scene.jpg");
	}

//*********************************************************************************
//
//				DEFAULT SCENE 
//
//*********************************************************************************

	this.getDefaultChat = function() {

		if (!this.flags.hasQuest) return "storyDefault_chat_preintro";

		if (!this.flags.hasVisitedGuard) return "storyA_chat_missionToMona";

		return "storyA_chat_missionInfo";
	}

//*********************************************************************************
//
//				INVENTORY 
//
//*********************************************************************************

	this.addInventoryItem = function( _name) {

		if (_name == "passcode") {

			this.flags.hasPasscode = true;
		}

		if (_name == "mona") {

			this.flags.hasPainting = true;
		}

		this._addInventoryItem( _name );
	}

	this.removeInventoryItem = function( _name) {

		this._removeInventoryItem( _name );

		if (_name == "passcode") {

			if (this.scene == "secondGuardVisit") {

				this.flags.hasGivenPasscode = true;

				this.play( "guardGetsPasscode");

				return;
			}
		}

		if (_name == "mona") {

			if (this.scene == "nelsonGetsPainting") {

				this.flags.hasGivenPainting = true;

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

			if ( !this.flags.hasQuest) {

				this.play("missionToMona");

				return;
			}

			if ( !this.flags.hasVisitedGuard || !this.flags.hasVisitedVanGogh ||  !this.flags.hasPasscode ||  !this.flags.hasPainting ||  !this.flags.hasGivenPainting ) {

				this.play("missionInfo");

				return;
			}
		}

		if ( _ID == "FR") {

			this.background = "louvre.jpg";

			if ( !this.flags.hasVisitedGuard ) {

					this.play("firstGuardVisit");

					return;		
			}

			if ( this.flags.hasPasscode ) {

					this.play("secondGuardVisit");

					return;						
			}
		}

		if ( _ID == "NL") {

			this.background = "vanGoghHouse.jpg";

			if ( !this.flags.hasVisitedGuard ) {

				this.playDefaultScene( );

				return;	
			}

			if ( !this.flags.hasPasscode) {

				this.play("vanGogh");

				return;
			}
		}

		if ( _ID == "ML") {

			this.background = "timbuktu_1.jpg";

			if ( this.flags.hasPainting ) {

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

