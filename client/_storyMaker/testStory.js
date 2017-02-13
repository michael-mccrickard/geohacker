testStory = function() {


	var _code = sed.code.get();

	if (!_code) {

		showMessage("Select a story in the editor.");

		return;
	}

	game.user.mode = uStory;

	FlowRouter.go("/waiting");  

	if ( !db.storiesInitialized ) db.initStories();

	var _name = "story" + _code;

	eval( "story = new " + _name + "()" );

	story._init( _code );
}


testStoryEditor = function() {

	game.user.mode = uEditStory;

	game.mode.set( gmEditStory );

	FlowRouter.go("/waiting");

	if ( !db.storiesInitialized )  db.initStories();

	sed = new StoryEditor();

	sed.init();

	ved = new StoryEditorVisual();

	//ved.setMode("select");

	ved.edit("Story", cStory, "select");
}


