MemeCollection = function(  _parent ) {
	
	this.items = [];

	this.used = [];

	this.collection = db.ghMeme;

	this.arrNonHelpers = [ "lng", "lng_i","lng_o","lng_om", "cap", "ldr"];

	this.arrNonClue = [ "lng", "lng_i","lng_o","lng_om" ];

	this.parent = _parent;

	var _rec = null;

	this.countryCode = "";

	this.make = function( _countryCode) {

		this.countryCode = _countryCode;

		var _exclude = [];

		var _meme = null;

		if (this.parent == "hacker") _exclude = this.arrNonClue;

		if (this.parent == "helper") _exclude = this.arrNonHelpers;

		this.items = [];

	    var _arr = this.collection.find( { cc: _countryCode, dt: { $nin: _exclude } } ).fetch();

	    for (var i = 0; i < _arr.length; i++) {

	    	_meme = new Meme( _arr[i], this.parent );

			_meme.init();  //s/b this.parent

	    	this.items.push( _meme );  
	    } 

	    if (this.parent == "hacker")  {

	    	//do we have a redacted map we can add as a meme?

	    	_arr = db.ghImage.find( { cc: _countryCode, dt: "rmp"} ).fetch();

	    	if (_arr.length) {

	    		_arr[0].tc = "Country map (name obscured)";	    		

	    		_meme = new Meme( _arr[0], this.parent );

	    		_meme.init();

	    		this.items.push( _meme );
	    	}

	    	//do we have any "flg" records in the meme table?

	    	_arr = this.collection.find( { cc: _countryCode, dt: "flg" } ).fetch();

	    	//if not, then add one

	    	if (!_arr.length) {

	    		var _obj = {};

	    		_obj.u = hack.getFlagPic();

	    		_obj._id = db.ghImage.find( { cc: _countryCode, dt: "flg"} )._id;

	    		_obj.dt = "flg";

	    		_obj.tc ="National flag";

	    		_meme = new Meme( _obj, this.parent);

	    		_meme.init();

	    		this.items.push( _meme );	    		
	    	}

	    }

	    Database.shuffle( this.items );
	}

	this.restoreItems = function() {

		this.make( this.countryCode );
	}
}

/*
Each "user" of the MemeCollection has different needs, but a common goal of all users
is to prevent needless repetition of memes, since the memes are shared between:

	--meme hacker clues
	--helper clues
	--debriefs
	
*/

MemeCollection.getNextUnusedItem = function( _arr ) {

	for (var i = 0; i < _arr.length; i++) {

		if ( !_arr[i].usedByHacker &&  !_arr[i].usedByHelper  ) {

			return _arr[i];
		}

	}

	return null;
}

MemeCollection.getNextItemUnusedBy = function( _which, _arr ) {

	var _meme = null;

	var _flag = null;

	if (_which == "hacker") _flag = "usedByHacker";

	if (_which == "helper") _flag = "usedByHelper";	

	for (var i = 0; i < _arr.length; i++) {

		_meme = _arr[i];

		if ( !_meme[ _flag ] ) {

			return _arr[i];
		}

	}

	return null;
}

MemeCollection.getDebriefItem = function( _arr ) {

	var _item = null;

	_item = MemeCollection.getNextUnusedItem( _arr );

	if ( _item == null ) _item = Database.getRandomElement( _arr );

	return _item;
}


MemeCollection.getNextHelperItem = function( _arr ) {

	var _item = null;

	_item = MemeCollection.getNextUnusedItem( _arr );

	if ( _item == null ) {

		_item = MemeCollection.getNextItemWhereFalse( "usedByHelper", _arr );
	}

	if ( _item ) MemeCollection.markMemeAsUsedBy(_item.code, "helper");

	if ( _item == null ) _item = Database.getRandomElement( _arr );

	return _item;
}

//only the loader calls this one (hacker meme clues), so if we ar

MemeCollection.getNextHackerItem = function( _arr ) {

	var _item = null;

	_item = MemeCollection.getNextUnusedItem( _arr );

	if ( _item == null ) {

		_item = MemeCollection.getNextItemWhereFalse( "usedByHacker", _arr );
	}
		
	if ( _item ) MemeCollection.markMemeAsUsedBy(_item.code, "hacker");
	

	if ( _item == null ) _item = Database.getRandomElement( _arr );

	return _item;
}

MemeCollection.markMemeAsUsedBy = function( _code, _which ) {

    MemeCollection.markCodeAsUsedBy( _code, _which, hacker.helper.items );

    MemeCollection.markCodeAsUsedBy( _code, _which, hacker.ctl["MEME"].memeCollection.items );

    MemeCollection.markCodeAsUsedBy( _code, _which, hacker.debriefItems );
} 

MemeCollection.markCodeAsUsedBy = function( _code, _which, _arr) {

	var _flag = "";

	if (_which == "hacker") _flag = "usedByHacker";

	if (_which == "helper") _flag = "usedByHelper";	

	var _meme = null;

    for ( var i = 0; i < _arr.length; i++) {

    	_meme = _arr[i];

        if ( _meme.code == _code ) {

            _meme[ _flag ] = true;

            break;
        }
    }
}

