

storyA = function() {

//*********************************************************************************
//
//				INITIALIZE
//
//*********************************************************************************

	this.init = function() {

		this.location = "base";  //base, FR, ML, NL

		this.baseSound = "storyABase.mp3";

		this.inventorySize = 3;  //move to db?  if we do, we can move the next command to story.finishSubscriptions()

		this.inv = new Inventory();
	}

//*********************************************************************************
//
//				CHATS 
//
//*********************************************************************************

	this.checkForChat = function() {

		if (this.flags.gave_mona && !this.flags.didExercise4) {

			this.doExercise();

			return false;
		}
		else {
			return true;
		}
	}


	this.getChat = function( _shortName ) {

//return "test";

		//we can return a specific chat name here based on the scene,
		//the flags, etc.

		if (!this.flags.knowsQuest) {

			if (this.location == "base")  return "storyDefault_chat_cantTalkNow";

			return "storyDefault_chat_reportToBase";
		}

		if ( this.scene == "default") {

			if (!this.flags.awareOfPasscode) return "missionToMona";

			return "missionInfo";
		}

		if ( this.scene == "firstGuardVisit2") {

			return "whereIsVanGogh";
		}


		if (this.scene == "nelsonGetsPainting") {

			if (_shortName == "shadow") return this.scene;

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

			if (this.scene == "vanGogh") story.van.q();
		}

		if (_name == "mona") {

			if (this.flags.gave_mona) {

				this.doExercise();

				return;
			}


			this.flags.has_mona = true;

			if (this.scene == "guardGetsPasscode") {

				Meteor.setTimeout( function() { story.guard.q(); }, 500 );

				Meteor.setTimeout( function() { story.passcode.fadeOut(); }, 1500 );

			}
		}

		this._addInventoryItem( _name );
	}

	this.removeInventoryItem = function( _name) {

		if (this.mode.get() == "exercise") {
			
			this.playEffect( this.locked_sound_file );

			return;
		}

		var _obj = {};

		this._removeInventoryItem( _name );

		if (_name == "passcode") {

			if (this.scene == "secondGuardVisit") {

				this.flags.gave_passcode = true;

				this.play( "guardGetsPasscode");

				return;
			}

			this.refuseItem( _name );
		}

		if (_name == "mona") {

			if (this.scene == "nelsonGetsPainting") {

				this.flags.gave_mona = true;

				this.play("finalChallenge");

				return;
			}

			this.refuseItem( _name );
		}
		
	}	

//*********************************************************************************
//
//				NAVIGATION 
//
//*********************************************************************************

	this.playBGLoop = function( _ID) {

		if (_ID == "base")  this.playLoop( this.baseSound );
		if (_ID == "FR") 	this.playLoop("paris_loop2.mp3")
		if (_ID == "ML") 	this.playLoop("maliLoop2.mp3")
		if (_ID == "NL") 	this.playLoop("netherlands_loop2.mp3")
	}

	this.go = function( _ID ) {

		var _mode = this.mode.get();

		if (story.handleNavigationInParent( _mode) ) return;

		this.location = _ID;

		//this will fail in the case of "non-story countries",
		//but those cases are always default scenes, and playDefaultScene uses
		//db.getCapitalPic() to set the background

		this.background = this.getBackground( _ID );
	

		if (_ID == "base") {

			if ( !this.flags.didExercise1 ) {

				this.play("intro");

				return;
			}

			if (!this.flags.knowsQuest) {

				this.play("missionToMona");

				return;
			}

			//otherwise, we just answer questions

			this.play("missionInfo");

			return;

		}

		if ( _ID == "FR") {

			if ( !this.flags.awareOfPasscode) {

					this.play("firstGuardVisit");

					return;		
			}

			if (this.flags.didExercise2 && !this.flags.has_passcode) {

					this.play("firstGuardVisit2");

					return;		
			}			

			if ( this.flags.has_passcode && !this.flags.has_mona && !this.flags.gave_passcode ) {

					this.play("secondGuardVisit");

					return;						
			}

			if ( this.flags.gave_passcode && !this.flags.has_mona ) {

					this.play("guardGetsPasscode");

					return;						
			}

			this.playDefaultScene("FR");

			return;
		}

		if ( _ID == "NL") {

			if ( !this.flags.awareOfPasscode ) {

				this.playDefaultScene("NL");

				return;	
			}

			if (!this.flags.didExercise3) {

				this.play("vanGogh");

				return;
			}

			if (!this.flags.has_passcode) {

				this.play("userGetsPasscode");

				return;
			}	

			this.playDefaultScene("NL");

			return;		
		}

		if ( _ID == "ML") {

			if (!this.flags.has_mona) {

				this.playDefaultScene("ML");

				return;
			}

			this.brightness(10);

			this.brightness(20, this.shadow.imageElement);

			//in case user skipped out after giving the painting

			if ( this.flags.gave_mona  && !this.flags.didExercise4) {

				this.play("finalChallenge");		

				return;		
			}

			if ( this.flags.has_mona  && !this.flags.didExercise4) {

				this.play("nelsonGetsPainting");

				return;
			}

			if ( this.flags.didExercise4 ) {

				this.play("nelsonAndMark");

				return;
			}

		}


		this.playDefaultScene( );

	}

	this.getCityName = function(_scene) {

		if (this.location == "NL") return "Zundert";

		if (this.location == "ML") return "Timbuktu";

		//if (_scene == "vanGogh" || _scene == "userGetsPasscode" ) return "Zundert";

		//if (_scene == "nelsonAndMark" || _scene == "nelsonGetsPainting" ||  _scene == "finalChallenge") return "Timbuktu";

		return null;
	}

//*********************************************************************************
//
//				EXERCISES 
//
//*********************************************************************************

	this.doExercise = function() {

		//hide city name, silence all, etc.

		this._doExercise();

		//the em.build() switches us to the exercise template
		//and then the Template.rendered event starts the exercise

		if (this.scene == "intro") {

			this.em.build( "whereIsContinent");
		}

		if (this.scene == "firstGuardVisit") {

			this.em.build();

			this.em.add([

				{ ID: "inWhichContinent", aCode: "europe", qCode: "FR" },
				{ ID: "inWhichContinent", aCode: "africa", qCode: "ML" }

			]);
		}

		if (this.scene == "vanGogh") {

			this.em.build();

			this.em.add([

				{ ID: "inWhichRegion", aCode: "weu", qCode: "FR" },
				{ ID: "inWhichRegion", aCode: "weu", qCode: "NL" },
				{ ID: "inWhichRegion", aCode: "nwaf", qCode: "ML" }

			]);
		}

		if (this.scene == "finalChallenge") {

			this.em.build();

			this.em.add([

				{ ID: "whereIsCountry", aCode: "europe", qCode: "FR" },
				{ ID: "whereIsCountry", aCode: "europe", qCode: "NL" },
				{ ID: "whereIsCountry", aCode: "africa", qCode: "ML" }

			]);
		}
	}

	this.doneWithExercise = function() {

		if (this.scene == "intro") this.flags.didExercise1 = true;

		if (this.scene == "firstGuardVisit") this.flags.didExercise2 = true;

		if (this.scene == "vanGogh") this.flags.didExercise3 = true;

		if (this.scene == "finalChallenge") this.flags.didExercise4 = true;

		this.go( this.location );
	}

}


storyA.prototype = new Story();

