//storyPreload.js

sizeAndPos = function() {

	var _big = "img#big"

	var _smA = "img#smallA";

	var _smB = "img#smallB";


	var _top = 0.4;


	var _left = 0.4;

	var _width = 0.1;

	doElement( _smA, _left, _top, _width, 100);

	
	_top =  0.3;

	_left = 0.30

	_width = 0.3;

	doElement( _big, _left, _top, _width, 300);


	_left = 0.7;

	_top =  0.3;

	_width = 0.1;

	doElement( _smB, _left, _top, _width, 100);

}

doElement = function( _ele, _left, _top, _width, _origWidth) {

	var _windowWidth = $(window).width();

	var _windowHeight = $(window).height();


	var _pixelWidth = _width * _windowWidth;

	var _scaleX = _pixelWidth / _origWidth;
  
  
  	var _pixelHeight = _width * _windowHeight;

	var _scaleY = _pixelHeight / _origWidth;
	
  	var _topVal = _top * _windowHeight;

	var _leftVal = _left * _windowWidth;

	var _xFactor = ( _scaleX - 1.0) * _origWidth;

	_leftVal = _leftVal + _xFactor/2 ;

	var _yFactor =  ( _scaleY - 1.0) * _origWidth;  //use height here, but we're using squares so this is OK

	_topVal = _topVal + _yFactor/2 ;

	var _str = "matrix(" + _scaleX + ", 0, 0, " + _scaleY + ", " + _leftVal + ", " + _topVal + ")";



c(_ele)
c(_str)
	

	$(_ele).css("transform", _str)

}

zoomAll = function() {

	var _big = "img#big"

	var _smA = "img#smallA";

	var _smB = "img#smallB";

	//$(_big).css("transform-origin","initial");

	TweenLite.to( _big, 2, { scale: 4 }  );

}



tIndex = -1;

tRec = null;

arrToken = [];

imageSrc = null;

fixTokenSizes = function( _name ) {

	arrToken = db.ghToken.find({}).fetch();

	for (var i = 0; i < arrToken.length; i++) {

		var _obj = arrToken[i];

		if (_obj.w) {  //oWner

			var _ent = story[ _obj.n ];
c(_obj.n)
c(_ent)


			var _element = _ent.getChildElement( _ent.type );

			var _width = $( _element ).outerWidth() / $(window).width();

			var _height = $( _element ).outerHeight() / $(window).height();

c(_obj.n + " -- width: " + _width + " -- height: " + _height );

			db.ghToken.update( { _id: _obj._id }, { $set: { scx: _width, scy: _height } } );		
		}


	}
}


addTokenSizes = function( _name ) {

		arrToken = db.ghToken.find({}).fetch();

		getNextSize();
	}

getNextSize = function() {

		tIndex++;

		if (tIndex == arrToken.length) return;

		tRec = arrToken[tIndex];

		$("#preloadFeature").attr("src", tRec.p);

	        imagesLoaded( document.querySelector('#preloadFeature'), function( instance ) {
	    
	          //now that the image is loaded ...

	          imageSrc = display.getImageFromFile( tRec.p );

	          Meteor.setTimeout( function() { showSize() }, 500 );

	     });

}

showSize = function() {

			  c(tRec.n + " -- width: " + imageSrc.width + ", hite: " + imageSrc.height);

			  var _ext = tRec.p.substr( tRec.p.length - 4, 4)

			  var _filename = tRec.p.substr(0, tRec.p.length - 4);

			  _filename = _filename + "_" + imageSrc.width + "_" + imageSrc.height + _ext;

			  db.ghToken.update( { _id: tRec._id }, { $set: { p: _filename } } );

			  getNextSize();
}






//story.updatePreloads()

testsp = function() {



		$("#ps1").attr("src", _img1 );

		$("#ps2").attr("src", _img2 );

        imagesLoaded( document.querySelector('#preloadStoryFiles'), function( instance ) {

        });	
}


/*

		//sub-content:  save scale as a percentage of parent

		if (_ent.ownerEntity) {

			var _owner = _ent.ownerEntity;

			if ( _obj.scaleX ) {

				_update.scx = ( $( _ent.getChildElement( _ent.type ) ).outerWidth() ) / $(_owner.element).outerWidth();

				_update.scx= (_update.scx * 100) + "%";	
						
			}
 

			if ( _obj.scaleY ) {

				_update.scy = ( $( _ent.getChildElement( _ent.type ) ).outerHeight() ) / $(_owner.element).outerHeight();

				_update.scy= (_update.scy * 100) + "%";	
		}

c(_ent.name + " -- width: " + _update.scx + " -- height: " + _update.scy );	
		}
return;

Tracker.autorun( function(comp) {

  		var _flag = Session.get("sCheckStoryPreloads") 

  		console.log("story preloads equal " + _flag)

	}

);  

*/