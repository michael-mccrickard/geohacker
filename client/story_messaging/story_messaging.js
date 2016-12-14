//messaging.js

StoryMessaging = function() {

	if ( Meteor.user() ) this.userID = Meteor.user()._id;

	this.targetID = new Blaze.ReactiveVar( 0 );

	this.thread = null;

	this.threadID = new Blaze.ReactiveVar( "");

    this.conversation = new Meteor.Collection(null);

	this.startThread = function() {

		doSpinner();

		//this was set in the template helper?

        this.thread = null;

        this.thread = this.conversation.findOne( {chatIds: {$all: [ this.targetID.get(), Meteor.userId() ] } } );
        
        if (this.thread) {

            //conversation already exists
        
            this.threadID.set(	this.thread ._id );
        }

        else{
        
            //no room exists
            var _id = this.conversation.insert( { chatIds: [ this.targetID.get(), Meteor.userId()], messages:[] } );

            this.threadID.set( _id );

        }

        //game.user.setMode( uMessage);

        stopSpinner();

	}


}