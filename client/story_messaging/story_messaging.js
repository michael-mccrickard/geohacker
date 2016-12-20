//messaging.js

StoryMessaging = function() {

    //conversation level properties

	if ( Meteor.user() ) this.userID = Meteor.user()._id;

	this.targetID = new Blaze.ReactiveVar( 0 );

    this.lastSpeakerID = "";

	this.thread = null;

	this.threadID = new Blaze.ReactiveVar( "");

    this.updateFlag = new Blaze.ReactiveVar( false );

    this.conversation = new Meteor.Collection(null);


    //speech level properties

    this.speechIndex = 0;

    this.text = "";

    this.dest = "";

    this.choices = [];

    this.dests = [];

    this.targetObj = null;

    this.createTarget = function( _char) {

        this.targetID.set( _char.ID );

        this.targetObj = {

            name: _char.name,

            ID: _char.ID,

            shortName: _char.shortName,

            pic: _char.pic
        }
    }

    this.createChatSource = function( _arr ) {

        var _obj = {};

        var obj = {};

        for (var i = 0; i < _arr.length; i++ ) {

            _obj = _arr[i];

            obj[ _obj.n ] = _obj;
        }

        return obj;
    }

    this.updateContent = function() {

        var _val = this.updateFlag.get();

        this.updateFlag.set( !_val );
    }

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
        
            //no conversation exists

            var _id = this.conversation.insert( { chatIds: [ this.targetID.get(), Meteor.userId()], messages:[] } );

            this.threadID.set( _id );

        }

        stopSpinner();

	}

    this.startChat = function( _arr ) {

        this.source = this.createChatSource( _arr );

        //who spoke last, if anybody?

        if (this.lastSpeakerID) {

            if (this.lastSpeakerID == this.userID) {

                this.doUserChoices("*");

                return;
            }
        }

        this.doHelperSpeech( "root" );

    }

    this.doHelperSpeech = function( _val ) {

        this.text = this.source[ _val ].d[ 0 ].t;  //for helper speeches, we should only ever one item in this d array

        this.dest = this.source[ _val ].d[ 0 ].g;


        this.addNPCMessage( this.text );

        this.doUserChoices( this.dest );
    }

    this.doUserChoices = function( _val ) {

        //get the string from object dest (the + 1 is a temporary stand-in)

        this.choices = [];

        this.tmp = this.source[ _val ].d;  //user objects should have at least two objs

        this.dests = [];

        for (var i = 0; i < this.tmp.length; i++) {

            this.choices.push( this.tmp[ i ].t );

            this.dests.push( this.tmp[ i ].g );
        }

        game.user.sms.updateContent();
    }

    this.processUserChoice = function( _text, _index ) {

        this.dest = this.dests[ _index ];

        this.addUserMessage( _text );

        if (this.dest == "*") {

            this.doUserChoices( this.dest );

            return;
        } 

        if (this.dest == "exit") {

            story.mode.set("scene")

            return;
        } 

        this.doHelperSpeech( this.dest );
    }

    this.greetAgent = function() {

        var _body = "Yes, Agent " + game.username() + "...?";

        this.addNPCMessage( _body );   
    }

    this.addNPCMessage = function( _body ) {

        this.addMessage( this.targetID.get(), _body)
    }

    this.addUserMessage = function( _body ) {

        this.addMessage( Meteor.userId(), _body)
    }

    this.addMessage = function( _speakerID, _body ) {

        this.lastSpeakerID = _speakerID;

        game.user.sms.conversation.update( { "_id": game.user.sms.threadID.get() }, { $push: { messages: {

             userID: _speakerID,

             text: _body,
             
             createdAt: Date.now()

            } } }, function() { 

                if ( $(window).height() < $(document).height() ) display.scrollToBottom();

            }
        );   
    }

    this.userChoice = function( _index ) {

     var _key = storyA_chat1

//Database.getObjectIndexWithValue = function( _arr, _field, _val) 

    }

}