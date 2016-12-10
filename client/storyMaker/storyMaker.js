

StoryMaker = function() {

	this.load = function( _name ) {

		Meteor.subscribe("registeredUsers", function() {

            Meteor.setTimeout( function() { storyMaker.finishLoad( _name ); }, 100 );

            return;
        });
	}
	
	this.finishLoad = function( _name ) {

		story = new Story( _name );

		if (_name == "storyA") create_storyA();

		if (story) FlowRouter.go("/story");  

	}



}