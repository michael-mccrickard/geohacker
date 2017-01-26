
showExecuteField = new Blaze.ReactiveVar( false );

//Template.story_messaging_element.events = {}


Template.story_messaging_editor.helpers({

	chatName: function() {

		return smed.chatName;
	},

	childRecord: function() {

		if ( !smed.childRecordID.get() ) return;

		var _obj = db.ghChat.findOne( { _id: smed.childRecordID.get() } );

		_obj.relation = "child";

		return _obj;
	},


	parentRecord: function() {

		if ( !smed.parentRecordID.get() ) return;

		var _obj = db.ghChat.findOne( { _id: smed.parentRecordID.get() } );

		_obj.relation = "parent";

		return _obj;
	},

	grandRecord: function() {

		if ( !smed.grandRecordID.get() ) return;

		var _obj = db.ghChat.findOne( { _id: smed.grandRecordID.get() } );

		_obj.relation = "grand";

		return _obj;
	},

});


Template.story_messaging_element.helpers({

	chatUserPic : function() {

		if (this.i == "u") return game.user.profile.av;

		if (this.i == "h") return smed.helperPic;		
	},

	response: function() {

  		return this.d;
	},

	hasExecuteField: function() {

		if (this.x) return true
	},

	chatElementType: function() {

		if (this.i == "u") return "Response set:";

		if (this.i == "h") return "Helper speech:";		
	},

	relation: function() {

		return Template.parentData(1).relation;
	},

	isUser: function() {

		if (this.i == "u") return true;

		return false; 
	},

	responseID: function( _index ) {

		return ( Template.parentData(1)._id + "_" + _index );
	}

});