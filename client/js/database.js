

Database = function() {

  var res = null;

  this.storiesInitialized = false;

  //************************************************************
  //          COLLECTIONS
  //************************************************************

  this.initCore = function() {

    this.ghZ = new Meteor.Collection('alContinent');   //n = name, c = code

    this.ghR = new Meteor.Collection('alRegion');     //n = name, c = code, z = continent code

    this.ghC = new Meteor.Collection('alCountry');    //n = name, c = code, r = region code

    this.ghMusic = new Meteor.Collection('ghMusic');

    this.ghEvent = new Meteor.Collection('ghEvent');

    this.ghSea = new Meteor.Collection('ghSea');

  }

  this.initControls = function() {

    this.ghText = new Meteor.Collection('alText');    

    this.ghImage = new Meteor.Collection('ghImage');

    this.ghSound = new Meteor.Collection('ghSound');   

    this.ghVideo = new Meteor.Collection('ghVideo');

    this.ghWeb = new Meteor.Collection('ghWeb');

    this.ghMeme = new Meteor.Collection('alDebrief');

    this.ghTag = new Meteor.Collection("ghTag");

    this.ghUser = new Meteor.Collection("ghUser");

  }

  this.initStories = function() {

    this.storiesInitialized = true;

    this.ghStory = new Meteor.Collection("ghStory");

    this.ghLocation = new Meteor.Collection("ghLocation");

    this.ghScene = new Meteor.Collection("ghScene");

    this.ghChar = new Meteor.Collection("ghChar");

    this.ghToken = new Meteor.Collection("ghToken");

    this.ghStoryAgent = new Meteor.Collection("ghStoryAgent");

    this.ghStoryFlag = new Meteor.Collection("ghStoryFlag");

    this.ghCue = new Meteor.Collection("ghCue");

    this.ghChat = new Meteor.Collection("ghChat");

    this.ghStorySound = new Meteor.Collection("ghStorySound");
  }

  //************************************************************
  //          USER FUNCTIONS
  //************************************************************

  this.clearUsers = function() {

    Meteor.logout();

    Meteor.call("clearUsers");
  }

  this.updateUserHacks = function() {


      Meteor.users.update( { _id: Meteor.user()._id }, { $set: { 

        'profile.a': game.user.assigns, 

        'profile.c': game.user.assignCode, 
        
        'profile.h': game.user.getAtlasDataObject(),

        'profile.ag': game.user.profile.ag 

        } 
      
      }, function() { game.user.profile = Meteor.user().profile; }

      
      );
  }

  this.updateUserBio = function() {

   var res =  Meteor.users.update( {_id: Meteor.userId() }, { $set: 

      {
       'profile.t': $("#editBioText").val(),

       'profile.p': $(".imgBioFeaturedPic").attr("src"), 

       'profile.av': $(".imgBioAvatar").attr("src"),

       'profile.f': $(".imgBioFlag").attr("src"),

       'profile.pt': $("#editBioFeaturedPicText").val()

     }

   }, function() { stopSpinner(); } 

   ); 
}

this.updateUserStatus = function(_userID, _status, _lastSeen) {

  var _date = new Date( _lastSeen );

   var res =  Meteor.users.update( {_id: _userID }, { $set: 

     {

       'profile.sn': _date,

       'profile.st': _status

     }

   }); 
}

this.updateUserLastSeen = function(_userID, _lastSeen) {

  var _date = new Date( _lastSeen );

   var res =  Meteor.users.update( {_id: _userID }, { $set: 

     {

       'profile.sn': _date

     }

   }); 
}

this.updateUserLastNewsDate = function(_userID, _lastDate) {

  var _date = new Date( _lastDate );

   var res =  Meteor.users.update( {_id: _userID }, { $set: 

     {

       'profile.nsn': _lastDate

     }

   }); 
}

this.updateUserBadgeCount = function() {

   var res =  Meteor.users.update( {_id: Meteor.userId() }, { $set: 

      {
       'profile.ge': game.user.profile.ge,

       'profile.ex': game.user.profile.ex, 

       'profile.sp': game.user.profile.sp, 

       'profile.sc': game.user.profile.sc, 

       'profile.in': game.user.profile.in, 

       'profile.ft': game.user.profile.ft, 
     }

   }); 

}


this.updateUserLessons = function() {

   var res =  Meteor.users.update( {_id: Meteor.userId() }, { $set: 

      {
       'profile.lesson': game.user.profile.lesson
      }

   }); 

}



  //************************************************************
  //          RANDOMIZED DATA FUNCTIONS
  //************************************************************


  this.getRandomRec = function(collection) {

      var count = collection.find( {} ).count();

      var num = Math.floor( Math.random()*count );

      var arr = collection.find().fetch();

      var rec = arr[num];

      return rec;

  }

  this.getRandomCountryRec = function() {

      var count = this.ghC.find( {} ).count();

      var num = Math.floor( Math.random()*count );

      var arr = this.ghC.find( { } ).fetch();

      var rec = arr[num];

      //console.log(rec.n);

      return rec;

    }


    this.getRandomCountryRecForUser = function(_user) {

      var _code =  Database.getRandomElement( _user.assign.pool );

      var rec = this.ghC.findOne( { c: _code } );

      //Make sure this country didn't get deleted after the mission was created (Svalbard, e.g.)

      if (!rec) {

         //remove it

c("db is removing record for " + _code + " in the current mission.")

         var _index = _user.assign.pool.indexOf( _code );

         _user.assign.pool.splice( _index, 1);

         db.updateUserHacks();

         if ( _user.assign.pool.length ) {

            return ( this.getRandomCountryRecForUser( _user) );
         }
         else {

            alert("A problem was found with the data for your mission.  Please restart the game to continue.");

            return null;
         }
         
      }

      return rec;
    }

  //************************************************************
  //          PARAMETERIZED GET FUNCTIONS
  //************************************************************

  this.getCapitalName = function( _code ) {

      try {

        var f = db.ghText.findOne( { cc: _code, dt: "cap" } ).f;
      }
      catch(err) {

        showMessage("No capital name found for " + this.getCountryName( _code ) );

        return "";
      }

      return f;
  }

  this.getCapitalPic = function(_code) {

      try {

        var u = db.ghImage.findOne( { cc: _code, dt: "cap" } ).u;
      }
      catch(err) {

        showMessage("No capital picture found for " + this.getCountryName( _code ) );

        return "";
      }

      return u;
  }

  this.getContinentCodeForCountry = function (_code) {

    var recCountry = this.getCountryRec(_code);

    var recRegion = this.getRegionRec(recCountry.r);

    return recRegion.z;
  }

  this.getContinentCodeForRegion = function( _code) {

    var recRegion = this.getRegionRec(_code);    

    return recRegion.z;
  }

  this.getContinentRec = function(_code) {

    return ( this.ghZ.findOne( { c: _code } ) );
  }

  this.getContinentName = function( _code) {

    return ( this.getContinentRec( _code ).n );
  }

  this.getCountryID = function(_code) {

       return this.getCountryRec( _code)._id;
  }

  this.getCountryRec = function(_code) {

    return ( this.ghC.findOne( { c: _code } ) );
  }

  this.getCountryIDByCode = function(_code) {

    return ( this.ghC.findOne( { c: _code } )._id );
  }

  this.getCountryCodeByID = function( id ) {

    return ( this.ghC.findOne( { _id: id } ).c );
  }

  this.getCountryRecByID = function(id) {

    return ( this.ghC.findOne( { _id: id } ) );
  }

  this.getCountryName = function(_code) {

      try {

        var n = this.getCountryRec( _code ).n;
      }
      catch(err) {

        showMessage("No country name found for " +  _code );

        return "";
      }

      return n;
  }

  this.getCountryNameByID = function(id) {

    return ( this.getCountryRecByID( id ).n );
  }

  this.getDataFlagForCountry = function(_code) {

     var rec = this.getCountryRec( _code);

     if (rec.d == 1) return true;

     return false;

  }

  this.getFlagPicByID = function(_countryID) {

    var _code = this.getCountryRecByID(_countryID).c;

    if (typeof db.ghImage.findOne( { cc: _code, dt: "flg" } ) !== 'undefined') {

      return db.ghImage.findOne( { cc: _code, dt: "flg" } ).u;
    }
    else {

      showMessage("No flag pic found for " + this.getCountryName( _code ));

      return _code;
    }
  }

  this.getFlagPicByCode = function(_code) {

    if (typeof db.ghImage.findOne( { cc: _code, dt: "flg" } ) !== 'undefined') {

      return db.ghImage.findOne( { cc: _code, dt: "flg" } ).u;
    }
    else {

      showMessage("No flag pic found for " + this.getCountryName( _code ));

      return _code;
    }
  }

  this.getLeaderName = function( _code ) {

    if (typeof db.ghText.findOne( { cc: _code, dt: "ldr" } ) !== 'undefined') {

      return db.ghText.findOne( { cc: _code, dt: "ldr" } ).f;
    }
    else {

      showMessage("No leader name found for " + this.getCountryName( _code ));

      return _code;
    }
  }

  this.getLeaderPic = function( _code ) {

    if (typeof db.ghImage.findOne( { cc: _code, dt: "ldr" } ) !== 'undefined') {

      return db.ghImage.findOne( { cc: _code, dt: "ldr" } ).u;
    }
    else {

      showMessage("No leader pic found for " + this.getCountryName( _code ));

      return _code;
    }
  }


  this.getRegionRec = function(_code) {

    return ( this.ghR.findOne( { c: _code } ) );
  }

  this.getRegionName = function( _code) {

    return ( this.getRegionRec( _code ).n );
  }

  this.getRegionCodeForCountry = function (_code) {

    var recCountry = this.getCountryRec(_code);

    return recCountry.r;
  }

  this.getRegionRecForCountry = function( _code ) {

    var recCountry = this.getCountryRec(_code);

    return this.getRegionRec( recCountry.r );
  }

  this.getTagText = function( _tag, _cc ) {

    if (!_cc.length) return;

    if (_tag.dt == "agt") {
      showMessage("agt tag not yet supported by getTagText in database.js");
      return;
    }

      if (_tag.dt == "ldr") return this.getLeaderName( _cc );

      if (_tag.dt == "flg") return "Flag of " + this.getCountryName( _cc );

      var _rec = db.ghText.findOne( { cc: _cc, dt: _tag.dt } );  
      
      if (typeof _rec !== 'undefined') {

         return _rec.f;
      }  

      console.log("Couldn't find tag text for " +  this.getCountryName( _cc ) + " with dt = " + _tag.dt);

      return "";
  }

  this.getTagURL = function( _tag, _cc ) {
    
    if (!_cc.length) return;

    if (_tag.dt == "agt") {
      showMessage("agt tag not yet supported by getTagURL in database.js");
      return;
    }

      var _rec = db.ghTag.findOne( { cc: _cc, dt: _tag.dt } );  
      
      if (typeof _rec !== 'undefined') {

         return _rec.u;
      }  

      console.log("Couldn't find a URL for " +  this.getCountryName( _cc ) + " with dt = " + _tag.dt);

      return "";
  }

  //************************************************************
  //          CONTROL TYPE < > MONGO COLLECTION 
  //************************************************************

  //This has an identical (hopefully) twin in ghServer.js

  //Can we incorporate this into the pseudo-database object on the server  (userOptions.js)?
  

  this.getCollectionForType = function(_type) {

    var col = null;

    //area "controls"

    if (_type == cCountry) col = this.ghC;

    if (_type == cRegion) col = this.ghR;

    if (_type == cContinent) col = this.ghZ;

    if (_type == cSea) col = ghSea;

    //data controls

    if (_type == cMap) col = this.ghMap;

    if (_type == cSound) col = this.ghSound;

    if (_type == cImage) col = this.ghImage; 

    if (_type == cVideo) col = this.ghVideo;

    if (_type == cWeb) col = this.ghWeb;

    if (_type == cText) col = this.ghText;

    if (_type == cDebrief) col = this.ghMeme;

    if (_type == cMeme) col = this.ghMeme;

    if (_type == cStory) col = this.ghStory;

    if (_type == cLocation) col = this.ghLocation;

    if (_type == cToken) col = this.ghToken;

    if (_type == cChar) col = this.ghChar;

    if (_type == cStoryFlag) col = this.ghStoryFlag;

    if (_type == cStoryAgent) col = this.ghStoryAgent;

    if (_type == cCue) col = this.ghCue;

    if (_type == cChat) col = this.ghChat;

    if (_type == cStorySound) col = this.ghStorySound;

    return col;
  }


  this.getCollectionForName = function(_name) {

    var col = null;

    //area "controls"

    if (_name == "COUNTRY") col = this.ghC;

    if (_name == "REGION") col = this.ghR;

    if (_name == "CONTINENT") col = this.ghZ;

    //data controls

    if (_name == "MAP") col = this.ghMap;

    if (_name == "SOUND") col = this.ghSound;

    if (_name == "IMAGE") col = this.ghImage; 

    if (_name == "VIDEO") col = this.ghVideo;

    if (_name == "WEB") col = this.ghWeb;

    if (_name == "TEXT") col = this.ghText;

    if (_name == "DEBRIEF") col = this.ghMeme;

    if (_name == "MEME") col = this.ghMeme;

    return col;
  }


  //************************************************************
  //          DATABASE UPDATES
  //************************************************************

this.addRecord = function( _countryCode, _type, cb) {

  Meteor.call("addRecord", _countryCode, _type, function(error, result){

    if (error) showMessage(error.reason);

    cb(error, result);

  });
}

this.updateRecord2 = function (_type, field, ID, value, cb) {

    Meteor.call("updateRecordOnServer", field, _type, ID, value, function(error, result){

      stopSpinner();

      if (error) showMessage(error.reason);

      if (cb) cb(error, result);
  });
}

  // "#a.b"   a=rec id, b = fieldname (stored as class)

  this.updateRecord = function( arrField, _type, ID ) {

    if (_type && ID) {

      var res = null;

      var col = this.getCollectionForType( _type );

      var sel = "#" + ID + ".";
      
      for (var i = 0; i < arrField.length; i++) {

        var selField = sel + arrField[i];

        var value = $(selField).val();

        if ( arrField[i] == "dt" ) value = editor.getDTValue( ID );

        if (value != undefined) {

          Meteor.call("updateRecordOnServer", arrField[i], _type, ID, value, function( err, res) {

              stopSpinner();

              if (err) console.log(err);
          });

        }

        
      } //end looping thru fields

    }  //end if we have a control type and a record id

  }  //end updateRecord

  // "#a.b"   a=rec id, b = fieldname (stored as class)

  this.updateContentRecord = function( arrField, _dt, _type, _id, _countryCode ) {

    if (_type && _id) {

      var data = {};

      var sel = "#" + _id + ".";
      
      for (var i = 0; i < arrField.length; i++) {

          var selField = sel + arrField[i];

          value = $(selField).val();

          //for the dt field, we have to translate from the text version of the code to the short (typically 3-letter) code

          if (arrField[i] == "dt")  value = editor.arrCode[ editor.arrCodeText.indexOf( value ) ];

          data[ arrField[i] ] = value;
        
      } //end looping thru fields

      //add the debrief type

      data[ "dt"] = _dt;

      //we have to replace all the fields, b/c a content update
      //creates a whole new file

      data["cc"] = _countryCode;

      Meteor.call("updateRecordOnServerWithDataObject", _type, _id, data, function( err, res) {

              stopSpinner();

              if (err) console.log(err);
      });

    }  //end if _type and ID

  }//end updateContentRecord

} //end database constructor

