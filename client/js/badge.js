BadgeList = function() {

	this.arr = [];

	this.gold = 0;

	this.silver = 1;

	this.bronze = 2;

	this.speedText = ["LESS THAN 10 SECS", "LESS THAN 20 SECS", "LESS THAN 30 SECS"];

	this.scholarText = ["ANALYZED 15 OR MORE MINS","ANALYZED 8 OR MORE MINS","ANALYZED 3 OR MORE MINS"];

	this.investigatorText = ["9 OR MORE DATA POINTS","6 OR MORE DATA POINTS","3 OR MORE DATA POINTS"];

	this.speedPic = ["speedster_gold.png", "speedster_silver.png", "speedster_bronze.png"];

	this.scholarPic = ["scholar_gold.png", "scholar_silver.png", "scholar_bronze.png"];

	this.investigatorPic = ["investigator_gold.png", "investigator_silver.png", "investigator_bronze.png"];

	this.geniusPic = "genius.png";

	this.firstTimeCountryPic = "first_time_country.png";

	this.firstTimeRegionPic = "first_time_region.png";

	this.firstTimeContinentPic = "first_time_continent.png";

	this.firstTimeMissionPic = "first_time_mission.png";

	this.firstTimePlanetPic = "first_time_planet.png";

	this.hackCompletePic = "hackComplete.png";

	this.generateBadge = function(_type, _level) {

		var obj = {};

		if (_type == "hackComplete") {

			obj.pic = this.hackCompletePic;

			obj.text = "";
		}

		if (_type == "genius") {

			obj.pic = this.geniusPic;

			obj.text = "";
		}

		if (_type == "speed") {

			obj.pic = this.speedPic[ _level ];

			obj.text = this.speedText[ _level ];
		}

		if (_type == "scholar") {

			obj.pic = this.scholarPic[ _level ];

			obj.text = this.scholarText[ _level ];
		}

		if (_type == "investigator") {

			obj.pic = this.investigatorPic[ _level ];

			obj.text = this.investigatorText[ _level ];
		}

		if (_type == "first_time") {

			obj.pic = "first_time_" + _level + ".png";

			obj.text = "";
		}

		return obj;

	}

//add speed and scholar

	this.generateList = function() {

		this.arr = [];

		this.arr.push( this.generateBadge("hackComplete") );

    	//first times

     	if (game.user.getTicketCount( hack.countryCode ) == 1) this.arr.push( this.generateBadge( "first_time", "country") );  

    	if (display.loader.totalClueCount == 1) this.arr.push( this.generateBadge( "genius") );

    	//speed

    	if (game.hackTotalTime < 10.0) this.arr.push( this.generateBadge( "speed", this.gold) );

    	if (game.hackTotalTime >= 10.0 && game.hackTotalTime < 20.0) this.arr.push( this.generateBadge( "speed", this.silver) );

    	if (game.hackTotalTime >= 20.0 && game.hackTotalTime < 30.0) this.arr.push( this.generateBadge( "speed", this.bronze) );

    	//investigator

    	if (display.loader.totalClueCount >= 9) this.arr.push( this.generateBadge( "investigator", this.gold) );

    	if (display.loader.totalClueCount >= 6 && display.loader.totalClueCount < 9) this.arr.push( this.generateBadge( "investigator", this.silver) );

    	if (display.loader.totalClueCount >= 3 && display.loader.totalClueCount < 6) this.arr.push( this.generateBadge( "investigator", this.bronze) );

    	//scholar

    	var timeInMinutes = game.hackTotalTime / 60.0;

    	if (timeInMinutes >= 15.0) this.arr.push( this.generateBadge( "scholar", this.gold) );

    	if (timeInMinutes >= 8.0  && timeInMinutes < 15.0) this.arr.push( this.generateBadge( "scholar", this.silver) );

    	if (timeInMinutes >= 3.0  && timeInMinutes < 8.0) this.arr.push( this.generateBadge( "scholar", this.bronze) );



     	return this.arr; 	
	}


}