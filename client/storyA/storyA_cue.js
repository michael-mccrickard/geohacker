storyA_cue = function( _name ) {

	var _cue = [];
	
			if ( _name == "intro") {

			_cue  = [

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
						'story.twain.q()',
						'story.bert.q()',	
						'story.doExercise(0)',

					];				
		}

		if ( _name == "missionToMona") {

			_cue  = [
						'story.flags["didExercise1"] = true',  //or put this in the exercise code

						'story.computer.addContent( "warning" )',
						'story.computer.add()',
						'story.computer.scaleMe(0.5);',
			
						'story.twain.add()',
						'story.bert.add()',
						'story.fadeInChars()',  
						'story.fadeInTokens()',

						'story.twain.moveToStart()',
						'story.bert.moveToStart()',
						'delay.250',
						'story.computer.addContent( "bunnies" )',
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
						'story.flags["hasQuest"] = true',
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
						'story.bert.say("Click on one of us for help, if you need it.")',
						'story.flags["hasQuest"] = true',
						'story.hidePrompt()'				
					];				
		}

		if ( _name == "firstGuardVisit") {

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
						'story.bert.add()',
						'story.fadeInChars()',  
						'story.fadeInTokens()',
						'delay.1000',
						'story.bert.say("Agent!  What can we do for you?")'
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

		return _cue;
}