StoryManager = function() {

	this.init = function() {

		this.reset();

		if ( !db.storiesInitialized )  db.initStories();

		Meteor.subscribe("allStories", function() { Session.set("sAllStoriesReady", true ) });
	}

	this.reset = function() {

		 Session.set("sAllStoriesReady", false);
	}

	this.start = function( _code ) {

		if (sed) sed.reset();   //we need to subscribe to only one story now and the editor subscribes to all

		story.killSound();

		game.user.mode = uStory;

		game.mode.set( gmNormal );

		FlowRouter.go("/waiting");  

		if ( !db.storiesInitialized ) db.initStories();

		var _name = "story" + _code;

		eval( "story = new " + _name + "()" );

		story._init( _code );	

	}

	this.startStoryFromEditor = function() {

		var _code = sed.code.get();

		if (!_code) {

			showMessage("Select a story in the editor.");

			return;
		}

		ved.loadStory( _code );
	}

	this.startEditor = function() {

		game.user.mode = uEditStory;

		game.mode.set( gmEditStory );

		FlowRouter.go("/waiting");

		if ( !db.storiesInitialized )  db.initStories();

		sed = new StoryEditor();

		sed.init();

		ved = new StoryEditorVisual();

		ved.edit("Story", cStory, "select");		
	}
}


Tracker.autorun( function(comp) {

  		if ( Session.get("sAllStoriesReady") ) FlowRouter.go("/storyManager");

	}
);  
