


Mission = function(_code) {

  this.status = msNone;
	
  this.level = mlNone;

  this.code = _code;  //either a continent code, region code, or arbitrary string 
                      //like one of the custom mission codes (below)

  this.mapCode = null;

  this.name = "0";

  this.customList = ["ttp", "ttp_africa","ttp_asia","ttp_europe","ttp_americas","pg", "all"];

  this.items = [];

  //if we are only creating the mission object, but not initing it to a specific mission
  //then we're done

  if (_code === undefined) return;


  //custom "ad-hoc" missions

  //ten largest population (earth)

  if (this.code == "ttp") {

  	this.name = "Top Ten Earth"

    this.items = ["CN", "BD", "IN", "JP", "ID", "NG", "BR", "PK", "RU","US"]; 

    return;
  }

  //ten largest population (Africa)

  if (this.code == "ttp_africa") {

    this.name = "Top Ten Africa";

    this.mapCode = "africa";

    this.level = mlContinent;

    this.items = ["NG", "ET", "EG", "CD", "TZ", "ZA", "KE", "DZ", "SD", "UG"]; 

    return;
  }

  //ten largest population (Asia)

  if (this.code == "ttp_asia") {

    this.name = "Top Ten Asia";

    this.mapCode = "asia";

    this.level = mlContinent;

    this.items = ["CN","IN","ID","PK","BD","RU","JP","PH","VN","IR"]; 

    return;
  }

  //ten largest population (Europe)

  if (this.code == "ttp_europe") {

    this.name = "Top Ten Europe";

    this.mapCode = "europe";

    this.level = mlContinent;

    this.items = ["DE","FR","GB","IT","ES","UA","PL","RO","NL","BE"]; 

    return;
  }

  //ten largest population (AMERICAS)

  if (this.code == "ttp_americas") {

    this.name = "Top Ten America";

    this.level = mlWorld;

    this.items = ["US","BR","MX","CO","AR","CA","PE","VE","CL","EC"]; 

    return;
  }

  //ten largest population (NORTH AMERICA)

  if (this.code == "ttp_north_america") {

    this.name = "Top Ten North America";

    this.level = mlWorld;

    this.items = ["US","MX","CA","GT","CU","DO","HT","HN","SV","NI"]; 

    return;
  }

  //ten largest population (SOUTH AMERICA)

  if (this.code == "ttp_south_america") {

    this.name = "Top Ten South America";

    this.level = mlWorld;

    this.items = ["BR","CO","AR","VE","PE","CL","EC","BO","PY","UY"]; 

    return;
  }

  //Top 7 largest population (OCEANIA)

  if (this.code == "ttp_oceania") {

    this.name = "Top Seven Oceania";

    this.level = mlWorld;

    this.items = ["AU","PG","NZ","FJ","SB","VU","NC"]; 

    return;
  }

  //persian gulf

  if (this.code == "pg") {

  	this.name = "Persian Gulf";

    this.level = mlWorld;

  	this.items = ["IL", "IR", "IQ", "EG", "LY", "SA", "SY", "JO", "KW","OM", "YE", "AE", "QA", "PS"]; 

  	return;
  }

  var _arr = [];

  if (this.code == "all") {

  	this.name = "Earth";

    this.level = mlWorld;

    _arr = db.ghR.find().fetch();

  }
  else {

  	//otherwise, currently assumed to be a continent mission

  	//(Later, we'll need to test the code against an array of the continent codes,
  	//if found, then proceed as below, if not, assume it to be a region code, and proceed accordingly

  	this.level = mlContinent;

    this.mapCode = _code;

    //make an array of all the regions for this continent  (continent code is the z field)

  	_arr = db.ghR.find( { z: _code }).fetch();

    //get the continent rec and set the name of the mission

  	var rec = db.getContinentRec( _code );

  	this.name = rec.n;

    //the map variables are set in user.assign (called by hack.startNew() )
  }

  //Now make an array of just the region codes for this mission

  var regions = Database.makeSingleElementArray( _arr, "c");

  //And make an array of all the countries with data

  var countries = db.ghC.find( {d: 1} ).fetch();


  //Now loop thru the countries and any of them that have a region code that's in our array get added

  for (var i = 0; i < countries.length; i++) {

    if ( regions.indexOf( countries[i].r ) != -1) this.items.push( countries[i].c );
  }  

}

Mission.updateAll = function( _user ) {

    var _arrAssign = _user.profile.a;

    var _mission = new Mission();

    var _assign = null;

    var _customList = _mission.customList;

    var  _arr = db.ghZ.find().fetch();

    var _arrContinents = Database.makeSingleElementArray( _arr, "c"); 

    //concatenate custom list with continents

    var _list = _customList.concat( _arrContinents );

    //LATER: also concatentate regions when we have those missions   

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

} //end Mission.updateAll()










































