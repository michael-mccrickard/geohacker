VideoCollection = function(  _parent ) {
	
	this.items = [];

	this.videos = [];

	this.parent = _parent;  //"hack" or "browser"

	this.make = function( _countryCode) {

	      	//screen out the ones used as primaries in the newBrowser

	    this.items = this.collection.find( { cc: _countryCode, dt: { $nin: ["gn","sd","tt"] },  s: { $nin: ["p"] } } ).fetch();

	    for (var i = 0; i < this.items.length; i++) {

	    	this.videos.push( new Video( this.items.u ) );
	    } 

	}
}