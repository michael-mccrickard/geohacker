 //**************************************************************************
//    newLoader.js  --  Select and load a control's data (when user "scans")
//***************************************************************************

NewLoader = function() {

	this.newControl = null;

	this.totalClueCount = 0;


	this.go = function() {

		var mode = hack.mode;

		//reset the feature object

		display.feature.clear();


		if (mode != mReady) {
         
          Control.playEffect( display.locked_sound_file );
		
		  return;
		}

		this.newControl = this.loadRandomControl();

		if (!this.newControl) {

			console.log("No more controls to load in loader");

			return;
		}


		hack.mode = mScanning;

		display.setControls( sScanning );

		Meteor.defer( function(){ display.dimensionControls(); });  //the aspect ratio is likely to be 
																	//different (loaded control pic vs. scan pic)


		display.cue.setAndShow();

		display.feature.isLoaded.set( false );

	    //if this control has a still image, load it into memory
		//which will allow feature.dimension() to size it accurately
		//this also sets the name and ctl for the feature

	    display.feature.preload( this.newControl.name );	


	}

	this.showLoadedControl = function() {

		 //Have the control object dimension the small version of the picture

		c("in loader.showLoadedControl, newControl name is " + this.newControl.name)

	    display.ctl[ this.newControl.name ].setControlPicSource();

		hack.mode = mDataFound;

		if (this.totalClueCount == 1) display.status.setAndShow();

		display.cue.setAndShow();


		//here we set the unloaded controls to sIcon and the loaded ones back to sLoaded

		display.resetControls();

		display.dimensionControls();

		//this.newControl was set by this.go() before the loading sequence began
			
		this.newControl.setState ( sLoaded );

		this.newControl.setPicDimensions();

		this.newControl.hilite();


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

		var low = -1;

		var i = 0;

		var randomControl = null;

		//this is the temporary array to determine which control to enable
		
		var tmp = [];

		//cycle thru the controls and see if any are maxed out;

		//if so, remove them.  Also, set the low var


		while (i < display.ctlName.length) {

			var _name = display.ctlName[i];

			var fullCount = display.ctl[_name].fullCount;

			var loadedCount = display.ctl[_name].loadedCount;

			//skip the map and any control that is fully loaded

			if ( _name == "MAP" || fullCount == loadedCount) {

				i++;

				continue;
			}

			//set the low if we haven't already

			if ( low == -1) low = loadedCount;

			//test and see if the current control is lower than low

			if ( loadedCount  < low )  {

				low = loadedCount;
			}

			//add control to the array
	
			tmp.push( display.ctl[ _name ] );

			i++;

		}


		//if all the control are equally loaded, no need to do anything more except pick one at random

		if ( Control.allLoadsAreEqual() == false ) {

			//if any of the control data counts are higher than the low, remove them

			//we only need to run this check if we have more than one control left

			if (tmp.length > 1) {

				i = 0;

				while (tmp[i]) {

					//any control that is at the low threshold, we keep

					if ( tmp[i].loadedCount == low)  {

						i++;   

						continue;

					}		
					else {

						//the only remaining possibility is that the control is higher than the low threshold
						//so remove it

						tmp.splice(i, 1);						
					}

					//if we're down to a single control, then we have to use it, so break

					if (tmp.length == 1)  {break;}
				}

			}
		}

		var randomControl =  Database.getRandomElement(tmp);

//if we need to force a certain control for any reason, this is the place to do it

/*
if (this.totalClueCount == 0) randomControl = display.ctl["VIDEO"]; 

if (this.totalClueCount == 1) randomControl = display.ctl["VIDEO"];

if (this.totalClueCount == 2) randomControl = display.ctl["VIDEO"];

if (this.totalClueCount == 3) randomControl = display.ctl["VIDEO"];

if (this.totalClueCount == 4) randomControl = display.ctl["TEXT"];
*/
		//Bump up the loadedCount on this control and return the name

		if (randomControl) {

			newCount = randomControl.loadedCount + 1;
			
			randomControl.loadedCount = newCount;

			randomControl.setIndex( randomControl.loadedCount - 1);

//If we need to force a certain clue on a control, this is the place to do it
//(Comment out the Database.shuffle() command in control.setItems() if you need to do this
//	ghImageCtl overrides setItems, so comment it out there also to use images in a particular order)
/*
if (this.totalClueCount == 0) randomControl.setIndex( 8 );

if (hack.countryCode == "CU") randomControl.setIndex( 1 );
*/
			this.totalClueCount++;

			return randomControl;

		}
		else {

			return null;
		}

	}
}