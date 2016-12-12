

storyA = function() {

this.speed = 0.5;

	this.exerciseMode = new Blaze.ReactiveVar( false );
	
	this.twain = new storyA_twain(0);

	this.bert = new storyA_bert(1);

	this.chars = [this.twain, this.bert];

	this.playIntro = function() {

		this.cue  = [

					'delay.500',
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
					'delay.1000',
					'story.bert.q();',
					'story.twain.moveToCorner("nw");',
					'story.bert.moveToCorner("ne");',
					'delay.1000',
					'story.twain.say("I think Agent " + game.username() + " can help us.")',
					'delay.1000',
					'story.bert.say("We are counting on you, Agent " + game.username() + ".")',			
					'story.doExercise(0)',
					'delay.2000',
					'story.twain.q()',
					'story.bert.q()'							

				];	
			
		this.cutScene = new CutScene("intro");

		this.cutScene.play( this.cue );	
	}

	this.doExercise = function(_val) {

		this.exerciseMode.set( true );
	}


}

storyA.prototype = Story;


function storyA_twain(_index) {

	this.init( "Mark Twain", "twain", _index );

}

storyA_twain.prototype = Char;


function storyA_bert(_index) {

	this.init( "Bert Williams", "bert", _index );

}

storyA_bert.prototype = Char;