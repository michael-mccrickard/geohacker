
showExecuteField = new Blaze.ReactiveVar( false );

Template.story_messaging_editor.helpers({

	chatName: function() {

		return smed.chatName;
	},

	childRecord: function() {

return db.ghChat.findOne( { s: smed.chatName, n: "painting?" } );
	},


	parentRecord: function() {

		return db.ghChat.findOne( { s: smed.chatName, n: "*" } );
	},

	grandRecord: function() {

		return db.ghChat.findOne( { s: smed.chatName, n: "root" } );
	}
});


var _index = -1;

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


});