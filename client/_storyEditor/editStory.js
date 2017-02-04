

StoryEditor = function(_code) {

	this.template = new Blaze.ReactiveVar("storyData");  //was "storyData"

	this.code = new Blaze.ReactiveVar("");

	this.scene =  new Blaze.ReactiveVar("");

	this.chat =   new Blaze.ReactiveVar("");

	this.cue =   new Blaze.ReactiveVar("");

	this.mode = new Blaze.ReactiveVar("none");  //none, data or visual
 
	this.dataMode = new Blaze.ReactiveVar("server");  //server or local

	this.collection = new Blaze.ReactiveVar(null);

	this.collectionID = new Blaze.ReactiveVar( cStory );

	this.table = new Blaze.ReactiveVar("Story");

	this.findSelector =  new Blaze.ReactiveVar(null);

	this.recordID = new Blaze.ReactiveVar("");

	this.arrCollection = null;

	this.tableList = ["Story","Location","Scene","Char","Agent","Token","Flag","Cue","Chat"];

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

		this.reset();

		Meteor.subscribe("allStories", function() { Session.set("sAllStoriesReady", true ) });

		Meteor.subscribe("allLocations", function() { Session.set("sAllLocationsReady", true ) });

		//Meteor.subscribe("allScenes", function() { Session.set("sAllScenesReady", true ) });

		Meteor.subscribe("allChars", function() { Session.set("sAllCharsReady", true ) });

		Meteor.subscribe("allTokens", function() { Session.set("sAllTokensReady", true ) });

		Meteor.subscribe("allStoryAgents", function() { Session.set("sAllStoryAgentsReady", true ) });

		Meteor.subscribe("allStoryFlags", function() { Session.set("sAllStoryFlagsReady", true ) });

		Meteor.subscribe("allCues", function() { Session.set("sAllChats", true ) });

		Meteor.subscribe("allChats", function() { Session.set("sAllCues", true ) });

		this.findSelector.set( {} );

		this.collection.set( db.ghStory );
	}

	this.reset = function() {

		Session.set("sAllStoriesReady", false );

  		Session.set("sAllLocationsReady", false );

   		//Session.set("sAllScenesReady", false );

  		Session.set("sAllCharsReady", false );

   		Session.set("sAllTokensReady", false );

   		Session.set("sAllStoryAgentsReady", false );

   		Session.set("sAllStoryFlagsReady", false );

   		Session.set("sAllCues", false );

   		Session.set("sAllChats", false );
	}


	this.loadStory = function()  {

		var _code = this.code.get();

		if (!_code) {

			showMessage("No story selected.");

			return;
		}

game.user.mode = uStory;

		var _name = "story" + _code;

		eval( "story = new " + _name + "()" );

		story._init( _code );

	}

//*********************************************************************************
//
//		EDITOR MODE SWITCHING  AND STORY PLAY / STORY EDIT SWITCHING
//
//*********************************************************************************

	this.setMode = function(_val) {

		if (_val == "visual") {

			if (!ved) ved = new StoryEditorVisual();
		}

		this.mode.set( _val );

		//make sure the layout template updates, if necessary

		ved.updateContent();
	}

	this.switchTo = function( _val ) {

		if (_val == "editor") {

			FlowRouter.go("/editStory");
		}

		if (_val == "story") {

			if (ved) {

				ved.mode.set( "play" );

				ved.submode = "none";
			}

			var _code = this.code.get();

			if (!_code) {

				showMessage("Select a story in the editor.");

				return;
			}

			game.user.mode = uStory;

			FlowRouter.go("/waiting");  


			//Is there a story object loaded?

			if (story.code) {

				if ( story.code != _code ) {
c("loading new story b/c codes don't match")
					this.loadStory( _code);

					return;
				}
c("going to story in progress")
				FlowRouter.go("/story");

			}
			else {
c("loading story b/c story obj had no code")
				this.loadStory( _code );
			}

		}
	}


