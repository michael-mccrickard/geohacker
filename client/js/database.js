

Database = function() {

  var res = null;

  this.controlsReady = false;

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

    this.ghS = new Meteor.Collection('alSound');   //lc = language code, cc: country code, bc: bible code, f: URL or filename

    this.ghV = new Meteor.Collection('alVideo');

    this.ghW = new Meteor.Collection('alWeb');

    this.ghD = new Meteor.Collection('alDebrief');

    this.ghM = new Meteor.Collection('alMap');

    this.controlsReady = true;
  }

  //************************************************************
  //          USER FUNCTIONS
  //************************************************************

  this.clearUsers = function() {

    Meteor.logout();

    Meteor.call("clearUsers");
  }


  this.updateUserRec = function() {

      //res = this.ghU.update( { _id: game.user.id }, { $set: { a: game.user.assigns, c: game.user.assignCode, h: game.user.getAtlasDataObject() } } );


      Meteor.users.update( { _id: Meteor.user()._id }, { $set: { 'profile.a': game.user.assigns, 'profile.c': game.user.assignCode, 'profile.h': game.user.getAtlasDataObject() } } );


      c("Meteor.user() record updated with user assigns, assignCode, atlas");

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

  this.getFlagPicByID = function(_countryID) {

    var _code = this.getCountryRecByID(_countryID).c;

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

    if (_type == cSound) col = this.ghS;

    if (_type == cImage) col = this.ghI; 

    if (_type == cVideo) col = this.ghV;

    if (_type == cWeb) col = this.ghW;

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

    if (_name == "SOUND") col = this.ghS;

    if (_name == "IMAGE") col = this.ghI; 

    if (_name == "VIDEO") col = this.ghV;

    if (_name == "WEB") col = this.ghW;

    if (_name == "TEXT") col = this.ghT;

    if (_name == "DEBRIEF") col = this.ghD;

    return col;
  }


  //************************************************************
  //          DATABASE UPDATES
  //************************************************************

this.addRecord = function( _ID, _type) {

  Meteor.call("addRecord", _ID, _type);
}

this.updateRecord2 = function (_type, field, ID, value) {

    Meteor.call("updateRecordOnServer", field, _type, ID, value)
}


this.saveScroll = function(_val) {

    game.user.scroll = _val;

    //db.ghU.update( {_id: this.id }, { $set: {s: _val}  }); 

    Meteor.call("saveScroll", _val);
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

          //var data = {};

          //data[ arrField[i] ] = value;

          Meteor.call("updateRecordOnServer", arrField[i], _type, ID, value)

          //res = col.update( {_id: ID }, { $set: data  }); 

          //if (res) console.log("Fields updated: " + res);   
        }

        
      } //end looping thru fields

    }  //end if we have a control type and a record id

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

  var res = db.ghN.update( {_id: "TB9xzERLbYLxe2hD3" }, { $set: {f: "./geohacker_background.png"}  }); 

  res = db.ghN.update( {_id: "o2SDDRGBpcigcD8H7" }, { $set: {f: "./spinning_globe.gif"}  }); 
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

      arr = db.ghS.find().fetch();

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

    var _dt = arr[ _index ].dt;

    if (_dt != "ant")  {

      res = Meteor.call("updateRecordOnServer", "dt", cSound, ID, "lng", function() { _index++; fixRecNow( _index )}); 
    }
    else {

      _index++;

      fixRecNow( _index );
    }

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