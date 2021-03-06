


Mission = function(_code) {

  this.start = Date.now();

  this.finish = 0;

  this.status = msNone;
	
  this.level = mlNone;

  this.code = _code;  //either a continent code, region code, or arbitrary string 
                      //like one of the custom mission codes (below)

  this.mapCode = null;

  this.type = "quizOnly";

  this.name = "0";

  this.customList = ["ttp", "ttp_africa","ttp_asia","ttp_europe","ttp_americas","pg", "all"];

  this.items = [];

  //this.subMissions = [];



  //if we are only creating the mission object, but not initing it to a specific mission
  //then we're done

  if (_code === undefined) return;


  //custom "ad-hoc" missions

  //ten largest population (earth)

  if (this.code == "ttp") {

  	this.name = "Top Ten Earth"

    this.congratsName = "The Ten Largest Nations On Earth";

    this.items = ["CN", "BD", "IN", "JP", "ID", "NG", "BR", "PK", "RU","US"]; 

    return;
  }

  //ten largest population (Africa)

  if (this.code == "ttp_africa" || this.code == "africa_1") {

    this.type ="introAndQuiz";

    this.name = "Top Ten Africa";

    this.congratsName = "The Ten Largest Nations In Africa";

    if (this.code == "africa_1") this.name = "Africa by population (1 - 10)";

    this.shortName = "Africa 1";

    this.mapCode = "africa";

    this.level = mlContinent;

    this.items = ["NG", "ET", "EG", "CD", "TZ", "ZA", "KE", "DZ", "SD", "UG"]; 

    return;
  }

  if (this.code == "africa_2") {

    this.name = "Africa by population (11 - 20)"

    this.shortName = "Africa 2";

    this.mapCode = "africa";

    this.level = mlContinent;

    this.items = ["MA","GH","MZ","AO","CI","MG","CM","NE","BF","ML"]; 

    return;
  }

  if (this.code == "africa_3") {

    this.name = "Africa by population (21 - 30)"

    this.shortName = "Africa 3";

    this.mapCode = "africa";

    this.level = mlContinent;

    this.items = ["MW","ZM","SN","TD","ZW","SS","RW","TN","SO","GN"]; 

    return;
  }

  if (this.code == "africa_4") {

    this.name = "Africa by population (31 - 40)"

    this.shortName = "Africa 4";

    this.mapCode = "africa";

    this.level = mlContinent;

    this.items = ["BJ","BI","TG","ER","SL","LY","CF","CG","LR","MR"]; 

    return;
  }

  if (this.code == "africa_5") {

    this.name = "Africa by population (41 - 50)"

    this.shortName = "Africa 5";

    this.mapCode = "africa";

    this.level = mlContinent;

    this.items = ["NA","BW","GM","GQ","LS","GA","GW","SZ","DJ","EH"]; 

    return;
  }

  //ten largest population (Asia)

  if (this.code == "ttp_asia" || this.code == "asia_1") {

    this.type = "introAndQuiz";

    this.name = "Top Ten Asia";

    this.congratsName = "The Ten Largest Nations In Asia";

    if (this.code == "asia_1") this.name = "Asia by population (1 - 10)";

    this.shortName = "Asia 1";

    this.mapCode = "asia";

    this.level = mlContinent;

    this.items = ["CN","IN","ID","PK","BD","RU","JP","PH","VN","IR"]; 

    return;
  }

  if (this.code == "asia_2") {

    this.name = "Asia by population (11 - 20)"

    this.shortName = "Asia 2";

    this.mapCode = "asia";

    this.level = mlContinent;

    this.items = ["TR","TH","MM","KR","IQ","SA","UZ","MY","NP","AF"]; 

    return;
  }

  if (this.code == "asia_3") {

    this.name = "Asia by population (21 - 30)"

    this.shortName = "Asia 3";

    this.mapCode = "asia";

    this.level = mlContinent;

    this.items = ["YE","KP","TW","SY","LK","KZ","KH","AZ","AE","TJ"]; 

    return;
  }

  if (this.code == "asia_4") {

    this.name = "Asia by population (31 - 40)"

    this.shortName = "Asia 4";

    this.mapCode = "asia";

    this.level = mlContinent;

    this.items = ["IL","JO","LA","KG","TM","PS","LB","OM","KW","GE"]; 

    return;
  }

  if (this.code == "asia_5") {

    this.name = "Asia by population (41 - 47)"

    this.shortName = "Asia 5";

    this.mapCode = "asia";

    this.level = mlContinent;

    this.items = ["MN","AM","QA","TL","CY","BT","BN"]; 

    return;
  }

  
  //ten largest population (Europe)

  if (this.code == "ttp_europe" || this.code == "europe_1") {

    this.name = "Top Ten Europe";

    this.congratsName = "The Ten Largest Nations In Europe";

    if (this.code == "europe_1") this.name = "Europe by population (1 - 10)";

    this.type = "introAndQuiz";

    this.shortName = "Europe 1"

    this.mapCode = "europe";

    this.level = mlContinent;

    this.items = ["DE","FR","GB","IT","ES","UA","PL","RO","NL","BE"]; 

    return;
  }

  if (this.code == "europe_2") {

    this.name = "Europe by population (11 - 20)"

    this.shortName = "Europe 2";

    this.mapCode = "europe";

    this.level = mlContinent;

    this.items = ["GR","CZ","PT","SE","HU","BY","AT","CH","BG","RS"]; 

    return;
  }

  if (this.code == "europe_3") {

    this.name = "Europe by population (21 - 30)"

    this.shortName = "Europe 3";

    this.mapCode = "europe";

    this.level = mlContinent;

    this.items = ["DK","FI","SK","NO","IE","HR","BA","LT","AL","MK"]; 

    return;
  }

  if (this.code == "europe_4") {

    this.name = "Europe by population (31 - 38)"

    this.shortName = "Europe 4";

    this.mapCode = "europe";

    this.level = mlContinent;

    this.items = ["SI","LV","XK","EE","ME","LU","MD","IS"]; 

    return;
  }

  //ten largest population (AMERICAS)

  if (this.code == "ttp_americas") {

    this.name = "Top Ten America";

    this.congratsName = "The Ten Largest Nations In The Americas";

    this.level = mlWorld;

    this.items = ["US","BR","MX","CO","AR","CA","PE","VE","CL","EC"]; 

    return;
  }

  //ten largest population (NORTH AMERICA)

  if (this.code == "ttp_north_america" || this.code == "north_america_1") {

    this.type = "introAndQuiz";

    this.name = "Top Ten North America";

    this.congratsName = "The Ten Largest Nations in North America"

    this.shortName = "North America 1";

    this.mapCode = "north_america";

    this.level = mlWorld;

    this.items = ["US","MX","CA","GT","CU","DO","HT","HN","SV","NI"]; 

    return;
  }

  if (this.code == "north_america_2") {

    this.name = "North America by population (11 - 16)"

    this.shortName = "North America 2";

    this.mapCode = "north_america";

    this.level = mlContinent;

    this.items = ["CR","PA","PR","JM","BS","BZ","GL"]; 

    return;
  }

  //ten largest population (SOUTH AMERICA)

  if (this.code == "ttp_south_america" || this.code == "south_america_1") {

    this.type = "introAndQuiz";

    this.congratsName = "The Ten Largest Nations in South America"

    this.name = "Top Ten South America";

    this.shortName = "South America 1";

    this.mapCode = "south_america";

    this.level = mlWorld;

    this.items = ["BR","CO","AR","VE","PE","CL","EC","BO","PY","UY"]; 

    return;
  }

  if (this.code == "south_america_2") {

    this.name = "South America by population (11 - 15)"

    this.shortName = "South America 2";

    this.mapCode = "south_america";

    this.level = mlContinent;

    this.items = ["GY","SR","GF","FK","TT"]; 

    return;
  }

  //Top 7 largest population (OCEANIA)

  if (this.code == "ttp_oceania" || this.code == "oceania_1") {

    this.type = "introAndQuiz";

    this.name = "Top Seven Oceania";

    this.congratsName = "The Seven Largest Nations In Oceania";

    this.mapCode = "oceania";

    this.shortName = "Oceania 1";

    this.level = mlWorld;

    this.items = ["AU","PG","NZ","FJ","SB","VU","NC"]; 

    return;
  }

  //persian gulf

  if (this.code == "pg") {

  	this.name = "Persian Gulf";

    this.congratsName = "The Persian Gulf Nations";

    this.level = mlWorld;

  	this.items = ["IL", "IR", "IQ", "EG", "LY", "SA", "SY", "JO", "KW","OM", "YE", "AE", "QA", "PS"]; 

  	return;
  }

  var _arr = [];

  if (this.code == "all") {

  	this.name = "Earth";

    this.congratsName = "The Nations Of Earth";

    this.level = mlWorld;

  }
  else {

  	//otherwise, either a continent or a region

    if (Mission.isFullContinentMission( _code ) ) {

      this.level = mlContinent;
    }
    else {

      this.level = mlRegion;
    }

  	
    this.mapCode = _code;

    //make an array of all the regions for this continent  (continent code is the z field)

  	if (this.level == mlContinent) {

        _arr = db.ghR.find( { z: _code }).fetch();

        //get the continent rec and set the name of the mission

      	var rec = db.getContinentRec( _code );

  	     this.name = rec.n;
    }

    if (this.level == mlRegion) {

        _arr = db.ghC.find( { r: _code }).fetch();

        //get the continent rec and set the name of the mission

        var rec = db.getRegionRec( _code );

         this.name = rec.n;
    }    

    //set the congrats name

    this.congratsName = this.name;

    //the map variables are set in user.assign (called by hack.startNew() )

  }

  //Now make an array of just the region codes for this mission

  var regions = [];

  if (this.level == mlContinent) {

    regions = Database.makeSingleElementArray( _arr, "c");

  }
  else {

    regions.push(_code);
  }


  //And make an array of all the countries

  var countries = db.ghC.find().fetch();


  //for the whole earth mission, we just use all the countries from the above query

  if (this.code == "all")  {

    this.items = Database.makeSingleElementArray( countries, "c" );

    return;
  }

  //Now loop thru the countries and any of them that have a region code that's in our array get added

  for (var i = 0; i < countries.length; i++) {

    if ( regions.indexOf( countries[i].r ) != -1) this.items.push( countries[i].c );
  } 

}

