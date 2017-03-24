//storyPreload.js

sizeAndPos = function() {

	var _big = "img.testBoxBig"

	var _sm = "img.testBoxSmall"


	var _origSize = {};

	_origSize.width = 300;

	_origSize.height = 300;	


	var _newSize = {};

	//originally 300 / 2000

	_newSize.width = 600 / 2000;

	//originally 300 / 800

	_newSize.height = 600 / 800;		

	
	var _left = 500 / 2000;

	var _top = 0.25;

	doElement( _big, _origSize, _newSize, _left, _top, false);


	_origSize.width = 100;

	_origSize.height = 100;	

	//originally 100 / 2000

	_newSize.width = 200 / 2000;

	//originally 100 / 800

	_newSize.height = 200 / 800;	

	_left = 600 / 2000;

	_top = 0.375;

	doElement( _sm, _origSize, _newSize, _left, _top, true);

}

doElement = function( _ele, _origSize, _newSize, _left, _top, _childFlag) {

	var _windowWidth = $(window).width();

	var _windowHeight = $(window).height();

	var _origWindowWidth = 2000;

	var _origWindowHeight = 800;


	var _pixelWidth = _newSize.width * _windowWidth;

	var _scaleX = _pixelWidth / _origSize.width;


	var _pixelHeight = _newSize.height * _windowHeight;

	var _scaleY = _pixelHeight / _origSize.height;


	var _topVal = _top * _windowHeight;

	var _leftVal = _left * _windowWidth;	


	if ( _childFlag) {

		var _factor = (_origWindowWidth  - _windowWidth) / _origWindowWidth;

		_leftVal = _leftVal + ( _factor * _origSize.width);  

		_factor = (_origWindowHeight  - _windowHeight) / _origWindowHeight;

		_topVal = _topVal + ( _factor * _origSize.height);		
	}

	var _str = "matrix(" + _scaleX + ", 0, 0, " + _scaleY + ", " + _leftVal + ", " + _topVal + ")";

c(_str)

c(_ele)

	$(_ele).css("transform", _str);
}




/*

	var _bigWidth = _bigBoxSize/_origWidth * _windowWidth;

	var _bigScaleX = _bigWidth / _bigBoxSize;

	var _bigHeight = _bigBoxSize/_origHeight * _windowHeight;	

	var _bigScaleY = _bigHeight / _bigBoxSize;

	var _bigLeft = _bigLeftVal/_origWidth * _windowWidth;

	var _bigTop = _bigTopVal/_origHeight * _windowHeight;

	var _str = "matrix(" + _bigScaleX + ", 0, 0, " + _bigScaleY + ", " + _bigLeft + ", " + _bigTop + ")";

	$(_big).css("transform", _str);



	var _smWidth = _smBoxSize/_origWidth * _windowWidth;

	var _smScaleX = _smWidth / _smBoxSize;

	var _smHeight = _smBoxSize/_origHeight * _windowHeight;

	var _smScaleY = _smHeight / _smBoxSize;

	var _smTop = _smTopVal/_origHeight * _windowHeight;

	var _smLeft = _smLeftVal/_origWidth * _windowWidth;	

	var _xFactor = (_origWidth  - _windowWidth) / _origWidth;

	_smLeft = _smLeft + ( _xFactor * _smBoxSize);

	_xFactor = (_origHeight  - _windowHeight) / _origHeight;

	_smTop = _smTop + ( _xFactor * _smBoxSize);

	_str = "matrix(" + _smScaleX + ", 0, 0, " + _smScaleY + ", " + _smLeft + ", " + _smTop + ")";

	$(_sm).css("transform", _str);

*/





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