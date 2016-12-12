testStory = function() {

	FlowRouter.go("/waiting");  

	storyMaker.load( "storyA" );
}

//------------------------------------------------

StoryMaker = function() {

	this.load = function( _name ) {

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