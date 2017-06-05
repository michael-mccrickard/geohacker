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

		this.type = "";  //normal, content, contentBG

		this.owner = "";

		this.ownerEntity = null;

		this.content = null;

		this.contentBG = null;

		this.contentMode = "front";  //'front' or 'back'

		this.zIndex = 1003;

		if (_obj.t == "n") this.type = "normal";

		if (_obj.t == "o") this.type = "owner";

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

		this.origSize = getDimensionsFromFilename( this.pic );

		this.translateY = 0;

		this.translatex = 0;

		if (_obj.top) this.translateY = parseFloat(_obj.top);

		if (_obj.l) this.translateX = parseFloat(_obj.l);

		//set the default scale to be the equivalent of the natural size

		this.scaleX = this.origSize.width / $(window).width();

		this.scaleY = this.origSize.height / $(window).height();

		if (_obj.scx) this.scaleX = parseFloat(_obj.scx);

		if (_obj.scy) this.scaleY = parseFloat(_obj.scy);

		this.lastTransform = this.createDefaultTransform();

		this.movable = parseInt(_obj.m);

		this.spacer = 16;

		this.element = "img#storyThingPic" + this.index + ".storyThing";

		this.imageElement = this.element;  //will be different for Chars

		this.contentElement = null;

		this.contentElementBG = null;

		this.currentContentElement = "";	
	}

	this.add = function( _obj ) {

		this._add( _obj );

		story.tokenObjs.push( this );
	}

	this.fadeOutContent = function() {

		if ( this.contentElement) this.fadeOutElement( this.contentElement );

	}

	this.addContent = function( _name ) {

		var _obj = story[ _name ];

		story.tokenObjs.push( _obj );

		_obj.ownerEntity = this;

		this.fadeOutContent();

		this.contentElement = _obj.element;

		$(this.contentElement).css("z-index", _obj.zIndex);	

		$(this.contentElement).attr("data-shortName", _name);	

		if (_obj.borderRadius) $(this.contentElement).css("border-radius", _obj.borderRadius);

		this.currentContentElement = this.contentElement;

		this.switchContent( _obj );
	}


	this.switchContent = function( _obj ) {

		var _duration = 500;

		Token.contentEntity = _obj;

		Token.current = this;

		Token.pic = _obj.pic;

 		Meteor.setTimeout( function() { $( Token.contentEntity.draw( Token.contentEntity.createDefaultTransform() ) ) }, _duration + 10 )

 		Meteor.setTimeout( function() { $( Token.current.currentContentElement).attr("src", Token.pic ) }, _duration + 20 )

 		Meteor.setTimeout( function() { Token.current.fadeInElement( Token.current.currentContentElement) }, _duration + 30 )
	}

	this.addContentBG = function( _name ) {

		var _obj = story[ _name ];

		_obj.ownerEntity = this;

		story.tokenObjs.push( _obj );

		this.contentElementBG = _obj.element;

		$(this.contentElementBG).css("z-index", _obj.zIndex);	

		$(this.contentElementBG).attr("data-shortName", this.shortName);	

		if (_obj.borderRadius) $(this.contentElementBG).css("border-radius", _obj.borderRadius);

		$(this.contentElementBG).attr("src", _obj.pic );

		_obj.draw();

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

	this.linkContent = function() {

		$(this.element).addClass( this.shortName );

		if (this.contentElement) $(this.contentElement).addClass( this.shortName );

		if (this.contentElementBG) $(this.contentElementBG).addClass( this.shortName );		
	}

} 

Token.prototype = new Entity();

Token.contentEntity = null;

Token.current = null;

Token.pic = "";
