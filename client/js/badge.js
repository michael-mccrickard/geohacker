BadgeList = function() {

	this.arr = [];

	this.gold = 0;

	this.silver = 1;

	this.bronze = 2;

	this.hackCompletePic = "hackComplete.png";

	this.speedText = ["LESS THAN 10 SECS", "LESS THAN 20 SECS", "LESS THAN 30 SECS"];

	this.scholarText = ["ANALYZED 15 OR MORE MINS","ANALYZED 8 OR MORE MINS","ANALYZED 3 OR MORE MINS"];

	this.investigatorText = ["9 OR MORE DATA POINTS","6 OR MORE DATA POINTS","3 OR MORE DATA POINTS"];

	this.speedPic = ["speedster_gold.png", "speedster_silver.png", "speedster_bronze.png"];

	this.scholarPic = ["scholar_gold.png", "scholar_silver.png", "scholar_bronze.png"];

	this.investigatorPic = ["investigator_gold.png", "investigator_silver.png", "investigator_bronze.png"];

	this.geniusPic = "genius.png";

	this.expertPic = "expert.png";

	//these props not used, but left here for reference

	/*
	this.firstTimeCountryPic = "first_time_country.png";

	this.firstTimeRegionPic = "first_time_region.png";

	this.firstTimeContinentPic = "first_time_continent.png";

	this.firstTimeMissionPic = "first_time_mission.png";

	this.firstTimePlanetPic = "first_time_planet.png";

	*/

	this.index = 0;

	this.generateBadge = function(_type, _level) {

		var obj = {};

		if (_type == bHackComplete) {

			this.index++;

			obj.index = this.index;

			obj.pic = this.hackCompletePic;

			obj.text = "";
		}

		if (_type == bExpert) {

			this.index++;

			obj.index = this.index;

			obj.pic = this.expertPic;

			obj.text = "";
		}

		if (_type == bGenius) {

			this.index++;

			obj.index = this.index;

			obj.pic = this.geniusPic;

			obj.text = "";
		}

		if (_type == bSpeed) {

			this.index++;

			obj.index = this.index;

			obj.pic = this.speedPic[ _level ];

			obj.text = this.speedText[ _level ];
		}

		if (_type == bScholar) {

			this.index++;

			obj.index = this.index;

			obj.pic = this.scholarPic[ _level ];

			obj.text = this.scholarText[ _level ];
		}

		if (_type == bInvestigator) {

			this.index++;

			obj.index = this.index;

			obj.pic = this.investigatorPic[ _level ];

			obj.text = this.investigatorText[ _level ];
		}

		if (_type == bFirstTime) {

			this.index++;

			obj.index = this.index;

			obj.pic = "first_time_" + this.getLevelString(_level) + ".png";

			obj.text = "";
		}

		game.user.badgeLimit = this.index;

		this.updateBadgeCount(obj, _type, _level)

		return obj;

	}

//add speed and scholar

	this.generateList = function() {

		this.index = 0;

		this.arr = [];

		this.arr.push( this.generateBadge( bHackComplete ) );

    	//first times

     	if (game.user.assign.completions == 1  && game.user.assign.pool.length == 0 && mission.level == mlWorld) this.arr.push( this.generateBadge( bFirstTime, ftPlanet) );    

     	if (game.user.assign.completions == 1  && game.user.assign.pool.length == 0 && mission.level == mlContinent) this.arr.push( this.generateBadge( bFirstTime, ftContinent) );  

     	if (game.user.assign.completions == 1  && game.user.assign.pool.length == 0 && mission.level == mlRegion) this.arr.push( this.generateBadge( bFirstTime, ftRegion) );    
     	
     	if (game.user.getTicketCount( hack.countryCode ) == 1) this.arr.push( this.generateBadge( bFirstTime, ftCountry) );  

     	if (game.user.assign.completions == 1  && mission.level == mlNone) this.arr.push( this.generateBadge( bFirstTime, ftMission) );    

     	//genius

    	if (display.loader.totalClueCount == 1) this.arr.push( this.generateBadge( bGenius) );

     	//genius

    	if (display.loader.totalClueCount == 2) this.arr.push( this.generateBadge( bExpert ) );

    	//speed

    	if (game.hackTotalTime < 10.0) this.arr.push( this.generateBadge( bSpeed, this.gold ) );

    	if (game.hackTotalTime >= 10.0 && game.hackTotalTime < 20.0) this.arr.push( this.generateBadge( bSpeed, this.silver) );

    	if (game.hackTotalTime >= 20.0 && game.hackTotalTime < 30.0) this.arr.push( this.generateBadge( bSpeed, this.bronze) );

    	//investigator

    	if (display.loader.totalClueCount >= 9) this.arr.push( this.generateBadge( bInvestigator, this.gold) );

    	if (display.loader.totalClueCount >= 6 && display.loader.totalClueCount < 9) this.arr.push( this.generateBadge( bInvestigator, this.silver) );

    	if (display.loader.totalClueCount >= 3 && display.loader.totalClueCount < 6) this.arr.push( this.generateBadge( bInvestigator, this.bronze) );

    	//scholar

    	var timeInMinutes = game.hackTotalTime / 60.0;

    	if (timeInMinutes >= 15.0) this.arr.push( this.generateBadge( bScholar, this.gold) );

    	if (timeInMinutes >= 8.0  && timeInMinutes < 15.0) this.arr.push( this.generateBadge( bScholar, this.silver) );

    	if (timeInMinutes >= 3.0  && timeInMinutes < 8.0) this.arr.push( this.generateBadge( bScholar, this.bronze) );



     	return this.arr; 	
	}

	this.getLevelString = function( _level ) {

		var s = "";

		if (_level == ftCountry) s = "country";

		if (_level == ftRegion) s = "region";

		if (_level == ftContinent) s = "continent";

		if (_level == ftMission) s = "mission";

		if (_level == ftPlanet) s = "planet";

		return s;
	}

	this.updateBadgeCount = function(_obj, _type, _level ) {

		var val = 0;

		var pro = game.user.profile;

		if (_type == bGenius) {

			pro.ge = ++val;
		}

		if (_type == bExpert) {

			pro.ex = ++val;
		}

		_obj.count = val;

		db.updateUserBadgeCount();

	}

}