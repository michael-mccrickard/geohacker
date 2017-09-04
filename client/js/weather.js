//weather js

Weather = function() {
	
	this.city = "";

	this.country = "";

	this.description = new Blaze.ReactiveVar();

	this.delay = 0;

	this.timerID = null;

	this.capitals = [];

	this.show = function() {

		this.stop();

		this.country = "";

		if (this.capitals.length == 0) this.capitals = db.ghText.find( { dt: "cap" } ).fetch(); 

		var _rec = Database.getRandomElement( this.capitals );

		this.city = _rec.f;

		this.country = db.getCountryName( _rec.cc );

		if (this.country) {

			this.get( this.country, this.city );
		}
		else {
c("calling news.show b/c country name wasn't found");
			hacker.news.show();
		}
	}

	this.stop = function() {

		if (this.timerID) Meteor.clearTimeout( this.timerID );
	}

	this.get = function( _country, _city) {

		 Meteor.call("getWeatherStringFor", _city , function(err, res) {

		      if (err) {

		      	console.log(err);

		      	hacker.news.weather.show();

		      	return;
		      }

		      hacker.news.weather.description.set( _city + ", " + _country + ": " + res.weather[0].description + " and " + Math.round( res.main.temp ) + "\u2109" );

			  hacker.status.setThisAndType( hacker.news.weather.description.get() );

			  Meteor.setTimeout( function() { hacker.news.show(); }, hacker.news.delay);
		});
	}
}