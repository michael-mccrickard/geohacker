

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


	this.init = function( _chatRecordID )  {

		this.reset();

		this.grandRecordID.set( _chatRecordID );

		this.chatName = db.ghChat.findOne( { _id: _chatRecordID } ).s;
	}

	this.reset = function() {

		this.grandRecordID.set( "" );

		this.parentRecordID.set( "" );

		this.childRecordID.set( "" );

		this.chatName = "";

	}

	this.editResponse = function( _name, _sourceRelation) {

		if (_name == "exit") {

			this.closeParentAndChild();

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

	this.closeParentAndChild = function( _rel ) {

		this.parentRecordID.set ( "" );

	    this.childRecordID.set ( "" );
	}

	this.abortDelete = function() {

		this.responseToDelete = "";

		this.relationOfDelete = "";		
	}

	this.deleteResponse = function( _dest, _rel) {

		this.responseToDelete = _dest;

		this.relationOfDelete = _rel;

		$("h4#chatEditWarningHeader").text("Warning!")

		$("p#chatEditWarningMessage").text("Are you sure you want to delete response for destination: '" + _dest + "' ?");

		$("#chatEditWarningModal").modal();
	}

	this.finishDelete = function() {

		var _dest = this.responseToDelete;

		var _rel = this.relationOfDelete;

c("delete this dest val " + _dest)

		var _recordID = this.getRecordID( _rel );

		var _rec = db.ghChat.findOne( { _id: _recordID } );
c(_rec)
		var _arr = _rec.d;

		var _newData = [];

		var _obj = null;

		for (var i = 0; i < _arr.length; i++) {

			_obj = _arr[i];
c(_obj)
			if ( _obj.g != _dest) _newData.push( _obj );
		}				
c(_newData)
		db.ghChat.update( { _id: _recordID }, { $set: { d: _newData } } );

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

				_dest = this.fixDestination( _dest );

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

		this.endConfigureMode();
	}
}






















