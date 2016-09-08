

User = function( _name ) {  //name, scroll pos (for content editors)

	this.name = _name;

	this.missionHack = new Hack();

	this.missionDisplay = new Display();

	this.browseHack =  new Hack();

	this.browseDisplay = new Display();

	this.msg = new Messaging();

	this.scroll = 0;

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

    this.editMode = new Blaze.ReactiveVar( false );  //is the user editing the profile content?

    this.badgeLimit = 0;

    this.networkAgentsDataReady = false;

    this.headline = new Headline( "welcomeAgent" );

    this.lessonSequenceCode = new Blaze.ReactiveVar("");

    this.browseCountry = function( _code ) {

      if ( db.getDataFlagForCountry( _code) == false) {

      	showMessage("NO DATA FOUND FOR THIS COUNTRY");

      	return;
      }

      this.setMode( uBrowseCountry );

      this.setGlobals( "browse" );

      display.suspendMedia();

      hack.initForBrowse( _code );
      
    };

    this.setMode = function(_mode) {

    	if (_mode == uIntro) return;

    	deselectAllModes();

    	//store the current mode if we're going to browse something

    	if (_mode == uBrowseMap || _mode == uBrowseCountry) {

    		if (this.mode != uBrowseMap && this.mode != uBrowseCountry ) this.prevMode = this.mode;
    	}
    	

    	this.mode = _mode;

    	if (_mode == uBio) {

	  		Meteor.defer( function() { $(".imgHomeAvatar").css("border-color","gray") } );

	  		this.bio.load();

    		this.template.set("bio");
    	}

    	if (_mode == uHack) {

	  		Meteor.defer( function() { $("#divHomeHackPic").css("border-color","gray") } );

	  		this.template.set("missionListing");
    	}

    	if (_mode == uLearn) {

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

     	if (_mode == uBrowseMap) {

     		this.setGlobals("browse");

     		Control.playEffect( "mapButton.mp3" );
     	}
     	else {

			Control.playEffect( "blink.mp3" );
     	}

    }

    this.goBrowseMap = function() {

    	this.setMode( uBrowseMap );

    	if (!display.countryCode.length) display.init( this.profile.cc );

    	display.suspendMedia();

    	display.feature.browseMap();
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

    	if (display.feature.getName() == "MAP") {

	  		display.worldMapTemplateReady = false;

	  		FlowRouter.go("/worldMap");

	  		return;
    	}

  		FlowRouter.go("/main");
    }

    this.setGlobals = function( _which ) {

    	if (_which == "mission") {

    		display = this.missionDisplay;

  			hack = this.missionHack;
    	}

       	if (_which == "browse") {

    		display = this.browseDisplay;

  			hack = this.browseHack;
    	} 	
    }

    this.goHome = function() {

    	if (display) {

    		//The avatar button in the upper-left corner 
    		//is what calls this function.
    		//It might be faded b/c we're in the middle of some
    		//sequence like hackDone.

    		if ( display.homeButtonDisabled() ) return;

			display.suspendMedia();

    	}

    	if (this.mode == uBrowseMap || this.mode == uBrowseCountry)  {

    		FlowRouter.go("/home")

    		return;
    	}
    		
    	if (this.mode == uNone) {

    		this.setMode( uLearn );
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
    }

    this.selectNewMission = function() {

    	this.setMode( uHack );

    	mission = null;
    	
    	FlowRouter.go("/home");   	
    }

	//need to check and see if we have a logged-in user before trying to make this call

	this.makeAvatar = function( _gender ) {

		Meteor.call("makeAvatar", _gender, Meteor.userId(), function(error, result) {

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


		//either it's a mission that's already in progress ...

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

		var _a = { code: _assign.code, mapCode: _assign.mapCode, hacked: _assign.hacked, level: _assign.level, name: _assign.name, pool: _assign.pool, completions: _assign.completions };

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

//this is happening during browse while learning

// 		showMessage( "No ticket found for country " + _code);
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

			if ( game.user.profile.ag.indexOf(_id) == -1 ) game.user.profile.ag.push( _id );
		}


		//are we done?

		if (this.assign.pool.length == 0) {

			this.assign.completions = this.assign.completions + 1;

			mission.status = msComplete;
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
