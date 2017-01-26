

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

			this.closeElement(  _sourceRelation );

			return;
		}

		var _rec = db.ghChat.findOne( { c: sed.code.get(), s: this.chatName, n: _name } );

		if (!_rec) {

			showMessage("smed.editResponse could not find record for " + _name);

			return;
		}

		if ( _sourceRelation == "grand" ) this.parentRecordID.set ( _rec._id );

		if ( _sourceRelation == "parent" ) this.childRecordID.set ( _rec._id );
	}

	this.closeElement = function( _rel ) {

		this.childRecordID.set ( "" );

		if ( _rel == "parent" ) this.parentRecordID.set ( "" );
	}
}