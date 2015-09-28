


User = function( _name, _scroll ) {  //name, id, scroll pos (for content editors)

	this.name = _name;

	this.scroll = _scroll;

	this.assignCode = "0";  //last-started mission; game object sets this from db

	this.assigns = [];   //the array of assign data objects, game object sets this from db

	this.assign = null;

	this.atlas = [];  //cumulative list of ticket objects  

    this.avatarURL = new Blaze.ReactiveVar( "" );  //path and filename to avatar on server 


	//need to check and see if we have a logged-in user before trying to make this call

	this.makeAvatar = function() {

		Meteor.call("makeAvatar", "male", Meteor.userId() );
	} 

	this.setAvatarURL = function() {
	
		var _name = Meteor.userId() + ".png";

		var arr = game.ghAvatar.find({ "original.name" : _name }).fetch();

		if (!arr.length) return;

		var _url = arr[0].url();

		if (_url == null) return;

		var url = _url.split("?");
		
		this.avatarURL.set( url[0] );
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

		//the Top Ten list is first

		_mission = new Mission( "ttp" );

		_assign =  new Assign(_mission.code, [], _mission.level, _mission.name, _mission.items, 0)

		this.assigns.push( this.createAssignDataObject( _assign ) );


		//now the continents

		var _arr = db.ghZ.find().fetch();

		for (i = 0; i < _arr.length; i++) {

			_mission = new Mission( _arr[i].c );

			_assign =  new Assign(_mission.code, [], _mission.level, _mission.name, _mission.items, 0)

			this.assigns.push( this.createAssignDataObject( _assign ) );			

		}

		//now the last arbitrary ones

		_mission = new Mission( "pg" );

		_assign =  new Assign(_mission.code, [], _mission.level, _mission.name, _mission.items, 0)

		this.assigns.push( this.createAssignDataObject( _assign ) );

		_mission = new Mission( "all" );

		_assign =  new Assign(_mission.code, [], _mission.level, _mission.name, _mission.items, 0)

		this.assigns.push( this.createAssignDataObject( _assign ) );

	}


	this.assignMission = function( _code) {

		//create the mission object  (are we still using this global?)
		
		mission = new Mission( _code);


		//either it's a mission that's already in progress ...

		for (var i = 0; i < this.assigns.length; i++)  {

			//we check the code of each assign data object in the array ...

			if (this.assigns[i].code == _code) {

				//is the mission in a finished state?

				if (this.assigns[i].pool.length == 0) this.resetAssignDataObject( _code);

				var _assignData = this.assigns[i];

				this.assignCode = _code;

				//if we find it, we create the assign using our stored data

				this.assign = new Assign(_assignData.code, _assignData.hacked, _assignData.level, _assignData.name, _assignData.pool, _assignData.completions);

				return;
			}
		}
	}

	this.resetAssignDataObject = function( _code ) {

		var _index = this.findAssignIndex( _code );

		var _mission = new Mission( _code );

		//We re-create the assign object from scratch, except we carry over the current completions value

		var _assign = new Assign( _mission.code, [], _mission.level, _mission.name, _mission.items, this.assigns[ _index ].completions );
	
		this.assigns[ _index ] = this.createAssignDataObject( _assign );
	}

	this.assignAndStartMission = function( _code) {

		this.assignMission( _code );

		db.updateUserRec();

		hack = new Hack();

		hack.startNewFromMenu();
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

		var _a = { code: _assign.code, hacked: _assign.hacked, level: _assign.level, name: _assign.name, pool: _assign.pool, completions: _assign.completions };

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

			var _ticket = new Ticket( _arr[i].id, _arr[i].c );

			this.atlas.push( _ticket );
		}		

 	}

	this.getAtlasDataObject = function() {

		var _arr = [];

		for (var i = 0; i < this.atlas.length; i++)  {

			var obj = {id: this.atlas[i].id, c: this.atlas[i].count }

			_arr.push( obj );
		}

		return _arr;
	}

	//user's home screen uses this to show all the hacked countries (lifetime)

	this.atlasIDs = function() {

		return( Database.makeSingleElementArray( this.atlas, "id") );
	}

 	/******************************************************************
	/*			TICKETS -- associate a user with a hacked country;
	/*					   currently just the hack count is stored, 
	/*					   but more to come ...
 	/******************************************************************/

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

		//first add the hacked country code to the array

		//There is some condition that's causing countries to be added twice in some circumstances.
		//So check for the country code first.

		var _index = this.assign.hacked.indexOf( _code );

		if (_index == -1) this.assign.hacked.push( _code );

		//now update or create the ticket in the atlas

		_index = this.findTicketIndex( _code );

		if (_index == -1) {

			_ticket = new Ticket( _code, 1 );
		}
		else {

			this.atlas[ _index ].identified();

			//remove the ticket so that we can ...

			_ticket = this.atlas[ _index ];

			this.atlas.splice(_index, 1);
		}

		//... bump it to the front
	
		this.atlas.unshift( _ticket );


		var _poolIndex = this.assign.findPoolIndex( _code);

		if (_poolIndex != -1) this.assign.pool.splice(_poolIndex, 1);

		//are we done?

		if (this.assign.pool.length == 0) {

			this.assign.completions = this.assign.completions + 1;
		}

		//Save the assign object and the update the missionList

		this.updateAssignDataObject( this.assign );

		//save changes to db

		db.updateUserRec();

	}


}




Assign = function( _code, _hacked, _level, _name, _pool, _completions) {

	this.code = _code;

	this.hacked = _hacked;

	this.level = _level;

	this.name = _name;

	this.pool = [];

	this.completions = _completions;

	this.selectedContinent = "";

	this.selectedRegion = "";


	if (this.level == mlContinent) this.selectedContinent = this.code;

	if (this.level == mlRegion) {

		this.selectedContinent = db.getContinentCodeForRegion( this.code );

		this.selectedRegion = this.code;	
	}

	//run thru the countries in the mission and put their codes in the pool

	for (var i = 0; i < _pool.length; i++)  {

		this.pool.push(  _pool[i] );
	}

	//the congrats screen uses this to show all the hacked countries (in the current mission)

	this.hackedCodes = function() {

		return this.hacked;
	}

	this.findPoolIndex = function(_code) {

		return this.pool.indexOf( _code);
	}

	this.findHackedIndex = function(_code) {

		return this.hacked.indexOf( _code);
	}

	this.resetMap = function() {

		if (display == null) return;

		display.ctl["MAP"].reset();

		display.ctl["MAP"].resetSelections();

		display.ctl["MAP"].level.set( this.level );

		if (this.level == mlContinent) {

			display.ctl["MAP"].setContinent( this.code );

			display.ctl["MAP"].setState( sIDRegion );
		}

		if (this.level == mlRegion) {

			display.ctl["MAP"].setRegion( this.code );		

			display.ctl["MAP"].setState( sIDCountry );

		}
	}

}


Ticket = function(_code, _count ) {

	this.id = _code;

	this.count = _count;

	this.identified = function() {

		this.count++;
	}
}



/*





*/