Mission.isFullContinentMission = function( _code) {

    var continents = ["africa","asia","europe","north_america","south_america","oceania"];

  if (continents.indexOf( _code ) == -1) return false;

  return true; 
}

Mission.getElapsedTime = function() {

    return parseInt( (Date.now() - mission.start) / 1000 );
};

Mission.addThisLesson = function( _code, _pro ) {

   var _len = LessonFactory[ _code ].length;

   var _arr = [];

  for (var i = 0; i < _len; i++) {

    _arr.push(0.0);
  }  

  var _propName = "l_" + _code;

  _pro[ _propName ] = _arr;
}

Mission.updateAll = function( _user ) {

    var _arrAssign = _user.assigns;

    var _mission = new Mission();

    var _assign = null;

    var _customList = _mission.customList;

    var  _arr = db.ghZ.find().fetch();

    var _arrContinents = Database.makeSingleElementArray( _arr, "c"); 

    //concatenate custom list with continents

    var _list = _customList.concat( _arrContinents );

    //Concatentate regions when we have those missions   

    _arr = db.ghR.find().fetch();

    var _arrRegions = Database.makeSingleElementArray( _arr, "c"); 

    _list = _customList.concat( _arrRegions );

    var _completions = 0;


    //loop thru the mission codes

     for (var i = 0; i < _list.length; i++) {

       var _code = _list[i];

        var _index = _user.findAssignIndex( _code );

        //brand-new mission, does not exist in user's assigns array

        if ( _index == -1 ) {

            _user.addNewAssign( _code );

            //brand new, so bump it to the front

            _user.bumpAssign( _code )

            continue;
        }
        else {  //an existing mission

           _assign = _user.assigns[ _index ];

           if ( _assign.hacked.length == 0 )  {  //i.e., if the mission hasn't been started

              var _completions = _assign.completions;
 
              //remove it, then re-create it

              _user.assigns.splice( _index, 1);

              _user.addNewAssign( _code, _completions );

              //delete it and then splice it in at correct index

              _assign = _user.assigns.pop();

               _user.assigns.splice( _index, 0, _assign);             

              continue;              
           }
           else {  //an existing mission that is in progress

               _assign = _user.assigns[ _index ];

               //compare the countries in the mission with what is already in the assign

               _mission = new Mission( _code );

               var _pool = _assign.pool.concat( _assign.hacked );

               for (var j = 0; j < _mission.items.length; j++) {


                  if ( _pool.indexOf( _mission.items[j] ) == -1 ) _assign.pool.push( _mission.items[j] );


               }

               _assign.name = _mission.name;

           }  //end else if pool or hacked is zero

        } //end else if mission wasn't found

     } //end looping thru custom list

     db.updateUserHacks();

} //end Mission.updateAll()











































