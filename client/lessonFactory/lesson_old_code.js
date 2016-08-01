
/*
	//***************************************************************
	//				EVENTS
	//***************************************************************


$(document).keydown(function(e) {

	if (!gEditLesson && !gEditCapsulePos) return;

    switch(e.which) {

       case 37:  //left arrow

        nudgeLabel( e.which );

        break;

      case 38: //arrow key up

        nudgeLabel( e.which );

        break;

      case 39:  //right arrow

        nudgeLabel( e.which );

        break;


      case 40: //arrow key down

        nudgeLabel( e.which );

        break;

	  case 83: //s

	    updateLabelRecord();

		break;
    }
});




//***************************************************************
//            EDIT LABELS MODE
//***************************************************************

function nudgeLabel(_code) {

	var map = game.lesson.lessonMap.map;

	var _x = 0;

	var _y = 0;

	if (gEditCapsulePos) {

		_x = $(".divLearnCountry").offset().left;

		_y = $(".divLearnCountry").offset().top;
	}
	else {

		_x = map.allLabels[0].x;

		_y = map.allLabels[0].y;	
	}


	if (_code == 37) {  //left

	   if (gEditCapsulePos) {

	   		_x = _x * 0.98;
	   		
	   		moveCapsule( { top: _y, left: _x });

	   		return;
	   }

	   map.allLabels[0].x = _x * 0.98;

	   moveLabel();
	}

	if (_code == 38) {  //down

	   if (gEditCapsulePos) {

	   		_y = _y * 0.98;

	   		moveCapsule( { top: _y, left: _x });

	   		return;
	   }

	   map.allLabels[0].y = _y * 0.98;

	   moveLabel();
	} 

	if (_code == 39) {  //right

	   if (gEditCapsulePos) {

	   		_x = _x * 1.02;
	   		
	   		moveCapsule( { top: _y, left: _x });

	   		return;
	   }

	   map.allLabels[0].x = _x * 1.02;

	   moveLabel();
	}

	if (_code == 40) {  //up

	   if (gEditCapsulePos) {

	   		_y = _y * 1.02;

	   		moveCapsule( { top: _y, left: _x });

	   		return;
	   }

	   map.allLabels[0].y = _y * 1.02;

	   moveLabel();
	}

}

function moveLabel() {

	var map = game.lesson.lessonMap.map;

	var _x = map.allLabels[0].x;

	var _y = map.allLabels[0].y;

    map.clearLabels();

    Meteor.defer( function() { display.ctl["MAP"].lessonMap.labelMapObject( game.lesson.level, game.lesson.code, _x, _y ); } );      

}

function moveCapsule( _obj) {

	$(".divLearnCountry").offset( _obj );
}




function updateLabelRecord() {

	//showMessage("updating label pos in db");

    Meteor.defer( function() { updateLabelPosition2( ); } );
	
}



updateLabelPosition2 = function(_which) {

	var _map = game.lesson.lessonMap.map

    var totalWidth = _map.divRealWidth;

    var totalHeight =  _map.divRealHeight;

    var x = _map.allLabels[0].x;

//c("x in updateLabelPosition is " + x)

    var y = _map.allLabels[0].y;

    x =  x  / totalWidth;

//c("x normalized in updateLabelPosition is " + x)

    y =  y  / totalHeight;

    var _level = game.lesson.level;

    var _code = game.lesson.code;

    var xName = "xl";

    var yName = "yl";

//db.updateRecord2 = function (_type, field, ID, value) 

    if (_level == mlContinent) {

        var rec = db.getContinentRec( _code );

        db.updateRecord2( cContinent, "xl", rec._id, x);

        db.updateRecord2( cContinent, "yl", rec._id, y);

        console.log("continent " + _code + " label updated to " + x + ", " + y);
    }

    if (_level == mlRegion) {

        var rec = db.getRegionRec( _code );

        db.updateRecord2( cRegion, "xl", rec._id, x);

        db.updateRecord2( cRegion, "yl", rec._id, y);

        console.log("region " + _code + " label updated to " + x + ", " + y);
    }
    

}

	//this.tl.call( this.doLabelRegion, [ arr[i] ], this, arr[i] );



	this.addFadeList = function( _which, _pos) {

		var s = ".divTeachList";

		if (_which == "in") this.tl.add( TweenMax.to(s, 0.5, {opacity: 1, ease:Power1.easeIn } ), _pos );

		if (_which == "out") this.tl.add( TweenMax.to(s, 0.5, {opacity: 0, ease:Power1.easeIn } ), _pos );

	}

	this.addFadeUnselectedList = function( _which, _pos) {

		var s = ".listItem";

		if (_which == "in") this.tl.add( TweenMax.to(s, 0.5, {opacity: 1, ease:Power1.easeIn } ), _pos );

		if (_which == "out") this.tl.add( TweenMax.to(s, 0.5, {opacity: 0, ease:Power1.easeIn } ), _pos );

	}

	this.addShowMessage = function( _text, _pos ) {

		this.tl.call( this.showMessage, [ _text ], this, _pos );
	}

	this.addShowHeader = function( _text, _pos ) {

		this.tl.call( this.showHeader, [ _text ], this, _pos );
	}

	this.addShowBody = function( _text, _pos, _lessonID ) {

		this.tl.call( this.showBody, [ _text, _lessonID ], this, _pos );
	}

	this.addShowList = function( _pos ) {

		this.tl.call( this.showList,[], this, _pos );

	}

	this.addResetBody = function(_pos, _lessonID)  {

		this.tl.call( this.resetBody,[_lessonID], this, _pos );		
	}

	this.addFlyListItemToMap = function( _ID ) {

		var s = "#" + _ID + "-ListItem";

		var itemX = $(s).offset().left;

		var itemY = $(s).offset().top;

		var itemWidth = $(s).width();

		var _lon, _lat, _x, _y;

		var m = game.lesson.lessonMap.map;

		var obj = m.getObjectById( _ID );

		_lat = m.getAreaCenterLatitude( obj );

		_lon = m.getAreaCenterLongitude( obj );

		//the first time thru, the CSS is different on the list items

		var _offset = 800;

		if (this.index != 0) _offset = 0;

		_x = m.longitudeToX(_lon) - (itemX + itemWidth/2) - _offset;   //800 = amt this div is shifted over;

		_y = m.latitudeToY(_lat) - itemY - $(s).height()/2  + 55;  //55 = height of menubar

		this.tl.add( TweenMax.to(s, 1.0, {x: _x, y: _y, scale: 0.45, ease:Power1.easeIn} ) );		
	}


*/