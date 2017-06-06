Template.storyManager.rendered = function() {

	stopSpinner();
}

var buttonTypes = ["danger", "primary", "success"];


Template.storyManager.helpers({

  story: function() {

  	 return db.ghStory.find( { r: "1" }, { sort: { c: 1 } }).fetch();
  },

  buttonType: function( _index ) {

  	 if ( _index <  3) return buttonTypes[ _index ];

  	 return ( buttonTypes[_index % 3] )
  },

});

Template.storyManager.events = {

  'click .storyPlayButton' : function(e){

    e.preventDefault();

    var _code = e.currentTarget.id;

    storyManager.start( _code );

  },
}