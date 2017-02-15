//token.js

Token = function() {

		this.init = function( _obj, _index ) {

		this.name = _obj.n;

		this.ID = _obj._id;

		this.index = _index;

		this.shortName = _obj.n;

		this.entityType = "token";

		if (_obj.sn) {

			this.shortName = _obj.sn;
		}

		this.collectionID = cToken;

		this.type = "";

		this.owner = "";

		this.ownerEntity = null;

		this.content = null;

		this.contentBG = null;

		this.contentMode = "front";  //'front' or 'back'

		if (_obj.t == "n") {

			this.type = "normal";

			this.zIndex = 1001;
		}

		if (_obj.t == "c") {

			this.type = "content";	

			this.zIndex = 1000;

			this.owner = _obj.w;

			this.borderRadius = "16px";
		}	

		if (_obj.t == "cb") {

			this.type = "contentBG";	

			this.zIndex = 990;

			this.owner = _obj.w;

			this.borderRadius = "16px";
		}

		this.pic = _obj.p;	

		if (_obj.top) this.top = percentStringToNumber( _obj.top );

		if (_obj.l) this.left = percentStringToNumber( _obj.l );

		if (_obj.scx) this.scaleX = _obj.scx;

		if (_obj.scy) this.scaleY = _obj.scy;


		this.movable = false;

		this.movable = _obj.m;


		this.spacer = 16;

		this.element = "div#storyThing" + this.index + ".divStoryThing";

		this.imageElement = "img#storyThingPic" + this.index + ".storyThing";

		this.contentElement = "img#storyThingContent" + this.index + ".storyThingContent";		

		this.contentElementBG = "img#storyThingContentBG" + this.index + ".storyThingContentBG";		
	}

	this.add = function( _flag ) {

		this._add( _flag );

		story.tokenObjs.push( this );
	}

	this.addContent = function( _name ) {

		var _obj = this.content[ _name ];

		Token.contentEntity = _obj;

		_obj.ownerEntity = this;

		$(this.contentElement).css("z-index", _obj.zIndex);	

		$(this.contentElement).attr("data-shortName", this.shortName);	

		if (_obj.borderRadius) $(this.contentElement).css("border-radius", _obj.borderRadius);

		var _duration = 500;

		Token.current = this;

		Token.pic = _obj.pic;

		this.fadeOutElement( this.contentElement, _duration ); 

 		Meteor.setTimeout( function() { $(Token.contentEntity.draw() ) }, _duration + 10 )

 		Meteor.setTimeout( function() { $(Token.current.contentElement).attr("src", Token.pic ) }, _duration + 20 )

 		Meteor.setTimeout( function() { Token.current.fadeInElement( Token.current.contentElement) }, _duration + 30 )
	}

	this.addContentBG = function( _name ) {

		var _obj = this.contentBG[ _name ];

		_obj.ownerEntity = this;

		_obj.draw();

		$(this.contentElementBG).attr("data-shortName", this.shortName);	

		if (_obj.borderRadius) $(this.contentElementBG).css("border-radius", _obj.borderRadius);

		$(this.contentElementBG).attr("src", _obj.pic )

	}

	this.fadeInElement = function(_element, _val) {

		var _duration = 500;

		if (_val) _duration = _val;

		if ( $(_element).css("opacity") == 0 ) $( _element).velocity( "fadeIn", { duration: _duration} );

	},

	this.fadeOutElement = function( _element, _val ) {
		
		var _duration = 500;

		if (_val) _duration = _val;

		$( _element ).velocity( "fadeOut", { duration: 500} );
	}

} 

Token.prototype = new Entity();

Token.contentEntity = null;

Token.current = null;

Token.pic = "";
