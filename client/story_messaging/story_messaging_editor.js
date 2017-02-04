

StoryMessagingEditor = function() {


	this.grandRecordID = new Blaze.ReactiveVar("");

	this.parentRecordID = new Blaze.ReactiveVar("");

	this.childRecordID = new Blaze.ReactiveVar("");


	this.helperRootSpeechName = "root";

	this.helperRootSpeech = "Yes ...";	

	this.agentRootSpeechName = "*";

	this.speaker = new Blaze.ReactiveVar("h");;   //h or a (helper or agent);

	this.helperPic = "happy.png";

	this.chatName = "";

	this.configureMode = new Blaze.ReactiveVar(false);

	this.configureRelation = new Blaze.ReactiveVar("");

	this.responseToDelete = "";

	this.relationOfDelete = "";

	this.destinationList = [];

	this.descendantsList = [];

	this.storyCode = "";

    this.locked_sound_file = "locked.mp3";

//*********************************************************************************
//
//				BASIC FUNCTIONS
//
//*********************************************************************************


	this.init = function( _chatRecordID )  {

		this.reset();

		this.grandRecordID.set( _chatRecordID );

		var _rec = db.ghChat.findOne( { _id: _chatRecordID } );

		this.chatName = _rec.s;

		if (story.code) story.chat = this.chatName;

		this.storyCode = _rec.c;
	}

	this.initByName = function( _name ) {

		this.reset();

		this.chatName = _name;

		this.storyCode = sed.code.get();

		var _rec = db.ghChat.findOne( { c: this.storyCode, s: _name, n: "root" } );

		this.grandRecordID.set( _rec._id );	
	}

	this.reset = function() {

		this.grandRecordID.set( "" );

		this.parentRecordID.set( "" );

		this.childRecordID.set( "" );

		this.chatName = "";

	}

	this.restart = function() {

		var _rec = db.ghChat.findOne( { c: this.storyCode, s: this.chatName, n: "root" } );

		this.init( _rec._id );
	}

	this.close = function() {

		FlowRouter.go("/editStory")
	}

	this.createNewChat = function( _ID ) {

		//request the chatName from the user here and fill it in for them

		var _newChatName = prompt("Please enter the name for the new chat:", "");

		if (_newChatName == null) {

			db.ghChat.delete( { _id: _rec._id  } );

			showMessage("Add new chat aborted.")

			return;
		}


		//with the rec we get from sed, we make into the first helper record

		var _obj = {};

		_obj.c = sed.code.get();

		_obj.i = "h";

		_obj.n =  this.helperRootSpeechName;

		_obj.d = [ { t: this.helperRootSpeech, g: this.agentRootSpeechName } ];

		_obj.s = _newChatName


		db.ghChat.update( { _id: _ID }, { $set: _obj  } );


		//make the first user record

		_obj.c = sed.code.get();

		_obj.i = "u";

		_obj.n =  this.agentRootSpeechName;

		_obj.d = [ { t: "", g: "" } ];

		_obj.s = _newChatName

		db.ghChat.insert( _obj  );

	}

//*********************************************************************************
//
//				ADD / EDIT RESPONSE FUNCTIONS
//
//*********************************************************************************

	this.addResponse = function( _rel ) {

		var _recordID = this.getRecordID( _rel );

		var _rec = db.ghChat.findOne( { _id: _recordID  } );

		if (!_rec) {

			showMessage("smed.addResponse could not find record for " + _recordID);

			return;
		}

		var _arr = _rec.d;

		var _obj = { t: "", g:"" };

		_arr.push( _obj );

		db.ghChat.update( { _id: _recordID }, { $set: { d: _arr } } );		
	}

	this.createDestinationName = function( _text, _rel ) {

		var _recordID = this.getRecordID( _rel );

		var _rec = db.ghChat.findOne( { _id: _recordID  } );

		if (!_rec) {

			showMessage("smed.createDestinationName could not find record for " + _recordID);

			return;
		}	

		if ( _text.length > 8) _text = _text.substr(0,8);

		_text = _text.replace(/ /g, "_");  //underscores instead of spaces

		if (_text.substr( _text.length - 1, 1) == "_") _text = _text.substr(0, _text.length - 1);  //if the last char is an underscore, lop it off

		_text = _text.replace(/'/g, "");  //get rid of apostrophes

		//check to see if there is a duplicate name in the array of responses

		var _arr = this.compileDestinations();

		var _skipCount = 0;

		for (var i = 0; i < _arr.length; i++) {

			var _arrVal = _arr[i].g;

			for (var j = 0; j < _arr.length; j++) {

				var _test = _text + "_" + j;

				if (_arrVal == _test) {

					_skipCount++
				}

			}

		}

		return _text + "_" + parseInt(_skipCount);

	}

	this.editResponse = function( _name, _sourceRelation) {

		if (_name == "exit") {

			this.closeParentAndChild();

			return;
		}

		//Is this a re-direct or a command?

		if ( _name.indexOf("@") != -1) {

			//Only one command at this time; just show a quick message; nothing to edit

			if ( _name.substr(0,4) == "play" ) {

				showMessage("Play scene here");

				return;
			}

			//Not a command, must be a redirect

			var _index = _name.indexOf("@");

			var _newChatElementName = _name.substr(0, _index);

			var _newScene = _name.substr( _index + 1 );

			var _rec = db.ghChat.findOne( { c: this.storyCode, s: _newScene, n: _newChatElementName  } );

			if ( ! _rec ) {

				showMessage("Record was not found for redirected chat: " + _name);

				return;
			}

			this.init( _rec._id );

			return;
		}

		var _rec = db.ghChat.findOne( { c: sed.code.get(), s: this.chatName, n: _name } );

		if (!_rec) {

			showMessage("smed.editResponse could not find record for " + _name);

			return;
		}

		//returning to the origin set for the user?

		if (_name == "*" && _sourceRelation == "child") {

			//just wipe current parent and child, and put the origin set back at the top

			this.closeParentAndChild();

			this.grandRecordID.set( _rec._id );

			return;
		}

		if ( _sourceRelation == "grand" ) this.parentRecordID.set ( _rec._id );

		if ( _sourceRelation == "parent" ) this.childRecordID.set ( _rec._id );

		if ( _sourceRelation == "child" ) {

			this.grandRecordID.set( this.parentRecordID.get() );

			this.parentRecordID.set( this.childRecordID.get() );

			this.childRecordID.set ( _rec._id );
	
		}
	}

//*********************************************************************************
//
//				MOVE RESPONSE FUNCTIONS
//
//*********************************************************************************

this.moveResponse = function( _dest, _sourceRelation, _val) {

	var _recordID = this.getRecordID( _sourceRelation );

	var _arr = db.ghChat.findOne( { _id: _recordID } ).d;

	var _indexToMove = Database.getObjectIndexWithValue( _arr, "g", _dest);

	//Can we move it?

	if ( ( _indexToMove == 0 && _val == -1) || ( _indexToMove == _arr.length-1 && _val == 1) ) {

		showMessage("Cannot move response in that direction");

		display.playEffect( this.locked_sound_file);

		return;
	}

	//Flip the elements in the array

	var _newIndex = _indexToMove + _val;

	var _temp = _arr[ _newIndex ];

	_arr[_newIndex] = _arr[_indexToMove];

	_arr[_indexToMove] = _temp;	


	db.ghChat.update( { _id: _recordID }, { $set: { d: _arr } } );
}


//*********************************************************************************
//
//				UTILITY FUNCTIONS
//
//*********************************************************************************

	this.closeParentAndChild = function( _rel ) {

		this.parentRecordID.set ( "" );

	    this.childRecordID.set ( "" );
	}

	this.enableConfigureMode = function( _rel ) {

		this.configureRelation.set( _rel );

		this.configureMode.set(true);	
	}

	this.endConfigureMode = function(){

		this.configureRelation.set( "" );

		this.configureMode.set(false);	

	}

	this.fixDestination = function( _dest ) {

		var _res = _dest.substr(3);  //lop off the ">  "

		return _res;
	}

	this.getRecordID = function( _rel ) {

		if (_rel == "grand") return this.grandRecordID.get();

		if (_rel == "parent") return this.parentRecordID.get();

		if (_rel == "child") return this.childRecordID.get();		
	}

	this.isRealDestination = function( _s ) {

		if ( _s != "*" && _s != "root" && _s != "exit" &&  _s.indexOf("@") == -1 ) return true;

		return false;
	}

	this.switchSpeaker = function( _val ) {

		if (_val == "u") return "h";

		if (_val == "h") return "u";

		showMessage("Unknown or null speaker code passed to smed.switchSpeaker -- " + _val)		
	}

	this.showAll = function() {

		sed.findSelector.set( {} );
	}

//*********************************************************************************
//
//				DELETE FUNCTIONS
//
//*********************************************************************************

	this.abortDelete = function() {

		this.responseToDelete = "";

		this.relationOfDelete = "";		
	}

	this.deleteResponse = function( _dest, _rel) {

		this.responseToDelete = _dest;

		this.relationOfDelete = _rel;

		this.compileDescendants( _dest );

		$("h4#chatEditWarningHeader").text("Warning!")

		$("p#chatEditWarningMessage").text("Are you sure you want to delete response for destination: '" + _dest + "', along with " + this.descendantsList.length + " descendant records?");

		$("#chatEditWarningModal").modal();
	}

	this.finishDelete = function() {

		var _dest = this.responseToDelete;

		var _rel = this.relationOfDelete;

		var _recordID = this.getRecordID( _rel );

		var _rec = db.ghChat.findOne( { _id: _recordID } );

		var _arr = _rec.d;

		var _newData = [];

		var _obj = null;

		for (var i = 0; i < _arr.length; i++) {

			_obj = _arr[i];

			if ( _obj.g != _dest) _newData.push( _obj );
		}				

		db.ghChat.update( { _id: _recordID }, { $set: { d: _newData } } );

		//remove the descendants using the list generated above in deleteResponse()

		_arr = this.descendantsList;

		for (var i = 0; i < _arr.length; i++) {

			_rec = db.ghChat.findOne( { c: this.storyCode, s: this.chatName, n: _arr[i] } );

			if (! _rec ) continue;

			var _ID = _rec._id;

			db.ghChat.remove( { _id: _ID } );
		}			

	}

//*********************************************************************************
//
//				SAVE FUNCTIONS
//
//*********************************************************************************

	this.saveRecord = function( _rel) {

		var _data = [];

		var _recordID = this.getRecordID( _rel );

		var _len = db.ghChat.findOne( { _id: _recordID } ).d.length;

		for (var i = 0; i < _len; i++) {

			var _dest = "";

			//create the response objects array

			//first the response text itself 

			var _ID = "#response_" + _recordID + "_" + i;

			var _response = $( _ID ).val();

			//is the 'edit destination' field in the DOM?

			_ID = "#editDestination_" + _recordID + "_" + i;

			if ( $( _ID).length ) {

				_dest = $( _ID).val();

			}
			else {

				//... then no edit dest field found, so get the value from the button

				_ID = "#destination_" + _recordID + "_" + i;

				_dest = $( _ID ).text();

				if ( _dest.length == 3) {  //i.e. only ">  "; must be a new record

					_dest = this.createDestinationName( _response, _rel );

				}
				else {

					_dest = this.fixDestination( _dest );
				}

			}

			//put the values into a blank object

			var _obj = {};

			_obj.t = _response;  // t for text

			_obj.g = _dest;  //g for goTo

			_data.push( _obj );

		}

		//get the name from the field

		_ID = "#name_" + _recordID;

		var _name = $( _ID ).val();

		//if there's an execute value, get it

		var _execute = "";

		_ID = "#execute_" + _recordID;			

		if ( $( _ID).length ) {

			_execute = $( _ID).val();
		}

		//assemble the update object

		var _updateObj = {};

		_updateObj.n = _name;

		_updateObj.d = _data;

		if (_execute) _updateObj.x = _execute;


		db.ghChat.update( { _id: _recordID }, { $set: _updateObj } );


		//if a new response(s) was added since the last save, we need to create a record for it

		this.checkForDestinationRecords( _rel);

		this.endConfigureMode();
	}

//*********************************************************************************
//
//				TRAVERSAL FUNCTIONS
//
//*********************************************************************************

	this.checkForDestinationRecords = function( _rel )  {

		var _recordID = this.getRecordID( _rel );

		var _rec = db.ghChat.findOne( { _id: _recordID } );

		var _arr = _rec.d;

		var _speaker = this.switchSpeaker( _rec.i );

		for (var i = 0; i < _arr.length; i++) {

			var _dest = _arr[i].g;

			var _destRecord = db.ghChat.findOne( {c: _rec.c, s: _rec.s, n: _dest } );

			if ( !_destRecord ) {

				db.ghChat.insert( {c: _rec.c, s: _rec.s, i: _speaker, d: [], n: _dest } )
			}

		}	
	}

	this.compileDestinations = function() {

		this.destinationList = [];

		var _arr = db.ghChat.find( { c: this.storyCode, s: this.chatName } ).fetch();

		for (var i = 0; i < _arr.length; i++) {

			var _name = _arr[i].n;

			//don't count the starting recs or any pseudo dests (like a switch to another chat or play command)

			if  ( this.isRealDestination( _name) ) {

				if ( this.destinationList.indexOf( _name) != -1) showMessage("Duplicated response record name found: " + _name);

				this.destinationList.push( _name );

			}
		}

		return this.destinationList;

	}



	this.compileDescendants = function( _name )  {

		this.descendantsList = [ _name ];  //we manually add this name to the list, b/c it is the first "descendant" of that response value

		this.compileDescendants2( _name);
	}

	this.compileDescendants2 = function( _name ) {

		var _rec = db.ghChat.findOne( { c: this.storyCode, s: this.chatName, n: _name } );

		if ( !_rec ) return;

		var _arr = _rec.d;

		for (var i = 0; i < _arr.length; i++) {

			var _dest = _arr[i].g;

			//don't count the starting recs or any pseudo dests (like a switch to another chat or a play command)

			if  ( this.isRealDestination( _dest) ) {

				if ( this.descendantsList.indexOf( _dest) == -1) this.descendantsList.push( _dest );

				this.compileDescendants2( _dest );
			}

		}
	}



}  //end story_messaging_editor






















