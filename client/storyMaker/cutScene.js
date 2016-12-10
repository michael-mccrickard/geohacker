CutScene = function( _name ) {
	
	this.name = _name;

	this.play = function() {

		if (this.name == "storyA_intro") {

			await Meteor.sleep(2000);

			story.twain.say("Lemme write your name on it.");

			await Meteor.sleep(5000);

			story.twain.q();			


		}

	}


}