

storyA = function() {

//*********************************************************************************
//
//				PROPERTIES
//
//*********************************************************************************

	this.init = function() {

		this.location = "base";  //base, FR, ML, NL

	/*	
		this.twain = new storyA_twain(1);

		this.bob = new storyA_bob(1);

		this.guard = new storyA_guard(3);

		this.van = new storyA_van(4);

		this.nelson = new storyA_nelson(5);


		this.computer = new storyA_computer(3);

		this.passcode = new storyA_passcode(2);

		this.mona = new storyA_mona(1);
*/

	//	this.tokens = [1,2, 3];

	//	this.chars = [0,1,2,3,4,5];

//hasQuest is the one mandatory flag

		this.flags["didExercise1"] = false;

		this.flags["hasQuest"] = false;	

		this.flags["hasVisitedGuard"] = false;

		this.flags["hasVisitedVanGogh"] = false;

		this.flags["hasPasscode"] = false;

		this.flags["hasGivenPasscode"] = false;

		this.flags["hasPainting"] = false;

		this.flags["hasGivenPainting"] = false;


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

c("loc is " + _ID)

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


storyA.prototype = Story;

//*********************************************************************************
//
//				CHARACTERS 
//
//*********************************************************************************

/*
function storyA_twain(_index) {

	var _obj = {

		name: "Mark Twain",
		shortName: "twain",
		top: "50%",
		left: "30%",
		index: _index
	}

	this.init( _obj );

}

storyA_twain.prototype = new Char();



function storyA_bob(_index) {

	var _obj = {

		name: "Bob Marley",
		shortName: "bob",
		top: "50%",
		left: "66%",
		index: _index,
		pic: "bobMarley.jpg",
		ID: "storyA_bob"
	}

	this.init( _obj );

}

storyA_bob.prototype = new Char();


function storyA_guard(_index) {

	var _obj = {

		type: "guest",
		name: "Museum Guard",
		shortName: "guard",
		pic: "museumGuard.jpg",
		ID: "storyA_guard",
		top: "47%",
		left: "47%",
		index: _index
	}

	this.init( _obj );

}

storyA_guard.prototype = new Char();

function storyA_van(_index) {

	var _obj = {

		type: "guest",
		name: "Vincent Van Gogh",
		shortName: "van",
		pic: "vanGogh.jpg",
		ID: "storyA_van",
		top: "37%",
		left: "37%",
		index: _index
	}

	this.init( _obj );

}

storyA_van.prototype = new Char();

function storyA_nelson(_index) {

	var _obj = {

		type: "guest",
		name: "Nelson Mandela",
		shortName: "nelson",
		pic: "nelsonMandela.jpg",
		ID: "storyA_nelson",
		top: "37%",
		left: "46%",
		index: _index
	}

	this.init( _obj );

}

storyA_nelson.prototype = new Char();

//*********************************************************************************
//
//				TOKENS 
//
//*********************************************************************************

function storyA_mona(_index) {

	var _obj = {

		name: "Mona Lisa",
		shortName: "mona",
		pic: "monaLisa.jpg",
		top: "31%",   
		left: "40%",
		movable: true,
		index: _index
	}

	this.init( _obj );

}

storyA_mona.prototype = new Token();


function storyA_passcode(_index) {

	var _obj = {

		name: "passcode",
		pic: "passcode_byzantine.png",
		top: "26%",   
		left: "5%",
		movable: true,
		index: _index,
	}

	this.init( _obj );

}

storyA_passcode.prototype = new Token();


function storyA_computer(_index) {

	var _content = {};

	_content["bunnies"] = bunnies();

	_content["warning"] = warning();

	_content["mona_content"] = mona_content();

	_content["tim"] = tim();

	//rather than use width and height to size this,
	//we scale it instantly with GSAP in the scene 'script',
	//this allows it to zoom straight out toward us and not veer off to the side

	var _obj = {

		n: "computer",
		p: "oldcomputer_hollow.png",
		top: "28%", 
		l: "33%",
		t: "o",  
		index: _index,
		content: _content
	}

	this.init( _obj, _index );

}

storyA_computer.prototype = new Token();



function warning() {

	var _obj = {

		name: "warning",
		pic: "static_warning.gif",
		width: "54%",
		height: "55%",
		left: "25%",
		top: "8%",
		borderRadius: "16px",
		zIndex: 1000
	}

	return _obj;

}


function bunnies() {

	var _obj = {

		name: "bunnies",
		pic: "static5.gif",
		width: "54%",
		height: "55%",
		left: "25%",
		top: "8%",
		borderRadius: "16px",
		zIndex: 1000
	}

	return _obj;
}

function mona_content() {

	var _obj = {

		name: "mona",
		pic: "monaLisa.jpg",
		width: "54%",
		height: "55%",
		left: "25%",
		top: "8%",
		borderRadius: "16px",
		zIndex: 1000
	}

	return _obj;
}

function tim() {

	var _obj = {

		name: "tim",
		pic: "timbuktu.jpg",
		width: "54%",
		height: "55%",
		left: "25.5%",
		top: "8%",
		borderRadius: "16px",
		zIndex: 1000
	}

	return _obj;
}

*/