//char.js
Char = function() {

	this.init = function( _obj, _index ) {

		this.name = _obj.n;

		this.collectionID = cChar;

		this.index = _index;

		this.shortName = _obj.n;

		this.entityType = "char";

		if (_obj.sn) {

			this.shortName = _obj.sn;
		}

		this.placement = "top";


		if (_obj.t) {   //type

			if (_obj.t == "a") this.type = "agent";  

			if (_obj.t == "g") this.type = "guest";  
		}

		if (_obj._id) this.ID = _obj._id;

		//for an agent in the database, you don't supply the pic file in the _obj param b/c you don't know it,
		//but for a "guest star", you do.  Also, we create the ID on the fly for guests.
		
		if ( this.type == "guest" ) {

			this.pic = _obj.p;			
		}

		if ( this.type == "agent" ) {

			//the object we were passed was just the record in the ghChar table,
			//we have to get the user record for the picture file

			var _rec = Meteor.users.findOne( { username: this.name } );

			this.pic = _rec.profile.av;
			
		}

		if (_obj.top) this.top = percentStringToNumber( _obj.top );

		if (_obj.l) this.left = percentStringToNumber( _obj.l );

		if (_obj.scx) this.scaleX = _obj.scx;

		if (_obj.scy) this.scaleY = _obj.scy;

		this.size = 96;

		this.prevTop = 0;

		this.prevLeft = 0;

		this.element = "div#storyChar" + this.index + ".divStoryChar";

		this.nameElement = "div#storyCharName" + this.index;

		this.imageElement = "img#storyCharPic" + this.index + ".storyChar";

	}


	this.add = function() {

		this._add();

		story.charObjs.push( this );	

		$(this.nameElement).text( this.name );
	}
} 

Char.prototype = new Entity();

