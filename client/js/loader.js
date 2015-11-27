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

		display.feature.clear();

		//just in case the user skipped a MAP clue, turn off the blinking timer

		display.ctl["MAP"].clearTimer();


		if (mode != mReady) {
         
          Control.playEffect( display.locked_sound_file );
		
		  return;
		}

		this.newControl = this.loadRandomControl();

		if (this.newControl === undefined) {

			console.log("No more controls to load in loader");

			return;
		}


		hack.mode = mScanning;

		display.setControls( sScanning );

		Meteor.defer( function(){ display.dimensionControls(); });  //primarily for the TEXT control
																	//which sometimes has an image file
																	//sometimes not

		display.cue.setAndShow();

	    //if this control has a still image, load it into memory
		//which will allow feature.dimension() to size it accurately

	    display.feature.load( this.newControl.name );	


		Session.set("sFeatureImageLoaded", false);  

	}

	this.showLoadedControl = function() {

		 //also have the control object dimension the small version of the picture
	    display.ctl[ this.newControl.name ].setControlPicSource();

		hack.mode = mDataFound;

		if (this.totalClueCount == 1) display.status.setAndShow();

		display.cue.setAndShow();


		//here we set the unloaded controls to sIcon and the loaded ones back to sLoaded

		display.resetControls();

		display.dimensionControls();


		//this.newControl was set by doScan before the loading sequence began

		if (this.newControl.name == "MAP") {

			//MAP is a special case; it has it's own states which it manages

			display.ctl["MAP"].autoFeatured = true;

			display.feature.set( "MAP" );
		}
		else {
			
			this.newControl.setState ( sLoaded );

			this.newControl.setPicDimensions();

			//not immediately showing the randomly-loaded control in the feature area anymore

			//display.feature.set( this.newControl.name );

		}

		//set the timer if we're on the first clue

		if (this.totalClueCount == 1) {

			game.hackStartTime = new Date().getTime();
			
		}

		//see if any buttons need enabling / disabling

		display.checkMainScreen();

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

			var state = display.ctl["MAP"].getState();

			if (state <= sIDContinent) {

				this.totalClueCount++;

				var _index = db.getMapRecIndex("continent");

				display.ctl["MAP"].setIndex( _index );

				display.ctl["MAP"].setState( sContinentFeatured );

				return display.ctl["MAP"];
			}

			if (state <= sIDRegion  && (this.totalClueCount == 5 || this.totalClueCount == 8)) {

				this.totalClueCount++;

				var _index = db.getMapRecIndex("region");

				display.ctl["MAP"].setIndex( _index );

				display.ctl["MAP"].setState( sRegionFeatured );

				return display.ctl["MAP"];
			}

		}

		//this is the temporary array to determine which control to enable
		
		var tmp = [];

		//cycle thru the controls and see if any are maxed out;

		//if so, remove them.  Also, set the low var

		var tempCount = 0;

		while (i < display.ctlName.length) {

			var _name = display.ctlName[i];

			var fullCount = display.ctl[_name].fullCount;

			var loadedCount = display.ctl[_name].loadedCount;

			if ( fullCount == loadedCount) {

				i++;

				continue;
			}

			if ( loadedCount  < low )  low = loadedCount;

			tmp.push( display.ctl[ _name ] );

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
if (this.totalClueCount == 0) randomControl = display.ctl["MAP"];

if (this.totalClueCount == 1) randomControl = display.ctl["TEXT"];

if (this.totalClueCount == 2) randomControl = display.ctl["IMAGE"];


if (this.totalClueCount == 3) randomControl = display.ctl["IMAGE"];

if (this.totalClueCount == 4) randomControl = display.ctl["WEB"];

if (this.totalClueCount == 5) randomControl = display.ctl["TEXT"];
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