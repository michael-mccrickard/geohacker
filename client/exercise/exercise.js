//exercise.js
Template.exercise.rendered = function() {

	story.fadeOutAll();
}

ExerciseManager = function() {

	this.exercise = null;

	this.processUserChoice = function( _val ) {

		this.exercise.item[ this.exercise.index ].processUserChoice( _val );
	}

	this.finishExercise = function() {

		browseMap.mode.set("story");

		story.mode.set("scene");
	}

	this.build = function( _ID ) {

		story.mode.set("exercise");

		this.exercise = new Exercise();

		if (_ID) this.exercise.build(_ID);
	}

	this.go = function() {

		this.exercise.show();

		Meteor.setTimeout( function() { story.em.exercise.go() }, 300);
	}


	this.add = function( _arr ) {

		for (var i = 0; i < _arr.length; i++) {

			this.exercise.add( _arr[i] );
		}		
	}

	this.getQCode = function() {

		return this.exercise.item[ this.exercise.index ].qCode;
	}

	this.getConfig = function() {

		return this.exercise.config;
	}


}


Exercise = function() {

	this.item = [];

	this.index = -1;

	this.config = {};

	this.startSound = "exerciseStart.mp3";

	this.itemChangeSound = "exerciseItemChange.mp3";

	this.correctSound = "exerciseCorrect.mp3";

	this.incorrectSound = "exerciseIncorrect.mp3";

	//We can modify these functions to let value pairs in the param obj
	//over-ride the default values

	//just passing the ID for now, but we could change this to an object

	this.build = function( _ID ) {

		//the .type property on these may not be needed.
		//Probably won't know until we add the progressive build type

		if (_ID == "whereIsContinent") {

			var _arr = Database.shuffle( db.ghZ.find().fetch() );

			var _obj = {};

			_obj.ID = _ID;

			_obj.type = "whereIs";

			_obj.qEntity = mlContinent;	

			_obj.aEntity = mlContinent;

			_obj.mapLevelStart = mlWorld;

			_obj.mapLevelAnswer = mlWorld;

			this.config = _obj;

			for (var i = 0; i < _arr.length; i++) {

				_obj.qCode = _arr[i].c;

				_obj.aCode = _arr[i].c;

				this.item.push( new ExerciseItem( _obj ) );

			}
		}
	}

	this.add = function( _par ) {

c("param obj in add follows")
c( _par)
		var _obj = {};

		_obj.ID = _par.ID;

		_obj.qCode = _par.qCode;

		_obj.aCode = _par.aCode;

		if (_obj.ID == "whereIsCountry") {

			_obj.type = "whereIs";

			_obj.qEntity = mlCountry;	

			_obj.mapLevelStart = mlRegion;

			_obj.mapLevelEnd = mlRegion;

			_obj.aEntity = mlCountry;
		}

		if (_obj.ID == "inWhichContinent") {

			_obj.type = "whereIs";

			_obj.qEntity = mlCountry;

			_obj.mapLevelStart = mlWorld;

			_obj.mapLevelEnd = mlContinent;

			_obj.aEntity = mlContinent;
		}

		if (_obj.ID == "inWhichRegion") {

			_obj.type = "whereIs";

			_obj.qEntity = mlCountry;	

			_obj.mapLevelStart = mlContinent;

			_obj.mapLevelEnd = mlContinent;

			_obj.aEntity = mlRegion;
		}

		this.config = _obj;

		this.item.push( new ExerciseItem( _obj ) );
	}


	this.show = function() {

		browseMap.mode.set("exercise");

		story.mode.set("exercise");

		story.fadeOutBG();
	}


	this.go = function()  {

		this.index++;

		if (this.index == 0) story.playEffect( this.startSound );

		if (this.index == this.item.length) {

			story.em.finishExercise();

			story.doneWithExercise();

			return;
		}

		story.playEffect2( this.itemChangeSound );

		this.item[ this.index ].draw();
	}

}

ExerciseItem = function( _obj ) {  

	this.clueElement = "div.divExerciseClue";

	this.messageElement = "#browseMapMessageBox";


	this.ID = _obj.ID;  //whereIs, findCountry

	if (_obj.qCode) this.qCode = _obj.qCode; 

	if (_obj.aCode) this.aCode = _obj.aCode; 

	if (_obj.qEntity) this.qEntity = _obj.qEntity;  //mlContinent, mlRegion, etc.

	if (_obj.aEntity) this.aEntity = _obj.aEntity;  //mlContinent, mlRegion, etc.

	if (_obj.mapLevelStart) this.mapLevelStart = _obj.mapLevelStart;  

	if (_obj.mapLevelEnd) this.mapLevelEnd = _obj.mapLevelEnd;  

	if (_obj.pic) this.pic = _obj.pic;  


	this.draw = function() {

		var _worldMap = browseMap.worldMap;

		_worldMap.mapLevel = this.mapLevelStart;

		var _showNames = false;  //over-ride this below if necessary

		var _name = getAreaName( this.qEntity, this.qCode)

		if (this.ID == "whereIsContinent") {

			this.clue( "Where is " + _name + "?");

			this.message( "Click on " + _name);	
		}

		if (this.ID == "inWhichContinent") {

			this.clue( "On which continent is " + _name + "?");

			this.message( "Click on the continent for " + _name);	
		}		

		if (this.ID == "inWhichRegion") {

			this.clue( "In which region is " + _name + "?");

			this.message( "Click on the region for " + _name);

//use a property here
_showNames = true;
		
		}

		Meteor.setTimeout( function() { browseMap.worldMap.doCurrentMap( _showNames ) }, 250 );  
		
	}

	this.clue = function( _s) {

		$(this.clueElement).text( _s );
	}

	this.message = function( _s ) {

		$(this.messageElement).text( _s);				
	}

	this.processUserChoice = function( _val ) {

		//this is the country code of the item clicked (assuming whereIs questions for now),
		//but depending on the answer entity (aEntity) we may have to interpolate it

		if ( this.aEntity == mlContinent ) _val = db.getContinentCodeForCountry( _val );

		if ( this.aEntity == mlRegion ) _val = db.getRegionCodeForCountry( _val );
		
c("_val is " + _val)
c("_item.aCode is " + this.aCode)
		
		if ( _val == this.aCode) {

			story.playEffect( story.em.exercise.correctSound );

			var _clue = "CORRECT!";

			var _answerName = getAreaName( this.aEntity, this.aCode)			

			//need a better way to distinguish which types get this extra text

			if (this.ID != "whereIsContinent") {

				var _questionName = getAreaName( this.qEntity, this.qCode)

				this.message( _answerName );

				if (_answerName) {

					_clue = _clue + "  " + _questionName + " is in " + _answerName + ".";
				}
			}

			this.clue( _clue );

			this.message( _answerName );

			Meteor.setTimeout( function() { story.em.exercise.go() }, 2000);
		}
		else {

			story.playEffect( story.em.exercise.incorrectSound );

			this.clue("Incorrect.  Try again.");

			story.em.exercise.index--;

			Meteor.setTimeout( function() { story.em.exercise.go() }, 2000);			
		}
	}

}


function getAreaName( _level, _code) {

	if (_level == mlContinent) return db.getContinentName( _code );

	if (_level == mlRegion) return db.getRegionName( _code );

	if (_level == mlCountry) return db.getCountryName( _code );
}