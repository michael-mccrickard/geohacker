

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

	this.tempStoryAgentName = "";

	this.tempStoryAgentRecordID = "";

	this.story = null;

//*********************************************************************************
//
//				INIT
//
//*********************************************************************************

	this.init = function() {

		Meteor.subscribe("allStories", function() { Session.set("sAllStoriesReady", true ) });

		Meteor.subscribe("allLocations", function() { Session.set("sAllLocationsReady", true ) });

		Meteor.subscribe("allScenes", function() { Session.set("sAllScenesReady", true ) });

		Meteor.subscribe("allChars", function() { Session.set("sAllCharsReady", true ) });

		Meteor.subscribe("allTokens", function() { Session.set("sAllTokensReady", true ) });

		Meteor.subscribe("allStoryAgents", function() { Session.set("sAllStoryAgentsReady", true ) });

		Meteor.subscribe("allStoryFlags", function() { Session.set("sAllStoryFlagsReady", true ) });

		Meteor.subscribe("allCues", function() { Session.set("sAllChats", true ) });

		Meteor.subscribe("allChats", function() { Session.set("sAllCues", true ) });

		this.findSelector.set( {} );

		this.collection.set( db.ghStory );
	}

//*********************************************************************************
//
//				STORY TESTING
//
//*********************************************************************************

	this.loadStory = function() {


	}


//*********************************************************************************
//
//				INTERFACE FUNCTIONS
//
//*********************************************************************************


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

//*********************************************************************************
//
//				DATABASE FUNCTIONS
//
//*********************************************************************************

	this.setFindSelector = function() {

		if ( sed.code.get().length ) sed.findSelector.set( { c: sed.code.get() } );   
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

		if (this.collectionID.get() == cStoryAgent)  {

			var _sel = "input#" + _id + ".n";

			var _agentName = $(_sel).val();

			if (!_agentName) {

				showMessage("No agent name found in field n for a story agent.");

				return;
			}		

			this.tempStoryAgentName = _agentName;

			this.tempStoryAgentRecordID = _id;

			Meteor.subscribe("tempAgent", _agentName, function() { 

				var _uid = Meteor.users.findOne( { username: sed.tempStoryAgentName } )._id;
c(_uid)
				var _sel = "input#" + _id + ".uid";

				$( _sel ).val( _uid );

				sed.updateRecord2( sed.tempStoryAgentRecordID );

			 });
		}
		else {

			this.updateRecord2( _id );
		}
	}

	this.updateRecord2 = function( _id ) {

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

  if ( Session.get("sAllStoriesReady") &&  

  		Session.get("sAllLocationsReady")  && 

   		Session.get("sAllScenesReady")  && 

  		Session.get("sAllCharsReady")  && 

   		Session.get("sAllTokensReady") &&

   		Session.get("sAllStoryAgentsReady") &&

   		Session.get("sAllStoryFlagsReady") &&

   		Session.get("sAllCues") &&

   		Session.get("sAllChats")

      ) {

  	console.log("edit story data ready")

  	FlowRouter.go("/editStory");
  } 

  console.log("edit story data not ready")

});  
