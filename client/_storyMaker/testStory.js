testStory = function( _code) {

	FlowRouter.go("/waiting");  

	game.user.mode = uStory;

	if ( !db.storiesInitialized ) db.initStories();

	var _name = "story" + _code;

	eval( "story = new " + _name + "()" );

	story._init( _code );
}


testStoryEditor = function() {

	FlowRouter.go("/waiting");

	if ( !db.storiesInitialized ) db.initStories();

	sed = new StoryEditor();

	sed.init();
}
