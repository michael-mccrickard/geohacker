


Game = function() {

	this.user = null;

	this.currentEmail = "";  //we store the email address entered on the login screen

	this.newUser = true; 

	this.hackStartTime = 0;

	this.hackEndTime = 0;

	this.musicOn = true;

	this.musicStarted = false;

	this.musicCount = 0;

	this.music = ["amber.mp3","yellow.mp3","agent_d_cooper.mp3", "geohackerAmbientSofter.mp3", "geohackerThemeSoftest.mp3"];


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

		document.getElementById("musicPlayer").pause();		
	}

	this.playMusic = function() {

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

		this.musicOn = true;	

		this.playMusic();
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

		display.ctl["SOUND"].setState( sPaused );

		//if SOUND is the current ctl, then set it again to force a redraw of the feature area

		if (display.feature.getName() == "SOUND") {

			display.feature.loadAgain( "SOUND" );

			display.feature.set( "SOUND" );
		}

		game.playMusic();
	}

	/**************************************************************/
	/*             USER ACCOUNTS    
	/**************************************************************/

	//this is triggered by the onLogin event

	this.createGeohackerUser = function() {

		var _user = null;
		
		//for a newly-created user, the game.user object is already set;
		//if it's not, then we need to read in the data from the db for this user
		//and apply it to game.user

		if (game.user == null)  {

			_user =	new User( Meteor.user().username, Meteor.user().profile.s ); //name, scroll pos (for content editors)

			_user.assigns = Meteor.user().profile.a;

			//eventually we may want to update the assigns with any newly-added or revised missions here

			_user.assignCode = Meteor.user().profile.c;

			_user.setAtlas( Meteor.user().profile.h );
		}
		else {

			//for the newly-created user, we take this opportunity
			//to update their record in the database, so their mission
			//list is saved

			_user = game.user;

			db.updateUserRec();
		}

		return _user;

	}

	this.logout = function() {

		Meteor.logout();

		game.user = null;

		Session.set("sLoginNow", true);

		Router.go("/start");
	},

	this.doResetPassword = function() {

	    if ( this.currentEmail.length ) {

    	  var id = Meteor.users.find( { 'emails[0].address': this.currentEmail } )._id;
      
          Accounts.forgotPassword( { email: this.currentEmail } , function(err){
          
	          if (err) {

			   	Session.set("sLoginPrompt", err.toUpperCase() );

			   	Session.set("sLoginPromptTextColor", "redText");	          	
	          }
	            
	          else {

			   Session.set("sLoginPrompt", "PASSWORD RESET INSTRUCTIONS HAVE BEEN SENT TO YOUR EMAIL ADDRESS.");

			   Session.set("sLoginPromptTextColor", "greenText"); 
	          }
	      });

	    }

	}

}  //end game object