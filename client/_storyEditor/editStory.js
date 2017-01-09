testStoryEditor = function() {

	FlowRouter.go("/waiting");

	db.initStories();

	sed = new StoryEditor();

	sed.init();
}

StoryEditor = function() {

	this.template = new Blaze.ReactiveVar("storyData");

	this.code = new Blaze.ReactiveVar("");

	this.collection = new Blaze.ReactiveVar(null);

	this.table = new Blaze.ReactiveVar("story");

	this.findSelector =  new Blaze.ReactiveVar(null);

	this.init = function() {

		Meteor.subscribe("ghStory", function() { Session.set("sStoryReady", true ) });

		Meteor.subscribe("ghLocation", function() { Session.set("sLocationReady", true ) });

		this.findSelector.set( {} );

		this.collection.set( db.ghStory );
	}
	
}

Template.editStory.helpers({

	editStoryContent : function() {

		return sed.template.get();
	},
});

Template.editStory.events = {

  'click #pickStory' : function(e){

    e.preventDefault();

    sed.code.set("");

    sed.findSelector.set( null );

	sed.collection.set( db.ghStory );
	
  },

  'click #pickLocation' : function(e){

    e.preventDefault();

    if ( sed.code.get().length ) sed.findSelector.set( { c: sed.code.get() } );   

	sed.collection.set( db.ghLocation );
  },

  'click .selectRecord' : function(e){

      e.preventDefault();
	
	  sed.code.set( e.currentTarget.id );

	  sed.findSelector.set( { c: sed.code.get() } );
  },
}


Template.storyData.helpers({

	field : function() {

		return Object.keys( sed.collection.get().find().fetch()[0] );
	},

	dataRecord : function() {

		if (sed.code.get().length) {

			return sed.collection.get().find( sed.findSelector.get() );
		}

		return sed.collection.get().find();
	},

	getValue : function( _field) {

		var _obj = Template.parentData(1);

		return _obj[ _field ];
	}
});

Tracker.autorun( function(comp) {

  if ( Session.get("sStoryReady") &&  Session.get("sLocationReady") 

      ) {

  	console.log("story data ready")

  	FlowRouter.go("/editStory");
  } 

  console.log("story data not ready")

});  
