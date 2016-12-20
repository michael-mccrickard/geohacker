

storyA = function() {

	this._init();
	
	this.twain = new storyA_twain(1);

	this.bert = new storyA_bert(2);

	this.charObjs = [this.bert, this.twain];

	this.computer = new storyA_computer(1);

	this.tokenObjs = [this.computer];

	this.scenes = ["intro","needAPasscode","visitGuard"];

	this.scene = this.scenes[0];

	this.tokens = [1];

	this.chars = [1,2];

	this.flags = {};

	this.flags["hasVisitedGuard"] = false;

	this.flags["awareOfPasscode"] = false;

	this.flags["hasVisitedVanGogh"] = false;

	this.flags["hasPasscode"] = false;

	this.flags["hasGivenPasscode"] = false;

	this.flags["hasPainting"] = false;

	this.flags["hasGivenPainting"] = false;


	this.play = function( _name ) {

		this.scene = _name;

		if ( _name == "intro") {

			this.background = "starryBG.jpg";

			this.cue  = [

						'story.fadeInBG()',

						'delay.1000',
						'story.computer.addContent( "warning" )',
						'story.computer.add()',
						'story.computer.scaleMe(0.5);',
			
						'story.twain.add()',
						'story.bert.add()',
						'story.fadeInChars()',  
						'story.fadeInTokens()',

						'delay.1000',
						'story.twain.setDirection("right")', 
						'story.bert.setDirection("left")',
						'story.twain.say("Hey, my computer is frozen!  I think I have a virus.");',  
						'wait',
						'story.twain.q();',
						'story.bert.say("Is there an error message?");', 
						'wait',
						'story.bert.q();',
						'story.twain.say("It says I have to complete this exercise to unfreeze my machine.");',
						'wait',
						'story.twain.q();',
						'story.bert.say("Crazy!");',
						'wait',
						'story.bert.q();',
						'story.twain.moveToCorner("nw");',
						'story.bert.moveToCorner("ne");',
						'delay.1000',
						'story.twain.say("I think Agent " + game.username() + " can help us.")',
						'delay.1000',
						'story.bert.say("We are counting on you, Agent " + game.username() + ".")',	
						'story.computer.fadeOut()',	
						'story.fadeOutBG()',
						'delay.1700',	
						'story.doExercise(0)',
						'delay.2000',
						'story.twain.q()',
						'story.bert.q()',						

					];				
		}

		if ( _name == "needAPasscode") {

			this.background = "starryBG.jpg";

			this.cue  = [
						'story.twain.add()',
						'story.bert.add()',
						'story.fadeInChars()',  
						'story.twain.q()',
						'story.bert.q()',
						'delay.500',
						'story.fadeInBG()',
						'story.twain.setDirection("right")',
						'story.bert.setDirection("left")',
						'story.twain.moveToStart()',
						'story.bert.moveToStart()',
						'story.computer.addContent( "bunnies" )',
						'delay.25',
						'story.computer.fadeIn()',
						'delay.1000',
						'story.twain.say("Hey, you knocked that out in no time.");',  
						'wait',
						'story.twain.q();',
						'story.bert.say("This is one sharp agent we got here, Mark.");', 													
						'wait',
						'story.bert.q();',
						'story.computer.addContent( "warning" )',
						'delay.1000',
						'story.twain.say("Hey, another error message!")',
						'wait',
						'story.twain.q();',
						'story.bert.say("Oh, no.  What now?")',
						'wait',
						'story.bert.q();',
						'story.twain.say("It says: If you do not complete the following quest, the same thing will happen tomorrow!")',
						'wait',
						'story.twain.q()',
						'story.bert.say("What sort of bizarre blackmail is this?  Good thing we have Agent " + game.username() + " with us.")',
						'wait',
						'story.twain.q()',
						'story.bert.q()',	
						'story.twain.moveToCorner("nw");',
						'story.bert.moveToCorner("ne");',
						'delay.1000',
						'story.computer.zoomMe(1)',
						'delay.1500',
						'story.computer.addContent("mona")',						
						'delay.1000',
						'story.computer.say("Get the Mona Lisa and take it to Timbuktu.")',
						'wait',						
						'story.computer.addContent("tim")',
						'story.computer.q()',
						'delay.1000',
						'story.computer.say("Do not delay.  Get the painting now.")',
						'wait',
						'story.twain.moveToStart()',
						'story.bert.moveToStart()',	
						'delay.1000',
						'story.computer.q()',
						'story.computer.zoomMe(0.5)',
						'delay.1000',						
						'story.twain.say("Not asking for much, are they?")',
						'delay.1000',						
						'story.bert.say("Click on one of us for help, if you need it.")'				
					];				
		}

		//call the play method on the base object

		this._play( _name );

	}

	this.go = function( _countryID ) {

		if ( _countryID == "FR") {

			if ( !this.flags["hasVisitedGuard"]) {


			}
		}

	}

	this.doExercise = function(_val) {

		this.mode.set( "exercise" );
	}

	this.doChat = function() {

		var _name = "storyA_chat_" + this.scene;

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