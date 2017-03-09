//exercise.js
Template.exercise.rendered = function() {

	story.fadeOutAll();
}

ExerciseManager = function() {

	this.exercise = null;

	this.start = function( _ID ) {

		this.exercise = new Exercise( _ID);

		this.exercise.show();

		Meteor.setTimeout( function() { story.em.go() }, 300);
	}

	this.go = function() {

		this.exercise.go();
	}

	this.processUserChoice = function( _val ) {

		this.exercise.processUserChoice( _val );
	}

	this.finishExercise = function() {

		browseMap.mode.set("story");

		story.mode.set("scene");
	}

}


Exercise = function(_ID) {

	this.item = [];

	this.index = -1;

	this.config = {};

	this.startSound = "exerciseStart.mp3";

	this.itemChangeSound = "exerciseItemChange.mp3";

	this.correctSound = "exerciseCorrect.mp3";

	this.incorrectSound = "exerciseIncorrect.mp3";


	if (_ID == "whereIsContinent") {

		var _arr = Database.shuffle( db.ghZ.find().fetch() );

		var _obj = {};

		_obj.ID = "whereIs";

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


	this.show = function() {

		browseMap.mode.set("exercise");

		story.mode.set("exercise");
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
		
		var _answerGiven = "";

		//assuming whereIs for the moment

		if (_item.entity == "continent") _answerGiven = db.getContinentCodeForCountry( _val );
		
		if ( _answerGiven == _item.code) {

			story.playEffect( this.correctSound );

			_item.clue("CORRECT!")

			_item.message( _item.name );

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


	this.type = _obj.ID;  //whereIs, findCountry

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

		if (this.type == "whereIs") {

			this.clue( "Where is " + this.name + "?");

			this.message( "Click on " + this.name);		

			_worldMap.drawLevel = mlWorld

			_worldMap.detailLevel = mlContinent;	

			Meteor.setTimeout( function() { browseMap.worldMap.doCurrentMap( false ) }, 250 );  //set _showNames to false
		}
	}

	this.clue = function( _s) {

		$(this.clueElement).text( _s );
	}

	this.message = function( _s ) {

		$(this.messageElement).text( _s);				
	}

}
