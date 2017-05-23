//exercise.js
Template.mapboxExercise.rendered = function() {

	story.fadeOutAll();

	//Create the ghMapbox object which will create the map object; then the
	//on.load callback will call this.mapboxReady()

	Meteor.setTimeout( function() { story.mapbox = new ghMapbox(); }, 1000 );	
}

Template.mapboxExercise.helpers({

  MMapLeft: function() {

     return $(window).width() * 0.05;
  },

  MMapWidth: function() {

     return $(window).width() * 0.8;
  },


  MMapHeight: function() {

     return $(window).height() * 0.9;
  
     return false;
  },

  exerciseChar: function() {

  	return story.mem.char.index;
  },

	picForChar: function() {

		return story.mem.char.pic;
	},

	nameForChar: function() {

		return story.mem.char.name;
	}

});


MapboxExerciseManager = function(_charName) {

	this.char = null;

	this.exercise = null;

	this.setChar = function(_charName) {

		this.char = story[ _charName ];
	}

	this.processUserChoice = function( _val ) {

		this.exercise.item[ this.exercise.index ].processUserChoice( _val );
	}

	this.finishExercise = function() {

		story.mode.set("scene");
	}

	this.init = function( _charName ) {

		if (_charName) this.char = story[ _charName ];

		story.exerciseType.set("mapbox");

		//We need a little delay here to ensure that the template has been redrawn with the exercise on it.
		//The rendered event for the mapboxExercise template creates the ghMapbox object and it's onload event
		//calls story.mapboxReady, which triggers the exercise code

		Meteor.setTimeout( function() { story.mode.set("exercise"); }, 500 );
	}

	this.build = function() {

		this.exercise = new MapboxExercise();

	}

	this.go = function() {

		this.exercise.show();

		Meteor.setTimeout( function() { story.mem.exercise.go() }, 300);
	}

	this.add = function( _arr ) {

		for (var i = 0; i < _arr.length; i++) {

			this.exercise.add( _arr[i] );
		}		
	}

	//not used yet (no qCode yet) but keeping it as an example

	this.getQCode = function() {

		return this.exercise.item[ this.exercise.index ].qCode;
	}

	this.getConfig = function() {

		return this.exercise.config;
	}
}


MapboxExercise = function() {

	this.item = [];

	this.index = -1;

	this.config = {};

	this.startSound = "exerciseStart.mp3";

	this.itemChangeSound = "exerciseItemChange.mp3";

	this.correctSound = "exerciseCorrect.mp3";

	this.incorrectSound = "exerciseIncorrect.mp3";

	//We can modify these functions to let value pairs in the param obj
	//over-ride the default values

	this.add = function( _par ) {

		var _obj = {};

		_obj.aCode = _par.aCode;

		_obj.qText = _par.qText;

		_obj.aText = _par.aText;

		this.config = _obj;

		this.item.push( new MapboxExerciseItem( _obj ) );

	}


	this.show = function() {

		browseMap.mode.set("exercise");

		story.mode.set("exercise");

		story.fadeOutBG();
	}


	this.go = function()  {

		this.index++;

		if (this.index == 0) {

			story.playEffect( this.startSound );

			Database.shuffle(this.item);
		}

		if (this.index == this.item.length) {

			story.em.finishExercise();

			story.doneWithExercise();

			return;
		}

		story.playEffect2( this.itemChangeSound );

		this.item[ this.index ].draw();
	}

	this.processUserChoice = function( _val ) {

		this.item[ this.index ].processUserChoice( _val );

	}

}

MapboxExerciseItem = function( _obj ) {  

	if (_obj.qText) this.qText = _obj.qText; 

	if (_obj.qText) this.aText = _obj.aText; 

	if (_obj.aCode) this.aCode = _obj.aCode; 

	if (_obj.pic) this.pic = _obj.pic;  


	this.draw = function() {

		var _showNames = false;  //over-ride this below if necessary

		this.clue( this.qText);
		
	}

	this.clue = function( _s) {

		story.mem.char.say( _s );
	}

	this.message = function( _s ) {

		story.prompt( _s);				
	}

	this.processUserChoice = function( _val ) {
		
c("_val is " + _val)
c("_item.aCode is " + this.aCode)
		
		if ( _val == this.aCode) {

			story.playEffect( story.mem.exercise.correctSound );

			this.message( "CORRECT!" );

			this.clue( this.aText );

			Meteor.setTimeout( function() { story.mem.char.q() }, 4000);		

			Meteor.setTimeout( function() { story.mem.exercise.go() }, 5000);	
		}

		else {

			story.playEffect( story.mem.exercise.incorrectSound );

			this.clue("Incorrect.");

			story.mem.exercise.index--;

			Meteor.setTimeout( function() { story.mem.char.q() }, 1000);		

			Meteor.setTimeout( function() { story.mem.exercise.go() }, 2000);		
		}

	}

}