//news.js

//move these to constants.js

//event types
eNone = 0;

eHire = 1;

eLogin = 2;

eMissionStart = 3;

eHackComplete = 4;

eMissionComplete = 5;

eGSMissionStart = 6;

eGSMissionComplete = 7;

eExplore = 8;

//local-user only message types
mtHackStatus = 9;

mtMissionPercentage = 10;

mtHackTotalAlltime = 11;

mtMissionTotal	= 12;

mtPrevHackTime  = 13;

//event classes

ecLocal = 1;
ecWeather = 2;
ecNetwork = 3;



NewsItem = function(_type, _ID, _param, _name, _date) {

	var _localName = "Agent " + game.user.name;

	var _remoteName = "";

	if (_name) _remoteName = "Agent " + _name;

	var _formattedDate = new Date(_date).toString();


	this.msg = "";

	//network types


	if (_type == eHire) {

		this.msg = _remoteName + " was just hired as a Geohacker agent"
	}

	if (_type == eLogin) {

		this.msg = _remoteName + " logged into the Geohacker system"
	}	

	if (_type == eMissionStart) {

		var _mission = new Mission( _param );

		this.msg = _remoteName + " started Mission " + _mission.name;
	}	

	if (_type == eHackComplete) {

		var _countryName = db.ghC.findOne( { c: _param } ).n;

		this.msg = _remoteName + " hacked " + _countryName;
	}	

	if (_type == eMissionComplete) {

		var _mission = new Mission( _param );

		this.msg = _remoteName + " completed Mission: " + _mission.name;
	}	

	if (_type == eExplore) {

		var _countryName = "Unknown";

		if (_param) {	
			_countryName = db.ghC.findOne( { c: _param } ).n;
		}

		this.msg = _remoteName + " is exploring " + _countryName;
	}

	if (_type == eGSMissionStart) {

		this.msg = _remoteName + " started Geosquad Mission: " + _param;
	}	

	if (_type == eGSMissionComplete) {

		this.msg = _remoteName + " completed Geosquad Mission: " + _param;
	}	

	//local-only types

	if (_type == mtHackStatus) {

		if ( hacker.loader.totalClueCount == 0) {

			this.msg = _localName + " is hacking " + mission.name;

			return;
		}

		this.msg = " is hacking a stream from ";

		var _object = " an unknown country"

		//complete msg based on hackmap continent, region

		if (hackMap.level.get() == mlContinent) _object = db.getContinentName( hackMap.worldMap.selectedContinent );

		if (hackMap.level.get() == mlRegion) _object = db.getRegionName( hackMap.worldMap.selectedRegion );

		this.msg = _localName + this.msg + _object;

	}

	if (_type == mtMissionPercentage) {

		this.msg = " has completed " + parseInt(game.user.assign.hacked.length / (game.user.assign.hacked.length + game.user.assign.pool.length) * 100) + "% of mission:  "  + mission.name;

		this.msg = _localName + this.msg;
	}

	if (_type == mtHackTotalAlltime) {

		if (game.user.lifetimeHackCount() == 0) {

			return null;
		}

		this.msg = " has completed a total of " + game.user.lifetimeHackCount() + " hacks";

		this.msg = _localName + this.msg;		
	}

	if (_type == mtMissionTotal) {

		if (game.user.lifetimeMissionCount() == 0) {

			return null;
		}

		this.msg = " has completed " + game.user.lifetimeMissionCount() + " missions";

		this.msg = _localName + this.msg;		
	}

	if (_type == mtPrevHackTime) {

		if (game.user.prevHackCountry.length == 0) {

			return null;
		}

		this.msg = " hacked " + db.getCountryName( game.user.prevHackCountry ) + " in " + game.user.prevHackTime.toFixed(2) + " seconds";

		this.msg = _localName + this.msg;		
	}
}


 
News = function() {

	this._arrClass = [ecLocal, ecWeather, ecNetwork];

	this.arrClass = [];

	this.arrNetworkEvent = [];

	this.active = 0;

	this._arrLocalType = [9,10,11,12,13];

	this.arrLocalType = [];

	this.delay = 10000;

	this.class = "weather";  //weather or user

	this.weather = new Weather();

	this.networkEventsStarted = false;


	this.resetLocalTypeArray = function() {

		this.arrLocalType = this._arrLocalType.slice();
	}

	this.flipClass = function() {

		if (!this.arrClass.length) {

			this.arrClass = this._arrClass.slice();
		}

		this.class = this.arrClass.pop();

	}

	this.start = function() {

		if (!this.networkEventsStarted) this.listenForNetworkEvents();

		if (this.active) {

			c("returning from news.start b/c already active")

			return;
		}

		this.active = 1;

		if ( hacker.loader.totalClueCount == 0 ) {

			this.show();

			return;
		}

		Meteor.setTimeout( function() { hacker.news.show() }, this.delay);
	}

	this.listenForNetworkEvents = function() {

		this.networkEventsStarted = true;

		var _date = new Date( game.user.lastNewsDate );

		this.networkNewsCursor = db.ghEvent.find( { d: { $gt: _date.getTime() }, u: { $ne: game.user._id }} );

		this.networkNewsCursor.observe({

			added: function( _obj) {

				hacker.news.arrNetworkEvent.push( _obj );
			} 
		});		
	}

	this.stop = function() {

		this.active = 0;
	}

	this.show = function() {

		if (this.active == 0) {

			c("returning from show b/c not active")

			return;
		}

		var _item = null;

		this.flipClass();


		if (this.class == ecWeather) {

			this.weather.show();

			return;
		}

		if (this.class == ecLocal) {

			var _type = this.arrLocalType.pop();

			if (this.arrLocalType.length == 0) {

				this.resetLocalTypeArray();
			}


			_item = new NewsItem( _type );

		}

		if (this.class == ecNetwork)  {

			if (this.arrNetworkEvent.length == 0) {

				this.show();

				return;
			}			

			var _obj = this.arrNetworkEvent.pop();

			//skip any network events for the current user

			if (_obj.u == game.user._id) {

				this.show();

				return;
			}	
			
			_item = new NewsItem(_obj.t, _obj.u, _obj.p, _obj.n)

			game.user.lastNewsDate = _obj.d;

		}

		if (!_item) {

			this.show();

			return;
		}

		hacker.status.setThisAndType( _item.msg );

		Meteor.setTimeout( function() { hacker.news.show() }, this.delay);
	}

	this.clear = function() {

		var txt;

		var r = confirm("Clear all news events?");

		if (r == true) {

		    Meteor.call("clearEvents");
		}
	}

	this.listAll = function() {

		var _s = "";

		var _newline = "\n";

		//var _arr = db.ghEvent.find( {}, {sort: {d: -1}}).fetch();

		var _arr = db.ghEvent.find( {} ).fetch();

		for (var i = 0; i < _arr.length; i++) {

			var _obj = _arr[i];

			var _item = new NewsItem( _obj.t, _obj.u, _obj.p, _obj.n);

			var _date = new Date( _obj.d ).toString();

			var _s2 = _date + ": " +	_item.msg;

			_s = _s + _s2 + _newline;

		}

		console.log( _s);	

		var _unit = new Unit();

		_unit.showTextModal("News Events", _s)
	}


}



















