

StoryEditor = function() {

	this.template = new Blaze.ReactiveVar("storyData");

	this.code = new Blaze.ReactiveVar("");

	this.mode = new Blaze.ReactiveVar("server");

	this.collection = new Blaze.ReactiveVar(null);

	this.collectionID = new Blaze.ReactiveVar( cStory );

	this.table = new Blaze.ReactiveVar("Story");

	this.findSelector =  new Blaze.ReactiveVar(null);

	this.recordID = new Blaze.ReactiveVar("");

	this.arrCollection = null;

	this.tableList = ["Story","Location","Scene","Char","Token","Flag"];

	this.uploader = new Slingshot.Upload("ghStoryPic");

	this.tempStoryAgentName = "";

	this.tempStoryAgentRecordID = "";

	this.story = null;

	//these are specifically for the array of commands in ghCue

	this.localFields = ["q", "d"];

//*********************************************************************************
//
//				INIT
//
//*********************************************************************************

	this.init = function() {

		//init the global messaging editor

		smed = new StoryMessagingEditor();

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

	this.setCollection = function( _name, _collection, _collectionID) {

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
//				DATABASE FUNCTIONS -- SERVER
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


//*********************************************************************************
//
//				DATABASE FUNCTIONS -- LOCAL
//
//*********************************************************************************

	this.makeLocalCollection = function( _scene ) {

		if (this.collectionID.get() == cCue)  {

			this.arrCollection = new Meteor.Collection();

			var _arr = db.ghCue.findOne( { c: this.code.get(), n: _scene } ).d;

			for (var i = 0; i < _arr.length; i++) {

				var _index = (i + 1) * 100;

				this.arrCollection.insert( { q: parseInt(_index), d: _arr[i] } )
			}
		}
	}


	this.updateLocalRecord = function(_ID) {

		doSpinner();

  		var data = {};

		var fields = Object.keys( this.arrCollection.find().fetch()[0] );

  		for (var i = 0; i < fields.length; i++) {

			var _field = fields[i];

			if ( _field == "_id") continue;
 
			var sel = "";

			sel = "input#" + _ID + "." + _field;

			data[ _field ] = $(sel).val(); 		

			if ( _field == "q") data[_field] = parseInt( $(sel).val() );			
			
  		}

  		this.arrCollection.update( { _id: _ID }, { $set: data  } );

  		stopSpinner();
	
	}

	this.saveAllLocalRecords = function() {

		//create an array of the records in arrLocalCollection

		var _arr = this.arrCollection.find( {} ).fetch();

		for (var i= 0; i < _arr.length; i++) {

			this.updateLocalRecord( _arr[i]._id );

		}

	}

	this.deleteLocalRecord = function(_ID) {

  		this.arrCollection.remove( { _id: _ID } );
	
	}

	this.addLocalRecord = function ( _id ) {

		//get the highest number in the q field

		var _arr = this.arrCollection.find( {}, { sort: { q: -1 } } ).fetch();

		//we start by assuming that the recordset is empty

		var _q = 100;

		//Our only local collection so far is the array of commands in ghCue
		//and localFields has the fieldnames for it

		var fields = this.localFields;

		//If we have already existing records, we need to increment the highest q value
		//that we got above.  We also can just use the fields already defined in one of the records.
		//Doing it this way makes this portion work for any future localCollections we might need
		//but we would still need to have an appropriate set of localFields defined (for the empty recordset case)

		if ( _arr.length) {

			_q = _arr[0].q + 100;

			fields = Object.keys( this.arrCollection.find().fetch()[0] );
		}
			
  		var data = {};

  		for (var i = 0; i < fields.length; i++) {

			var _field = fields[i];

			if ( _field == "_id") continue;

			data[ _field ] = "";

			if ( _field == "q") data[ _field ] = parseInt(_q);
  		}

  		this.arrCollection.insert( data );

	}

	this.saveLocalCollectionToRecord = function() {

		//create an array of the records in arrLocalCollection

		var _arrSource = this.arrCollection.find( {}, { sort: { q: 1 }  } ).fetch();

		var _arrResult = [];

		for (var i= 0; i < _arrSource.length; i++) {

			_arrResult.push( _arrSource[i].d )

		}

		//create temporary object from the field values and update record with it

		sed.collection.get().update( { _id: sed.recordID.get() }, { $set: { d: _arrResult} } );
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
