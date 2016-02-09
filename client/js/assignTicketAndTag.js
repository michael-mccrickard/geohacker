//assignAndTicket.js


Assign = function( _code, _hacked, _level, _name, _pool, _completions) {

	this.code = _code;  //string code for the mission
 
	this.hacked = _hacked;   //array of countries already hacked (codes)

	this.level = _level;  //map level, if applicable

	this.name = _name;   //name of the mission displayed on the screen

	this.pool = [];   //all the countries still needing to be hacked  (codes)

	this.completions = _completions;  //number of times that mission has been completed

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


Ticket = function(_code, _count, _arr ) {

	this.id = _code;

	this.count = _count;

	this.tag = _arr;

	this.identified = function() {

		this.count++;
	}

	this.addTag = function(_file, _longitude, _latitude) {

		var _tag = new Tag(_file, _longitude, _latitude);

		this.tag.push( _tag );
	}
}

Tag = function(_file, _longitude, _latitude) {

	this.u = _file;

	this.t = '';
	
	this.lo = _longitude;
	
	this.la = _latitude;
}

