//token.js

Token = function() {

	this.init = function( _obj, _index ) {

		this.name = _obj.n;

		this.ID = _obj._id;

		this.collectionID = cToken;

		this.shortName = _obj.n;

		if (_obj.sn) {

			this.shortName = _obj.sn;
		}

		this.type = "";

		this.owner = "";

		this.ownerEntity = null;

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

		if (_obj.scx) this.scaleX = _obj.scx;

		if (_obj.scy) this.scaleY = _obj.scy;

		this.index = _index;

		this.movable = false;

		this.movable = _obj.m;


		this.spacer = 16;

		this.element = "div#storyThing" + this.index + ".divStoryThing";

		this.imageElement = "img#storyThingPic" + this.index + ".storyThing";

		this.contentElement = "img#storyThingContent" + this.index + ".storyThingContent";		

		//check for tokens in ghToken where o == this.shortName

	}


	this.add = function( _flag ) {

		this._add( _flag );

		story.tokenObjs.push( this );
	}

	this.addContent = function( _name ) {

		var _obj = this.content[ _name ];

		_obj.ownerEntity = this;

		$(this.contentElement).attr("src", _obj.pic);

		//if (_obj.scaleX) $(this.contentElement).css("scaleX", _obj.scaleX);

		//if (_obj.scaleY) $(this.contentElement).css("scaleY", _obj.scaleY);

		//$(this.contentElement).css("left", _obj.left);

		//$(this.contentElement).css("top", _obj.top);	

		$(this.contentElement).css("z-index", _obj.zIndex);	

		$(this.contentElement).attr("data-shortName", this.shortName);	

		if ( _obj.borderRadius) $(this.contentElement).css("border-radius", _obj.borderRadius);	

		_obj.draw();
	}


} 

Token.prototype = new Entity();
