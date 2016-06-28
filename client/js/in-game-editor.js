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


//in-game-editor.js

gEditLabels = false;

gInstantMode = false;

gUserCountriesOnlyMode = true;

gCropPictureMode = new Blaze.ReactiveVar(false);

gGameEditor = false;

//turn in-game editor off / on  

$(document).keydown(function(e) {

    if (e.which == 116) toggleGameEditor();

    if (e.which == 117) turnOffCropMode();

    //if (e.which == 32) startCrop();   

    if (e.which == 32) doH();     

  }
);


$(document).keydown(function(e) {

	if (!gGameEditor) return;

    switch(e.which) {

    	case 37: //arrow key 

    		if (gEditLabels) nudgeLabel( e.which );

    		break;

    	case 38: //arrow key 

    		if (gEditLabels) nudgeLabel( e.which );

    		break;

    	case 39: //arrow key 

    		if (gEditLabels) nudgeLabel( e.which );

    		break;

    	case 40: //arrow key 

    		if (gEditLabels) nudgeLabel( e.which );

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

	    case 83: //s

	    	if (gEditLabels) updateLabelRecord();

	    	break;

	    case 85:  //u

	    	toggleUserCountriesOnlyMode(); 

	    	break;

        default: return; // exit this handler for other keys
    }
    
    e.preventDefault(); // prevent the default action (scroll / move caret)
});


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


//temporary hacks


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


//database updates

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

//used by updateLabelPos above

function deriveInt(_s) {

  _s = _s.substr(0, _s.length-2);

  return parseInt(_s);
}
