

storyB = function() {

//*********************************************************************************
//
//				INITIALIZE
//
//*********************************************************************************

	this.init = function() {

		this.location = "base";  

		this.baseSound = "storyABase.mp3";

		this.inventorySize = 4;  //move to db?  if we do, we can move the next command to story.finishSubscriptions()

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

		if (!this.scene == "startMission") return "misionInfo";

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


		if (_name == "letter") {

			this.flags.gotLetter = true;

			this.play("missionToPsy");
		}
/*
		if (_name == "itemName2") {

			if (this.flags.flagName2) {

				this.doExercise();

				return;
			}

			if (this.scene == "sceneName") {

				//do something special

			}
		}

*/

		this._addInventoryItem( _name );
	}

	//this._removeInventoryItem( _name ) hides the inv item in the inventory and then
	//shows it in the play area

	this.removeInventoryItem = function( _name) {

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
	
		if (_ID == "base") {

			this.play("intro");


			if (this.flags.gotLetter && !this.flags.didExercise1) {

				this.play( "missionToPsy" );

				return;
			}

			if (this.flags.didExercise1) { 

				this.play( "startMission");

				return;
			}

			this.play( commonScene );  //probably info about the mission

		}
/*
		if ( _ID == countryCode) {

			if ( !this.flags.flagName3) {

					this.play( sceneName3 );

					return;		
			}

		}
*/

		this.playDefaultScene( _ID);

	}

	//typically, the location name displayed on the screen when you go to a country is the name of the capital
	//but not necessarily ...

	this.getCityName = function(_location) {

		if (_location == "ID") return "Bali";

		if (_location == "US") return "Cleveland";

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

		if (this.scene == "missionToPsy") {

			var _arr = [];

			var _obj1 = {};

			var _obj2 = {};

			_obj1.c = 'africa';

			_arr.push( _obj1 );

			_obj2.c = 'asia';

			_arr.push( _obj2 );

console.log( _arr );

			this.em.build( "whereIsContinent", _arr);
		}

/*		if (this.scene == "firstGuardVisit") {

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

		if (this.scene == "missionToPsy") this.flags.didExercise1 = true;

		this.go( this.location );
	}

}


storyB.prototype = new Story();

