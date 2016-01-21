

Database = function() {

  var res = null;

  this.publicStore = new FS.Store.S3("publicStore");

  this.ghPublicImage = new FS.Collection("ghPublicImage", {
      stores: [ this.publicStore ]
  });

  this.ghPublicSound = new FS.Collection("ghPublicSound", {
      stores: [ this.publicStore ]
  });

    this.ghPublicVideo = new FS.Collection("ghPublicVideo", {
      stores: [ this.publicStore ]
  });

  this.ghPublicWeb = new FS.Collection("ghPublicWeb", {
      stores: [ this.publicStore ]
  });

  this.ghAvatar = new FS.Collection("ghAvatar", {
      stores: [ this.publicStore ]
  });

  this.ghTag = new FS.Collection("ghTag", {
      stores: [ this.publicStore ]
  });

  //************************************************************
  //          COLLECTIONS
  //************************************************************

  this.initCore = function() {

    this.ghZ = new Meteor.Collection('alContinent');   //n = name, c = code

    this.ghR = new Meteor.Collection('alRegion');     //n = name, c = code, z = continent code

    this.ghC = new Meteor.Collection('alCountry');    //n = name, c = code, r = region code

  }

  this.initControls = function() {

    this.ghT = new Meteor.Collection('alText');    

    this.ghI = new Meteor.Collection('alImage');

    this.ghS = new Meteor.Collection('alSound');   

    this.ghV = new Meteor.Collection('alVideo');

    this.ghW = new Meteor.Collection('alWeb');

    this.ghD = new Meteor.Collection('alDebrief');

    this.ghM = new Meteor.Collection('alMap');

    this.ghG = new Meteor.Collection('alTag');
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

       'profile.pt': $("#editBioFeaturedPicText").val(),

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

      var rec = db.ghT.findOne( { cc: _code, dt: "cap" } );

      try {

        return rec.f;
      }
      catch(err) {

        showMessage("No capital name found for " + this.getCountryName( _code ) );

        return "";
      }
  }

  this.getCapitalPic = function(_code) {

    var rec = db.ghI.findOne( { cc: _code, dt: "cap" } );

    if (rec) return rec.f;

    rec = db.ghD.findOne( { cc: _code, dt: "cap" } );

    try {

      return rec.f;
    }
    catch(err) {

      showMessage("No capital picture found for " + this.getCountryName( _code ) );

      return "";
    }
  }

  this.getContinentRec = function(_code) {

    return ( this.ghZ.findOne( { c: _code } ) );
  }

  this.getContinentName = function( _code) {

    return ( this.getContinentRec( _code ).n );
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

  this.getContinentCodeForCountry = function (_code) {

    var recCountry = this.getCountryRec(_code);

    var recRegion = this.getRegionRec(recCountry.r);

    return recRegion.z;
  }

  this.getContinentCodeForRegion = function( _code) {

    var recRegion = this.getRegionRec(recCountry.r);    

    return recRegion.z;
  }

  this.getRegionCodeForCountry = function (_code) {

    var recCountry = this.getCountryRec(_code);

    return recCountry.r;
  }

  this.getCountryID = function(_code) {

     return this.getCountryRec( _code)._id;

  }

  this.getDataFlagForCountry = function(_code) {

     var rec = this.getCountryRec( _code);

     if (rec.d == 1) return true;

     return false;

  }

  this.getFlagPicByID = function(_countryID) {

    var _code = this.getCountryRecByID(_countryID).c;

    if (db.ghI.findOne( { cc: _code, dt: "flg" } ) != undefined) {

      return db.ghI.findOne( { cc: _code, dt: "flg" } ).f;
    }
    else {

      return _code;
    }
  }

  this.getFlagPicByCode = function(_code) {

    if (db.ghI.findOne( { cc: _code, dt: "flg" } ) != undefined) {

      return db.ghI.findOne( { cc: _code, dt: "flg" } ).f;
    }
    else {

      return _code;
    }
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

    if (_type == cMap) col = this.ghM;

if (_type == cSound) col = this.ghPublicSound;

if (_type == cImage) col = this.ghPublicImage; 

    if (_type == cVideo) col = this.ghV;

if (_type == cWeb) col = this.ghPublicWeb;

    if (_type == cText) col = this.ghT;

    if (_type == cDebrief) col = this.ghD;

    return col;
  }


  this.getCollectionForName = function(_name) {

    var col = null;

    //area "controls"

    if (_name == "COUNTRY") col = this.ghC;

    if (_name == "REGION") col = this.ghR;

    if (_name == "CONTINENT") col = this.ghZ;

    //data controls

    if (_name == "MAP") col = this.ghM;

if (_name == "SOUND") col = this.ghPublicSound;

if (_name == "IMAGE") col = this.ghPublicImage; 

    if (_name == "VIDEO") col = this.ghV;

if (_name == "WEB") col = this.ghPublicWeb;

    if (_name == "TEXT") col = this.ghT;

    if (_name == "DEBRIEF") col = this.ghD;

    return col;
  }


  //************************************************************
  //          DATABASE UPDATES
  //************************************************************

this.addRecord = function( _countryCode, _type) {

  Meteor.call("addRecord", _countryCode, _type);
}

this.addContentRecord = function( _countryCode, _type) {

  var _filter = '';


  if (_type == cImage || _type == cWeb) {

    _file = getLocalPrefix() + "dummy.png";

    _filter = 'image/*';
  }

  if (_type == cSound) {

    _file = getLocalPrefix() + "dummy.mp3";

    _filter = 'audio/mp3';
  }

  var col = this.getCollectionForType( _type );

  var _fileObj = new FS.File();

  _fileObj.attachData( _file, {type: _filter},  function(error){

    if (error) {
      console.log(error);
      return;
    }

    col.insert(_fileObj, function (err, fileObj) {

      if (err) {
        console.log(err);
        return;
      }

      col.update( {_id: fileObj._id }, { $set: { cc: _countryCode } }, function(err, res) {

         if (err) {
          console.log(err);
          return;
         }             

         if (res > 0) {

          console.log( _fileObj.original.name + "'s record was updated." );
         }
         else {

          console.log("Record wasn't found for: " + _fileObj.original.name);
         }

      });

   });   

  });

}

this.updateRecord2 = function (_type, field, ID, value) {

    Meteor.call("updateRecordOnServer", field, _type, ID, value)
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

          Meteor.call("updateRecordOnServer", arrField[i], _type, ID, value)

        }

        
      } //end looping thru fields

    }  //end if we have a control type and a record id

  }  //end updateRecord

  // "#a.b"   a=rec id, b = fieldname (stored as class)

  this.updateContentRecord = function( arrField, _type, _id, _countryCode ) {

    if (_type && _id) {

      var data = {};

      var col = this.getCollectionForType( _type );

      var sel = "#" + _id + ".";
      
      for (var i = 0; i < arrField.length; i++) {

          var selField = sel + arrField[i];

          value = $(selField).val();

          data[ arrField[i] ] = value;
        
      } //end looping thru fields

      //we have to replace all the fields, b/c a content update
      //creates a whole new file

      data["cc"] = _countryCode;

    }  //end if we have a control type and a record id

    Meteor.call("updateContentRecordOnServer", data, _type, _id)

  }  //end updateRecord

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


