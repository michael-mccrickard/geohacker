


//in-game-editor.js

gEditLabels = false;

gInstantMode = false;  //no longer works, but we might bring it back

gUserCountriesOnlyMode = true;

gCropPictureMode = new Blaze.ReactiveVar(false);

gGameEditor = false;

gEditLearnCountry = false;

gEditCapsulePos = false;

gEditSidewallsMode = false;

gEditElement = "div.transHomelandText";

gArrCountry = [];

gCountryIndex = 0;

gColorIndex = 0;

//turn in-game editor off / on  

$(document).keydown(function(e) {

//fix these so they only work for admins

    if (e.which == 116) toggleGameEditor();  //F5

//on a macbook you can't trap any of the function keys easily, so ...

 
    if (e.which == 187) toggleGameEditor();  //equals sign

//Cropping, if needed should be moved under the regular in-game editor setup

    //if (e.which == 32) startCrop();   


    //if (e.which == 117) turnOffCropMode();


//only for the movie

    //if (e.which == 32) doH();    

    if (Meteor.user().profile.st == usAdmin) {

        if (hack.mode == mEdit || hack.mode == mBrowse) {

           if (gEditLabels || gEditCapsulePos || gEditSidewallsMode || gEditLearnCountry) return;

           switch(e.which) {

            case 37: //left arraw

              hackAdjacentCountry(-1);

              break;

            case 39: //right arrow

              hackAdjacentCountry(1);

              break;           
           }
        }
    }
  }
);

//***************************************************************
//            EDITOR MODE EVENTS
//***************************************************************


$(document).keydown(function(e) {

	if (!gGameEditor) return;

    switch(e.which) {

      case 32: //space

        if (gEditLearnCountry) switchEditText();

        if (gEditSidewallsMode) switchSideWalls();

        break;

      case 33: //pageup

        if (gEditLearnCountry) editCountry(-1);

        break;

      case 190: //period 

        if (gEditLearnCountry) editCountry(-1);

        break;

      case 191: //forward slash

        if (gEditLearnCountry) editCountry(1);

        break;

      case 34: //pagedown

        if (gEditLearnCountry) editCountry(1);

        break;

    	case 35: //end

        if (gEditLearnCountry) editTextColor(-1);

    		break;

      case 222: //single quote 

        if (gEditLearnCountry) editTextColor(1);

        break;

      case 36: //home

        if (gEditLearnCountry) editTextColor(1);

        break;

      case 186: //semi colon

        if (gEditLearnCountry) editTextColor(-1);

        break;

      case 37:  //left arrow

        if (gEditLabels || gEditCapsulePos) nudgeLabel( e.which );

        if (gEditLearnCountry) posElementLeft(1); 

        if (gEditSidewallsMode) display.browser.nextMeme( display.browser.ID);


        break;

      case 38: //arrow key up

        if (gEditLabels || gEditCapsulePos) nudgeLabel( e.which );

        if (gEditLearnCountry) editTextSize(1);

        if (gEditSidewallsMode) display.browser.editSidewallFontSize(0.1)

        break;

      case 39:  //right arrow

        if (gEditLabels || gEditCapsulePos) nudgeLabel( e.which );

        if (gEditLearnCountry) posElementLeft(-1); 

        if (gEditSidewallsMode) {

          var _id = display.browser.setID();

          display.browser.nextMeme( _id );
        }
        break;


      case 40: //arrow key down

        if (gEditLabels || gEditCapsulePos) nudgeLabel( e.which );

        if (gEditLearnCountry) editTextSize(-1);

        if (gEditSidewallsMode) display.browser.editSidewallFontSize(-0.1)

        break;


  	    case 65: //a

	    	hack.autoHack();

	    	break;

        case 67: //c

        toggleEditCapsulePos();

        break;

	    case 69: //e

	    	toggleEditLabels();

	    	break;

	    case 71:  //g

	    	if (gEditLabels) {

	    		var _state = hackMap.getState();

	    		if (_state == sTestCountry) hackMap.worldMap.doCorrectSequence();  //resume part 1 of the end-of-hack sequence

	    		if (_state == sCountryOK) hackMap.worldMap.hackDone4a();  //resume the part 2 of end-of-hack sequence

	    		 showMessage("resuming sequence");
	    	}

	    	break;

	    case 73: //i

	    	//toggleInstantMode();  //not working anymore

	    	break;

      case 76: //l

        toggleEditLearnCountryMode();

        break;

      case 78: //n

        toggleNavigateCountriesMode();

        break;

      case 81: //q

        if (gEditCapsulePos) moveCapsuleToDefault();

        break;

	    case 83: //s

        if (gEditCapsulePos) updateCapsulePos();

	    	if (gEditLabels) updateLabelRecord();

        if (gEditLearnCountry) updateLCValues();

        if (gEditSidewallsMode) display.browser.updateMemeFontSize();

	    	break;

	    case 85:  //u

	    	toggleUserCountriesOnlyMode(); 

	    	break;

      case 87:  //w

        toggleEditSidewallsMode(); 

        break;

      case 219:  //open bracket

        adjustCapitalOpacity(-1); 

        break;

      case 221:  //close bracket

        adjustCapitalOpacity(1); 

        break;

        default: return; // exit this handler for other keys
    }
    
    e.preventDefault(); // prevent the default action (scroll / move caret)
});


