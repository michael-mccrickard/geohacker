//char.js
Char = function() {

	this.init = function( _obj, _index ) {

		this.name = _obj.n;

		this.index = _index;

		this.top = percentStringToNumber( _obj.top );

		this.left = percentStringToNumber( _obj.l );

		if (_obj.sc) this.scale = parseFloat( _obj.sc );

		this.shortName = _obj.sn;

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
		
			this.ID = _obj._id;

			//the object we were passed was just the record in the ghChar table,
			//we have to get the user record for the picture file

			var _rec = Meteor.users.findOne( { username: this.name } );

			this.pic = _rec.profile.av;
			
		}

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

		$(this.imageElement).attr("data-mongoid", this.ID);

		$(this.imageElement).attr("data-shortname", this.shortName);		

		$(this.nameElement).text( this.name );
	}
} 

Char.prototype = new Entity();

