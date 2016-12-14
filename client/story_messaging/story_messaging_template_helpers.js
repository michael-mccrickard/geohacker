//messaging.js
Template.story_messaging.rendered = function() {

	stopSpinner();

	display.scrollToBottom();
}

Template.story_messaging.helpers({

	messageTarget: function() {

		return Meteor.users.findOne( { _id: game.user.sms.targetID.get() } );
	},

	av: function() {

		return Meteor.users.findOne( { _id: this.userID } ).profile.av;
	},

	username: function() {

		return Meteor.users.findOne( { _id: this.userID } ).username;
	},	

	message: function() {

		return Conversation.findOne( { _id: game.user.sms.threadID.get() }).messages;
	},

	isLoggedInUser: function() {

		if (this.userID == Meteor.user()._id) return true;

		return false;
	},
})



Template.story_messaging.events({

   'submit #message-form' : function(e, t){

      	e.preventDefault();
      
      	// retrieve the input field value
      
      	var _body = $('#editMessage').val();
    
		if (_body !== '') {

			game.user.sms.conversation.update( { "_id": game.user.sms.threadID.get() }, { $push: { messages: {

			     userID: Meteor.user()._id,

			     text: _body,
			     
			     createdAt: Date.now()

				} } }, function() { display.scrollToBottom(); }
			);
		}

		$('#editMessage').val( '' );

	  return false;
   }

});