BadgeList = function() {

	this.arr = [];

	this.hackCompletePic = "hackComplete.jpg";

	this.speedGold = 20;

	this.speedSilver = 40;

	this.speedBronze = 60;

	this.speedText = ["UNDER " + this.speedGold + " SECS", "UNDER " + this.speedSilver + " SECS", "UNDER " + this.speedBronze + " SECS"];

	this.scholarGold = 3;

	this.scholarSilver = 2;

	this.scholarBronze = 1;	

	this.scholarText = [ this.scholarGold + " OR MORE MINS", this.scholarSilver + " OR MORE MINS", this.scholarBronze + " OR MORE MINS"];

	this.investigatorGold = 5;

	this.investigatorSilver = 4;

	this.investigatorBronze = 3;

	this.investigatorText = [this.investigatorGold + " OR MORE MESSAGES", this.investigatorSilver + " OR MORE MESSAGES", this.investigatorBronze + " OR MORE MESSAGES"];

	this.speedPic = ["speedster_gold.jpg", "speedster_silver.jpg", "speedster_bronze.jpg"];

	this.scholarPic = ["scholar_gold.jpg", "scholar_silver.jpg", "scholar_bronze.jpg"];

	this.investigatorPic = ["investigator_gold.jpg", "investigator_silver.jpg", "investigator_bronze.jpg"];

	this.geniusPic = "genius.jpg";

	this.expertPic = "expert.jpg";

	//these props not used, but left here for reference

	/*
	this.firstTimeCountryPic = "first_time_country.jpg";

	this.firstTimeRegionPic = "first_time_region.jpg";

	this.firstTimeContinentPic = "first_time_continent.jpg";

	this.firstTimeMissionPic = "first_time_mission.jpg";

	this.firstTimePlanetPic = "first_time_planet.jpg";

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

			obj.pic = "first_time_" + this.getLevelString(_level) + ".jpg";

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

		//first times

		if (pro.ft[ ftCountry ] > 0) this.arr.push( this.generateBadge( bFirstTime, ftCountry, false) ); 			

		if (pro.ft[ ftRegion ] > 0) this.arr.push( this.generateBadge( bFirstTime, ftRegion, false) ); 

		if (pro.ft[ ftContinent ] > 0) this.arr.push( this.generateBadge( bFirstTime, ftContinent, false) ); 

		if (pro.ft[ ftMission ] > 0) this.arr.push( this.generateBadge( bFirstTime, ftMission, false) ); 

		if (pro.ft[ ftPlanet ] > 0) this.arr.push( this.generateBadge( bFirstTime, ftPlanet, false) ); 

		return this.arr;     

	}

	this.generateList = function() {

		var totalHackClues = hacker.loader.totalClueCount + hacker.helper.getClueCount();

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

    	if (totalHackClues == 1) this.arr.push( this.generateBadge( bGenius, null, true) );

     	//expert

    	if (totalHackClues == 2) this.arr.push( this.generateBadge( bExpert, null, true ) );

    	//speed

    	if (game.hackTotalTime < parseFloat(this.speedGold)) this.arr.push( this.generateBadge( bSpeed, vGold, true ) );

    	if (game.hackTotalTime >= parseFloat(this.speedGold) && game.hackTotalTime < parseFloat(this.speedSilver)) this.arr.push( this.generateBadge( bSpeed, vSilver, true ) );

    	if (game.hackTotalTime >= parseFloat(this.speedSilver) && game.hackTotalTime < parseFloat(this.speedBronze)) this.arr.push( this.generateBadge( bSpeed, vBronze, true ) );

    	//investigator

    	if (hacker.loader.totalClueCount >= this.investigatorGold) this.arr.push( this.generateBadge( bInvestigator, vGold, true) );

    	if (hacker.loader.totalClueCount >= this.investigatorSilver && hacker.loader.totalClueCount < this.investigatorGold) this.arr.push( this.generateBadge( bInvestigator, vSilver, true ) );

    	if (hacker.loader.totalClueCount >= this.investigatorBronze && hacker.loader.totalClueCount < this.investigatorSilver) this.arr.push( this.generateBadge( bInvestigator, vBronze, true ) );

    	//scholar

    	var timeInMinutes = game.hackTotalTime / 60.0;

    	if (timeInMinutes >= parseFloat(this.scholarGold)) this.arr.push( this.generateBadge( bScholar, vGold, true ) );

    	if (timeInMinutes >= parseFloat(this.scholarSilver)  && timeInMinutes < parseFloat(this.scholarGold)) this.arr.push( this.generateBadge( bScholar, vSilver, true ) );

    	if (timeInMinutes >= parseFloat(this.scholarBronze)  && timeInMinutes < parseFloat(this.scholarSilver)) this.arr.push( this.generateBadge( bScholar, vBronze, true ) );



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