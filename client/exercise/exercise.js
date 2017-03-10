//exercise.js
Template.exercise.rendered = function() {

	story.fadeOutAll();
}

ExerciseManager = function() {

	this.exercise = null;

	this.processUserChoice = function( _val ) {

		this.exercise.processUserChoice( _val );
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

	this.getCode = function() {

		return this.exercise.item[ this.exercise.index ].code;
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

			_obj.entityType = "area";

			_obj.entity = "continent";	

			_obj.mapLevelStart = mlWorld;

			_obj.mapLevelAnswer = mlWorld;

			this.config = _obj;

			for (var i = 0; i < _arr.length; i++) {

				_obj.code = _arr[i].c;

				_obj.name = _arr[i].n;

				this.item.push( new ExerciseItem( _obj ) );

			}
		}
	}

	this.add = function( _par ) {

		var _obj = {};

		_obj.ID = _par.ID;

		if (_obj.ID == "whereIsCountry") {

			_obj.type = "whereIs";

			_obj.entityType = "area";

			_obj.entity = "country";	

			_obj.mapLevelStart = mlRegion;

			_obj.mapLevelAnswer = mlRegion;

			this.config = _obj;

			_obj.code = _par.code;

			_obj.region = db.getRegionCodeForCountry( _par.code );

			_obj.name = db.getCountryName( _par.code);
		}

		if (_obj.ID == "inWhichContinent") {

			_obj.type = "whereIs";

			_obj.entityType = "area";

			_obj.entity = "continent";	

			_obj.mapLevelStart = mlWorld;

			_obj.mapLevelAnswer = mlContinent;

			this.config = _obj;

			_obj.code = _par.code;

			_obj.name = _par.name;
		}

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

	this.processUserChoice = function( _val ) {

		var _item = this.item[ this.index ];

		//this is the country code of the item clicked
		
		var _answerGiven = _val;

		//assuming whereIs type for the moment

		if (_item.entity == "continent") _answerGiven = db.getContinentCodeForCountry( _val );
		
		if ( _answerGiven == _item.code) {

			story.playEffect( this.correctSound );

			var _clue = "CORRECT!";

			var _message = _item.name;

			if (_item.ID == "inWhichContinent") {

				_message = db.getContinentName( _item.code );

				_clue = _clue + "  " + _item.name + " is in " + _message + ".";

			}

			_item.clue( _clue );

			_item.message( _message );

			Meteor.setTimeout( function() { story.em.exercise.go() }, 2000);
		}
		else {

			story.playEffect( this.incorrectSound );

			_item.message("Incorrect.  Try again.");

			this.index--;

			Meteor.setTimeout( function() { story.em.exercise.go() }, 2000);			
		}
	}

}

ExerciseItem = function( _obj ) {  

	this.clueElement = "div.divExerciseClue";

	this.messageElement = "#browseMapMessageBox";


	this.ID = _obj.ID;  //whereIs, findCountry

	if (_obj.code) this.code = _obj.code; 

	if (_obj.name) this.name = _obj.name; 

	if (_obj.entityType) this.entityType = _obj.entityType;  //area, thing, person (only for whereIs)

	if (_obj.entity) this.entity = _obj.entity;  //continent, region, country, landmark, leader, celebrity  (only for whereIs)

	if (_obj.mapLevelStart) this.mapLevelStart = _obj.mapLevelStart;  

	if (_obj.mapLevelAnswer) this.mapLevelAnswer = _obj.mapLevelAnswer;  

	if (_obj.pic) this.pic = _obj.pic;  


	this.draw = function() {

		var _worldMap = browseMap.worldMap;

		_worldMap.mapLevel = this.mapLevelStart;

		var _showNames = false;  //over-ride this below if necessary

		if (this.ID == "whereIsContinent") {

			this.clue( "Where is " + this.name + "?");

			this.message( "Click on " + this.name);	
		}

		if (this.ID == "inWhichContinent") {

			this.clue( "On which continent is " + this.name + "?");

			this.message( "Click on the continent for " + this.name);	
		}		


		Meteor.setTimeout( function() { browseMap.worldMap.doCurrentMap( _showNames ) }, 250 );  
		
	}

	this.clue = function( _s) {

		$(this.clueElement).text( _s );
	}

	this.message = function( _s ) {

		$(this.messageElement).text( _s);				
	}

}
