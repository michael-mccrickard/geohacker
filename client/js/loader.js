 //**************************************************************************
//    newLoader.js  --  Select and load a control's data (when user "scans")
//***************************************************************************

NewLoader = function() {

	this.newControl = null;

	this.totalClueCount = 0;

	this.columnCount = 4;

	this.state = "stop";  //also play and pause


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

		//Meteor.defer( function(){ hacker.dimensionControls(); });  //the aspect ratio is likely to be 
																	//different (loaded control pic vs. scan pic)
		hacker.cue.setAndShow();

		var _delay = 0;

		if (this.totalClueCount == 1) _delay = 2000;

	    //if this control has a still image, load it into memory
		//which will allow feature.dimension() to size it accurately
		//this also sets the name and ctl for the feature

	    Meteor.setTimeout( function() { 

	    	if (hacker.loader.state != "play") {

	    		stopSpinner();

	    		return;
	    	}

	    	hacker.feature.preload( hacker.loader.newSet.name );	

	    }, _delay );


	}


	this.showLoadedControl = function() {

		 //Have the control object dimension the small version of the picture

		c("in loader.showLoadedControl, newControl name is " + this.newSet.name)

	    hacker.ctl[ this.newSet.name ].setControlPicSource();

		hack.mode = mDataFound;

		hacker.cue.setAndShow();

		this.newSet.setPicDimensions();


		//set the timer if we're on the first clue

		if (this.totalClueCount == 1) {

			game.hackStartTime = new Date().getTime();
			
		}

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

			var _meme = MemeCollection.getNextHackerItem( randomSet.memeCollection.items );

			randomSet.meme = _meme;

			//totalClueCount has not yet been incremented to reflect this newest control load,
			//so we can just use the value as is, rather than decrementing it (the arrays are zero-based)

			hacker.addClue( { u: _meme.image, f: _meme.image, t: _meme.text, n: 'MEME', i: this.totalClueCount } );

			//the collection of meme items includes items for the helper agent to use, and the meme control object
			//needs to be able to refer to the hacker clue items by index, so we create a sequence array of the hacker clue meme indices from
			//the full meme collection

			randomSet.addToSequence( randomSet.getMemeIndex() );
		}
		else {

			this.getNonMemeControl( tmp );  //this will add the potential clues to the tmp array

			randomControl =  Database.getRandomElement(tmp);

		}


//if we need to force a certain control for any reason, this is the place to do it
//ALSO:  uncomment the "if meme" block below and the alternate version of hacker.addClue() 
//in the "if randomControl" block below that

/*


if (this.totalClueCount == 0) randomControl = hacker.ctl["MEME"]; 

if (this.totalClueCount == 1) randomControl = hacker.ctl["MEME"];

if (this.totalClueCount == 2) randomControl = hacker.ctl["SOUND"];

if (this.totalClueCount == 3) randomControl = hacker.ctl["MEME"];

if (this.totalClueCount == 4) randomControl = hacker.ctl["VIDEO"];

if (this.totalClueCount == 5) randomControl = hacker.ctl["MEME"]; 

if (this.totalClueCount == 6) randomControl = hacker.ctl["WEB"];

if (this.totalClueCount == 7) randomControl = hacker.ctl["VIDEO"];

if (this.totalClueCount == 8) randomControl = hacker.ctl["MEME"];

if (this.totalClueCount == 9) randomControl = hacker.ctl["VIDEO"];

if (this.totalClueCount == 10) randomControl = hacker.ctl["MEME"]; 

if (this.totalClueCount == 11) randomControl = hacker.ctl["MEME"];

if (this.totalClueCount == 12) randomControl = hacker.ctl["MEME"];

if (this.totalClueCount == 13) randomControl = hacker.ctl["MEME"];
*/
			var _text = "";

/*

if (randomSet.name == "MEME") {

var _meme = MemeCollection.getNextHackerItem( randomSet.memeCollection.items );

randomSet.meme = _meme;

_text = _meme.text;

randomSet.addToSequence( randomSet.getMemeIndex() );
}

*/

		//Bump up the loadedCount on this control and return the name

		

		if (randomControl) {

			newCount = randomSet.loadedCount + 1;
			
			randomSet.loadedCount = newCount;

			randomSet.setIndex( randomSet.loadedCount - 1);

			if (randomSet.name != "MEME") hacker.addClue( { u: randomSet.getFile(), f: randomSet.getControlPic(), t: "", n: randomSet.name, i: newCount - 1 } );

//hacker.addClue( { u: randomSet.getFile(), f: randomSet.getControlPic(), t: _text, n: randomSet.name, i: newCount - 1 } );

//If we need to force a certain clue on a control, this is the place to do it
//(Comment out the Database.shuffle() command in Set.setItems() if you need to do this.
//	ghImageCtl overrides setItems, so comment it out there also, to use clues in a particular order)
/*
if (this.totalClueCount == 0) randomSet.setIndex( 8 );

if (hack.countryCode == "CU") randomSet.setIndex( 1 );
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

		if ( Set.allLoadsAreEqual() == false ) {

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