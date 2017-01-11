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

	this.collectionID = new Blaze.ReactiveVar( cStory );

	this.table = new Blaze.ReactiveVar("Story");

	this.findSelector =  new Blaze.ReactiveVar(null);

	this.recordID = new Blaze.ReactiveVar("");

	this.tableList = ["Story","Location","Scene","Char","Token","Flag"];

	this.uploader = new Slingshot.Upload("ghStoryPic");

	this.init = function() {

		Meteor.subscribe("ghStory", function() { Session.set("sStoryReady", true ) });

		Meteor.subscribe("ghLocation", function() { Session.set("sLocationReady", true ) });

		Meteor.subscribe("ghScene", function() { Session.set("sSceneReady", true ) });

		Meteor.subscribe("ghChar", function() { Session.set("sCharReady", true ) });

		Meteor.subscribe("ghToken", function() { Session.set("sTokenReady", true ) });


		this.findSelector.set( {} );

		this.collection.set( db.ghStory );
	}

	this.setFindSelector = function() {

		if ( sed.code.get().length ) sed.findSelector.set( { c: sed.code.get() } );   
	}

	this.selectTableButton = function() {

		this.deselectAllTableButtons();

		$("#pick" + this.table.get() ).addClass("editStoryModeButtonSel"); 
	} 

	this.deselectAllTableButtons = function() {

		for (var i = 0; i < this.tableList.length; i++) {

			$("#pick" + this.tableList[i] ).removeClass("editStoryModeButtonSel"); 
		}
	}

	this.setMode = function( _name, _collection, _collectionID) {

	    this.table.set( _name );

	    sed.selectTableButton();

		sed.setFindSelector();

		sed.collection.set( _collection );

		if (_collectionID) {

			this.collectionID.set( _collectionID );
		}
		else {

			this.collectionID.set( 0 );
		}
	}

	this.updateURLForNewRecord = function( _url, ID ) {

		var data = {};

		data["p"] = _url;

		Meteor.call("updateRecordOnServerWithDataObject", sed.collectionID.get(), ID, data, function(err, result) {

			if (err) {

				console.log(err);
			}

		}); 

	}

	this.updateRecord = function(_id) {

		doSpinner();

  		var data = {};

		var fields = Object.keys( sed.collection.get().find().fetch()[0] );

  		for (var i = 0; i < fields.length; i++) {

			var _field = fields[i];

			if ( _field == "_id") continue;

			var sel = "";

			sel = "input#" + _id + "." + _field;

			data[ _field ] = $(sel).val(); 					
			
  		}

		Meteor.call("updateRecordOnServerWithDataObject", sed.collectionID.get(), _id, data, function(err, result) {

			stopSpinner();

			if (err) {

				console.log(err);
			}

		}); 	

	}

	this.addRecord = function() {

		var _type = this.collectionID.get();

  		var data = {};

		var fields = Object.keys( sed.collection.get().find().fetch()[0] );

  		for (var i = 0; i < fields.length; i++) {

			var _field = fields[i];

			if ( _field == "_id") continue;

			data[ _field ] = "";

			if ( _type != cStory) {

				if (_field == "c" && sed.code.get() ) data[ _field ] = sed.code.get();					
			}

  		}

  		Meteor.call("addRecordWithDataObject", _type, data);


	}

	this.deleteRecord = function ( _id ) {

		Meteor.call( "deleteRecord", _id, this.collectionID.get() );
	}
}





Tracker.autorun( function(comp) {

  if ( Session.get("sStoryReady") &&  

  		Session.get("sLocationReady")  && 

   		Session.get("sSceneReady")  && 

  		Session.get("sCharReady")  && 

   		Session.get("sTokenReady")

      ) {

  	console.log("story data ready")

  	FlowRouter.go("/editStory");
  } 

  console.log("story data not ready")

});  
