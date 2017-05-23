

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

		this.lakeVictoriaID = 479;

		this.lakeTanganyikaID = 478;

		this.lakeMalawiID = 477;
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

		if (!this.flags.has_letter && !this.flags.gave_letter) {

			if (this.location == "base")  return "storyDefault_chat_cantTalkNow";

			return "storyDefault_chat_reportToBase";
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

	//	this._addInventoryItem( _name ) actually hides the token in the scene and then
	//  shows it in the inventory.

	this.addInventoryItem = function( _name) {

		if (_name == "letter") {

			this.play("missionToMalawi");  
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

		if (this.mode.get() == "exercise") {

			this.playEffect( this.locked_sound_file );

			return;
		}

		//letter -- lock out any attempt to remove this if we are not at the correct Psy scene


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

		if (_ID == "IS") this.playLoop("iceland_ambience.mp3")

		if (_ID == "KR") this.playLoop("korea_ambience.mp3")

		if (_ID == "US") this.playLoop("cleveland_ambience.mp3")

		if (_ID == "MW") this.playLoop("malawi_ambience.mp3")

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

			if (!this.flags.has_letter  && !this.flags.gave_letter) {

				this.play("intro");

				return;
			}


			if (this.flags.has_letter && !this.flags.didExercise1) {

				this.play( "missionToMalawi" );

				return;
			}

			if (this.flags.didExercise1 && !this.flags.didExercise2) {

				this.play( "startMissionToMalawi" );

				return;
			}

			//this.play( commonScene );  //probably info about the mission

		}

		if ( _ID == "MW") {

			if ( this.flags.didExercise1 && !this.flags.didExercise2) {

					this.play( "visitChef1" );

					return;		
			}

			if ( this.flags.didExercise2 && !this.flags.knowsLangspil) {

					this.play( "missionToIceland" );

					return;		
			}
		}

		if ( _ID == "IS") {

			if ( this.flags.knowsLangspil && !this.flags.knowsBook) {

					this.play( "visitBjork1" );

					return;		
			}

			if ( this.flags.didExercise3 && !this.flags.knowsBook) {

					this.play( "missionToBali" );

					return;		
			}
		}


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

		if (this.scene == "missionToMalawi") {

			this.em.build();

			this.em.add([

				{ ID: "inWhichContinent", aCode: "asia", qCode: "KR" },
				{ ID: "inWhichContinent", aCode: "asia", qCode: "KP" },
				{ ID: "inWhichContinent", aCode: "africa", qCode: "MW" }

			]);
		}

		if (this.scene == "visitChef1") {

			this.em.build();

			this.em.add([

				{ ID: "inWhichRegion", aCode: "saf", qCode: "MW" },
				{ ID: "inWhichRegion", aCode: "eas", qCode: "KR" },
				{ ID: "inWhichRegion", aCode: "eas", qCode: "KP" }

			]);
		}

		if (this.scene == "visitBjork1") {

			story.mem.init( "bjork" );  //pass the shortName of the char "hosting" the exercise

			this.mem.build();

			this.mem.add([

				{ qText: "Click the largest lake in Africa.", aCode: this.lakeVictoriaID, aText: "Exactly. Lake Victoria is the largest lake on the continent." },

				{ qText: "Click Lake Malawi.", aCode: this.lakeMalawiID, aText: "That's it. Lake Malawi is the third largest lake in Africa." },

			]);
		}

	}

	this.doneWithExercise = function() {

		if (this.scene == "missionToMalawi") this.flags.didExercise1 = true;

		if (this.scene == "visitChef1") this.flags.didExercise2 = true;

		this.go( this.location );
	}

//*********************************************************************************
//
//				MAPBOX 
//
//********************************************************************************* 

	this.mapboxReady = function() {

		if (this.mode.get() == "exercise") {

			this.doMapboxForExercise( "visitBjork1"); 
		}

	}

	this.doMapboxForExercise = function( _scene) {

		if (_scene == "visitBjork1") {

			var _arr = [33.164, -1.232];

			story.mapbox.addLabel("vic_label", _arr, "Lake Victoria"); 

			_arr = [28.5, -6.186];

			story.mapbox.addLabel("tan_label", _arr, "Lake Tanganyika"); 

			_arr = [34.450, -12.117];

			story.mapbox.addLabel("mal_label", _arr, "Lake Malawi"); 

			story.mapbox.fillCountries( ["neaf","saf","caf","nwaf"] );

			story.mapbox.map.flyTo( {center: [32.99, -9.614], zoom: 4.42, speed: 0.2} );

			story.mapbox.setLayerClickHandler( "lakes", function(e) {

			var _obj = e.features[0];

				story.mem.char.q();

				if ( _obj.id == story.lakeVictoriaID ) {

					story.mapbox.showLabel( "l_vic_label");
				}

				if ( _obj.id == story.lakeTanganyikaID ) {

					story.mapbox.showLabel( "l_tan_label");
				}

				if ( _obj.id == story.lakeMalawiID ) {

					story.mapbox.showLabel( "l_mal_label");
				}


				Meteor.setTimeout( function() { story.mem.exercise.processUserChoice( _obj.id ) }, 500 );

			});	

			story.bjork.add( {translateX: 0.87, translateY: 0.50, scaleX: 0.10, scaleY:0.20}   );

			story.bjork.fadeIn();			

			Meteor.setTimeout( function() { story.mem.go() }, 3500)
		}

	}


}


storyB.prototype = new Story();

