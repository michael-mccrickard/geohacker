//quiz.js

Quiz = function( _lesson ) {

		this.lesson = _lesson;
	

		//QUIZ PROPERTIES

		this.sequence = ["quizFindRegionOfCountry", "quizFindCountryInRegion"];

		this.type = "";

		this.typeIndex = -1;

		this.item = []; //the array of countries that provides the basis for the questions
							//Sometimes the answer IS the element from quizItem, sometimes it is DERIVED from it

		this.answer = ""; //Again, either the element from quizItem, or an answer derived from it

		this.questionIndex = -1;

		this.inProgress = new Blaze.ReactiveVar( false );

		this.displayItem = new Blaze.ReactiveVar( "" );

		this.state = new Blaze.ReactiveVar( "waiting" );  //waiting, readyForNext, quizEnd, examEnd, decideNextStep

		this.correctCount = 0;

		this.questionCount = 0;

		//SOUNDS

		this.rightSoundLimit = 4;

		this.wrongSoundLimit = 5;

		this.resultsLimit = 1;

		this.newQuestionLimit = 3;

		this.selectSoundLimit = 3;

		this.buttonSoundLimit = 2;


	//***************************************************************
	//					SOUND FUNCTIONS
	//***************************************************************

	this.getSoundFile = function( _type) {

		var _s = '';

		if (_type == "right") _s = _type + "_" + (Database.getRandomValue( this.rightSoundLimit ) + 1) + ".mp3";

		if (_type == "wrong") _s = _type + "_" + (Database.getRandomValue( this.wrongSoundLimit ) + 1) + ".mp3";

		if (_type == "results") _s = _type + "_" + (Database.getRandomValue( this.resultsLimit )  + 1) + ".mp3";

		if (_type == "question") _s = _type + "_" + (Database.getRandomValue( this.newQuestionLimit ) + 1) + ".mp3";

		if (_type == "select") _s = _type + "_" + (Database.getRandomValue( this.selectSoundLimit ) + 1) + ".mp3";

		if (_type == "button") _s = _type + "_" + (Database.getRandomValue( this.buttonSoundLimit ) + 1) + ".mp3";

		return _s;
	}

	this.playSound = function( _type ) {

		var _s = this.getSoundFile( _type);

		Control.playEffect( _s );
	}

	this.playSound2 = function( _type ) {

		var _s = this.getSoundFile( _type);

		Control.playEffect2( _s );
	}

	this.playSound3 = function( _type ) {

		var _s = this.getSoundFile( _type);

		Control.playEffect3( _s );
	}



	//***************************************************************
	//					QUIZ FUNCTIONS
	//***************************************************************

	this.retake = function() {

		this.typeIndex = -1;

		this.questionCount = 0;

		this.correctCount = 0;

		this.start();
	}

	this.start = function() {

		this.lesson.hideCapsule();

		this.typeIndex++;

		if ( this.typeIndex == this.sequence.length ) {

			this.state.set( "examEnd" );

			this.postResults();

			return;
		}

		this.inProgress.set( true );

		//set the array using the lesson.items  (from lesson's mission object)

		this.item = this.lesson.items;

		Database.shuffle( this.item );

		this.questionCount += this.item.length;

		this.lesson.hideTeachLayout();

		this.showItem();

		this.type = this.sequence[ this.typeIndex ];

//this.type = "quizFindCountryInRegion";

		this.questionIndex = -1;

		this.doQuestion();

	}



	this.doQuestion = function() {

		this.lesson.setTextColor( "yellow" );

		this.playSound("question");

		this.lesson.hideCapsule();

		this.state.set( "waiting" );

		this.questionIndex++;

		var _item = this.item[ this.questionIndex ];

		var rec = null;


		//regions

		if (this.type == "quizFindRegionOfCountry") {

			this.lesson.setMessage("click the region");

	        this.answer = db.getRegionCodeForCountry( _item ); 

			this.lesson.setHeader("Which region is this country in?");

			this.lesson.lessonMap.doThisMap(mlContinent, mlContinent, mlRegion, this.lesson.continent, this.answer, false);

			this.displayItem.set( db.getCountryName(  _item ) );			
		}

		if (this.type == "quizFindCountryInRegion") {

			this.lesson.setMessage("click the country");

	        this.answer = _item; 

	        rec = db.getRegionRecForCountry( _item);

			this.lesson.setHeader("Can you find this country in " + rec.n + "?");

			this.lesson.lessonMap.doThisMap(mlRegion, mlRegion, mlCountry, this.lesson.continent, rec.c, true);

			this.displayItem.set( db.getCountryName(  _item ) );			
		}

	}

	this.doCorrectAnswer = function( _ID ) {

		this.lesson.setTextColor( "lime" );

		this.playSound3( "right" );

		this.correctCount++;

		//the map detects clicks on individual countries, so our quiz items are always
		//countries, but we need the region of the country to draw the map appropriately

		var _item = this.item[ this.questionIndex ];

		var _region = db.getRegionCodeForCountry( _item );

		this.lesson.setHeader("CORRECT!");

		if (this.type == "quizFindRegionOfCountry") {

			this.lesson.lessonMap.doThisMap(mlContinent, mlRegion, mlCountry, this.lesson.continent, _region, false);

			this.lesson.setMessage( this.displayItem.get() + " is in " + db.getRegionRec( this.answer ).n );	
		}

		if (this.type == "quizFindCountryInRegion") {

			this.lesson.lessonMap.doThisMap(mlContinent, mlRegion, mlCountry, this.lesson.continent, _region, false);

			this.lesson.setMessage( this.displayItem.get() + " is in " + db.getRegionRecForCountry( this.answer ).n );	
		}


		this.lesson.showCapsule( _item );

		this.checkForEnd();

	}

	this.doIncorrectAnswer = function( _ID )  {

		this.lesson.setTextColor( "red" );

		this.playSound3( "wrong" );

		var _item = this.item[ this.questionIndex ];

		var _region = db.getRegionCodeForCountry( _item );		

		this.lesson.lessonMap.doThisMap(mlContinent, mlRegion, mlCountry, this.lesson.continent, _region, false);

		if (this.type == "quizFindRegionOfCountry") {

			this.lesson.setHeader("INCORRECT! YOU CLICKED " + db.getRegionRecForCountry( _ID ).n );

			this.lesson.setMessage( this.displayItem.get() + " is in " + db.getRegionRec( this.answer ).n );	
		}

		if (this.type == "quizFindCountryInRegion") {

			this.lesson.setHeader("INCORRECT! YOU CLICKED " +  db.getCountryName( _ID ) );

			this.lesson.setMessage( this.displayItem.get() + " is in " + db.getRegionRecForCountry( this.answer ).n );	
		}		

		this.lesson.showCapsule( _item );

		this.checkForEnd();
	}

	this.checkForEnd = function() {

		if (this.questionIndex == this.item.length - 1) {

			this.state.set( "quizEnd" );

			return;
		}
		else {

			this.state.set( "readyForNext" );
		}
	}

	this.postResults = function() {

		Meteor.setTimeout( function() { game.lesson.quiz.playSound( "results" ); }, 1500 );

		this.lesson.setTextColor( "yellow" );

		this.lesson.setMessage("QUIZ COMPLETE");

		this.lesson.setHeader("");

		this.hideItem();

		this.lesson.showTeachLayout();

		this.lesson.showBody("YOUR RESULTS:", this.correctCount + " out of " + this.questionCount, "CORRECT", 0.3);

		this.updateScore( this.lesson.lessonGroup, this.lesson.code, parseInt( this.correctCount/this.questionCount * 100) );
	}

	this.finishExam = function() {

		this.lesson.hideTeachLayout();

		this.state.set("decideNextStep");
	}

	this.hideItem = function() {

		$(".quizItem").css("display","none");
	
	}

	this.showItem = function() {

		$(".quizItem").css("display","block");
	
	}

	this.updateScore = function( _lessonGroupCode, _lessonID, _score)  {

		var ls = LessonScore.get( _lessonGroupCode);

		var lessonIndex = LessonScore.getIndex( _lessonGroupCode)

		if (ls) {

			var _index = ls.item.indexOf( _lessonID );

			if ( _index != -1) {

				ls.score[ _index ] = _score;

				game.user.profile.lesson[ lessonIndex ] = ls;		

				db.updateUserLessons();	
			}
		}
	}
}