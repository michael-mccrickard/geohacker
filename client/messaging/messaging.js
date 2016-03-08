//messaging.js

Template.messaging.helpers({

	messageTarget: function() {

		return Meteor.users.findOne( { _id: Session.get("sUserMessageTargetID") } );
	},
})