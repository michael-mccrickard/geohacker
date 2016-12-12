//story.js


$(document).ready(function(){
    $('.storySpot').tooltip(); 
});


Story = {

	//numerous other properties are created / populated by create_Story[Name] function

	start : function() {

		//default response

		this.playIntro();
	}
}

Template.story.rendered = function() {

	Meteor.setTimeout( function() { story.start(); }, 500 );
}

Template.story.helpers({

  char: function() {

  	 return story.chars;
  },

  exerciseMode: function() {

  	if (!story.exerciseMode) return false;

  	return story.exerciseMode.get();
  },

  storyCharPic: function( _val) {

//these will come from an array passed to story.go()

    if (_val == 0) return story.twain.pic;

    if (_val == 1) return story.bert.pic;
  },

  storyCharShortName : function( _val) {

     if (_val == 0) return story.twain.shortName;

     if (_val == 1) return story.bert.shortName;
  }

});