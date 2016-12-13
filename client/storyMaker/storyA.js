

storyA = function() {

	this._init();
	
	this.twain = new storyA_twain(1);

	this.bert = new storyA_bert(2);

	this.computer = new storyA_computer(1);

	this.scenes = ["intro","needAPasscode"];

	this.tokens = [1];

	this.chars = [1,2,3];

	this.play = function( _name ) {

		if ( _name == "intro") {

			this.background = "starryBG.jpg";

			this.cue  = [

						'story.fadeInBG()',
						'delay.1000',
						'story.computer.addContent( "bunnies" )',
						'story.computer.add()',
						'story.twain.add()',
						'story.bert.add()',
						'story.fadeInChars()',  
						'delay.1000',
						'story.twain.setDirection("right")', 
						'story.bert.setDirection("left")',
						'story.twain.say("Hey, my computer is frozen!  I think I have a virus.");',  
						'delay.4000',
						'story.twain.q();',
						'story.bert.say("Is there an error message?");', 
						'delay.2000',
						'story.bert.q();',
						'story.twain.say("It says I have to complete this exercise to unfreeze my machine.");',
						'delay.4000',
						'story.twain.q();',
						'story.bert.say("Crazy!");',
						'delay.1750',
						'story.bert.q();',
						'story.twain.moveToCorner("nw");',
						'story.bert.moveToCorner("ne");',
						'delay.1000',
						'story.twain.say("I think Agent " + game.username() + " can help us.")',
						'delay.1000',
						'story.bert.say("We are counting on you, Agent " + game.username() + ".")',		
						'story.fadeOutBG()',
						'delay.1700',	
						'story.doExercise(0)',
						'delay.2000',
						'story.twain.q()',
						'story.bert.q()'							

					];				
		}

		if ( _name == "needAPasscode") {

			this.background = "starryBG.jpg";

			this.cue  = [

						'delay.500',
						'story.fadeInBG()',
						'story.twain.setDirection("right")',
						'story.bert.setDirection("left")',
						'story.twain.moveToStart()',
						'story.bert.moveToStart()',
						'delay.1000',
						'story.twain.say("Hey, you knocked that out in no time.");',  
						'delay.2000',
						'story.twain.q();',
						'story.bert.say("This is one sharp agent we got here, Mark.");', 													
						'delay.3000',
						'story.bert.q();',
						'story.twain.say("Hey, another error message!")',
						'delay.2000',
						'story.twain.q();',
						'story.bert.say("Oh, no.  What now?")',
						'delay.3000',
						'story.bert.q();',
						'story.twain.say("It says: If you do not complete the next exercise, the same thing will happen tomorrow!")',
						'delay.4000',
						'story.twain.q()',
						'story.bert.say("What sort of bizarre blackmail is this?  Good thing we have Agent " + game.username() + " with us.")',
						'delay.5000',
						'story.twain.q()',
						'story.bert.q()',	
						'story.twain.moveToCorner("nw");',
						'story.bert.moveToCorner("ne");',
						'delay.1000',
						'story.fadeOutBG()',
						'story.doExercise(1)'

					];				
		}

		//call the play method on the base object

		this._play( _name );

		this.cutScene = new CutScene( _name );

		this.cutScene.play( this.cue );	
	}

	this.doExercise = function(_val) {

		this.exerciseMode.set( true );
	}




}

storyA.prototype = Story;


function storyA_twain(_index) {

	var _obj = {

		name: "Mark Twain",
		top: "50%",
		left: "30%",
		index: _index
	}

	this.init( _obj );

}

storyA_twain.prototype = Char;


function storyA_bert(_index) {

	var _obj = {

		name: "Bert Williams",
		top: "50%",
		left: "60%",
		index: _index
	}

	this.init( _obj );

}

storyA_bert.prototype = Char;

function storyA_computer(_index) {

	var _content = {};

	_content["bunnies"] = bunnies();

	_content["warning"] = warning();

	var _obj = {

		name: "computer",
		type: "overlay",
		pic: "oldcomputer_hollow.png",
		width: "30%",
		top: "28%",
		left: "46%",
		type: "overlay",
		index: _index,
		content: _content
	}

	this.init( _obj );

}

storyA_computer.prototype = Token;


function warning() {

	var _obj = {

		name: "warning",
		pic: "static_warning.gif",
		width: "15%",
		height: "55%",
		left: "8.22%",
		top: "8%",
		borderRadius: "16px"
	}

	return _obj;

}

function bunnies(_index) {

	var _obj = {

		name: "bunnies",
		pic: "static5.gif",
		width: "15%",
		height: "55%",
		left: "8.22%",
		top: "8%",
		borderRadius: "16px"
	}

	return _obj;
}