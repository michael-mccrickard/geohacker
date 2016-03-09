//messaging.js
Template.messaging.rendered = function() {

	c("rendered")
}

Template.messaging.helpers({

	messageTarget: function() {

		return Meteor.users.findOne( { _id: game.user.msg.targetID.get() } );
	},

	av: function() {

		return Meteor.users.findOne( { _id: this.userID } ).profile.av;
	},

	username: function() {

		return Meteor.users.findOne( { _id: this.userID } ).username;
	},	

	message: function() {

		return Conversation.findOne( { _id: game.user.msg.threadID.get() }).messages;
	},

	isLoggedInUser: function() {

		if (this.userID == Meteor.user()._id) return true;

		return false;
	},
})



Template.messaging.events({

   'submit #message-form' : function(e, t){

      	e.preventDefault();
      
      	// retrieve the input field value
      
      	var _body = $('#editMessage').val();
    
		if (_body !== '') {

			Conversation.update( { "_id": game.user.msg.threadID.get() }, { $push: { messages: {

			     userID: Meteor.user()._id,

			     text: _body,
			     
			     createdAt: Date.now()

				} } }, function() { document.documentElement.scrollTop = document.body.scrollTop = $(document).height() }
			);
		}

		$('#editMessage').val( '' );

		//document.getElementById('editMessage').value = '';


//	  game.user.msg.addToThread( _body );

	  return false;
   }

});