function resetArrowKeyModes() {

  gEditLabels = false;

  gEditCapsulePos = false;

  gEditLearnCountry = false;

  gEditSidewallsMode = false;

}

//***************************************************************
//            TOGGLE EDITOR MODES
//***************************************************************

toggleGameEditor = function() {

	gGameEditor = !gGameEditor;

	if (gGameEditor) {

$("div#universalMessageText").removeClass("invisible");

		startGameEditor();

		showMessage( "Game editor on");
	}

	if (!gGameEditor) {

		stopGameEditor();        	

		showMessage( "Game editor off");

    Meteor.setTimeout( function() { $("div#universalMessageText").addClass("invisible"); }, 1000);
	}
};
    

startGameEditor = function() {

	c("starting game editor")

}

stopGameEditor = function() {

	c("stopping game editor");

  resetArrowKeyModes();

	gInstantMode = false;

	gUserCountriesOnlyMode = true;

}


function toggleEditLabels() {

   if (gEditLabels) {

      gEditLabels = false;

      showMessage("Edit labels is off")

   }
   else {

    resetArrowKeyModes();

      gEditLabels = true;

      showMessage("Edit labels is on")        
   }
}

function toggleEditCapsulePos() {

   if (gEditCapsulePos) {

      gEditCapsulePos = false;

      showMessage("Edit capsule position is off")

   }
   else {

    resetArrowKeyModes();

      gEditCapsulePos = true;

      showMessage("Edit capsule position is on")        
   }
}

function toggleUserCountriesOnlyMode() {

   gUserCountriesOnlyMode = !gUserCountriesOnlyMode;

   if (gUserCountriesOnlyMode) showMessage("MAP SHOWS USER COUNTRIES ONLY");

   if (!gUserCountriesOnlyMode) showMessage( "MAP SHOWS ALL COUNTRIES");  
}

function toggleEditSidewallsMode() {

   gEditSidewallsMode = !gEditSidewallsMode;

   if (gEditSidewallsMode) {

      showMessage("EDITING SIDEWALLS ON");

      display.browser.suspendRotation = true;

      display.browser.markNextSidewall("left");

   }

   if (!gEditSidewallsMode) showMessage( "EDITING SIDEWALLS OFF");  
}

function toggleInstantMode() {

   gInstantMode = !gInstantMode;

   if (gInstantMode) showMessage( "Instant mode on");

   if (!gInstantMode) showMessage( "Instant mode off");   
}

function toggleEditLearnCountryMode() {

  if (!gEditLearnCountry) resetArrowKeyModes();

   gEditLearnCountry = !gEditLearnCountry;

   if (gEditLearnCountry) showMessage( "Edit learn country mode on");

   if (!gEditLearnCountry) showMessage( "Edit learn country mode off");   
}


function switchSideWalls() {

    display.browser.markNextSidewall();
}

//***************************************************************
//            EDIT LABELS MODE
//***************************************************************

