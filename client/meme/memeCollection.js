MemeCollection = function(  _parent ) {
	
	this.items = [];

	this.used = [];

	this.collection = db.ghMeme;

	this.arrNonHelpers = [ "lng", "lng_i","lng_o","lng_om", "hqt", "cap", "ldr"];

	this.arrNonClue = [ "lng", "lng_i","lng_o","lng_om" ];

	this.parent = _parent;

	this.make = function( _countryCode) {

		var _exclude = [];

		if (this.parent == "hacker") _exclude = this.arrNonClue;

		if (this.parent == "helper") _exclude = this.arrNonHelpers;

		this.items = [];

	    var _arr = this.collection.find( { cc: _countryCode, dt: { $nin: _exclude } } ).fetch();

	    for (var i = 0; i < _arr.length; i++) {

	    	var _meme = new Meme( _arr[i], _parent );

			_meme.init( this.parent );  //s/b this.parent

	    	this.items.push( _meme );  //only "hacker" for now, but could be "browser" or something else, later
	    } 

	    Database.shuffle( this.items );
	}



	this.getItem = function(   ) {

		var _arr = this.items;

		if ( !_arr.length) {

			if (this.parent == "hacker") return null;

			_arr = this.used;

			Database.shuffle( _arr );
		}


		//For a helper clue, we always take the first item in the array,
		//b/c we are moving each item to used[] as we use it

		var i = 0;

		//but for the hacker clues, we use the index on the control

		if (this.parent == "hacker") i = hacker.ctl["MEME"].getIndex();

		var _meme = _arr[ i ];

		//we will recycle the helper clues, if need be

		if (this.parent == "helper") {

			_meme = _arr.unshift( i, 1);

			_meme.setText();

			this.used.push( _meme );			
		}

		return _meme;

	}
}