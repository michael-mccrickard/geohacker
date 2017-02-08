//token.js

Token = function() {

	this.init = function( _obj, _index ) {

		this.name = _obj.n;

		this.shortName = _obj.n;

		if (_obj.sn) {

			this.shortName = _obj.sn;
		}

		this.type = "";

		this.owner = "";

		if (_obj.t == "n") {

			this.type = "normal";

			this.zIndex = 1001;
		}

		if (_obj.t == "c") {

			this.type = "content";	

			this.zIndex = 1000;

			this.owner = _obj.o;
		}	

		this.pic = _obj.p;	

		this.top = percentStringToNumber( _obj.top );

		this.left = percentStringToNumber( _obj.l );

		if (_obj.sc) this.scale = _obj.sc;

		this.index = _index;

		this.movable = false;

		this.movable = _obj.m;


		this.spacer = 16;

		this.element = "div#storyThing" + this.index + ".divStoryThing";

		this.imageElement = "img#storyThingPic" + this.index + ".storyThing";

		this.contentElement = "img#storyThingContent" + this.index + ".storyThingContent";		

		//check for tokens in ghToken where o == this.shortName

	}

	this.add = function() {

		this._add();

		story.tokenObjs.push( this );

		$(this.imageElement).attr("data-shortname", this.shortName);	
	}

	this.addContent = function( _name ) {

		var _obj = this.content[ _name ];

		$(this.contentElement).attr("src", _obj.pic);

		$(this.contentElement).css("width", _obj.width);

		$(this.contentElement).css("height", _obj.height);

		$(this.contentElement).css("left", _obj.left);

		$(this.contentElement).css("top", _obj.top);	

		$(this.contentElement).css("z-index", _obj.zIndex);	

		$(this.contentElement).attr("data-shortName", this.shortName);	

		if ( _obj.borderRadius) $(this.contentElement).css("border-radius", _obj.borderRadius);	
	}


} 

Token.prototype = new Entity();

/*

Token = function() {

	this.init = function( _obj  ) {

		this.name = _obj.name;

		this.shortName = _obj.name;

		if (_obj.shortName) {

			this.shortName = _obj.shortName;
		}

		this.type = _obj.type;

		this.pic = _obj.pic;	

		//width and left are a little tricky, you can use them if you don't plan to zoom the item
		//or you can live with the position that they zoom themselves to

		if (_obj.width) this.width = _obj.width;

		this.top = _obj.top;

		if (_obj.left) this.left = _obj.left;

		this.index = _obj.index;

		this.type = _obj.type;

		if ( _obj.content ) this.content = _obj.content;

		this.movable = false;

		if (_obj.movable) this.movable = _obj.movable;

		this.zIndex = 1001;

		this.spacer = 16;

		this.element = "div#storyThing" + this.index + ".divStoryThing";

		this.imageElement = "img#storyThingPic" + this.index + ".storyThing";

		this.contentElement = "img#storyThingContent" + this.index + ".storyThingContent";		

	}

	this.add = function() {

		this._add();

		story.tokenObjs.push( this );

		$(this.imageElement).attr("data-shortname", this.shortName);	
	}

	this.addContent = function( _name ) {

		var _obj = this.content[ _name ];

		$(this.contentElement).attr("src", _obj.pic);

		$(this.contentElement).css("width", _obj.width);

		$(this.contentElement).css("height", _obj.height);

		$(this.contentElement).css("left", _obj.left);

		$(this.contentElement).css("top", _obj.top);	

		$(this.contentElement).css("z-index", _obj.zIndex);	

		$(this.contentElement).attr("data-shortName", this.shortName);	

		if ( _obj.borderRadius) $(this.contentElement).css("border-radius", _obj.borderRadius);	
	}


} 

Token.prototype = new Entity();
*/