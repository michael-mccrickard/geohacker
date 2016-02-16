BadgeList = function() {

	this.arr = [];

	this.hackCompletePic = "hackComplete.png";

	this.speedText = ["UNDER 10 SECS", "UNDER 20 SECS", "UNDER 30 SECS"];

	this.scholarText = ["15 OR MORE MINS","8 OR MORE MINS","3 OR MORE MINS"];

	this.investigatorText = ["9 OR MORE MESSAGES","6 OR MORE MESSAGES","3 OR MORE MESSAGES"];

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

	this.generateBadge = function(_type, _level, _updateFlag) {

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

		if (_updateFlag) {

			this.updateBadgeCount(obj, _type, _level)
		}
		else {

			obj.count = this.getBadgeCount( _type, _level);
		}

		return obj;

	}

	this.generateStatsList = function() {

		this.arr = [];

		var pro = game.user.profile;

		//genius and expert

		if (pro.ge > 0) this.arr.push( this.generateBadge( bGenius, null, false) ); 

		if (pro.ex > 0) this.arr.push( this.generateBadge( bExpert, null, false) );

		//speed
		
		if (pro.sp[ vGold ] > 0) this.arr.push( this.generateBadge( bSpeed, vGold, false) ); 		

		if (pro.sp[ vSilver ] > 0) this.arr.push( this.generateBadge( bSpeed, vSilver, false) ); 		

		if (pro.sp[ vBronze ] > 0) this.arr.push( this.generateBadge( bSpeed, vBronze, false) ); 		

		//scholar
		
		if (pro.sc[ vGold ] > 0) this.arr.push( this.generateBadge( bScholar, vGold, false) ); 		

		if (pro.sc[ vSilver ] > 0) this.arr.push( this.generateBadge( bScholar, vSilver, false) ); 		

		if (pro.sc[ vBronze ] > 0) this.arr.push( this.generateBadge( bScholar, vBronze, false) ); 	

		//investigator

		if (pro.in[ vGold ] > 0) this.arr.push( this.generateBadge( bInvestigator, vGold, false) ); 		

		if (pro.in[ vSilver ] > 0) this.arr.push( this.generateBadge( bInvestigator, vSilver, false) ); 		

		if (pro.in[ vBronze ] > 0) this.arr.push( this.generateBadge( bInvestigator, vBronze, false) ); 	

		//investigator

		if (pro.ft[ ftCountry ] > 0) this.arr.push( this.generateBadge( bFirstTime, ftCountry, false) ); 			

		if (pro.ft[ ftRegion ] > 0) this.arr.push( this.generateBadge( bFirstTime, ftRegion, false) ); 

		if (pro.ft[ ftContinent ] > 0) this.arr.push( this.generateBadge( bFirstTime, ftContinent, false) ); 

		if (pro.ft[ ftMission ] > 0) this.arr.push( this.generateBadge( bFirstTime, ftMission, false) ); 

		if (pro.ft[ ftPlanet ] > 0) this.arr.push( this.generateBadge( bFirstTime, ftPlanet, false) ); 

		return this.arr;     

	}

	this.generateList = function() {

		this.arr = [];

		this.arr.push( this.generateBadge( bHackComplete ) );

    	//first times

     	if (game.user.assign.completions == 1  && game.user.assign.pool.length == 0 && mission.level == mlWorld) this.arr.push( this.generateBadge( bFirstTime, ftPlanet, true) ); 

     	if (game.user.assign.completions == 1  && game.user.assign.pool.length == 0 && mission.level == mlContinent) this.arr.push( this.generateBadge( bFirstTime, ftContinent, true) );

     	if (game.user.assign.completions == 1  && game.user.assign.pool.length == 0 && mission.level == mlRegion) this.arr.push( this.generateBadge( bFirstTime, ftRegion, true) );   
     	
     	if (game.user.getTicketCount( hack.countryCode ) == 1) this.arr.push( this.generateBadge( bFirstTime, ftCountry, true) );

     	//the ad-hoc missions (Top Ten, etc.)

     	if (game.user.assign.completions == 1  && game.user.assign.pool.length == 0 && mission.level == mlNone) this.arr.push( this.generateBadge( bFirstTime, ftMission, true) );  

     	//genius

    	if (display.loader.totalClueCount == 1) this.arr.push( this.generateBadge( bGenius, null, true) );

     	//expert

    	if (display.loader.totalClueCount == 2) this.arr.push( this.generateBadge( bExpert, null, true ) );

    	//speed

    	if (game.hackTotalTime < 10.0) this.arr.push( this.generateBadge( bSpeed, vGold, true ) );

    	if (game.hackTotalTime >= 10.0 && game.hackTotalTime < 20.0) this.arr.push( this.generateBadge( bSpeed, vSilver, true ) );

    	if (game.hackTotalTime >= 20.0 && game.hackTotalTime < 30.0) this.arr.push( this.generateBadge( bSpeed, vBronze, true ) );

    	//investigator

    	if (display.loader.totalClueCount >= 9) this.arr.push( this.generateBadge( bInvestigator, vGold) );

    	if (display.loader.totalClueCount >= 6 && display.loader.totalClueCount < 9) this.arr.push( this.generateBadge( bInvestigator, vSilver, true ) );

    	if (display.loader.totalClueCount >= 3 && display.loader.totalClueCount < 6) this.arr.push( this.generateBadge( bInvestigator, vBronze, true ) );

    	//scholar

    	var timeInMinutes = game.hackTotalTime / 60.0;

    	if (timeInMinutes >= 15.0) this.arr.push( this.generateBadge( bScholar, vGold, true ) );

    	if (timeInMinutes >= 8.0  && timeInMinutes < 15.0) this.arr.push( this.generateBadge( bScholar, vSilver, true ) );

    	if (timeInMinutes >= 3.0  && timeInMinutes < 8.0) this.arr.push( this.generateBadge( bScholar, vBronze, true ) );



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

			val = pro.ge;

			pro.ge = ++val;
		}

		if (_type == bExpert) {

			val = pro.ex;

			pro.ex = ++val;
		}

		if (_type == bSpeed) {

			val = pro.sp[ _level ];

			pro.sp[ _level ] = ++val;
		}

		if (_type == bScholar) {

			val = pro.sc[ _level ];

			pro.sc[ _level ] = ++val;
		}

		if (_type == bInvestigator) {

			val = pro.in[ _level ];

			pro.in[ _level ] = ++val;
		}

		if (_type == bFirstTime) {

			val = pro.ft[ _level ];

			pro.ft[ _level ] = ++val;
		}

		_obj.count = val;

		db.updateUserBadgeCount();
	}

	this.getBadgeCount = function(_type, _level) {

		var pro = game.user.profile;

		if (_type == bGenius) return pro.ge;

		if (_type == bExpert) return pro.ex;

		if (_type == bSpeed) return pro.sp[ _level ];	

		if (_type == bScholar) return pro.sc[ _level ];	

		if (_type == bInvestigator) return pro.in[ _level ];	

		if (_type == bFirstTime) return pro.ft[ _level ];	

	}

}