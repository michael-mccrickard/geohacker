 

User = function( _name ) {  //name, scroll pos (for content editors)

	this.name = _name;

	this.missionHack = new Hack();

	this.missionHacker = new Hacker();

	this.browseHack =  new Hack();

	this.browseHacker = new Hacker();

	this.msg = new Messaging();

	this.assignCode = "0";  //last-started mission; game object sets this from db

	this.assigns = [];   //the array of assign data objects, game object sets this from db

	this.assign = null;

	this.atlas = [];  //cumulative list of ticket objects  

    this.mode = uNone;  //determines the content on the user's home screen

    this.prevMode = uNone;  //remember what the last-used mode was before going to uBrowse (Map or Country)

    this.photoReady = new Blaze.ReactiveVar( false );  //are we ready to display user's photo in nav bar?

    this.bio = new Bio();

    this.template = new Blaze.ReactiveVar( "" );  //template for the above content

    this.profile = {};

    this.title = "";

    this.editMode = new Blaze.ReactiveVar( false );  //is the user editing the profile content?

    this.badgeLimit = 0;

    this.networkAgentsDataReady = false;

    this.headline = new Headline( "welcomeAgent" );

    this.lessonSequenceCode = new Blaze.ReactiveVar("");

    this.returnRoute = "";  

    this.returnName = "";

    this.isGuest = false;

    this._id = "";

    this.prevHackTime = 0;

    this.prevHackCountry = "";

    this.lastNewsDate = 0;

    this.deleteMeIfGuest = function() {

    	if (this.isGuest) {

    		Meteor.users.remove( { _id: this._id } );
    	}

    }


    this.browseCountry = function( _code, _returnRoute ) {

    Database.registerEvent( eExplore, game.user._id, _code);

     //the calling function passes _returnRoute as route to go back to 
     //with the RETURN TO XXXX button on the browse screen, and _returnName
     //(derived or set below) is the XXXX on that button

      this.returnRoute = _returnRoute;

      this.returnName = _returnRoute;

      if(_returnRoute == "newBrowse2") this.returnRoute = "browseWorldMap";

      if (_returnRoute == "worldMap" || _returnRoute == "browseWorldMap" || _returnRoute == "newBrowse2") this.returnName = "map";

      if (_returnRoute == "congrats") this.returnName = "mission";     

      if (_returnRoute == "lessonMap") this.returnName = "lesson";     

      this.setMode( uBrowseCountry );

      this.setGlobals( "browse" );


      display.suspendAllMedia();

		//if we're in lesson mode, uLearn, then the hack.countryCode
		//will aready be set to _code (to create the learning capsule) but
		//display will still have the previous countryCode (if any), so we
		//need to re-init the hacker.  If the codes are the same, then
		//we are probably just coming back from the browseMap

      if (_code != display.browser.countryCode) {

      	hack.initForBrowse( _code);
      }
      else {

      	FlowRouter.go("newBrowse2");
      }
      
    };

    //not currently running mode uStory through this ... (just setting it directly)

    this.setMode = function(_mode) {

    	// so this mode never even gets set??

    	if (_mode == uIntro) return;

    	deselectAllModes();

    	//store the current mode if we're going to browse something

    	if (_mode == uBrowseMap || _mode == uBrowseCountry || _mode == uHelp) {

    		if (this.mode != uBrowseMap && this.mode != uBrowseCountry && this.mode != uHelp ) this.prevMode = this.mode;
    	}
    	

    	this.mode = _mode;

    	if (_mode == uBio) {

	  		Meteor.defer( function() { $(".imgHomeAvatar").css("border-color","gray") } );

	  		this.bio.load();

    		this.template.set("bio");
    	}

    	if (_mode == uHack) {

    		if (!this.assigns.length) {

    			this.createAssigns();
    		
    		}
    		else {

    			//Update the assigns with any newly-added or revised missions

    			if ( Session.get("sUserMissionsUpdated") == false ) {

	     			Mission.updateAll( game.user );

	     			Session.set("sUserMissionsUpdated", true);
	     		}

    		}

    		this.setGlobals("hack");

	  		Meteor.defer( function() { $("#divHomeHackPic").css("border-color","gray") } );

	  		this.template.set("missionListing");
    	}

    	if (_mode == uLearn) {

    		this.setGlobals("browse");

	  		Meteor.defer( function() { $("#divHomeLearnPic").css("border-color","gray") } );

	  		if (!game.lesson) {

	  			game.lesson = new LessonFactory();

	  			game.lesson.init();
	  		}
	  		
	  		this.template.set("lessonMenu");
    	}


      	if (_mode == uMessage) {

	  		Meteor.defer( function() { $("#divHomeAgentsPic").css("border-color","gray") } );

			this.template.set("messaging");
     		
     	}

     	if (_mode == uAgents) {

	  		Meteor.defer( function() { $("#divHomeAgentsPic").css("border-color","gray") } );

			game.user.template.set("agent");

     	}

     	if (_mode == uStats) {

	  		Meteor.defer( function() { $("#divHomeStatsPic").css("border-color","gray") } );

     		this.template.set("stats");   	
     	}

     	if (_mode == uClockOut) {

	  		Meteor.defer( function() { $("#divHomeClockOutPic").css("border-color","gray") } );

     		game.logout();
     	}

     	if (_mode == uHelp) {

     		FlowRouter.go("help");
     	}

		display.playEffect( "blink.mp3" );


    }

    this.goBrowseMap = function() {

    	hacker.suspendMedia();

    	if (game.user.mode == uBrowseCountry) {

	      	var b = browseMap.worldMap;

	    	b.mapLevel = mlRegion;

	    	b.drawLevel = mlRegion;

	    	b.detailLevel = mlCountry;  		

	    	b.selectedCountry.set( hack.countryCode );

	    	b.selectedRegion = db.getRegionCodeForCountry( hack.countryCode );

	    	b.selectedContinent = db.getContinentCodeForCountry( hack.countryCode );	    	
    	}
    	else {

    		this.setGlobals("browse");

    		this.setMode( uBrowseMap );

    		browseMap.mode.set("browse");

    		display.browser.countryCode = "";  //reset this since we are going in fresh

    		//it should be possible to just let the browseMap remember where you last explored
    		//but at the moment, this can produce erratic map behavior when trying to drill down

    		game.user.setMode( uBrowseMap );

    		browseMap.reset();
    	}

    	display.playEffect( "mapButton.mp3" );

    	//we don't call setMode for uBrowseMap, because we manage that feature differently
    	//but we probably could now that we have reconfigured things.
    	//Mode is currently set to uBrowseMap in Template.newBrowseMap.rendered

    	FlowRouter.go("/browseWorldMap");
    	
    }

//when this is called, do we know for sure the mission isn't complete?

    this.resumeMission = function() {

    	this.setGlobals("mission");

    	this.mode = uHack;

    	this.setGlobals( "misson" );

		//they might have just clocked in ...

    	if (this.assign == null) {

    		this.assignAndStartMission( mission.code );

    		return;
    	}

    	//user might be resuming after immediately browsing the newly-hacked country 
    	
    	if ( hack.mode == mHackDone || hack.mode == mNone ) {

    		hack.startNext();

    		return;
    	}

    	hack.mode = mReady;

  		FlowRouter.go("/main");
    }

    this.setGlobals = function( _which ) {

    	if (_which == "mission") {

  			hack = this.missionHack;
    	}

       	if (_which == "browse") {

  			hack = this.browseHack;
    	} 	
    }

    this.goHome = function() {

		//The avatar button in the upper-left corner 
		//is what calls this function.
		//It might be faded b/c we're in the middle of some
		//sequence like hackDone.

		if ( display.homeButtonDisabled() ) return;

		game.mode.set( gmNormal );

		display.suspendAllMedia();

		display.stopEffects();

		if (display.browser) display.browser.suspendRotation = true;


    	if (FlowRouter.current().path == "/editor") {

    		editor.stopEditMedia();
    	}

    	if (this.mode == uBrowseMap || this.mode == uBrowseCountry)  {

    		game.playMusic();

    		this.returnFromBrowse();

    		return;
    	}

    	if (this.mode == uHelp) {

    		if (this.prevMode.length) {

    			this.mode = this.prevMode
    		}
    		else {

    			this.mode = uNone;
    		}
    	}
    		
    	if (this.mode == uNone || this.mode == uIntro || this.mode > uHelp) {   // > uHelp would be story or editing 

    		this.setMode( uHack );
    	}
    	else {

    		this.setMode( this.mode );
    	}

    	FlowRouter.go("/home");
    }

    this.returnFromBrowse = function() {

    	if (this.prevMode == uNone) {

    		this.prevMode = uHack;
    	}

    	this.setMode( this.prevMode ); 

    	FlowRouter.go("/home");
    }

    this.selectNewMission = function() {

    	display.suspendAllMedia();

    	this.setMode( uHack );

    	mission = null;
    	
    	FlowRouter.go("/home");   	
    }

    this.startNextHack = function() {

    	display.suspendAllMedia();

    	if (!game.user.assign) {

    		alert("Choose a mission from the Mission Select screen.");

    		game.user.setMode( uHack );

    		game.user.goHome();

    		return;
    	}

    	hack.startNext();
    }

    this.autoHack = function() {

    	if (hack.mode == 0 || this.mode != uHack) {

    		alert("You don't appear to be hacking right now.")

    		return;
    	}

    	hack.autoHack();
    }

	//need to check and see if we have a logged-in user before trying to make this call

	this.makeAvatar = function() {

		Meteor.call("makeAvatar", Meteor.userId(), function(error, result) {

			  if(error){
			    console.log(error.reason);
			    return;
			  }

		});
	} 

	this.avatar = function() {

		return Meteor.user().profile.av;
	}

	this.updateAvatar = function( url ) {

		Meteor.users.update( {_id: Meteor.userId() }, { $set: { 'profile.av': url}  });

		this.profile.av = url;
	}

	this.featuredPic = function() {

		return this.profile.p;
	}

	this.updateFeaturedPic = function( url ) {

		Meteor.users.update( {_id: Meteor.userId() }, { $set: { 'profile.p': url}  })

		this.profile.p = url;
	}

	this.updateLastEditedStory = function( _code ) {

		Meteor.users.update( {_id: Meteor.userId() }, { $set: { 'profile.lastEditedStory': _code }  })

		this.profile.lastEditedStory = _code;
	}


	this.hasChiefInNetwork = function() {

		if ( indexOf.this.profile.ag( Database.getChiefID()[0] ) == -1 ) return false;

		return true;
	}


 	/************************************************************************************************
	/*			ASSIGNS   		
	/*
	/*	An assign is a mission assigned to an individual user; it includes
	/*	the vars tracking that mission for that user: pool, hacks, completions.	
	/*
	/*	The user has an array of assigns and a current assign object (taken from the array).
	/*
	/*	A data-only version of the assign object array is stored in the a field of the user rec.
	/*
 	/***********************************************************************************************/

 	this.replaceAssigns = function() {

 		this.assigns = [];
 	
 		this.createAssigns();

 		Meteor.setTimeout( function() { db.updateUserHacks() }, 1000 );

 		showMessage("Updating user missions");
 	
 	}

 	this.getRootLevelAssigns = function() {

 		var _arr = [];

 		for (var i = 0; i < this.assigns.length; i++) {

 			if (this.assigns[i].level <= mlContinent) _arr.push( this.assigns[i] )
 		}

 		return _arr;
 	}

 	this.getSubAssignsForContinent = function( _code ) {

  		var _arr = [];
  		
  		var _index = this.findAssignIndex( _code );

 		for (var i = 0; i < this.assigns.length; i++) {

 			if (this.assigns[i].level == mlRegion) {

 				if (this.assigns[i].selectedContinent == _code) _arr.push( this.assigns[i] );
 			}
 		}

 		return _arr;		
 	}

 	this.createAssigns = function() {

 		var _assign = null;

 		var _mission = null;

 		//Any custom missions, like top ten lists and any other arbitrary (non-continental, non-region) missions
 		//have to be listed in the Mission.customList property  (in mission.js)

		//the Top Ten lists are first

		this.addNewAssign( "ttp" );

		this.addNewAssign( "ttp_africa" );

		this.addNewAssign( "ttp_asia" );

		this.addNewAssign( "ttp_europe" );

		this.addNewAssign( "ttp_americas" );


		//now the continents

		var _arr = db.ghZ.find().fetch();

		for (i = 0; i < _arr.length; i++) {

			this.addNewAssign( _arr[i].c );			
		}

		//now the regions

		var _arr = db.ghR.find().fetch();

		for (i = 0; i < _arr.length; i++) {

			this.addNewAssign( _arr[i].c );			
		}

		//now the last arbitrary ones

		this.addNewAssign( "pg" );

		this.addNewAssign( "all" );



	}

	this.addNewAssign = function(_code, _completions) {

		if (_completions === undefined) _completions = 0; 

		var _mission = new Mission( _code );

		_assign =  new Assign(_mission.code, _mission.mapCode, [], _mission.level, _mission.name, _mission.items, _completions)

		this.assigns.push( this.createAssignDataObject( _assign ) );		
	}

	this.assignMission = function( _code) {

		//create the mission object
		
		mission = new Mission( _code);

		mission.status = msInProgress;


		for (var i = 0; i < this.assigns.length; i++)  {

			//we check the code of each assign data object in the array ...

			if (this.assigns[i].code == _code) {

				//is the mission in a finished state?

				if (this.assigns[i].pool.length == 0) this.resetAssignDataObject( _code);

				var _assignData = this.assigns[i];

				this.assignCode = _code;

				//if we find it, we create the assign using our stored data

				this.assign = new Assign(_assignData.code, _assignData.mapCode, _assignData.hacked, _assignData.level, _assignData.name, _assignData.pool, _assignData.completions);



				return;
			}
		}
	}

	this.resetAssignDataObject = function( _code ) {

		var _index = this.findAssignIndex( _code );

		var _mission = new Mission( _code );

		//We re-create the assign object from scratch, except we carry over the current completions value

		var _assign = new Assign( _mission.code, _mission.mapCode, [], _mission.level, _mission.name, _mission.items, this.assigns[ _index ].completions );
	
		this.assigns[ _index ] = this.createAssignDataObject( _assign );
	}

	this.assignAndStartMission = function( _code) {

		//the user may have been browsing before this ...

		this.mode = uHack;

		this.setGlobals("mission");

		this.assignMission( _code );

		db.updateUserHacks();

		hack.startNext();  
	}

	this.findAssignIndex = function( _code) {

		for (var i = 0; i < this.assigns.length; i++)  {

			//we check the code of each assign data object in the array ...

			if (this.assigns[i].code == _code) {

				return i;
			}
		}

		return -1;

	}

	this.createAssignDataObject = function( _assign ) {

		var _a = { code: _assign.code, mapCode: _assign.mapCode, hacked: _assign.hacked, level: _assign.level, name: _assign.name, pool: _assign.pool, completions: _assign.completions, selectedContinent: _assign.selectedContinent };

		return _a;

	}

	this.updateAssignDataObject = function(_assign) {

		var _index = this.findAssignIndex( _assign.code );

		this.assigns[ _index ] = this.createAssignDataObject( _assign );
	}

	this.bumpAssign = function( _code ) {

		var _index = this.findAssignIndex( _code );

		if ( _index == -1) return;		

		var _assign = this.assigns[ _index ];

		//if we are bumping a region-level assign, then we need to bump the parent assign instead

		if (_assign.level == mlRegion) {

			_code = _assign.selectedContinent;

			_index = this.findAssignIndex( _code );

			_assign = this.assigns[ _index ];
		}

		this.assigns.splice(_index, 1);

		//put it back at the beginning

		this.assigns.unshift( _assign );
	}


 	/*******************************************************************************
	/*	ATLAS -- Lifetime list of hacked countries for this user;
	/*			 an array of Ticket objects	 (data only version stored in h: field)									 
 	/******************************************************************************/

 	this.setAtlas = function( _arr ) {

 		for (var i = 0; i < _arr.length; i++)  {

			var _ticket = new Ticket( _arr[i].id, _arr[i].cn, _arr[i].t );

			this.atlas.push( _ticket );
		}		

 	}

 	this.isCountryInAtlas = function( _code ) {

		for (var i = 0; i < this.atlas.length; i++)  {

			if (this.atlas[i].id == _code) return i;
		}

		return -1;
 	}

	this.getAtlasDataObject = function() {

		var _arr = [];

		for (var i = 0; i < this.atlas.length; i++)  {

			var obj = {id: this.atlas[i].id, cn: this.atlas[i].count, t: this.atlas[i].tag }

			_arr.push( obj );
		}

		return _arr;
	}

	//use this to build the list (masonry display) of countries in the user Stats section

	this.atlasIDs = function() {

		return( Database.makeSingleElementArray( this.atlas, "id") );
	}


 	/******************************************************************
	/*			TICKETS -- associate a user with a hacked country;
	/*					   currently just the hack count is stored, 
	/*					   but more to come ...
 	/******************************************************************/

 	this.getTicket = function( _code ) {

 		var _index = this.findTicketIndex( _code );

 		if (_index != -1) return this.atlas[ _index ];
 	}

	this.getTicketCount = function( _code ) {

		var _index = this.findTicketIndex( _code);

		if (_index == -1) return 0;

		return this.atlas[ _index ].count; 
	}

	this.findTicketIndex = function( _code) {

		for (var i = 0; i < this.atlas.length; i++)  {

			if (this.atlas[i].id == _code) return i;
		}

		return -1;
	}

 	/*******************************************************************************
	/*				STATISTICS							 
 	/******************************************************************************/


	this.lifetimeMissionCount = function() {

		var c = 0;

		for (var i = 0; i < this.assigns.length; i++)  {

			//we check the code of each assign data object in the array ...

			c = c + this.assigns[i].completions;
		}

		return c;
	}

	this.uniqueCountryCount = function() {

		return this.atlas.length;
	}

	this.lifetimeHackCount = function() {

		var c = 0;

		for (var i = 0; i < this.atlas.length; i++)  {

			c = c + this.atlas[i].count;
		}

		return c;
	}

 	/******************************************************************
	/*			MISCELLANEOUS 											 
 	/******************************************************************/

	this.countryHacked = function( _code ) {

		Database.registerEvent( eHackComplete, game.user._id, _code);

		db.updateUserLastNewsDate( game.user._id, game.user.lastNewsDate);

		var _ticket = null;

		//Add the hacked country code to the array

		//There is some condition that's causing countries to be added twice in some circumstances.
		//So check for the country code first.

		var _index = this.assign.hacked.indexOf( _code );

		if (_index == -1) this.assign.hacked.push( _code );

		//now update or create the ticket in the atlas

		_index = this.findTicketIndex( _code );

		if (_index == -1) {

			_ticket = new Ticket( _code, 1, [] );
		}
		else {

			this.atlas[ _index ].identified();

			//remove the ticket so that we can ...

			_ticket = this.atlas[ _index ];

			this.atlas.splice(_index, 1);
		}

		//... bump the ticket to the front
	
		this.atlas.unshift( _ticket );

		//remove the country from the pool array

		var _poolIndex = this.assign.findPoolIndex( _code);

		if (_poolIndex != -1) this.assign.pool.splice(_poolIndex, 1);


		//add the welcome agent to the user's network (if this is the first time)

		if (_ticket.count == 1) {

			var _id = hack.getWelcomeAgent()._id;

if (!game.user.profile.ag) game.user.profile.ag = [];

			if ( game.user.profile.ag.indexOf(_id) == -1 ) { 

				game.user.profile.ag.push( _id );
			}
		}


		//are we done?

		if (this.assign.pool.length == 0) {

			this.assign.completions = this.assign.completions + 1;

			mission.status = msComplete;

			mission.finish = Date.now();

			Database.registerEvent( eMissionComplete, game.user._id, mission.code )
		}

		//Save the assign object and update the missionList

		this.updateAssignDataObject( this.assign );

		//save changes to db

		db.updateUserHacks();

	}

}


function deselectAllModes() {

	$(".divHomeButtonPic").css("border-color","black");

	$(".imgHomeAvatar").css("border-color","black");

}
