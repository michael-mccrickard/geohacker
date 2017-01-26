

StoryMessagingEditor = function() {
	
this.recordID = new Blaze.ReactiveVar("");



	this.helperRecordID = new Blaze.ReactiveVar("");

	this.agentRecordID = new Blaze.ReactiveVar("");

	this.helperRootSpeechName = "root";

	this.helperRootSpeech = "Yes ...";	

	this.agentRootSpeechName = "*";

	this.speaker = new Blaze.ReactiveVar("h");;   //h or a (helper or agent);

	this.helperPic = "happy.png";

	this.chatName = "";


	this.set = function( _chatRecordID )  {

		this.recordID.set( _chatRecordID );

		this.chatName = db.ghChat.findOne( { _id: _chatRecordID } ).s;
	}
}