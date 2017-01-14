testStory = function( _code) {

	game.user.mode = uStory;

	FlowRouter.go("/waiting");  

	if ( !db.storiesInitialized ) db.initStories();

	var _name = "story" + _code;

	eval( "story = new " + _name + "()" );

	story._init( _code );
}


testStoryEditor = function() {

	game.user.mode = uEditStory;

	FlowRouter.go("/waiting");

	if ( !db.storiesInitialized ) db.initStories();

	sed = new StoryEditor();

	sed.init();
}