//****************************************
//  Static functions
//****************************************

Database.getChiefID = function() {

  var _id = Meteor.users.findOne( { username: "Mac Sea" } )._id;

  var ID = [];

  ID.push( _id );

  return ID;

}

Database.getChiefRec = function() {

  return Meteor.users.findOne( { username: "Mac Sea" } );

}

Database.getIndexWithNValue = function(_val, _arr) {

      for (var i = 0; i < _arr.length; i++) {

        if (_arr[i].n == _val) return i;
      }

      return -1;
}

//***********************************************************************
//        Array-related
//***********************************************************************

Database.getIndexForCountryCode = function( _code )   {

      var _arr = db.ghC.find( {}, {sort: {n: 1} } ).fetch();

      var _index = -1;

      for (var i = 0; i < _arr.length; i++) {

        if (_arr[i].c == _code) {

          _index = i;

          break;
        }
      }

      return _index;
}

Database.getCountryCodeForIndex = function( _index ) {

      var _arr = db.ghC.find( {}, {sort: {n: 1} } ).fetch();

      return  _arr[_index].c;    
}

Database.getRandomElement = function(arr) {

    var count = arr.length;

    var num = Math.floor( Math.random()*count );

    var ele = arr[num];

    return ele;
  }

//will return from zero up to limit - 1

