//userProfile.js
//these fields are documented in db_scheme.js

blankUserProfile = {

    createdAt: "",
    a: [],
    h: [],
    c: "",
    s: 0,
    av: "",
    cc: "",
    cn: "",
    f: "",
    t: "",
    p: "", 
    pt: "",
    ag: "SWjqzgXy9rGCYvpRF",
    st: 0,
    ge: 0,
    ex: 0,
    sp: [0,0,0],
    sc: [0,0,0],
    in: [0,0,0],
    ft: [0,0,0,0,0],
    ut: 0

}

if ( !Meteor.isClient ) {

DB = function() {

	this.getCapitalName = function( _code ) {

	      try {

	        var f = ghText.findOne( { cc: _code, dt: "cap" } ).f;
	      }
	      catch(err) {

	        console.log("No capital name found for " + this.getCountryName( _code ) );

	        return "";
	      }

	      return f;
	  }

	this.getCapitalPic = function(_code) {

	      try {

	        var u = ghImage.findOne( { cc: _code, dt: "cap" } ).u;
	      }
	      catch(err) {

	        console.log("No capital picture found for " + this.getCountryName( _code ) );

	        return "";
	      }

	      return u;
	  }

	this.getCountryName = function(_code) {

	      try {

	        var n = this.getCountryRec( _code ).n;
	      }
	      catch(err) {

	        console.log("No country name found for " +  _code );

	        return "";
	      }

	      return n;
	  }

	this.getCountryRec = function(_code) {

	    return ( ghC.findOne( { c: _code } ) );
	}

	this.getFlagPicByCode = function(_code) {

	    if (typeof ghImage.findOne( { cc: _code, dt: "flg" } ) !== 'undefined') {

	      return ghImage.findOne( { cc: _code, dt: "flg" } ).u;
	    }
	    else {

	      console.log("No flag pic found for " + this.getCountryName( _code ));

	      return _code;
	    }
	  }

  this.getRandomCountryRec = function() {

      var count = ghC.find( {} ).count();

      var num = Math.floor( Math.random()*count );

      var arr = ghC.find( { } ).fetch();

      var rec = arr[num];

      return rec;

    }

  } // end DB

} //end if not client

createUserOptions = function(_obj) {

    var _text = "Agent, " + db.getCountryName( _obj.countryID );

    var _pic = db.getCapitalPic( _obj.countryID );

    var _pt = db.getCapitalName( _obj.countryID ) + " is the capital of " + db.getCountryName( _obj.countryID ) + ".";

    var options = {};

    Object.assign( options, blankUserProfile);

    options.createdAt = _obj.date;

    options.cc = _obj.countryID;

    options.cn = db.getCountryName( _obj.countryID );

    options.f = db.getFlagPicByCode( _obj.countryID );

    options.t = _text;

    options.p = _pic;

    options.pt = _pt;

    options.st = _obj.st;

    options.ut = _obj.ut;

    if (_obj.password) options.password = _obj.password;

    if (_obj.name) options.username = _obj.name;

    if (_obj.email) options.email = _obj.email;

    return options;
}