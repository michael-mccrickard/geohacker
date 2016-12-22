

storyA = function() {

	this._init("storyA");

	this.location = "base";  //base, FR, ML, NL
	
	this.twain = new storyA_twain(1);

	this.bert = new storyA_bert(2);

	this.guard = new storyA_guard(3);

	this.van = new storyA_van(4);

	this.charObjs = [];  //this.bert, this.twain, this.guard, this.van

	this.computer = new storyA_computer(1);

	this.passcode = new storyA_passcode(2);

	this.tokenObjs = [];  //this.computer, this.passcode

	this.scenes = ["intro","missionToMona","firstGuardVisit","secondGuardVisit","auxGuardVisit","missionInfo"];

	this.scene = "";

	this.tokens = [1,2];

	this.chars = [1,2,3,4];

	this.buttons = [1,2,3,4,5];

	this.sceneButtonPic = new Blaze.ReactiveVar("");

	this.flags = {};

this.flags["didExercise1"] = true;

this.flags["hasQuest"] = true;	

this.flags["hasVisitedGuard"] = true;

this.flags["awareOfPasscode"] = true;

	this.flags["hasVisitedVanGogh"] = false;

	this.flags["hasPasscode"] = false;

	this.flags["hasGivenPasscode"] = false;

	this.flags["hasPainting"] = false;

	this.flags["hasGivenPainting"] = false;

	this.sceneButtonPic.set("storyA_scene.jpg");


	this.play = function( _name ) {

		this.scene = _name; 

		this.cue = storyA_cue( _name );

		//call the play method on the base object

		this._play( _name );

	}


	this.go = function( _ID ) {

		this.location = _ID;

		if (_ID == "base") {

			this.background = "starryBG.jpg";

			if ( !this.flags["didExercise1"]) {

				this.play("intro");

				return;
			}

			if ( !this.flags["hasQuest"]) {

				this.play("missionToMona");

				return;
			}

			if ( !this.flags["hasVisitedGuard"] || !this.flags["awareOfPasscode"] ||  !this.flags["hasVisitedVanGogh"] ||  !this.flags["hasPasscode"] ||  !this.flags["hasPainting"] ||  !this.flags["hasGivenPainting"] ) {

				this.play("missionInfo");

				return;
			}
		}

		if ( _ID == "FR") {

			this.background = "louvre.jpg";

			if ( !this.flags["hasVisitedGuard"]) {

				if ( !this.flags["awareOfPasscode"]) {

					this.play("firstGuardVisit")		
					
				}		
			}
		}

		if ( _ID == "NL") {

			this.background = "vanGoghHouse.jpg";

			if ( !this.flags["hasVisitedGuard"] || !this.flags["hasVisitedGuard"] ) {

				c("need to play a default NL scene here, with a GIC");

				return;	
			}

			if ( !this.flags.hasVisitedVanGogh || !this.flags["hasGivenPasscode"]) {

				this.play("vanGogh");
			}
			else {

				c("need to play an auxiliary VG scene here");
			}
		}

	}

	this.doExercise = function(_val) {

		this.mode.set( "exercise" );
	}

	this.doChat = function( _sel, _shortName) {

		this._chat(_sel, _shortName);

		var _name = this.name + "_chat_" + this.scene;

		//we evaluate this so that js will see the string _name as an object

		eval( "game.user.sms.startChat(" + _name + ")" );
	}
}


storyA.prototype = Story;


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


function storyA_bert(_index) {

	var _obj = {

		name: "Bert Williams",
		shortName: "bert",
		top: "50%",
		left: "66%",
		index: _index
	}

	this.init( _obj );

}

storyA_bert.prototype = new Char();


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


function storyA_passcode(_index) {

	var _obj = {

		name: "passcode",
		pic: "passcode_byzantine.png",
		top: "15%",   
		left: "27%",
		index: _index,
	}

	this.init( _obj );

}

storyA_passcode.prototype = new Token();

function storyA_computer(_index) {

	var _content = {};

	_content["bunnies"] = bunnies();

	_content["warning"] = warning();

	_content["mona"] = mona();

	_content["tim"] = tim();

	//rather than use width and height to size this,
	//we scale it instantly with GSAP in the scene 'script',
	//this allows it to zoom straight out toward us and not veer off to the side

	var _obj = {

		name: "computer",
		type: "overlay",
		pic: "oldcomputer_hollow.png",
		top: "28%",   
		index: _index,
		content: _content
	}

	this.init( _obj );

}

storyA_computer.prototype = new Token();



function warning() {

	var _obj = {

		name: "warning",
		pic: "static_warning.gif",
		width: "15%",
		height: "55%",
		left: "43.22%",
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
		width: "15%",
		height: "55%",
		left: "43.22%",
		top: "8%",
		borderRadius: "16px",
		zIndex: 1000
	}

	return _obj;
}

function mona() {

	var _obj = {

		name: "mona",
		pic: "monaLisa.jpg",
		width: "16%",
		height: "55%",
		left: "42.22%",
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
		width: "15%",
		height: "55%",
		left: "43.22%",
		top: "8%",
		borderRadius: "16px",
		zIndex: 1000
	}

	return _obj;
}