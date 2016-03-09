//messaging.js

Messaging = function() {

	this.userID = Meteor.user()._id;

	this.targetID = new Blaze.ReactiveVar( 0 );

	this.thread = null;

	this.threadID = new Blaze.ReactiveVar( "");

	this.startThread = function() {

		waitOnDB();

		//this was set in the template helper?

        //Session.set('targetID', this.targetID.get());

        this.thread = null;

        this.thread = Conversation.findOne( {chatIds: {$all: [ this.targetID.get(), Meteor.userId() ] } } );
        
        if (this.thread) {

            //conversation already exists
            //Session.set("conversationID", res._id);
        
            this.threadID.set(	this.thread ._id );
        }

        else{
        
            //no room exists
            var _id = Conversation.insert( { chatIds: [ this.targetID.get(), Meteor.userId()], messages:[] } );

            this.threadID.set( _id );

            //Session.set('conversationID', newRoom );
        }

        game.user.setMode( uMessage);

        stopWait();

/*

	    Meteor.user().findExistingConversationWithUsers(participants, function(error, result){

	        if(result){
	        
	            console.log("load existing conversation here");

console.log("id in messaging is " + result);

				game.user.msg.threadID.set( result );

	            game.user.msg.thread = Meteor.conversations.findOne( { _id: result } );

	        }
	        else {

	        	game.user.msg.thread = new Conversation().save() ;

	        	game.user.msg.threadID.set( game.user.msg.thread._id );

	        	game.user.msg.thread.addParticipant( Meteor.users.findOne({ _id: game.user.msg.targetID.get() }) );

	        }

	        game.user.setMode( uMessage);

	        stopWait();
	    });
*/

	}

	this.addToThread = function( _body ) {

		this.thread.sendMessage( _body );
	}


}