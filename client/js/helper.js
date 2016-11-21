/* helper.js */


Helper = function() {

	this.name = "helper";

	this.pic = new Blaze.ReactiveVar("");

	this.rec = null;

	this.name = new Blaze.ReactiveVar("");

	this.text = new Blaze.ReactiveVar("");

	this.title = new Blaze.ReactiveVar("");

	this.ZText1 = ["This one must be in ", "Must be ", "I'm thinking it's ", "Probably ", "Maybe ", ""];

	this.ZText2 = [".", ".", ".", ".", "?","?"];	

	this.RText1 = ["This is from ", "I believe it's ", "Surely, this is in ", "Could be ", "", ""];

	this.RText2 = [".", ".", ".", ".", ", you think?","?"];	

	this.CText1 = ["It's ", "Would you believe ", "My gut says ", "I'm confident it's ", "I want to say it's ", ""];

	this.CText2 = [".", "?", ".", ".", ".","?"];	

	this.ZClue = 0;

	this.RClue = 0;

	this.CClue = 0;

	this.init = function() {

		this.ZClue = 0;

		this.RClue = 0;

		this.CClue = 0;


		var _arr = Meteor.users.find( {_id: { $ne: Meteor.userId() }, "profile.ut": utGeohackerInChiefCountry } ).fetch();

		this.rec = Database.getRandomElement( _arr );

		if (!this.rec) this.rec = Database.getChiefRec();

		this.pic.set( this.rec.profile.av );

		this.title.set( arrUserTitle[ this.rec.profile.ut ] + db.getCountryName( this.rec.profile.cc ) );

		var _name = "";

		var _arr = this.rec.username.split(" ");

		for (var i = 0; i < _arr.length; i++ ) {

			_name = _name + capitalizeFirstLetter( _arr[i] ) + " ";
		}

		this.name.set( _name );
	} 

	this.setText = function() {

		var _level = hackMap.level.get();

		if (hacker.loader.totalClueCount == 0)  {

			this.text.set( "Click the SCAN button so we can get started.");

			return;
		}

		if (_level == mlWorld || _level == mlNone)  {

			this.ZClue = 1;

			var _continent = hack.getContinentName();

			var _len = this.ZText1.length;

			var _index = Database.getRandomValue(_len); 

			this.text.set( this.ZText1[_index] + _continent + this.ZText2[_index]);

			return;
		}

		if (_level == mlContinent)  {

			this.RClue = 1;

			var _region = hack.getRegionName();

			var _len = this.RText1.length;

			var _index = Database.getRandomValue(_len); 

			this.text.set( this.RText1[_index] + _region + this.RText2[_index]);

			return;
		}

		if (_level == mlRegion)  {

			this.CClue = 1;

			var _country = hack.getCountryName();

			var _len = this.CText1.length;

			var _index = Database.getRandomValue(_len); 

			this.text.set( this.CText1[_index] + _country + this.CText2[_index]);


			return;
		}

	}

	this.getClueCount = function() {

		return this.ZClue + this.RClue + this.CClue;
	}
}