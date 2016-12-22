//char.js

Char = function() {

	this.init = function( _obj ) {

		this.name = _obj.name;

		this.index = _obj.index;

		this.top = _obj.top;

		this.left = _obj.left;

		this.shortName = _obj.shortName;

		this.placement = "top";

		this.rec = Meteor.users.findOne( { username: this.name } );

		this.type = "agent";

		//for an agent in the database, you don't supply the pic file or the ID in the _obj param,
		//but for a "guest star", you do


		if (_obj.type) {

			this.type = _obj.type;
		}

		if (_obj.pic) {

			this.pic = _obj.pic;
		}
		else {

			this.pic = this.rec.profile.av;	
		}
		
		if (_obj.ID) {

			this.ID = _obj.ID;
		}
		else {
		
			this.ID = this.rec._id;
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

		$(this.imageElement).attr("data-shortName", this.shortName);		

		$(this.nameElement).text( this.name );
	}
} 

Char.prototype = new Entity();