//*********************************************************************************
//
//				INTERFACE FUNCTIONS
//
//*********************************************************************************

	this.draw = function() {

		this.conformButtons();

		this.conformData();

		if (this.table.get() == "Token" ) this.extendBG();
	}

	this.conformButtons = function() {

		this.deselectAllTableButtons();

		if ( this.table.get().length ) this.selectTableButton();
	}

	this.conformData = function() {

		if (this.table.get() == "Chat") this.displayChatData();

		if (this.table.get() == "StoryFlag") this.setStoryFlagValues();		
	}

	this.setStoryFlagValues = function() {

		var _arr = this.collection.get().find( this.findSelector.get() ).fetch();

		for (var i = 0; i < _arr.length; i++) {

			 document.getElementById("F" + _arr[i]._id ).checked = story.flags[ _arr[i].n ];
		}
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

	this.setCollection = function( _name, _collection, _collectionID) {

	    this.table.set( _name );

	    this.selectTableButton();

		this.setFindSelector();

		this.collection.set( _collection );

		if (_collectionID) {

			this.collectionID.set( _collectionID );
		}
		else {

			this.collectionID.set( 0 );
		}

		Meteor.setTimeout( function() { sed.draw() }, 500 );
	}

	this.displayChatData = function() {

		this.setCollection( "Chat", db.ghChat, cChat )
	}

	this.selectRecord = function( _ID ) {

	    this.recordID.set( _ID );
		
	    this.code.set( $( "button#" + _ID + ".btn").data("c") );

	    this.showSubTable( _ID );

		if ( this.table.get() == "Story") {

			$("#pick" + sed.table.get() ).text( this.code.get() );
		}

		 sed.findSelector.set( { c: this.code.get() } );
	}

	this.showSubTable = function( _ID ) {

	   if ( sed.table.get() == "Cue") {

	   		var _name = db.ghCue.findOne( { _id: _ID } ).n;

	   		//this probably does nothing b/c story.go() determines the cue (scene)	

	   		if (story.code) story.scene = n;

	        this.makeLocalCollection( _name );

	        this.dataMode.set( "local" );

	        return;
	   }

	    if ( sed.table.get() == "Chat") {

	        smed.init( _ID );

	       Meteor.setTimeout( function() { FlowRouter.go("/editChat"); }, 250 );
	    }
	}

	this.extendBG = function() {

		var _width = $(document).width();

		$("div.editor.storyDataTable").css("width", _width)
	}

//*********************************************************************************
//
//				DATABASE FUNCTIONS -- SERVER
//
//*********************************************************************************

	this.setFindSelector = function() {

		if ( sed.code.get().length ) {

			if (this.table.get() == "Chat") {

				sed.findSelector.set( { c: sed.code.get(), n: "root" } );  

				return; 

			}

			sed.findSelector.set( { c: sed.code.get() } );   
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

		doSpinner();

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

  		Meteor.call("addRecordWithDataObject", _type, data, function(err, result) {

			stopSpinner();

			if (err) {

				console.log(err);
			}
			else {

				if ( sed.collectionID.get() == cChat) {

					smed.createNewChat( result );
				}
			}

		}); 	

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

			var _rec = db.ghCue.findOne( { c: this.code.get(), n: _scene } );

			var _arr = _rec.d;

			//this is redundant in data mode but not visual

			sed.recordID.set( _rec._id );

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

   		//Session.get("sAllScenesReady")  && 

  		Session.get("sAllCharsReady")  && 

   		Session.get("sAllTokensReady") &&

   		Session.get("sAllStoryAgentsReady") &&

   		Session.get("sAllStoryFlagsReady") &&

   		Session.get("sAllCues") &&

   		Session.get("sAllChats")

      ) {

  	console.log("edit story data ready");


  	FlowRouter.go("/editStory");
  } 

  console.log("edit story data not ready")

});  