function nudgeLabel(_code) {

	var map = hackMap.worldMap.map;

  if (game.user.mode == uLearn) map = game.lesson.lessonMap.map;

	var _x = map.allLabels[0].x;

	var _y = map.allLabels[0].y;

  if (gEditCapsulePos) {

    _x = $(".divLearnCountry").offset().left;

    _y = $(".divLearnCountry").offset().top;
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


function moveCapsule( _obj) {

  $(".divLearnCountry").offset( _obj );
}

function moveCapsuleToDefault() {

    var _obj = {};

    _obj.top = 200;

    _obj.left = 200;

    moveCapsule( _obj );
}

function moveLabel() {

	var map = hackMap.worldMap.map;

  if (game.user.mode == uLearn) map = game.lesson.lessonMap.map;

	var _x = map.allLabels[0].x;

	var _y = map.allLabels[0].y;

    map.clearLabels();

    if (game.user.mode == uLearn) {


        var _area = "";

        if (game.lesson.detailLevel == mlCountry) {

          _area = game.lesson.country;

           Meteor.defer( function() { game.lesson.lessonMap.labelMapObject(game.lesson.detailLevel, _area, _x, _y, 12, "black"); } );
        }

        if (game.lesson.detailLevel == mlRegion){

          _area = game.lesson.region;

          Meteor.defer( function() { game.lesson.lessonMap.labelMapObject(game.lesson.detailLevel, _area, _x, _y, 16, "white"); } );         
        }

        return;
    }

    if ( hackMap.getState() == sCountryOK) {

        Meteor.defer( function() { hackMap.worldMap.labelMapObject( 14, "black", _x, _y ); } );
    }
    else {

        Meteor.defer( function() { hackMap.worldMap.labelMapObject( 24, "black", _x, _y ); } );      
    } 
}

updateLabelRecord = function() {

	showMessage("updating label pos in db");

  if (game.user.mode == uLearn) {

        Meteor.defer( function() { updateLabelPosition( 3 ); } );    

        return;  
  }

	//if the state is sCountryOK, then we are on the second labeling of the correct country
	//(with the half-width map displayed to the left)

    if ( hackMap.getState() == sCountryOK) {

        Meteor.defer( function() { updateLabelPosition( 2 ); } );
    }
    else {   //otherwise we are updating the first labeling of the country (full-screen map)

        Meteor.defer( function() { updateLabelPosition( 1 ); } );     
    }	
}



//***************************************************************
//            EDIT LEARN COUNTRY CAPSULES
//***************************************************************

var arrColor = ["white","black","red","orange","limegreen","mediumpurple","yellow","turquoise","teal","gold","green","slategray","brown"]





function switchEditText() {

   if (gEditElement == "div.transHomelandText" ) {

      gEditElement = "div.nativeHomelandText";
   }
   else {

     gEditElement = "div.transHomelandText"
   }
}

function editCountry( _val ) {

  gCountryIndex += _val;

  if (gCountryIndex == -1) gCountryIndex = gArrCountry.length - 1;

  if (gCountryIndex == gArrCountry.length) gCountryIndex = 0;

  hack.initForBrowse( gArrCountry[ gCountryIndex ].c );
}

function editTextColor( _val ) {

   gColorIndex += _val;

  if (gColorIndex == -1) gColorIndex = arrColor.length - 1;

  if (gColorIndex == arrColor.length) gColorIndex = 0;

  $( gEditElement ).css("color", arrColor[ gColorIndex ] );
} 

function editTextSize( _val ) {

   var _size = $(gEditElement).css("font-size");

   _size = deriveInt(_size);

   _size += _val;

  if (_size == 0) _size = 1;

  $( gEditElement ).css("font-size", _size + "px" );
} 

function posElementLeft( _val ) {

   var _left = $("div.homelandText").css("margin-left");

   _left = deriveInt(_left);

   _left += _val * -1;

  $( "div.homelandText" ).css("margin-left", _left + "px" );
}

function adjustCapitalOpacity( _val ) {

   var _o = parseFloat( $("img.learnCapitalImage").css("opacity") );

   _o += _val * 0.1;

   if (_o > 1.0) _o = 1.0;

   if (_o < 0.0) _o = 0.0;

  $( "img.learnCapitalImage" ).css("opacity", _o );
}



//***************************************************************
//            CROP MODE
//***************************************************************

function turnOffCropMode() {

	gCropPictureMode.set( false );	

	showMessage( "Crop mode off");

	return;

/*
	if (gCropPictureMode.get() == true ) {

		gCropPictureMode.set( false );	

		showMessage( "Crop mode off");
	}
	else {

		gCropPictureMode.set( true );	

		showMessage( "Crop mode on");			
	}
*/

}

function startCrop() {

//if (gCropPictureMode.get() == false ) return;

    gCropPictureMode.set( true );

	Meteor.defer( function() { $('#closeUpPic').cropper({
	  aspectRatio: 1 / 1,
	  viewMode: 0

	  });

	});	
}

//***************************************************************
//            NAVIGATE COUNTRIES
//***************************************************************

function hackAdjacentCountry( _val ) {

    if (hack.mode == mEdit)  {

        hack.index += _val;

        var _code = Database.getCountryCodeForIndex( hack.index );

        editor.hack.countryCode = _code;  

        FlowRouter.go("/waiting");

        editor.dataReady = false;

        Meteor.setTimeout( function() { editor.subscribeToData(); }, 100 );
     
    }

    if (game.user.mode == uLearn) {

        hack.index += _val;

        var _code = Database.getCountryCodeForIndex( hack.index );

        hack.countryCode = _code;  

        game.lesson.showCountryAndCapsule( _code );

      return;
    }

    if (game.user.mode == uBrowseCountry) {

        hack.index += _val;

        var _code = Database.getCountryCodeForIndex( hack.index );

        hack.countryCode = _code;  

        game.user.browseCountry( _code );

      return;
    }

}


//***************************************************************
//            DATABASE UPDATES
//***************************************************************



function updateCapsulePos() {

    var map = game.lesson.lessonMap.map

    var s = ".divLearnCountry";

    var x = $(s).offset().left;

    var y = $(s).offset().top;

    var loc = map.stageXYToCoordinates(x, y);

    var rec = db.getCountryRec(game.lesson.country);

    db.updateRecord2( cCountry, "cpLon", rec._id, loc.longitude);

    db.updateRecord2( cCountry, "cpLat", rec._id, loc.latitude);

    showMessage(db.getCountryName( game.lesson.country ) + " capsule pos updated to lon:" + loc.longitude + ", lat: " + loc.latitude);

    return;

}

function updateLCValues()  {

  var rec = db.getCountryRec( hack.countryCode );

  //color and size for the homeland text and the translated homeland text

  db.updateRecord2( cCountry, "hts", rec._id, deriveInt( $("div.nativeHomelandText").css("font-size") ) );

  db.updateRecord2( cCountry, "htc", rec._id, $("div.nativeHomelandText").css("color") );

  db.updateRecord2( cCountry, "tts", rec._id, deriveInt( $("div.transHomelandText").css("font-size") ) );

  db.updateRecord2( cCountry, "ttc", rec._id, $("div.transHomelandText").css("color") );

  //the margin-left value for the parent div

  db.updateRecord2( cCountry, "htl", rec._id, deriveInt( $("div.homelandText").css("margin-left") ) ); 

  //the opacity value for the capital image

  db.updateRecord2( cCountry, "hto", rec._id, $("img.learnCapitalImage").css("opacity") ); 

  showMessage( "learning capsule values updated for " + rec.n);
}


updateLabelPosition = function(_which) {

    var map = hackMap.worldMap.map

    var mapObj = hackMap.worldMap;

    if (game.user.mode == uLearn) map = game.lesson.lessonMap.map;

    var x = map.allLabels[0].x;

    var y = map.allLabels[0].y;


      //var _long = map.stageXToLongitude( x );

      //var _lat = map.stageYToLatitude( y );

      var loc = map.stageXYToCoordinates(x, y);

      var _long = loc.longitude;

      var _lat = loc.latitude;

    if (game.user.mode == uLearn) {

        var _level = game.lesson.detailLevel;

        if (_level == mlCountry) {

           var rec = db.getCountryRec(game.lesson.country);

          db.updateRecord2( cCountry, "llon", rec._id, _long);

          db.updateRecord2( cCountry, "llat", rec._id, _lat);

          console.log("country " + "(" + _which + ") " + db.getCountryName( game.lesson.country ) + " label updated to (long / lat method) " + _long + ", " + _lat);

          return;         
        }

        //for now learn mode stores the region and continent with the lessonMap object (country with the lesson object)

        if (_level == mlRegion) {

           var rec = db.getRegionRec(game.lesson.region);

          db.updateRecord2( cRegion, "llon", rec._id, _long);

          db.updateRecord2( cRegion, "llat", rec._id, _lat);

          showMessage("region " + "(" + rec.c + ") " + db.getRegionName( game.lesson.region ) + " label updated to " + _long + ", " + _lat);

          return;         
        }


    }

    x =  x  / map.divRealWidth;

    y =  y  / map.divRealHeight;


    var xName = "xl";

    var yName = "yl";

    if ( _which == 2 ) {

      xName = "xl2";
      yName = "yl2";
    }

    var selectedContinent = mapObj.selectedContinent;

    var selectedRegion = mapObj.selectedRegion;

    var selectedCountry = mapObj.selectedCountry.get();

    var _level = hackMap.level.get();

//db.updateRecord2 = function (_type, field, ID, value) 

    if (_level == mlContinent) {

        var rec = db.getContinentRec(selectedContinent);

        db.updateRecord2( cContinent, "xl", rec._id, x);

        db.updateRecord2( cContinent, "yl", rec._id, y);

        console.log("continent " + selectedContinent + " label updated to " + x + ", " + y);
    }

    if (_level == mlRegion) {

        var rec = db.getRegionRec(selectedRegion);

        db.updateRecord2( cRegion, "xl", rec._id, x);

        db.updateRecord2( cRegion, "yl", rec._id, y);

        console.log("region " + selectedRegion + " label updated to " + x + ", " + y);
    }

    if (_level == mlCountry) {

        var rec = db.getCountryRec(selectedCountry);

        db.updateRecord2( cCountry, xName, rec._id, x);

        db.updateRecord2( cCountry, yName, rec._id, y);

        console.log("country " + "(" + _which + ") " + selectedCountry + " label updated to (using old ratio method, xl2, yl2) " + x + ", " + y);
    }
    

}


//***************************************************************
//            UTILITIES
//***************************************************************



function deriveInt(_s) {

  _s = _s.substr(0, _s.length-2);

  return parseInt(_s);
}

//***************************************************************
//            TEMPORARY HACKS
//***************************************************************


arrI = [];

ti = function() {

  Meteor.subscribe("allImages", function() { arrI = db.ghImage.find().fetch(); c("images ready") });
}

iIndex = -1;

goImage = function ( _val ) {

  iIndex += _val;

  if (iIndex < 0 || iIndex >= arrI.length) { c("val out of range"); return;}

  hack.debrief.image = arrI[ iIndex ].u;

  hack.debrief.text = iIndex + " of " + arrI.length + " -- " + arrI[ iIndex ].u + " -- " + arrI[ iIndex ].cc;

  hack.debrief.draw();
}


//hilites the controls in turn (for the movie)
doH = function() {

      Meteor.setTimeout( function() { $("#ctlBG_SOUND" ).attr("src", "hilitedBackdrop.jpg"); }, 1 );

      Meteor.setTimeout( function() { $("#ctlBG_SOUND" ).attr("src", "featuredBackdrop.jpg"); }, 1001 );


      Meteor.setTimeout( function() { $("#ctlBG_TEXT" ).attr("src", "hilitedBackdrop.jpg"); }, 1001 );

      Meteor.setTimeout( function() { $("#ctlBG_TEXT" ).attr("src", "featuredBackdrop.jpg"); }, 2001 );


      
      Meteor.setTimeout( function() { $("#ctlBG_IMAGE" ).attr("src", "hilitedBackdrop.jpg"); }, 2001 );

       Meteor.setTimeout( function() { $("#ctlBG_IMAGE" ).attr("src", "featuredBackdrop.jpg"); }, 3001 );


      Meteor.setTimeout( function() { $("#ctlBG_VIDEO" ).attr("src", "hilitedBackdrop.jpg"); }, 3001 );

       Meteor.setTimeout( function() { $("#ctlBG_VIDEO" ).attr("src", "featuredBackdrop.jpg"); }, 4001 );

      
      Meteor.setTimeout( function() { $("#ctlBG_WEB" ).attr("src", "hilitedBackdrop.jpg"); }, 4001 );

      Meteor.setTimeout( function() { $("#ctlBG_WEB" ).attr("src", "featuredBackdrop.jpg"); }, 5001 );
      

}