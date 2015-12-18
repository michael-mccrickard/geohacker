


Mission = function(_code, _countryCode) {

  this.mode = mNone;
	
  this.level = mlNone;

  this.code = _code;  //either a continent code, region code, or arbitrary string 
                      //like "browse" or one of the ad-hoc mission codes (below)

  this.name = "0";

  this.browseCode = "0";  //the country code when _code == "browse"

  this.items = [];

  //if we are only creating the mission object, but not initing it to a specific mission
  //then we're done

  if (_code === undefined) return;

  //reset our map variables (selected areas, level, state)

  if (display) {

  	if (game.display.ctl) game.display.ctl["MAP"].reset();
  }

  //browse mode

  if (this.code == "browse") {

    if (_countryCode === undefined) {

      console.log("browse mission called with no country");

    }
    else {

      this.browseCode = _countryCode;

      this.name = db.getCountryRec( _countryCode).n;

      this.items.push( _countryCode);
    }

    return;
  }


  //hard-coded "ad-hoc" missions

  //ten largest population

  if (this.code == "ttp") {

  	this.name = "Top Ten"

    this.items = ["CN", "BD", "IN", "JP", "ID", "NG", "BR", "PK", "RU","US"]; 

    return;
  }

  //persian gulf

  if (this.code == "pg") {

  	this.name = "Persian Gulf"

  	this.items = ["IL", "IR", "IQ", "EG", "LY", "SA", "SY", "JO", "KW","OM", "YE", "AE","QA"]; 

  	return;
  }

  var _arr = [];

  if (this.code == "all") {

  	this.name = "Earth";

    this.level = mlWorld;

    _arr = db.ghR.find().fetch();

  }
  else {

  	//otherwise, currently assumed to be a continent mission

  	//(Later, we'll need to test the code against an array of the continent codes,
  	//if found, then proceed as below, if not, assume it to be a region code, and proceed accordingly

  	this.level = mlContinent;

    //make an array of all the regions for this continent  (continent code is the z field)

  	_arr = db.ghR.find( { z: _code }).fetch();

    //get the continent rec and set the name of the mission

  	var rec = db.getContinentRec( _code );

  	this.name = rec.n;

    //the map variables are set in user.assign (called by hack.startNew() )
  }

  //Now make an array of just the region codes for this mission

  var regions = Database.makeSingleElementArray( _arr, "c");

  //And make an array of all the countries with data

  var countries = db.ghC.find( {d: 1} ).fetch();


  //Now loop thru the countries and any of them that have a region code that's in our array get added

  for (var i = 0; i < countries.length; i++) {

    if ( regions.indexOf( countries[i].r ) != -1) this.items.push( countries[i].c );
  }  

}