Database.getRandomValue = function( _limit ) {

    return ( Math.floor( Math.random() * _limit ) );
}

Database.getRandomFromRange = function(min, max) {
  
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

Database.shuffle = function(array) {
  
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

Database.removeIfFieldValueEquals = function( _arr, _field, _val) {

    var _obj = null;

     for (var i = 0; i < _arr.length; i++) {

          _obj = _arr[i];

          if ( _obj[ _field ] == _val) {

            _arr.splice( i, 1);   

            i--;

          }  

      } 

      return _arr;
}


Database.makeSingleElementArray = function( _arr, _field) {

  var arr = [];

  for (var i = 0; i < _arr.length; i++) {

    arr.push( _arr[i][ _field ] );
  }

  return arr;
}


Database.getObjectIndexWithValue = function( _arr, _field, _val) {

    var _obj = null;

     for (var i = 0; i < _arr.length; i++) {

          _obj = _arr[i];

          if ( _obj[ _field ] == _val) return i;    
      } 

      return -1;
}

Database.getObjectsWithValue = function( _arr, _field, _val) {

    var _out = [];

    var _obj = null;

     for (var i = 0; i < _arr.length; i++) {

          _obj = _arr[i];

          if ( _obj[ _field ] == _val) _out.push( _obj) 
      } 

      return _out;
}


Database.getObjectIndexWithValueAdjacent = function( _arr, _field, _val, _offset) {

    var _obj = null;

     for (var i = 0; i < _arr.length; i++) {

          _obj = _arr[i];

          if ( _obj[ _field ] == _val) {

            //check the edge cases

            if (_offset == -1 && i == 0) return -1;

            if (_offset == 1 && i == _arr.length - 1) return -1;           

            return i + _offset; 
          }   
      } 

      return -1;
}


Database.getCountryCodes = function(_code) {     

      var _arr = [];

      var _arrOut = [];

      var _type = "none";

      //Is the code a continent?
      var _rec = db.ghZ.findOne( { c: _code } );

      if (_rec) _type = "continent";

      if (!_rec) {

        //is it a region?

         _rec = db.ghR.findOne( { c: _code } );

         if (_rec) _type = "region";

         //neither region nor continent, so it must be custom

          if (!_rec) return mission.items;
      }

      if (_type == "none") {

          showMessage("Code passed to getCountryCodes not recognized: " + _code);

          return;
      } 


      if ( _type == "region" ) {

          _arrOut = db.ghC.find( { r: _code } ).fetch();
      }

      else {

          _arr = db.ghR.find( { z: _code } ).fetch();

          for (var i = 0; i < _arr.length; i++) {

              var _regionCode = _arr[i].c;

              var _arrCountry = db.ghC.find( { r: _regionCode} ).fetch();

              for (var j = 0; j < _arrCountry.length; j++) {

                  _arrOut.push( _arrCountry[j] );
              }
          }
      }

      return makeSingleElementArray(_arrOut, "c");
}

Database.registerEvent = function( _type, _userID, _param ) {

c("registering event type: " + _type + " with param: " + _param);

  Meteor.call("registerEvent", _type, _userID, _param, Date.now(), game.user.name );
}
