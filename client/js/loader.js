 //**************************************************************************
//    newLoader.js  --  Select and load a control's data (when user "scans")
//***************************************************************************

NewLoader = function() {

	this.newControl = null;

	this.totalClueCount = 0;


	this.go = function() {

		var mode = hack.mode;

		//reset the feature object

		hacker.feature.clear();


		if (mode != mReady) {
         
          display.playEffect( hacker.locked_sound_file );
		
		  return;
		}

		this.newControl = this.loadRandomControl();

		if (!this.newControl) {

			console.log("No more controls to load in loader");

			return;
		}


		hack.mode = mScanning;

		hacker.setControls( sScanning );

		Meteor.defer( function(){ hacker.dimensionControls(); });  //the aspect ratio is likely to be 
																	//different (loaded control pic vs. scan pic)


		hacker.cue.setAndShow();


	    //if this control has a still image, load it into memory
		//which will allow feature.dimension() to size it accurately
		//this also sets the name and ctl for the feature

	    hacker.feature.loadNextItem( this.newControl.name );	


	}

	this.showLoadedControl = function() {

		 //Have the control object dimension the small version of the picture

		c("in loader.showLoadedControl, newControl name is " + this.newControl.name)

	    hacker.ctl[ this.newControl.name ].setControlPicSource();

		hack.mode = mDataFound;

		if (this.totalClueCount == 1) hacker.status.setAndShow();

		hacker.cue.setAndShow();


		//here we set the unloaded controls to sIcon and the loaded ones back to sLoaded

		hacker.resetControls();

		hacker.dimensionControls();

		//this.newControl was set by this.go() before the loading sequence began
			
		this.newControl.setState ( sLoaded );

		this.newControl.setPicDimensions();

		this.newControl.hilite();


		//set the timer if we're on the first clue

		if (this.totalClueCount == 1) {

			game.hackStartTime = new Date().getTime();
			
		}

		//see if any buttons need enabling / disabling

		hacker.checkMainScreen();

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


		while (i < hacker.ctlName.length) {

			var _name = hacker.ctlName[i];

			var fullCount = hacker.ctl[_name].fullCount;

			var loadedCount = hacker.ctl[_name].loadedCount;

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
	
			tmp.push( hacker.ctl[ _name ] );

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
if (this.totalClueCount == 0) randomControl = hacker.ctl["WEB"]; 

if (this.totalClueCount == 1) randomControl = hacker.ctl["WEB"];

if (this.totalClueCount == 2) randomControl = hacker.ctl["SOUND"];

if (this.totalClueCount == 3) randomControl = hacker.ctl["WEB"];

if (this.totalClueCount == 4) randomControl = hacker.ctl["VIDEO"];
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