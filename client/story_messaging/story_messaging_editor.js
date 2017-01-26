

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

			//create the response objects array

			var _ID = "#response_" + _recordID + "_" + i;

			var _response = $( _ID ).val();

			_ID = "#destination_" + _recordID + "_" + i;

			var _dest = $( _ID ).text();

			_dest = _dest.substr(3);  //lop off the ">  "

			var _obj = {};

			_obj.t = _response;  // t for text

			_obj.g = _dest;  //g for goTo

			_data.push( _obj );

			//get the name from the field

			_ID = "#name_" + _recordID;

			var _name = $( _ID ).val();

			//if there's an execute value, get it

			var _execute = "";

			_ID = "#execute_" + _recordID;			

			if ( $( _ID).length ) {

				_execute = $( _ID).val();
			}
		}


		var _updateObj = {};

		_updateObj.n = _name;

		_updateObj.d = _data;

		if (_execute) _updateObj.x = _execute;

c( _updateObj)

		db.ghChat.update( { _id: _recordID }, { $set: _updateObj } );
	}
}






