//****************************************
//   edit hacks
//****************************************

insertCountry = function() {

      var id = db.ghC.insert( { n: "French Southern and Antartic Lands", c: "TF", co: "#FF0000", r: "saf", xl: 0.45, yl: 0.43, lt: "Préfet"  } );
}

insertRecords = function() {

   var id = db.ghN.insert( { n: "backdropImage", f: "./3DGlobe_large.png"} );

   id = db.ghN.insert( { n: "scanningImage", f:"./atomic.gif"});

   id = db.ghN.insert( { n: "interceptImage", f:"./intercept_icon.png"});
}

updateRecords = function() {

  var res =  Meteor.users.update( {_id: Meteor.userId() }, { $set: 

      {
       'profile.t': $("#editProfileText").val(),

       'profile.p': $(".imgProfileFeaturedPic").attr("src"), 

       'profile.av': $(".imgProfileAvatar").attr("src"),

       'profile.f': $(".imgProfileFlag").attr("src"),

       'profile.cn': $("#countryNameText").text(), 

       'profile.pt': $("#editProfileFeaturedPicText").val(),

     }

   }); 
}

findImages = function() {

  var arr = db.ghD.find( {}).fetch();

      for (var i = 0; i < arr.length; i++) {

        if ( typeof arr[i].f === 'undefined') continue;

        if (arr[i].f.length) {

          c( db.getCountryName( arr[i].cc) + " -- " + arr[i].f + " -- " + arr[i].dt );
        }

      }
}

fixlc = function(_code, _val) {

  var rec = db.ghR.find( { c: _code }).fetch();

  var res = db.ghR.update( {_id: rec[0]._id }, { $set: {lc: _val}  }); 

      console.log(res + " fields updated.");
}

fixrecs2 = function() {

  var arr = db.ghR.find().fetch();

      for (var i = 0; i < arr.length; i++) {

        var id = arr[i]._id;

        db.ghR.update( {_id: id }, { $set: {lc: 0}  }); 

      }

    console.log(i + " fields updated.");
}

var arr;
var count = 0;

var _index = 0;

fixrecs = function() {

  //var arr = db.ghC.find( { d: { $exists: false } } ).fetch();

      arr = db.ghC.find().fetch();

      fixRecNow( _index );
}

