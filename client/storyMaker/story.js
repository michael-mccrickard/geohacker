//story.js

Story = function( _name ) {

	this.name = _name;

	//numerous other properties are created / populated by create_Story[Name] function

	this.start = function() {

		if (this.name == "storyA") {

			this.cutScene = new CutScene( "storyA_intro" );

			this.cutScene.play();
		}
	}
}

Template.story.rendered = function() {

	story.start();
}


Template.story.helpers({

  storyCharPic: function( _val) {

//these will come from an array passed to story.go()

    if (_val == 1) return story.twain.pic;

    if (_val == 2) return story.bert.pic;
  },

  storyCharShortName : function( _val) {

     if (_val == 1) return story.twain.shortName;

     if (_val == 2) return story.bert.shortName;
  }



});