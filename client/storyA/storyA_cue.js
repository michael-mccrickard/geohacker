addCue = function() {

	//var _scenes = [ "intro", "missionToMona", "firstGuardVisit", "secondGuardVisit", "missionInfo", "vanGogh", "userGetsPasscode", "guardGetsPasscode", "nelsonGetsPainting", "nelsonAndMark"]

var _scenes = [ "intro" ];

	for (var i = 0; i < _scenes.length; i++ ) {

		var _obj = {};

		_obj.c = "A";

		_obj.n = _scenes[i];

		_obj.d = storyA_cue( _obj.n );

		db.ghCue.insert( _obj );  
	}	     
}


/*
storyA_cue = function( _name ) {

	var _cue = [];
	
			if ( _name == "intro") {

			_cue  = [

						'story.computer.addContent( "warning" )',
						'story.computer.add()',
						'story.computer.scaleMe(0.5);',
						'story.twain.add()',
						'story.bob.add()',
						'story.fadeInChars()',  
						'story.fadeInTokens()',
						'delay.1000',
						'story.twain.setDirection("right")', 
						'story.bob.setDirection("left")',
						'story.twain.say("Hey, my computer is frozen!  I think I have a virus.");',  
						'wait',
						'story.twain.q();',
						'story.bob.say("Is there an error message?");', 
						'wait',
						'story.bob.q();',
						'story.twain.say("It says I have to complete this exercise to unfreeze my machine.");',
						'wait',
						'story.twain.q();',
						'story.bob.say("Crazy!");',
						'wait',
						'story.hidePrompt()',
						'story.bob.q();',
						'story.twain.moveToCorner("nw");',
						'story.bob.moveToCorner("ne");',
						'delay.1250',
						'story.twain.say("I think Agent " + game.username() + " can help us.")',
						'delay.1000',
						'story.bob.say("We are counting on you, Agent " + game.username() + ".")',	
						'story.computer.fadeOut()',	
						'story.fadeOutBG()',
						'delay.1700',	
						'story.twain.q()',
						'story.bob.q()',	
						'story.doExercise(0)',

					];				
		}

		if ( _name == "missionToMona") {

			_cue  = [
						'story.flags["didExercise1"] = true',  
						'story.computer.addContent( "warning" )',
						'story.computer.add()',
						'story.computer.scaleMe(0.5);',
						'story.twain.add()',
						'story.bob.add()',
						'story.fadeInChars()',  
						'story.fadeInTokens()',
						'story.twain.moveToStart()',
						'story.bob.moveToStart()',
						'delay.250',
						'story.computer.addContent( "bunnies" )',
						'delay.1000',
						'story.twain.say("Hey, you knocked that out in no time.");',  
						'wait',
						'story.twain.q();',
						'story.bob.say("This is one sharp agent we got here, Mark.");', 													
						'wait',
						'story.bob.q();',
						'story.computer.addContent( "warning" )',
						'delay.1000',
						'story.twain.say("Hey, another error message!")',
						'wait',
						'story.twain.q();',
						'story.bob.say("Oh, no.  What now?")',
						'wait',
						'story.bob.q();',
						'story.twain.say("It says: If you do not complete the following quest, the same thing will happen tomorrow!")',
						'wait',
						'story.twain.q()',
						'story.bob.say("What sort of bizarre blackmail is this?  Good thing we have Agent " + game.username() + " with us.")',
						'wait',
						'story.twain.q()',
						'story.bob.q()',	
						'story.twain.moveToCorner("nw");',
						'story.bob.moveToCorner("ne");',
						'delay.1000',
						'story.computer.zoomMe(1)',
						'delay.1500',
						'story.computer.addContent("mona_content")',						
						'delay.1000',
						'story.computer.say("Get the Mona Lisa and take it to Timbuktu.")',
						'story.flags["hasQuest"] = true',
						'wait',						
						'story.computer.addContent("tim")',
						'story.computer.q()',
						'delay.1000',
						'story.computer.say("Do not delay.  Get the painting now.")',
						'wait',
						'story.twain.moveToStart()',
						'story.bob.moveToStart()',	
						'delay.1000',
						'story.computer.q()',
						'story.computer.zoomMe(0.5)',
						'delay.1000',						
						'story.twain.say("Not asking for much, are they?")',
						'delay.1000',	
						'story.bob.setDirection("right")',
						'story.bob.say("Click on one of us for help, if you need it.")',
						'story.flags["hasQuest"] = true',
						'story.hidePrompt()'				
					];				
		}

		if ( _name == "firstGuardVisit" || _name == "secondGuardVisit") {

			_cue  = [

						'story.guard.add()',
						'story.guard.fadeIn()',
						'delay.500',
						'story.guard.say("Zzzzzzz ...")',
						'story.prompt("Click the guard to talk to him.")'								
					];				
		}

		if ( _name == "missionInfo") {

			_cue  = [

						'story.computer.addContent( "warning" )',
						'story.computer.add()',
						'story.computer.scaleMe(0.5);',
			
						'story.twain.add()',
						'story.bob.add()',
						'story.fadeInChars()',  
						'story.fadeInTokens()',
						'delay.1000',
						'story.bob.say("Agent!  What can we do for you?")'
					]
		}

		if ( _name == "vanGogh") {

			_cue  = [

						'story.van.add()',
						'story.van.fadeIn()',
						'delay.500',
						'story.prompt("Click Vincent to talk to him.")'								
					];				
		}

		if ( _name == "userGetsPasscode") {

			_cue  = [	
						'story.hidePrompt()',
						'story.passcode.add()',
						'story.passcode.scaleMe(0.5);',
						'story.van.add()',
						'story.van.fadeIn(0)',  
						'delay.500',
						'story.van.say("OK, there you go.  Have fun in Mali!")',
						'story.passcode.fadeIn()', 
						'story.prompt("Click the passcode to take it.")'								
					];				
		}

		if ( _name == "guardGetsPasscode") {

			_cue  = [	
						'story.hidePrompt()',
						'story.guard.add()',
						'story.passcode.add()',
						'story.guard.say("OK.  Looks legitimate.")',
						'delay.1000',
						'story.guard.q()',
						'delay.500',
						'story.guard.say("Alright.  Carry on then.  Hope you know what you are doing.  Serious business, removing a masterpiece from the Louvre.")',
						'story.mona.add()',
						'story.mona.scaleMe(0.35)',   
						'story.mona.fadeIn()', 

					];				
		}

		if ( _name == "nelsonGetsPainting") {

			_cue  = [	
						'story.hidePrompt()',
						'story.nelson.add()',
						'story.twain.add()',
						'story.bob.add()',
						'story.mona.add()',
						'story.fadeInChars()'

					];				
		}

		if ( _name == "nelsonAndMark") {

			_cue  = [	
						'story.hidePrompt()',
						'story.nelson.add()',
						'story.twain.add()',
						'story.bob.add()',
						'story.mona.add()',
						'story.showAll()',
						'story.twain.say("Special Agent Nelson Mandela!  What is the meaning of this?  YOU hijacked my computer?!?")',
						'wait',
						'story.silenceAll()',
						'story.nelson.say("Forgive me, Agent Twain.  I have long wanted to meet you and Mr. Marley.  I was not sure you would come all the way to Africa to meet with me.")',
						'wait',
						'story.silenceAll()',
						'story.bob.say("Why not just send us an email?")',
						'wait',
						'story.silenceAll()',
						'story.nelson.say("I wanted to grab your attention. I have also been tasked with training incoming recruits, like Agent " + game.user.name + " here.")',
						'wait',
						'story.silenceAll()',
						'story.twain.say("That was one heck of a training mission!")',
						'wait',
						'story.silenceAll()',
						'story.nelson.say("Yes and your agent did quite well.")',
						'wait',
						'story.silenceAll()',
						'story.bob.say("Well, this is our first time in Mali, so we do appreciate the free trip!")',
						'wait',
						'story.silenceAll()',
						'story.nelson.say("We have much to talk about my friends.  But first, let us congratulate the new agent.")',
						'wait',
						'story.silenceAll()',
						'story.bob.say("Congratulations, Agent " + game.user.name + "!")',
						'wait',
						'story.silenceAll()',
						'story.twain.say("Well done, Agent " + game.user.name + "!")',
						'wait',
						'story.silenceAll()',
						'story.nelson.say("Good work, Agent " + game.user.name + ".")',

					];				
		}

		return _cue;
}

*/
