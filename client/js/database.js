

Database = function() {

  var res = null;
/*
  this.publicStore = new FS.Store.S3("publicStore");

  this.ghAvatar = new FS.Collection("ghAvatar", {
      stores: [ this.publicStore ]
  });
*/
  //************************************************************
  //          COLLECTIONS
  //************************************************************

  this.initCore = function() {

    this.ghZ = new Meteor.Collection('alContinent');   //n = name, c = code

    this.ghR = new Meteor.Collection('alRegion');     //n = name, c = code, z = continent code

    this.ghC = new Meteor.Collection('alCountry');    //n = name, c = code, r = region code

  }

  this.initControls = function() {

    this.ghText = new Meteor.Collection('alText');    

    this.ghImage = new Meteor.Collection('ghImage');

    this.ghSound = new Meteor.Collection('ghSound');   

    this.ghVideo = new Meteor.Collection('ghVideo');

    this.ghWeb = new Meteor.Collection('ghWeb');

    this.ghMap = new Meteor.Collection('alMap');

    this.ghDebrief = new Meteor.Collection('alDebrief');

    this.ghTag = new Meteor.Collection("ghTag");

    this.ghUser = new Meteor.Collection("ghUser");

  }

  //************************************************************
  //          USER FUNCTIONS
  //************************************************************

  this.clearUsers = function() {

    Meteor.logout();

    Meteor.call("clearUsers");
  }

  /*User profile fields:

  The default / initial values are in login.js.  

  //hacking stuff 
  //see user.js, assignTicketAndTag.js, game.js ( .createGHUser() ) for details

  a = assigns (object array -- assigns)
  c = assign code (current mission)
  h = atlas (object array -- tickets)

  //badge stuff  (all integers, most are arrays [gold, silver, bronze])
  // see badge.js for details
  ge = genius 
  ex = expert
  sp = speed
  in = investigator
  sc = scholar
  ft = first time

  //bio stuff
  //see bio.html and bio.js for details
  t = text
  p = picture
  pt = picture text
  av = avatar or photo  //widely used in the code; bio, template_helpers, newNav, userDirectory
  f = flag pic
  cn = country name
  cc = country code  //essentially read-only, created when user is first created
                     //but reader has no way to edit this value (or cn's value, either)
                     //so these two not included in updates currently
  */


  this.updateUserHacks = function() {

      Meteor.users.update( { _id: Meteor.user()._id }, { $set: { 

        'profile.a': game.user.assigns, 

        'profile.c': game.user.assignCode, 
        
        'profile.h': game.user.getAtlasDataObject() 

        } } 
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

   }); 
}

  this.updateUserStatus = function(_userID, _status) {

   var res =  Meteor.users.update( {_id: _userID }, { $set: 

     {
       'profile.st': _status,

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

this.saveScroll = function(_val) {

  game.user.scroll = _val;

  Meteor.users.update( {_id: Meteor.userId() }, { $set: { 'profile.s': _val}  }); 

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


  //Use the d field to select on the collection so that we only get countries with data in it

  this.getRandomCountryRec = function() {

      var count = this.ghC.find( { d: 1 } ).count();

      var num = Math.floor( Math.random()*count );

      var arr = this.ghC.find( { d: 1 } ).fetch();

      var rec = arr[num];

      //console.log(rec.n);

      return rec;

    }


    this.getRandomCountryRecForUser = function(_user) {

      var _code =  Database.getRandomElement( _user.assign.pool );

      var rec = this.ghC.findOne( { c: _code } );

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

    var recRegion = this.getRegionRec(recCountry.r);    

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

    return ( this.getCountryRec( _code ).n );
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

      showMessage("No flag pic found for " + this.getCountryName( _codec ));

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

  this.getMapRecIndex = function(_which) {

      for (var i = 0; i < display.ctl["MAP"].items.length; i++) {

        if (display.ctl["MAP"].items[i].f == _which) return i;
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

  this.getCollectionForType = function(_type) {

    var col = null;

    //area "controls"

    if (_type == cCountry) col = this.ghC;

    if (_type == cRegion) col = this.ghR;

    if (_type == cContinent) col = this.ghZ;

    //data controls

    if (_type == cMap) col = this.ghMap;

    if (_type == cSound) col = this.ghSound;

    if (_type == cImage) col = this.ghImage; 

    if (_type == cVideo) col = this.ghVideo;

    if (_type == cWeb) col = this.ghWeb;

    if (_type == cText) col = this.ghText;

    if (_type == cDebrief) col = this.ghDebrief;

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

    if (_name == "DEBRIEF") col = this.ghDebrief;

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

      stopWait();

      if (error) showMessage(error.reason);

      cb(error, result);
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

        //for a checkbox, we look at 'checked' property
        //otherwise we just use the val() function

        var value = undefined;

        if ( arrField[i] == "d") {

          if ( $(selField).prop('checked') ) {

            value = 1;
          }
          else {

            value = 0;
          }
        }
        else {

          value = $(selField).val();
        }

        if (value != undefined) {

          Meteor.call("updateRecordOnServer", arrField[i], _type, ID, value, function( err, res) {

              stopWait();

              if (err) console.log(err);
          });

        }

        
      } //end looping thru fields

    }  //end if we have a control type and a record id

  }  //end updateRecord

  // "#a.b"   a=rec id, b = fieldname (stored as class)

  this.updateContentRecord = function( arrField, _type, _id, _countryCode ) {

    if (_type && _id) {

      var data = {};

      var sel = "#" + _id + ".";
      
      for (var i = 0; i < arrField.length; i++) {

          var selField = sel + arrField[i];

          value = $(selField).val();

          data[ arrField[i] ] = value;
        
      } //end looping thru fields

      //we have to replace all the fields, b/c a content update
      //creates a whole new file

      data["cc"] = _countryCode;

      Meteor.call("updateRecordOnServerWithDataObject", _type, _id, data, function( err, res) {

              stopWait();

              if (err) console.log(err);
      });

    }  //end if _type and ID

  }//end updateContentRecord

} //end database constructor

//****************************************
//  Static functions
//****************************************

Database.getIndexWithNValue = function(_val, _arr) {

      for (var i = 0; i < _arr.length; i++) {

        if (_arr[i].n == _val) return i;
      }

      return -1;
}

//***********************************************************************
//        Array-related
//***********************************************************************

Database.getRandomElement = function(arr) {

    var count = arr.length;

    var num = Math.floor( Math.random()*count );

    var ele = arr[num];

    return ele;
  }

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


Database.makeSingleElementArray = function( _arr, _field) {

  var arr = [];

  for (var i = 0; i < _arr.length; i++) {

    arr.push( _arr[i][ _field ] );
  }

  return arr;

}


