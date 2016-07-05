


Mission = function(_code) {

  this.status = msNone;
	
  this.level = mlNone;

  this.code = _code;  //either a continent code, region code, or arbitrary string 
                      //like one of the custom mission codes (below)

  this.mapCode = null;

  this.name = "0";

  this.customList = ["ttp", "ttp_africa", "pg", "all"];

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

Mission.updateAll = function( _userID ) {

    var _arrAssign = Meteor.users.findOne( { _id: _userID } ).profile.a;

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

        var _index = game.user.findAssignIndex( _code );

        //brand-new mission, does not exist in user's assigns array

        if ( _index == -1 ) {

            game.user.addNewAssign( _code );

            //brand new, so bump it to the front

            game.user.bumpAssign( _code )

            continue;
        }
        else {  //an existing mission

           _assign = game.user.assigns[ _index ];

           if ( _assign.hacked.length == 0 || _assign.pool.length == 0 )  {  //i.e., if the mission hasn't been started or is completely done

              var _completions = _assign.completions;

              //remove it, then re-create it

              game.user.assigns.splice( _index, 1);

              game.user.addNewAssign( _code, _completions );

              //delete it and then splice it in at correct index

              _assign = game.user.assigns.pop();

               game.user.assigns.splice( _index, 0, _assign);             

              continue;              
           }
           else {  //an existing mission that is in progress

               _assign = game.user.assigns[ _index ];

               //compare the countries in the mission with what is already in the assign

               _mission = new Mission( _code );

               var _pool = _assign.pool.concat( _assign.hacked );

               for (var j = 0; j < _mission.items.length; j++) {


                  if ( _pool.indexOf( _mission.items[j] ) == -1 ) _assign.pool.push( _mission.items[j] );


               }

           }  //end else if pool or hacked is zero

        } //end else if mission wasn't found

     } //end looping thru custom list

} //end Mission.updateAll()










































