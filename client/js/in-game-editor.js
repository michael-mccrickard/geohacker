//in-game-editor.js

gEditLabels = false;

gInstantMode = false;

gUserCountriesOnlyMode = true;

gCropPictureMode = new Blaze.ReactiveVar(false);

gGameEditor = false;

//turn in-game editor off / on  (only on for now, need named functions for $(window).on() calls to unbind them)

$(window).on('keyup', function(e){

    if (e.keyCode == 116) {  //f5

         //gGameEditor = !gGameEditor;

if (gGameEditor) {

	showMessage("game editor stays on until you reboot game")

}

         if (!gGameEditor) {

gGameEditor = true;

         	startGameEditor();

         	showMessage( "Game editor on");
         }

/*
         if (!gGameEditor) {

         	stopGameEditor();        	

         	showMessage( "Game editor off");
         }
*/
    }

    if (e.keyCode == 117) {  //f6

    	startCropMode();
    }


});


stopGameEditor = function() {

/*
	$(window).off('keyup.85');  //u = user countries only mode

	$(window).off('keyup.69');  //e = editLabels

	$(window).off('keyup.73');  //i = instant mode
*/

	gEditLabels = false;

	gInstantMode = false;

	gUserCountriesOnlyMode = true;
}

stopEditLabels = function() {

	$(window).off('keyup.37');  //arrow keys

	$(window).off('keyup.38');

	$(window).off('keyup.39');

	$(window).off('keyup.40');	

	$(window).off('keyup.71');  //g = go() (continue hackDone sequence)

	gEditLabels = false;
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


startGameEditor = function() {


	$(window).on('keyup', function(e){

		//main screen edit hacks

	    if (e.keyCode == 73) {  //i

	         gInstantMode = !gInstantMode;

	         if (gInstantMode) showMessage( "Instant mode on");

	         if (!gInstantMode) showMessage( "Instant mode off");  
	         
	    }

	    //browsing hacks

	    if (e.keyCode == 85) {  //d

	         gUserCountriesOnlyMode = !gUserCountriesOnlyMode;

	         if (gUserCountriesOnlyMode) showMessage("MAP SHOWS USER COUNTRIES ONLY");

	         if (!gUserCountriesOnlyMode) showMessage( "MAP SHOWS ALL COUNTRIES");  
	         
	    }	  


		//map screen edit hacks
	
		if (e.keyCode == 69) {  //e

		   if (gEditLabels) {

		      gEditLabels = false;

		      stopEditLabels();

		      showMessage("Edit labels is off")

		   }
		   else {

		      gEditLabels = true;

		      showMessage("Edit labels is on")        
		   }
		}
/*
		if (!gEditLabels) return;

		var map = display.ctl["MAP"].worldMap.map;

		try {

			var _x = map.allLabels[0].x;

			var _y = map.allLabels[0].y;
		}
		catch( err ) {

			c("No labels on the map or no map object (label editor is on)");
		}
*/
		if (e.keyCode == 71) {  //g

		   go();	//tells the worldMap to continue the hackDone sequence when we are in editLabels mode
		}

		if (e.keyCode == 37) {  //left

goImage(-1);
return;

		   map.allLabels[0].x = _x * 0.98;

		   updateLabel();
		}

		if (e.keyCode == 38) {  //down

		   map.allLabels[0].y = _y * 0.98;

		   updateLabel();
		} 

		if (e.keyCode == 39) {  //right

goImage(1);
return;


		   map.allLabels[0].x = _x * 1.02;

		   updateLabel();
		}

		if (e.keyCode == 40) {  //up

		   map.allLabels[0].y = _y * 1.02;

		   updateLabel();
		}


	});


}

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
