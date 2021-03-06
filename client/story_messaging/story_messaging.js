//messaging.js

StoryMessaging = function() {

    //conversation level properties

	if ( Meteor.user() ) this.userID = Meteor.user()._id;

	this.targetID = new Blaze.ReactiveVar( 0 );

	this.thread = null;

	this.threadID = new Blaze.ReactiveVar( "");

    this.updateFlag = new Blaze.ReactiveVar( false );

    this.showEntryBox = new Blaze.ReactiveVar( true );

    this.conversation = new Meteor.Collection(null);

    this.source = {};

    this.tempSource = [];

    this.targetEntity = null;


    //speech level properties

    this.text = "";

    this.dest = "";

    this.choices = [];

    this.dests = [];

    this.targetObj = null;

    //this is the dummy target used in the editor

    this.createHelperTarget = function() {

          this.targetObj = {

            name: 'Helper',

            ID: 'helper',

            shortName: 'helper',

            pic: smed.helperPic
        }

        this.targetEntity = this.targetObj;

        this.targetID.set( 'helper' );      
    }

    this.createTarget = function( _char) {

        this.targetObj = {

            name: _char.name,

            ID: _char.ID,

            shortName: _char.shortName,

            pic: _char.pic
        }

        this.targetID.set( _char.ID );

        this.targetEntity = _char;

    }

    //Take the scalar array of objects, _arr, and change it into an associative
    //array of objects, using the n value as the key

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

        if ( this.targetEntity.chat != story.chat ) {

            this.targetEntity.chat = story.chat; 

            this.doHelperSpeech( "root" );
        }
        else {

            c("continuing existing chat");

            this.doHelperSpeech( this.targetEntity.lastSpeech );           
        }
    }

    this.doHelperSpeech = function( _val ) {

        //in some cases, there is no helper response, instead we just jump to the next user choice set

        //For instance, dialogues that have multiple branches off from the user's main choice set ("*"),
        //once the dialogue reaches the end of a branch, the last user choice will be
        //something like "OK" or "Thanks".  These choices will have the dest set to "*",
        //The dest value is normally the helper's next speech, but since we are at the end
        //of the branch, there is no helper response and  we immediately re-load the main set (*).

        //In other cases, we are simply branching back to an earlier set of choices

        //So the first thing to determine is whether or not there is an object with the key _val in the source

        if ( this.source[ _val] ) {

            //... and is this a helper speech?  If not, we're either playing a scene or just presenting the next user choice set

            if (this.source[ _val].i == "h") {

                this.text = this.source[ _val ].d[ 0 ].t;  //for helper speeches, we should only ever have one item in this d array

                this.dest = this.source[ _val ].d[ 0 ].g;

                this.targetEntity.lastSpeech = _val;

                this.addNPCMessage( this.text );                   
            }

            this.checkExecute( this.source[ _val ] );  //we may need to set a flag or something
        }

        //are we exiting and playing a scene here, instead of a normal helper response or more user choices?

        if ( this.dest.substr(0,5) == "play@" ) {

            var _tmp = this.dest.split("@");

            story.play( _tmp[1] );

            return;
        }

        //are we exiting and executing a command here, instead of a normal helper response or more user choices?

        if ( this.dest.substr(0,4) == "exe@" ) {

            var _tmp = this.dest.split("@");

            eval( _tmp[1] );

            return;
        }

        story.playEffect("message2.mp3");

        this.createUserChoices( this.dest );
    }

    this.createUserChoices = function( _val ) {

        //get the string from object dest (the + 1 is a temporary stand-in)

        this.choices = [];

        //are the choices in another chat source?

        if ( _val.indexOf("@")  != -1 ) {

            var _arr = _val.split("@");

            var _newDest = _arr[0];

            var _newChat = _arr[1];

            //eval this so that js sees _newChat as an object, not a string?????

            this.tempSource = db.ghChat.find( { s: _newChat } ).fetch();

            this.source = this.createChatSource( this.tempSource );

            //assuming for now, the switch is always to a user choice set

            this.createUserChoices( _newDest );

            return;       
        }

        this.checkExecute( this.source[ _val ] );  //we may need to set a flag or something

        this.tmp = this.source[ _val ].d;  //user arrays should have at least two objs

        this.dests = [];

        for (var i = 0; i < this.tmp.length; i++) {

            this.choices.push( this.tmp[ i ].t );

            this.dests.push( this.tmp[ i ].g );
        }

        Meteor.setTimeout( function() { 

            game.user.sms.showEntryBox.set( true );

            game.user.sms.updateContent();

        }, 1000);
    }

    this.processUserChoice = function( _text, _index ) {

        this.dest = this.dests[ _index ];

        this.addUserMessage( _text );

        this.showEntryBox.set( false );

        if (this.dest == "exit") {

            story.returnToScene();

            return;
        } 

        story.playEffect("message1.mp3")

        this.updateContent();

        Meteor.setTimeout( function() { game.user.sms.doHelperSpeech( game.user.sms.dest ); }, 1000 );
    }

    this.checkExecute = function( _obj ) {

        if ( _obj.x ) {

            eval (_obj.x );
        }
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

        game.user.sms.conversation.update( { "_id": game.user.sms.threadID.get() }, { $push: { messages: {

             userID: _speakerID,

             text: _body,
             
             createdAt: Date.now()

            } } }, function() { 

                //if ( ( $(window).height() * 0.75 ) < $(document).height() ) {

                    display.animateScrollToBottom();
                //}
            }
        );   
    }

}