fixRecNow = function( _index ) {

console.log("index = " + _index);

console.log("arr len is " + arr.length)

    if (_index == arr.length) {

return;

    }

    var res;

    var ID = arr[ _index ]._id;

    res = Meteor.call("updateRecordOnServer", "s", cCountry, ID, "0", function() { _index++; fixRecNow( _index )}); 

}

  var arrImage = [];

  var _index = -1;


uploadPublic = function() {

   //arrImage = db.ghI.find().fetch();

   //arrImage = db.ghC.find( { d: 1 } ).fetch();

   //arrImage = db.ghW.find().fetch();

   arrImage = db.ghV.find().fetch();

/*
   for (var i = 0; i < arrImage.length; i++) {

      if ( arrImage[i].f.substr(0,2) == "f@") console.log( arrImage[i].f );
   }

   c(i + " files checked")
*/

   uploadPublic5();
}

uploadPublic5 = function() {

  _index++;

  if (_index == arrImage.length) return;

  if ( arrImage[_index].f.substr(0,3) != "s3@") {

    uploadPublic5();

    return;
  }

  if ( arrImage[_index].f.substr( arrImage[_index].f.length - 4 ) != ".gif") {

    uploadPublic5();

    return;
  }  

c("seeking " + arrImage[_index].f.substring(3) )

  var rec = db.ghPublicVideo.find( { f: arrImage[_index].f.substring(3) } ).fetch();

  if (rec.length == 0) {
  console.log("can't find " + arrImage[_index].f.substring(3) + " in public video");
   return;
  }

  db.ghV.update( { _id: arrImage[_index]._id }, { $set: { f: "s3@" + rec[0]._id } }, function() {

      uploadPublic5();

  } );

}

uploadPublic4 = function() {

  _index++;

  if (_index == arrImage.length) return;

  var _file = "";

  var _name = arrImage[ _index ].f;

  if (!_name.length) {

    uploadPublic4();

    return;
  }

  if ( _name.substring(0,2) != "f@") {

    uploadPublic4();

    return;   
  }

  _name = _name.substring(2);

  console.log("trying to insert " + _name )

  var _fileObj = new FS.File();
 

  _file = getLocalPrefix() + _name;


  _fileObj.attachData( _file, {type: 'image/gif'},  function(error){

    if (error) {
      console.log(error);
      return;
    }

    db.ghPublicVideo.insert(_fileObj, function (err, fileObj) {

      if (err) {
        console.log(err);
        return;
      }

      db.ghPublicVideo.update( {_id: fileObj._id }, { $set: { f: _name, s: arrImage[ _index ].s, cc: arrImage[ _index].cc } });

      db.ghV.update( {_id: arrImage[ _index]._id }, { $set: { f: "s3@" + _name } } );

      Meteor.defer( function() { uploadPublic4(); } );


   });   
  });

}



uploadPublic3 = function() {

  _index++;

  if (_index == arrImage.length) return;

  var _file = "";

  var _code = arrImage[ _index ].c;

  var rec = db.getCountryRec( _code );

  var name = rec.n.replaceAll(" ","_");

  _file = getLocalPrefix() +  name.toLowerCase() + "_map.jpg";


  console.log("trying to insert " + _file )

  var _fileObj = new FS.File();

  _fileObj.attachData( _file, {type: 'image/png'},  function(error){

    if (error) {
      console.log(error);
      return;
    }

    db.ghPublicImage.insert(_fileObj, function (err, fileObj) {

      if (err) {
        console.log(err);
        return;
      }

      db.ghPublicImage.update( {_id: fileObj._id }, { $set: { cc: _code, dt: "cmp" } });

      Meteor.defer( function() { uploadPublic3(); } );


   });   

  });
}

uploadPublic2 = function() {

  _index++;

  if (_index == arrImage.length) return;

  var _file = "";

  var _name = arrImage[ _index ].f;

  if (_name.substr(0,7) == "http://" || _name.substr(0,8) == "https://") {

    _file = _name;
  }
  else {
    _file = "http://localhost:3000/" + _name;
  }

  console.log("trying to insert " + _file )

  var _fileObj = new FS.File();

  _fileObj.attachData( _file, {type: 'image/*'},  function(error){

    if (error) {
      console.log(error);
      return;
    }

    db.ghPublicWeb.insert(_fileObj, function (err, fileObj) {

      if (err) {
        console.log(err);
        return;
      }

      db.ghPublicWeb.update( {_id: fileObj._id }, { $set: { s: arrImage[ _index ].s, f: arrImage[ _index ].f, cc: arrImage[ _index].cc } });

      Meteor.defer( function() { uploadPublic2(); } );


   });   

  });
}


fixgif = function() {

  var arr = ghV.find({}).fetch();

var c = 0;

      for (var i = 0; i < arr.length; i++) {

        var ID = arr[i]._id;

        var _f = "f@" + arr[i].f

        var res = ghV.update( {_id: ID }, { $set: {f: _f}  }); 

c = res + c;
    }

    console.log(c + " fields updated.");
}