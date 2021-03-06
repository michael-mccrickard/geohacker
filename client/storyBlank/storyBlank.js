//After changing the name of this function, change the last line in the file (prototype)

storyBlank = function() {

//*********************************************************************************
//
//				INITIALIZE
//
//*********************************************************************************

	this.init = function() {

		this.location = "base";  

		this.baseSound = "storyABase.mp3";

		this.inventorySize = 3;  //move to db?  if we do, we can move the next command to story.finishSubscriptions()

		this.inv = new Inventory();
	}

//*********************************************************************************
//
//				CHATS 
// 
//*********************************************************************************
	
	//When a char is clicked on, we call this to see if we should actually chat now

	//Most of the time we do (return true)

	//But based on the story flags, location, etc. we might want to trigger an exercise or something


	this.checkForChat = function() {


		return true;

	}


	this.getChat = function( _shortName ) {

		//we can return a specific chat name here based on the scene,
		//the flags, etc.

		//if (!this.flags.flagName) return "chatName";

		//If we have have reached this point, we assume the chat name is the same
		//as the scene name

		return this.scene;
	}

//*********************************************************************************
//
//				INVENTORY 
//
//*********************************************************************************

	//	this._addInventoryItem( _name ) actually hides the token in the scene and then
	//  shows it in the inventory.

	this.addInventoryItem = function( _name) {


//In most cases, we want to hide the prompt that is on the screen after adding the inv item
//However, if we want to show a new prompt after adding the item (say, it's the end of the scene 
// and we want to tell the user what to do next) then we trap that particular case, do the this._addInventoryItem() call and return

/*
		if (_name == "itemName2") {
	
			this._addInventoryItem(_name);

			showPrompt("Use the map to travel to Iceland")

			return;
		}

*/

		this._addInventoryItem( _name );

		this.hidePrompt();
	}

	//this._removeInventoryItem( _name ) hides the inv item in the inventory and then
	//shows it in the play area

	this.removeInventoryItem = function( _name) {

		if (this.mode.get() == "exercise") {

			this.playEffect( this.locked_sound_file );

			return;
		}

		var _obj = {};

		this._removeInventoryItem( _name );

		//removing an item (same as giving it to someone or placing it in the scene)
		//typically triggers another scene

		//we typically need to refuse the item also, if the conditions aren't right

/*
		if (_name == "itemName1") {

			if (this.scene == "sceneName1") {

				this.flags.flagName1 = true;

				this.play( "sceneName2");

				return;
			}

			this.refuseItem( _name );
		}

		if (_name == "itemName2") {

			if (this.scene == "sceneName3") {

				this.flags.flagName2 = true;

				this.play("sceneName4");

				return;
			}

			this.refuseItem( _name );
		}
*/

	}	

//*********************************************************************************
//
//				NAVIGATION 
//
//*********************************************************************************

	this.playBGLoop = function( _ID) {

		if (_ID == "base")  this.playLoop( this.baseSound );

		//if (_ID == countryCode) 	this.playLoop("specificLocationLoop.mp3")

	}

	//When we go to location _ID, which scene should we play?

	this.go = function( _ID ) {

		var _mode = this.mode.get();

		if (story.handleNavigationInParent( _mode) ) return;

		this.location = _ID;

		//this will fail in the case of "non-story countries",
		//but those cases are always default scenes, and playDefaultScene uses
		//db.getCapitalPic() to set the background

		this.background = this.getBackground( _ID );
	

/*
		if (_ID == "base") {

			if (this.flags.flagName1 ) {

				this.play( sceneName1 );

				return;
			}

			if (!this.flags.flagName2) {

				this.play( sceneName2);

				return;
			}

			this.play( commonScene );  //probably info about the mission

		}

		if ( _ID == countryCode) {

			if ( !this.flags.flagName3) {

					this.play( sceneName3 );

					return;		
			}

		}
*/

		this.playDefaultScene( );

	}

	//typically, the location name displayed on the screen when you go to a country is the name of the capital
	//but not necessarily ...

	this.getCityName = function(_scene) {

		//if (_scene == "sceneName1" || _scene == "sceneName2" ) return "specific city name";

		if (this.locaton == "base") return "Geosquad HQ";

		return null;  //just use the capital name
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

//leaving the actual code from storyA here b/c the syntax, etc. is not easy to remember

/*

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
*/

	}

	this.doneWithExercise = function() {

		//if (this.scene == "sceneName1") this.flags.flagName1 = true;

		this.go( this.location );
	}

}


storyBlank.prototype = new Story();

