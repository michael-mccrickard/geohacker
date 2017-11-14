 //**************************************************************************
//    newLoader.js  --  Select and load a control's data (when user "scans")
//***************************************************************************

NewLoader = function() {

	this.newControl = null;

	this.totalClueCount = 0;

	this.columnCount = 4;

	this.state = "stop";  //also play and pause

	this.start = function() {

		this.state = "play";

		this.go();
	}

	this.pause = function() {

		this.state = "pause";
	}

	this.stop = function() {

		this.state = "stop";
	}


	this.go = function() {

		if (this.state != "play") return;

		doSpinner();

		var mode = hack.mode;


		if (mode != mReady) {
         
          display.playEffect( hacker.locked_sound_file );
		
		  return;
		}

		this.arrangeRows();

		this.newControl = this.loadRandomControl();

		if (!this.newControl) {

			stopSpinner();

			console.log("No more controls to load in loader");

			return;
		}


		hack.mode = mScanning;

		//hacker.setControls( sScanning );

		//Meteor.defer( function(){ hacker.dimensionControls(); });  //the aspect ratio is likely to be 
																	//different (loaded control pic vs. scan pic)
		hacker.cue.setAndShow();

	    //if this control has a still image, load it into memory
		//which will allow feature.dimension() to size it accurately
		//this also sets the name and ctl for the feature

		var _delay = 0;

		if (this.totalClueCount == 1) _delay = 2000;

	    Meteor.setTimeout( function() { hacker.feature.loadNextItem( hacker.loader.newControl.name );	}, _delay );


	}

	this.showLoadedControl = function() {

		 //Have the control object dimension the small version of the picture

		c("in loader.showLoadedControl, newControl name is " + this.newControl.name)

	    //hacker.ctl[ this.newControl.name ].setControlPicSource();

		hack.mode = mDataFound;

//if (this.totalClueCount == 1) hacker.status.setAndShow();

		hacker.cue.setAndShow();


		//here we set the unloaded controls to sIcon and the loaded ones back to sLoaded

		//hacker.resetControls();

		//hacker.dimensionControls();

		//this.newControl was set by this.go() before the loading sequence began
			
		//this.newControl.setState ( sLoaded );

		//this.newControl.setPicDimensions();

		//this.newControl.hilite();


		//set the timer if we're on the first clue

		if (this.totalClueCount == 1) {

			game.hackStartTime = new Date().getTime();
			
		}

	//	this.arrangeRows();

		//see if any buttons need enabling / disabling

		hacker.checkMainScreen();

	},

	this.arrangeRows = function() {

		//do we need to bump any rows up?

		var _rem = this.totalClueCount % this.columnCount;

		for (var i = 0; i < this.totalClueCount; i++) {
   
			var _newIndex = Math.abs( i - this.totalClueCount + 1);

			if ( _newIndex < (this.totalClueCount % this.columnCount )) continue;   

			var rowNum = Math.floor(( _newIndex - _rem ) / this.columnCount);

			$("div#m" + i).addClass( "r" + (rowNum + 1) );

		}

/*

		if (this.totalClueCount > this.columnCount)  {

			if (this.totalClueCount % this.columnCount == 1) {

				var _tempClueCount = this.totalClueCount - 1;

				while (_tempClueCount) { 

					var newRowForPrev = (_tempClueCount / this.columnCount);

					var prevRow = newRowForPrev - 1;

					$(".control.r" + prevRow).addClass("r" + newRowForPrev);

//$(".control.r" + prevRow).removeClass("r" + prevRow);

					_tempClueCount = _tempClueCount - this.columnCount;

				}

				//prevent the new control from jumping up with the prev row

				$("#m" + (this.totalClueCount - 1)).addClass( "r" + prevRow );

				$("#m" + (this.totalClueCount - 1)).removeClass( "r" + newRowForPrev );
			}
		}
*/

	}


	/*  Decide which control to randomly display as a result of the Scan button being clicked

	This function has 3 main parts:

		1)  Check to see if we need to return a map control; return if so

		2) Run thru the controls and see if any are maxed out (fully loaded); if so remove those from the array

		3) Check to see if any controls have a higher loadedCount than the current lowest value amongst the controls;
			if so, remove those

		4) Pick one at random from the remaining controls and return it

	*/

	this.loadRandomControl = function() {


		var randomControl = null;

		//this is the temporary array to determine which control to enable
		
		var tmp = [];

		//use all the memes first

		var _ctl = hacker.ctl["MEME"];

		if (_ctl.loadedCount < _ctl.fullCount) {

			randomControl = _ctl;

			var _meme = MemeCollection.getNextHackerItem( randomControl.memeCollection.items );

			randomControl.meme = _meme;

			//totalClueCount has not yet been incremented to reflect this newest control load,
			//so we can just use the value as is, rather than decrementing it (the arrays are zero-based)

			hacker.addClue( { u: _meme.image, f: _meme.image, t: _meme.text, n: 'MEME', i: this.totalClueCount } );

			randomControl.addToSequence( randomControl.getMemeIndex() );
		}
		else {

			this.getNonMemeControl( tmp );  //this will add the potential clues to the tmp array

			randomControl =  Database.getRandomElement(tmp);

		}


//if we need to force a certain control for any reason, this is the place to do it

/*

if (this.totalClueCount == 0) randomControl = hacker.ctl["MEME"]; 

if (this.totalClueCount == 1) randomControl = hacker.ctl["MEME"];

if (this.totalClueCount == 2) randomControl = hacker.ctl["MEME"];

if (this.totalClueCount == 3) randomControl = hacker.ctl["MEME"];

if (this.totalClueCount == 4) randomControl = hacker.ctl["MEME"];
*/


		//Bump up the loadedCount on this control and return the name

		if (randomControl) {

			newCount = randomControl.loadedCount + 1;
			
			randomControl.loadedCount = newCount;

			randomControl.setIndex( randomControl.loadedCount - 1);

			if (randomControl.name != "MEME") hacker.addClue( { u: randomControl.getFile(), f: randomControl.getControlPic(), t: "", n: randomControl.name, i: newCount - 1 } );


//If we need to force a certain clue on a control, this is the place to do it
//(Comment out the Database.shuffle() command in control.setItems() if you need to do this.
//	ghImageCtl overrides setItems, so comment it out there also, to use clues in a particular order)
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

	this.getNonMemeControl = function( _arr ) {

		var low = -1;

		var i = 0;

		while (i < hacker.ctlName.length) {

			var _name = hacker.ctlName[i];

			if (_name == "MEME") {

				i++

				continue;
			}

			var fullCount = hacker.ctl[_name].fullCount;

			var loadedCount = hacker.ctl[_name].loadedCount;

			//skip any control that is fully loaded

			if ( fullCount == loadedCount) {

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
	
			_arr.push( hacker.ctl[ _name ] );

			i++;

		}


		//if all the control are equally loaded, no need to do anything more except pick one at random

		if ( Control.allLoadsAreEqual() == false ) {

			//if any of the control data counts are higher than the low, remove them

			//we only need to run this check if we have more than one control left

			if (_arr.length > 1) {

				i = 0;

				while (_arr[i]) {

					//any control that is at the low threshold, we keep

					if ( _arr[i].loadedCount == low)  {

						i++;   

						continue;

					}		
					else {

						//the only remaining possibility is that the control is higher than the low threshold
						//so remove it

						_arr.splice(i, 1);						
					}

					//if we're down to a single control, then we have to use it, so break

					if (_arr.length == 1)  {break;}
				}

			}
		}		
	}
}

/*




*/