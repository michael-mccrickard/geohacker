//weather js

Weather = function() {
	
	this.city = "";

	this.country = "";

	this.description = new Blaze.ReactiveVar();

	this.delay = 15000;

	this.timerID = null;

	this.capitals = [];

	this.start = function() {

		this.stop();

		if (this.capitals.length == 0) this.capitals = db.ghText.find( { dt: "cap"} ).fetch();

		var _rec = Database.getRandomElement( this.capitals );

		this.city = _rec.f;

		this.country = db.getCountryName( _rec.cc );

		this.timerID = Meteor.setTimeout( function() { display.weather.get( display.weather.country, display.weather.city ); }, this.delay );

	}

	this.stop = function() {

		if (this.timerID) Meteor.clearTimeout( this.timerID );
	}

	this.get = function( _country, _city) {

		 Meteor.call("getWeatherStringFor", _city , function(err, res) {

		      if (err) console.log(err);

		      display.weather.description.set( _city + ", " + _country + ": " + res.weather[0].description + " and " + Math.round( res.main.temp ) + "\u2109" );

//console.log(display.weather.description.get() );

			  display.status.setThisAndType( display.weather.description.get() );

		      display.weather.start();
		});
	}
}