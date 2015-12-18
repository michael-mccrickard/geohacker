 //**************************************************************************
//    newLoader.js  --  Select and load a control's data (when user "scans")
//***************************************************************************

NewLoader = function() {

	this.scanning_sound_file= "scanner3.mp3";

	this.intercept_sound_file = "new_intercept.mp3";

	this.data_found_file = "new_feedback2.mp3";

	this.feedback_sound = "new_feedback.mp3";

	this.newControl = null;

	this.totalClueCount = 0;


	this.go = function() {

		var mode = hack.mode;

		//reset the feature object

		game.display.feature.clear();

		//just in case the user skipped a MAP clue, turn off the blinking timer

		game.display.ctl["MAP"].clearTimer();


		if (mode != mReady) {
         
          Control.playEffect( game.display.locked_sound_file );
		
		  return;
		}

		this.newControl = this.loadRandomControl();

		if (this.newControl === undefined) {

			console.log("No more controls to load in loader");

			return;
		}


		hack.mode = mScanning;

		game.display.setControls( sScanning );

		Meteor.defer( function(){ game.display.dimensionControls(); });  //primarily for the TEXT control
																	//which sometimes has an image file
																	//sometimes not

		game.display.cue.setAndShow();

	    //if this control has a still image, load it into memory
		//which will allow feature.dimension() to size it accurately

	    game.display.feature.load( this.newControl.name );	


		Session.set("sFeatureImageLoaded", false);  

	}

	this.showLoadedControl = function() {

		 //also have the control object dimension the small version of the picture
	    game.display.ctl[ this.newControl.name ].setControlPicSource();

		hack.mode = mDataFound;

		if (this.totalClueCount == 1) game.display.status.setAndShow();

		game.display.cue.setAndShow();


		//here we set the unloaded controls to sIcon and the loaded ones back to sLoaded

		game.display.resetControls();

		game.display.dimensionControls();


		//this.newControl was set by doScan before the loading sequence began

		if (this.newControl.name == "MAP") {

			//MAP is a special case; it has it's own states which it manages

			game.display.ctl["MAP"].autoFeatured = true;

			game.display.feature.set( "MAP" );
		}
		else {
			
			this.newControl.setState ( sLoaded );

			this.newControl.setPicDimensions();

			//not immediately showing the randomly-loaded control in the feature area anymore

			//game.display.feature.set( this.newControl.name );

		}

		//set the timer if we're on the first clue

		if (this.totalClueCount == 1) {

			game.hackStartTime = new Date().getTime();
			
		}

		//see if any buttons need enabling / disabling

		game.display.checkMainScreen();

	},


	/*  Decide which control to randomly display as a result of the Scan button being clicked

	This function has 3 main parts:

		1)  Check to see if we need to return a map control; return if so

		2) Run thru the controls and see if any are maxed out (fully loaded); if so remove those from the array

		3) Check to see if any controls have a higher loadedCount than the current lowest value amongst the controls;
			if so, remove those

		4) Pick one at random from the remaining controls and return it

	*/

	this.loadRandomControl = function() {

		var high = 0;

		var low = 1;

		var i = 0;

		var randomControl = null;

		//first see if we need to give the user a map clue;
		//currently inserting these clues as #3, and #6 and #9
		//under certain conditions

		if (this.totalClueCount == 2 || this.totalClueCount == 5 || this. totalClueCount == 8) {

			var state = game.display.ctl["MAP"].getState();

			if (state <= sIDContinent) {

				this.totalClueCount++;

				var _index = db.getMapRecIndex("continent");

				game.display.ctl["MAP"].setIndex( _index );

				game.display.ctl["MAP"].setState( sContinentFeatured );

				return game.display.ctl["MAP"];
			}

			if (state <= sIDRegion  && (this.totalClueCount == 5 || this.totalClueCount == 8)) {

				this.totalClueCount++;

				var _index = db.getMapRecIndex("region");

				game.display.ctl["MAP"].setIndex( _index );

				game.display.ctl["MAP"].setState( sRegionFeatured );

				return game.display.ctl["MAP"];
			}

		}

		//this is the temporary array to determine which control to enable
		
		var tmp = [];

		//cycle thru the controls and see if any are maxed out;

		//if so, remove them.  Also, set the low var

		var tempCount = 0;

		while (i < game.display.ctlName.length) {

			var _name = game.display.ctlName[i];

			var fullCount = game.display.ctl[_name].fullCount;

			var loadedCount = game.display.ctl[_name].loadedCount;

			if ( fullCount == loadedCount) {

				i++;

				continue;
			}

			if ( loadedCount  < low )  low = loadedCount;

			tmp.push( game.display.ctl[ _name ] );

			i++;

		}

		//we only need to run this check if we have more than one control left

		if (tmp.length > 1) {

			//if any of the control data counts are higher than the low, remove them

			i = 0;

			while (tmp[i]) {

				//we have to check the length again, b/c it may have changed
				//(we can't delete the last member of the array or we'll have nothing to return)

				if ( tmp[i].loadedCount > low && tmp.length > 1)  {

					tmp.splice(i, 1);
				}		
				else {

					i++;
				}
			}

		}

		var randomControl =  Database.getRandomElement(tmp);
/*
if (this.totalClueCount == 0) randomControl = game.display.ctl["IMAGE"];

if (this.totalClueCount == 1) randomControl = game.display.ctl["WEB"];

if (this.totalClueCount == 2) randomControl = game.display.ctl["IMAGE"];


if (this.totalClueCount == 3) randomControl = game.display.ctl["WEB"];

if (this.totalClueCount == 4) randomControl = game.display.ctl["TEXT"];

if (this.totalClueCount == 5) randomControl = game.display.ctl["TEXT"];
*/
		//Bump up the loadedCount on this control and return the name

		if (randomControl) {

			newCount = randomControl.loadedCount + 1;
			
			randomControl.loadedCount = newCount;

			randomControl.setIndex( newCount - 1 );

			this.totalClueCount++;

			return randomControl;

		}

	}
}