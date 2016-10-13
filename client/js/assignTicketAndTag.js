//assignAndTicket.js


Assign = function( _code, _mapCode, _hacked, _level, _name, _pool, _completions) {

	this.code = _code;  //string code for the mission

	this.mapCode = _mapCode;

	this.hacked = _hacked;   //array of countries already hacked (codes)

	this.level = _level;  //map level, if applicable

	this.name = _name;   //name of the mission displayed on the screen

	this.pool = [];   //all the countries still needing to be hacked  (codes)

	this.completions = _completions;  //number of times that mission has been completed

	this.selectedContinent = "";

	this.selectedRegion = "";


	if (this.level == mlContinent) {

		if (this.mapCode) {  //we set a mapCode for some custom missions, like Top Ten [Continent];

			this.selectedContinent = this.mapCode;
		}
		else {

			this.selectedContinent = this.code;			
		}

	}

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

			display.ctl["MAP"].setContinent( this.mapCode );

			display.ctl["MAP"].setState( sIDRegion );
		}

		if (this.level == mlRegion) {

			display.ctl["MAP"].setRegion( this.code );		

			display.ctl["MAP"].setState( sIDCountry );

		}
	}

}


Ticket = function(_code, _count, _arr ) {

	this.id = _code;

	this.count = _count;

	this.tag = _arr;

	this.identified = function() {

		this.count++;
	}

	this.addTag = function(_longitude, _latitude, _dt) {

		var _tag = new Tag(_longitude, _latitude, _dt);

		this.tag.push( _tag );
	}
}

//see the DEBRIEF TYPES documentation in debrief.js for explanation about the _dt value

//the combination of the dt value and the countryCode determines the tag content

//all tags must have a rec in ghText with a countryCode and a dt value 
//that matches the tag dt value, and a url (_file) for the tag pic

//the exception to this is the agent tag (dt == "agt") where the pic / text
//are gleaned from ghUser


Tag = function(_longitude, _latitude, _dt) {

	//this.u = _file;

	//this.t = _text;
	
	this.lo = _longitude;
	
	this.la = _latitude;

	this.dt = _dt;
}

