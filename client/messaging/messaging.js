//messaging.js

Messaging = function() {

	if ( Meteor.user() ) this.userID = Meteor.user()._id;

	this.targetID = new Blaze.ReactiveVar( 0 );

	this.thread = null;

	this.threadID = new Blaze.ReactiveVar( "");

	this.startThread = function() {

		doSpinner();

		//this was set in the template helper?

        this.thread = null;

        this.thread = Conversation.findOne( {chatIds: {$all: [ this.targetID.get(), Meteor.userId() ] } } );
        
        if (this.thread) {

            //conversation already exists
        
            this.threadID.set(	this.thread ._id );
        }

        else{
        
            //no room exists
            var _id = Conversation.insert( { chatIds: [ this.targetID.get(), Meteor.userId()], messages:[] } );

            this.threadID.set( _id );

        }

        game.user.setMode( uMessage);

        stopSpinner();

	}

}