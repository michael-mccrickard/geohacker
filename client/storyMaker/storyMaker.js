testStory = function() {

	FlowRouter.go("/waiting");  

	storyMaker.load( "storyA" );
}

//------------------------------------------------

StoryMaker = function() {

	this.load = function( _name ) {

		game.user.mode = mStory;

		
		if (!game.user.sms) game.user.sms = new StoryMessaging();

//we need a new table in the database with story resources in it, so we can just
//subscribe to all the records in it, and not download all this unnecessary data

		Meteor.subscribe("registeredUsers", function() {

           storyMaker.finishLoad( _name );

            return;
        });
	}
	
	this.finishLoad = function( _name ) {

		if (_name == "storyA") story = new storyA();

		if (story) FlowRouter.go("/story");  

	}

}