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

		this.pic = this.rec.profile.av;	

		this.ID = this.rec._id;

		this.size = 96;

		this.spacer = 8;

		this.prevTop = 0;

		this.prevLeft = 0;

		this.element = "div#storyChar" + this.index + ".divStoryChar";

		this.nameElement = "div#storyCharName" + this.index;

		this.imageElement = "img#storyCharPic" + this.index + ".storyChar";

	}

	this.add = function() {

		this._add();

		$(this.imageElement).attr("data-mongoid", this.ID);

		$(this.imageElement).attr("data-shortName", this.shortName);		

		$(this.nameElement).text( this.name );
	}
} 

Char.prototype = new Entity();