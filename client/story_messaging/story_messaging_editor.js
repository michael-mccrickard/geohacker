

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


		var _arr = _rec.d;

		var _skipCount = 0;

		for (var i = 0; i < _arr.length; i++) {

			var _arrVal = _arr[i].g;

			for (var j = 0; j < _arr.length; j++) {

				var _test = _text + "_" + j;

//c("testing " + _arrVal + " and " + _test)

				if (_arrVal == _test) {
//("incing skipCount")
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
c("dest field from edit field is " + _dest)
			}
			else {

				//... then no edit dest field found, so get the value from the button

				_ID = "#destination_" + _recordID + "_" + i;

				_dest = $( _ID ).text();

				if ( _dest.length == 3) {  //i.e. only ">  "; must be a new record

					_dest = this.createDestinationName( _response, _rel );
c("calced dest name is " + _dest)
				}
				else {
c("dest value from button is " + _dest)
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

		this.endConfigureMode();
	}
}






















