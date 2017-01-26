

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

	chatElementType: function() {

		if (this.i == "u") return "Response set:";

		if (this.i == "h") return "Helper speech:";		
	},

	chatUserPic : function() {

		if (this.i == "u") return game.user.profile.av;

		if (this.i == "h") return smed.helperPic;		
	},

	destinationIDFromParent: function( _index ) {

		return ( "destination_" + Template.parentData(1)._id + "_" + _index );
	},


	elementColor: function() {

		if (this.i == "u") return "blue";

		if (this.i == "h") return "red"; 
	},

	executeID: function( _index ) {

		return ( "execute_" + this._id);
	},	

	executeValue: function() {

		if (!this.x.length) return "enter command here";

		return this.x;
	},

	hasExecuteField: function() {

		if (this.x) return true;
	},

	isUser: function() {

		if (this.i == "u") return true;

		return false; 
	},


	nameID: function() {

		return "name_" + this._id;
	},

	relationFromParent: function() {

		return Template.parentData(1).relation;
	},

	response: function() {

  		return this.d;
	},

	responseIDFromParent: function( _index ) {

		return ( "response_" + Template.parentData(1)._id + "_" + _index );
	},


});