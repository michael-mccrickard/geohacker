


Game = function() {

	this.user = null;

	this.currentEmail = "";  //we store the email address entered on the login screen

	this.newUser = true; 

	this.hackStartTime = 0;

	this.hackTotalTime = 0;

	this.musicOn = true;

	this.musicStarted = false;

	this.musicCount = 0;

	this.music = [];

	this.intro = new Intro();

	this.mode = new Blaze.ReactiveVar( gmNormal );


	//this.music = ["amber.mp3","yellow.mp3","agent_d_cooper.mp3", "geohackerAmbientSofter.mp3", "geohackerThemeSoftest.mp3"];

//this.music = ["spy_story.mp3","an_agent_alone.mp3","crystal_waters.mp3", "deep_serenity.mp3","zen.mp3","amber.mp3","yellow.mp3","agent_d_cooper.mp3", "geohackerAmbientSofter.mp3", "geohackerThemeSoftest.mp3"];


	this.showHelp = function() {

		FlowRouter.go("/help2");
	}

	//this is called by an eventListener and executes in a different context,
	//so "this" is replaced by "game"  here

	this.musicDone = function() {

		if (!game.musicOn) return;

		game.musicCount++;

		if (game.musicCount > game.music.length - 1) game.musicCount = 0;

		$("#musicPlayer").attr("src", game.music[ game.musicCount ] );

		game.playMusic();

	}

	this.pauseMusic = function() {

		c("pausing music in game.js")

		document.getElementById("musicPlayer").pause();		
	}

	this.playMusic = function() {

		c("playing music in game.js")
		
		if (this.musicOn == false) return;

		if (this.musicStarted == false) {

			Database.shuffle( this.music );

			$("#musicPlayer").attr("src", this.music[ this.musicCount ] );

			this.musicStarted = true;
		}

		document.getElementById("musicPlayer").play();		
	},

	this.stopMusic = function() {

		this.pauseMusic();

		this.musicOn = false;	
	}

	this.startMusic = function() {

		this.musicStarted = false;

		if (this.music.length == 0) {

			var _arr = db.ghMusic.find().fetch();

			this.music = Database.makeSingleElementArray( _arr, "u");

		}

		this.musicOn = true;	

		Meteor.setTimeout( function() { game.playMusic(); }, 2000 );
	}

	this.setMusicPlayerListener = function() {

		  Meteor.setTimeout(function() { 

		    music = document.getElementById("musicPlayer");

		    music.addEventListener('ended', game.musicDone); 
		  
		 }, 10000);
	}

	this.setSoundControlListener = function() {

		  Meteor.setTimeout(function() { 

		    music = document.getElementById("soundPlayer");

		    music.addEventListener('ended', game.soundControlDone); 
		  
		 }, 4000);
	},

	this.soundControlDone = function() {

		hacker.ctl["SOUND"].setState( sPaused );

		//if SOUND is the current ctl, then set it again to force a redraw of the feature area

		if (hacker.feature.item.getName() == "SOUND") {

			hacker.feature.item.setImageSource( "SOUND" );

			//force the static GIF here

		}

		game.playMusic();
	}

	/**************************************************************/
	/*             USER ACCOUNTS    
	/**************************************************************/

	//this is triggered by the onLogin event

	this.createGeohackerUser = function() {


		var _user =	new User( Meteor.user().username); //name

		_user.profile = Meteor.user().profile;

		_user.assigns = Meteor.user().profile.a;

		if (!_user.assigns.length) _user.createAssigns();

		_user.assignCode = Meteor.user().profile.c;

		_user.setAtlas( Meteor.user().profile.h );

		if (Meteor.user().profile.nsn) _user.lastNewsDate = Meteor.user().profile.nsn;

		if ( Meteor.user().profile.ut ) _user.title = Meteor.user().profile.ut;

		_user._id = Meteor.userId();

		//for the conversations object

		_user.msg.userID = Meteor.userId();

		if (Meteor.user().profile.av) _user.photoReady.set( true );

		var _date = new Date();

		return _user;

	}

	this.logout = function() {

		Meteor.logout( function( _err )  {

				game.user = null;

				Session.set("sLoginNow", true);

				FlowRouter.go("/start");
			}
		);
	},

	this.deleteUserS3File = function(_file) {

		var prefixLen = prefix.length;

		_file = _file.substring( prefixLen );

 		Meteor.call( "deleteS3File", _file, function(error, res) {

 			if (error) {

 				console.log(error);

 				return;
 			}

	 	});
	}

	this.deleteUser = function(_ID) {


 		var rec = Meteor.users.findOne( { _id: _ID});

 		this.deleteUserS3File( rec.profile.av );	

	 	Meteor.call("deleteRecord", _ID, cUser);

	},

	this.doResetPassword = function() {

	    if ( this.currentEmail.length ) {
      
          Accounts.forgotPassword( { email: this.currentEmail } , function(err){
          
	          if (err) {

			   	Session.set("sLoginPrompt", err.reason.toUpperCase() );

			   	Session.set("sLoginPromptTextColor", "redText");	          	
	          }
	            
	          else {

			   Session.set("sLoginPrompt", "PASSWORD RESET INSTRUCTIONS HAVE BEEN SENT TO YOUR EMAIL ADDRESS.");

			   Session.set("sLoginPromptTextColor", "greenText"); 
	          }
	      });

	    }

	}

	this.username = function() {

		if ( Meteor.user().emails[0].address.indexOf("example.com") != -1) return capitalizeAllWords( this.user.name );

		return this.user.name;
	}

}  //end game object