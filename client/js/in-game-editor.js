


//in-game-editor.js

gEditLabels = false;

gInstantMode = false;

gUserCountriesOnlyMode = true;

gCropPictureMode = new Blaze.ReactiveVar(false);

gGameEditor = false;

gEditLearnCountry = false;

gEditElement = "div.transHomelandText";

gArrCountry = [];

gCountryIndex = 0;

gColorIndex = 0;

//turn in-game editor off / on  

$(document).keydown(function(e) {

    if (e.which == 116) toggleGameEditor();

    if (e.which == 117) turnOffCropMode();

    //if (e.which == 32) startCrop();   

    if (e.which == 32) doH();     

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

        break;

      case 33: //pageup

        if (gEditLearnCountry) editCountry(-1);

        break;

      case 34: //pagedown

        if (gEditLearnCountry) editCountry(1);

        break;

    	case 35: //end

    		if (gEditLabels) nudgeLabel( e.which );

        if (gEditLearnCountry) editTextColor(-1);

    		break;

      case 36: //home

        if (gEditLabels) nudgeLabel( e.which );

        if (gEditLearnCountry) editTextColor(1);

        break;

      case 37:  //left arrow

        if (gEditLearnCountry) posElementLeft(1); 

        break;

      case 38: //arrow key up

        if (gEditLabels) nudgeLabel( e.which );

        if (gEditLearnCountry) editTextSize(1);

        break;

      case 39:  //right arrow

        if (gEditLearnCountry) posElementLeft(-1); 

        break;


      case 40: //arrow key down

        if (gEditLabels) nudgeLabel( e.which );

        if (gEditLearnCountry) editTextSize(-1);

        break;


  	    case 65: //a

	    	hack.autoHack();

	    	break;

	    case 69: //e

	    	toggleEditLabels();

	    	break;

	    case 71:  //g

	    	if (gEditLabels) {

	    		var _state = display.ctl["MAP"].getState();

	    		if (_state == sTestCountry) display.ctl["MAP"].worldMap.doCorrectSequence();  //resume part 1 of the end-of-hack sequence

	    		if (_state == sCountryOK) display.ctl["MAP"].worldMap.hackDone4a();  //resume the part 2 of end-of-hack sequence

	    		 showMessage("resuming sequence");
	    	}

	    	break;

	    case 73: //i

	    	toggleInstantMode();

	    	break;

      case 76: //i

        toggleEditLearnCountryMode();

        break;

	    case 83: //s

	    	if (gEditLabels) updateLabelRecord();

        if (gEditLearnCountry) updateLCValues();

	    	break;

	    case 85:  //u

	    	toggleUserCountriesOnlyMode(); 

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



//***************************************************************
//            TOGGLE EDITOR MODES
//***************************************************************

toggleGameEditor = function() {

	gGameEditor = !gGameEditor;

	if (gGameEditor) {

		startGameEditor();

		showMessage( "Game editor on");
	}

	if (!gGameEditor) {

		stopGameEditor();        	

		showMessage( "Game editor off");
	}
};
    

startGameEditor = function() {

	c("starting game editor")

}

stopGameEditor = function() {

	c("stopping game editor")

	gEditLabels = false;

	gInstantMode = false;

	gUserCountriesOnlyMode = true;
}


function toggleEditLabels() {

   if (gEditLabels) {

      gEditLabels = false;

      showMessage("Edit labels is off")

   }
   else {

      gEditLabels = true;

      showMessage("Edit labels is on")        
   }
}

function toggleUserCountriesOnlyMode() {

   gUserCountriesOnlyMode = !gUserCountriesOnlyMode;

   if (gUserCountriesOnlyMode) showMessage("MAP SHOWS USER COUNTRIES ONLY");

   if (!gUserCountriesOnlyMode) showMessage( "MAP SHOWS ALL COUNTRIES");  
}

function toggleInstantMode() {

   gInstantMode = !gInstantMode;

   if (gInstantMode) showMessage( "Instant mode on");

   if (!gInstantMode) showMessage( "Instant mode off");   
}
//***************************************************************
//            EDIT LABELS MODE
//***************************************************************

function nudgeLabel(_code) {

	var map = display.ctl["MAP"].worldMap.map;

	var _x = map.allLabels[0].x;

	var _y = map.allLabels[0].y;

	if (_code == 37) {  //left

	   map.allLabels[0].x = _x * 0.98;

	   moveLabel();
	}

	if (_code == 38) {  //down

	   map.allLabels[0].y = _y * 0.98;

	   moveLabel();
	} 

	if (_code == 39) {  //right

	   map.allLabels[0].x = _x * 1.02;

	   moveLabel();
	}

	if (_code == 40) {  //up

	   map.allLabels[0].y = _y * 1.02;

	   moveLabel();
	}

}

function moveLabel() {

	var map = display.ctl["MAP"].worldMap.map;

	var _x = map.allLabels[0].x;

	var _y = map.allLabels[0].y;

    display.ctl["MAP"].worldMap.map.clearLabels();

    if ( display.ctl["MAP"].getState() == sCountryOK) {

        Meteor.defer( function() { display.ctl["MAP"].worldMap.labelMapObject( 14, "black", _x, _y ); } );
    }
    else {

        Meteor.defer( function() { display.ctl["MAP"].worldMap.labelMapObject( 24, "black", _x, _y ); } );      
    } 
}

function updateLabelRecord() {

	showMessage("updating label pos in db");

	//if the state is sCountryOK, then we are on the second labeling of the correct country
	//(with the half-width map displayed to the left)

    if ( display.ctl["MAP"].getState() == sCountryOK) {

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

function toggleEditLearnCountryMode() {

   gEditLearnCountry = !gEditLearnCountry;

   if (gEditLearnCountry) {

     showMessage( "Edit Learn Country mode on");

     db.ghC.find( { d: 1 }, {sort: {n: 1} } );

     if (gArrCountry.length == 0) gArrCountry =  db.ghC.find( { d: 1 }, {sort: {n: 1} } ).fetch();

     game.user.mode = uBrowseCountry;

     game.user.setGlobals( "browse" );

     hack.initForBrowse( gArrCountry[ gCountryIndex ].c );
   }

   if (!gEditLearnCountry) {

      showMessage( "Edit Learn Country mode off");   

      game.user.goHome();
   }
}


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
//            DATABASE UPDATES
//***************************************************************

function updateLCValues()  {

  var rec = db.getCountryRec( hack.countryCode );

  //color and size for the homeland text and the translated homeland text

  db.updateRecord2( cCountry, "hts", rec._id, deriveInt( $("div.nativeHomelandText").css("font-size") ) );

  db.updateRecord2( cCountry, "htc", rec._id, $("div.nativeHomelandText").css("color") );

  db.updateRecord2( cCountry, "tts", rec._id, deriveInt( $("div.transHomelandText").css("font-size") ) );

  db.updateRecord2( cCountry, "ttc", rec._id, $("div.transHomelandText").css("color") );

  //the margin-left value for the parent div

  db.updateRecord2( cCountry, "htl", rec._id, deriveInt( $("div.homelandText").css("margin-left") ) ); 
}


updateLabelPosition = function(_which) {

    //var totalWidth = deriveInt( $("#divMap").css("width") ) ;

    //var totalHeight = deriveInt( $("#divMap").css("height") ) ;

    var totalWidth = display.ctl["MAP"].worldMap.map.divRealWidth;

    var totalHeight =  display.ctl["MAP"].worldMap.map.divRealHeight;

    var x = display.ctl["MAP"].worldMap.map.allLabels[0].x;

c("x in updateLabelPosition is " + x)

    var y = display.ctl["MAP"].worldMap.map.allLabels[0].y;

    x =  x  / totalWidth;

c("x normalized in updateLabelPosition is " + x)

    y =  y  / totalHeight;

    var _level = display.ctl["MAP"].level.get();

    var selectedContinent = display.ctl["MAP"].worldMap.selectedContinent;

    var selectedRegion = display.ctl["MAP"].worldMap.selectedRegion;

    var selectedCountry = display.ctl["MAP"].worldMap.selectedCountry.get();

    var xName = "xl";

    var yName = "yl";

    if ( _which == 2 ) {

      xName = "xl2";
      yName = "yl2";
    }

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

        console.log("country " + "(" + _which + ") " + selectedCountry + " label updated to " + x + ", " + y);
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