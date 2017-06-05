

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


		this.javaID = "ID_4";

		this.borneoID = "ID_11";

		this.sumatraID = "ID_12";
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

		if (!this.flags.didExercise1) return false;


		return true;

	}


	this.getChat = function( _shortName ) {

		//we can return a specific chat name here based on the scene,
		//the flags, etc.

		if (!this.flags.has_letter && !this.flags.gave_letter) {

			if (this.location == "base")  return "storyDefault_chat_cantTalkNow";

			return "storyDefault_chat_reportToBase";
		}

		if (this.scene == "default" || this.scene == "defaultBase") {

			if (!this.flags.knowsLangspil) return "missionToMalawi";

			if (!this.flags.knowsBook) return "missionToIceland";

			if (!this.flags.knowsVideo) return "missionToUS";

			if (!this.flags.has_video) return "missionToIndonesia";

			if (!this.flags.gave_video) return "missionToUS2";
 		}

 		//the user might ask questions immediately of an agent that just supplied a token

 		if (this.scene == "userGetsVideo" && this.flags.has_video) return "missionToUS2";

 		if (this.scene == "userGetsBook" && this.flags.has_book) return "missionToIceland2";

 		if (this.scene == "userGetsLangspil" && this.flags.has_lang) return "missionToMalawi2";

 		if (this.scene == "userGetsNsmima" && this.flags.has_nsima) return "missionToKorea";

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

			if (this.scene == "intro")  this.play("missionToMalawi");  
		}

		if (_name == "video") {

			//allow dancer to chat once user has video

			if (this.scene == "userGetsVideo") {

				this.dancer.movable = 1;

				this.showPrompt("Use the map to go back to the USA");

				this._addInventoryItem( _name );

				return;
			}
		}

		if (_name == "book") {

			//allow lib to chat once user has book

			this.lib.movable = 1;

			this.showPrompt("Use the map to return to Iceland")

			this._addInventoryItem( _name );

			return;

		}

		if (_name == "lang") {

			//allow Bjork to chat once user has langspil

			this.bjork.movable = 1;

			this.showPrompt("Use the map to return to Malawi")

			this._addInventoryItem( _name );

			return;
		}

		if (_name == "nsima") {

			//allow chef to chat once user has nsima

			this.chef.movable = 1;

			this.scene="default";

			this._addInventoryItem( _name );

			this.showPrompt("Use the map to travel to South Korea")

			return;
		}

		if (_name == "psy") {

			//fix the movable flag so story._addInventoryItem() won't reject him

			this.psy.movable = 1;

			this.play("missionToBase1");
		}

		this.hidePrompt();

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

		if (_name == "video") {

			if (this.scene == "visitLibrarian2") {

				this.play( "userGetsBook");

				this.hidePrompt();

				return;
			}
		}

		if (_name == "book") {

			if (this.scene == "visitBjork2") {

				this.hidePrompt();

				this.play("userGetsLangspil");

				return;
			}
		}

		if (_name == "lang") {

			if (this.scene == "visitChef2") {

				this.play("userGetsNsima");

				return;
			}
		}

		if (_name == "nsima") {

			if (this.scene == "visitPsy1") {

				this.play("psyGetsNsima");

				return;
			}
		}

		if (_name == "letter") {

			if (this.scene == "psyGetsNsima") {

				this.play("psyGetsLetter");

				return;
			}
		}

		if (_name == "psy") {

			if (this.scene == "userDeliverPsy") {

				this.play("prezAndPsyChat");

				return;
			}
		}

		this.refuseItem( _name );
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

		if (_ID == "ID") this.playLoop("indonesia_ambience.mp3")

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

			if (this.flags.has_psy  && !this.flags.gave_psy) {

				this.play( "userDeliverPsy" );

				return;
			}

			this.play( "defaultBase" );  //probably info about the mission

			return;

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

			if ( this.flags.has_lang && !this.flags.gave_lang) {

					this.play( "visitChef2" );

					return;		
			}
		}

		if ( _ID == "IS") {

			if ( this.flags.knowsLangspil && !this.flags.didExercise3) {

					this.play( "visitBjork1" );

					return;		
			}

			if ( this.flags.didExercise3 && !this.flags.knowsBook) {

					this.play( "missionToUS" );

					return;		
			}

			if ( this.flags.has_book && !this.flags.gave_book) {

					this.play( "visitBjork2" );

					return;		
			}
		}

		if ( _ID == "US") {

			if ( this.flags.knowsBook && !this.flags.metLibrarian) {

					this.play( "visitLibrarian1" );

					return;		
			}

			if ( this.flags.metLibrarian && !this.flags.knowsVideo) {

					this.play( "learnIndonesia" );

					return;		
			}

			if ( this.flags.has_video && !this.flags.gave_video) {

					this.play( "visitLibrarian2" );

					return;		
			}
		}


		if ( _ID == "ID") {

			if ( this.flags.knowsVideo && !this.flags.didExercise4) {

					this.play( "visitDancer1" );

					return;		
			}

			if ( this.flags.didExercise4 && !this.flags.has_video) {

					this.play( "userGetsVideo" );

					return;		
			}
		}

		if ( _ID == "KR") {

			if ( this.flags.has_nsima && !this.flags.gave_nsima) {

					this.play( "visitPsy1" );

					return;		
			}

			//thse actually triggered thru the inventory but these help us in testing

			if ( this.flags.gave_nsima && !this.flags.gave_letter) {

					this.play( "psyGetsLetter" );

					return;		
			}

			if ( this.flags.gave_letter && !this.flags.has_psy) {

					this.play( "userGetsPsy" );

					return;		
			}
		}

		this.playDefaultScene( _ID);

	}

	//typically, the location name displayed on the screen when you go to a country is the name of the capital
	//but not necessarily ...

	this.getCityName = function(_location) {

		if (_location == "base") return "Geosquad HQ";

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

			story.mem.init( "bjork", "mapbox" );  //pass the shortName of the char "hosting" the exercise

			this.mem.build( false );  //don't shuffle

			this.mem.add([

				{ qText: "Click Lake Malawi.", aCode: this.lakeMalawiID, aText: "That's it. Lake Malawi is the third largest lake in Africa." },

				{ qText: "Click the largest lake in Africa.", aCode: this.lakeVictoriaID, aText: "Exactly. Lake Victoria is the largest lake on the continent." },
				

			]);
		}


		if (this.scene == "visitDancer1") {

			story.mem.init( "dancer", "customAmmap" );  //pass the shortName of the char "hosting" the exercise

			this.mem.build( false );  //don't shuffle

			this.mem.add([

				{ qText: "Click the island of Borneo.", aCode: this.borneoID, aText: "That's it. Indonesia shares Borneo with Malaysia and Brunei." },

				{ qText: "Click the the most populous island in Indonesia.", aCode: this.javaID, aText: "Exactly. Over half the population lives on the island of Java." },

			]);
		}

	}

	this.doneWithExercise = function() {

		if (this.scene == "missionToMalawi") this.flags.didExercise1 = true;

		if (this.scene == "visitChef1") this.flags.didExercise2 = true;

		if (this.scene == "visitBjork1") this.flags.didExercise3 = true;

		if (this.scene == "visitDancer1") this.flags.didExercise4 = true;

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

			story.mapbox.addLabel("vic_label", _arr, "Lake Victoria", "hide"); 

			_arr = [28.5, -6.186];

			story.mapbox.addLabel("tan_label", _arr, "Lake Tanganyika", "hide"); 

			_arr = [34.450, -12.117];

			story.mapbox.addLabel("mal_label", _arr, "Lake Malawi", "hide"); 

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


			story.bjork.add( {left: 0.68, top: 0.33, scaleX: 0.10, scaleY:0.17}   );

			story.bjork.fadeIn();

			Meteor.setTimeout( function() { story.mem.go() }, 3500)
		}

	}

	this.doCustomAmmapForExercise = function() {

		this.dancer.fadeIn();

		this.dancer.add( {left: 0.85, top: 0.57, scaleX: 0.11, scaleY:0.16} );

		this.dancer.setDirection("top");

		Meteor.setTimeout( function() { customAmmap.doThisMap( { mapVar: AmCharts.maps.AsiaLow, z1: "6.43", z2: "-40.4", z3: "57.5" } ) }, 500);

		Meteor.setTimeout( function() { customAmmap.colorCountries(); }, 1000);

		Meteor.setTimeout( function() { customAmmap.freezeCountries( { mapVar: AmCharts.maps.AsiaLow, z1: "6.43", z2: "-40.4", z3: "57.5" } ); }, 1500);

		Meteor.setTimeout( function() { story.mem.go() }, 2000);
	}



	this.labelClickedExerciseObject = function(_ID) {

		if (this.scene == "visitDancer1") {

			if (_ID == this.javaID) customAmmap.labelMapObject("Java", 35.4, -45.2, "white")

			if (_ID == this.borneoID) customAmmap.labelMapObject("Borneo", 38, -38, "white")

			if (_ID == this.sumatraID) customAmmap.labelMapObject("Sumatra", 16, -38.7, "white")
		}		
	}

}


storyB.prototype = new Story();

