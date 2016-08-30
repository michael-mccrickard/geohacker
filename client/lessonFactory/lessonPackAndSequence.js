//lessonPackAndSequence.js

LessonSequence = function( _id ) {

	this.id = _id;

	this.item = [];  //array of ids

	if ( _id == "africa" ) this.item = ["africa_1", "africa_2", "africa_3", "africa_4", "africa_5"];

	if ( _id == "asia" ) this.item = ["asia_1", "asia_2", "asia_3", "asia_4"];

	if ( _id == "europe" ) this.item = ["europe_1", "europe_2", "europe_3", "europe_4"];

	if ( _id == "north_america" ) this.item = ["north_america_1", "north_america_2"];	

	if ( _id == "south_america" ) this.item = ["south_america_1", "south_america_2"];	

	if ( _id == "oceania" ) this.item = ["oceania_1", "oceania_2"];	

	this.score = [];

     for (var i = 0; i < this.item.length; i++ ) {

     	this.score.push(0.0);
     }	
}

//this singleton has the lesson group ids, like "africa" or "asia"

LessonPack = function() {

	this.item = ["africa","asia","europe","north_america","south_america","oceania"];

}

//this object used to store the scores per user in the db

LessonScore = function( _id ) {

	this.id = _id;

	var lessonSeq = new LessonSequence( _id );

	this.item = lessonSeq.item;

	this.score = lessonSeq.score;
}


LessonScore.get = function( _lessonGroupCode )  {

	var lessonIndex = LessonScore.getIndex( _lessonGroupCode );

	return game.user.profile.lesson[ lessonIndex ];
}

LessonScore.getIndex = function(_lessonGroupCode) {

	return getElementIndexForObjectID( _lessonGroupCode, game.user.profile.lesson );
}