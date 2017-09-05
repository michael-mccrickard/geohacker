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

	this.CText1 = ["Do you think it's ", "Could it be ", "What about ", "Tough one.  ", "Possibly "];	

	this.ZClue = 0;

	this.RClue = 0;

	this.CClue = 0;

	this.items = [];

	this.useRandomCountryClues = false;

	this.countryPool = [];

	this.init = function(_code) {

		this.ZClue = 0;

		this.RClue = 0;

		this.CClue = 0;

		this.useRandomCountryClues = false;

		this.countryPool = [];
		

		//get a random GIC agent to be the helper

		this.rec = null;		

		var _arr =  Meteor.users.find( { 'profile.cc': { $ne: _code}, '_id': { $ne: Database.getChiefID()[0]  } } ).fetch();

		if (_arr.length) {

			this.rec = Database.getRandomElement( _arr );
		}
		else {

			this.rec = Database.getChiefRec();			
		}


		//set the helper's picture and title

		this.pic.set( this.rec.profile.av );

		this.title.set( arrUserTitle[ this.rec.profile.ut ] + ", " +  db.getCountryName( this.rec.profile.cc ) );

		//format the name

		var _name = "";

		var _arr = this.rec.username.split(" ");

		for (var i = 0; i < _arr.length; i++ ) {

			_name = _name + capitalizeFirstLetter( _arr[i] ) + " ";
		}

		this.name.set( _name );

		//create meme collction

		var _memeCollection = new MemeCollection( "helper" );

		_memeCollection.make( hack.countryCode );

		this.items = _memeCollection.items;

		if ( this.items.length ) {

			Database.shuffle( this.items );
		}
		else {

			this.useRandomCountryClues = true;

			this.makeCountryPool();
		}

	} 

	this.makeCountryPool = function() {

		var _arr = db.ghC.find( { r: db.getRegionCodeForCountry( hack.countryCode ) } ).fetch();

		this.countryPool = Database.makeSingleElementArray( _arr, "c");		
	}

	this.setText = function() {

		var _len = 0;

		var _index = -1;

		var _level = hackMap.level.get();

		if (hacker.loader.totalClueCount == 0)  {

			this.text.set( "Click the SCAN button so we can get started.");

			return;
		}

		if (_level == mlWorld || _level == mlNone)  {

			this.ZClue = 1;

			var _continent = hack.getContinentName();

			_len = this.ZText1.length;

			_index = Database.getRandomValue(_len); 

			this.text.set( this.ZText1[_index] + _continent + this.ZText2[_index]);

			return;
		}

		if (_level == mlContinent)  {

			this.RClue = 1;

			var _region = hack.getRegionName();

			_len = this.RText1.length;

			_index = Database.getRandomValue(_len); 

			this.text.set( this.RText1[_index] + _region + this.RText2[_index]);

			return;
		}

		if (_level == mlRegion)  {

			this.CClue++;

			if (this.useRandomCountryClues)  {

				if ( !this.countryPool.length ) {

					this.makeCountryPool();

				}

				var _name = db.getCountryName( this.countryPool[0] );

				_len = this.CText1.length;

				_index = Database.getRandomValue(_len); 

				this.text.set( this.CText1[_index] + _name + "?");

				//remove the item we just used

				this.countryPool.shift();
				
			}
			else {

				var _meme = MemeCollection.getNextHelperItem( this.items );

				this.text.set( _meme.text );

				return;
			}
		}

	}

	this.getClueCount = function() {

		return this.ZClue + this.RClue + this.CClue;
	}
}