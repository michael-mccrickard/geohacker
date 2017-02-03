

storyA = function() {

//*********************************************************************************
//
//				PROPERTIES
//
//*********************************************************************************

	this.init = function() {

		this.location = "base";  //base, FR, ML, NL

		this.baseButtonPic.set("storyA_scene.jpg");  //move to the db, under ghStory

		this.baseBGPic = "starryBG.jpg";  //move to the db, under ghStory
	}

//*********************************************************************************
//
//				CHATS 
//
//*********************************************************************************


	this.getChat = function() {

		//we can return a specific chat name here based on the scene,
		//the flags, etc.

		if (!this.flags.knowsQuest) return "intro";

		if ( this.scene == "default") {

			if (!this.flags.visitedGuard) return "missionToMona";

			return "missionInfo";
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

			this.background = this.baseBGPic;

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

