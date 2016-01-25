//in-game-editor.js

gEditLabels = false;

gInstantMode = false;

gUserCountriesOnlyMode = true;

gCropPictureMode = new Blaze.ReactiveVar(false);

gGameEditor = false;

//turn in-game editor off / on  (only on for now, need named functions for $(window).on() calls to unbind them)

$(document).keydown(function(e) {

    if (e.which == 116) toggleGameEditor();

  }
);


$(document).keydown(function(e) {

	if (!gGameEditor) return;

    switch(e.which) {

    	case 37: 

    		if (gEditLabels) nudgeLabel( e.which );

    		break;

    	case 38: 

    		if (gEditLabels) nudgeLabel( e.which );

    		break;

    	case 39: 

    		if (gEditLabels) nudgeLabel( e.which );

    		break;

    	case 40: 

    		if (gEditLabels) nudgeLabel( e.which );

    		break;

	    case 69: //e

	    	if (gGameEditor) toggleEditLabels();

	    	break;

	    case 71:  //g

	    	if (gEditLabels) go();	//tells the worldMap to continue the hackDone sequence when we are in editLabels mode

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

        case 117: //F6 

	        startCropMode();

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

    if ( display.ctl["MAP"].getState() == sMapDone) {

        Meteor.defer( function() { display.ctl["MAP"].worldMap.labelMapObject( 14, "yellow", _x, _y ); } );
    }
    else {

        Meteor.defer( function() { display.ctl["MAP"].worldMap.labelMapObject( 24, "yellow", _x, _y ); } );      
    } 
}

function updateLabelRecord() {

    if ( display.ctl["MAP"].getState() == sMapDone) {

        Meteor.defer( function() { updateLabelPosition( 2 ); } );
    }
    else {

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

function startCropMode() {

	if (gCropPictureMode.get() == false ) {

    	gCropPictureMode.set( true );	

		Meteor.defer( function() { $('#closeUpPic').cropper({
		  aspectRatio: 1 / 1,
		  viewMode: 0

		  });

		});	
	}
	else {

    	gCropPictureMode.set( false );				
	}

}


//temporary hacks


arrI = [];

ti = function() {

	Meteor.subscribe("allImages", function() { arrI = db.ghPublicImage.find().fetch(); c("images ready") });
}

iIndex = -1;

goImage = function ( _val ) {

	iIndex += _val;

	if (iIndex < 0 || iIndex >= arrI.length) { c("val out of range"); return;}

	hack.debrief.image = getS3URL( arrI[ iIndex ] );

	hack.debrief.text = iIndex + " of " + arrI.length + " -- " + arrI[ iIndex ].copies.ghPublic.name + " -- " + arrI[ iIndex ].cc;

	hack.debrief.draw();
}
