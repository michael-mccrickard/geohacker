


fixmission = function()  {

  game.user.assign.hacked = game.user.assign.pool;

  game.user.assign.pool = [];

  var _obj = game.user.assign.hacked.pop();

  game.user.assign.pool.push( _obj );

  game.user.startNextHack();
}

fixgic = function() {

  var _index = game.user.findAssignIndex( _code );

  game.user.assigns.splice(_index);

}




doColors = function() {

  var arr = db.ghC.find( {} ).fetch();

  var _s = "";

    var newline = "\n\r";


      var _s1 = '{' + newline + '"id": "' ;

      var _s2 = '"type": "fill",' + newline + '"source": "composite",'  + newline + '"source-layer": "ne_10m_admin_0_countries_1-drrv7p",'  + newline + '"filter": ['  + newline +'"==",'  + newline + '"ADM0_A3_IS",'  + newline + '"';  
      
      var _s3 = '],' + newline + '"layout": {' + newline + '"visibility": "visible"' + newline + '},' + newline + '"paint": {' + newline + '"fill-color": "';

      var _s4 = '}' + newline + '},' + newline;

      for (var i = 0; i < arr.length; i++) {

          var _obj = arr[i];

          _s = _s + _s1 + _obj.d + '",' + newline;

          _s = _s + _s2 +  _obj.d + '"' + newline;

          _s = _s + _s3 + _obj.co + '"' + newline + _s4; 
      }

c(_s)

  Meteor.call("writeFile", _s, "countriesColored.json")



  }

doLabels = function() {

  var arr = db.ghC.find( {} ).fetch();

  var _s = "";

    var newline = "\n\r";


      var _s0 = '{' + newline + '"type": "FeatureCollection",' + newline + '"features": [' + newline;

      var _s1 = '{' + '"type": "Feature",' + newline + '"source": "composite",' + newline + '"geometry": {' + newline + '"type": "Point",' + newline;

      var _s2 = '"coordinates": [';
      
      var _s3 = ']' + newline + '},' + newline + '"properties": {' + newline + '"name":"';

      var _s4 = '"' + newline + '}' + newline + '},' + newline;

      for (var i = 0; i < arr.length; i++) {

        _s = _s + _s1 + _s2 + arr[i].cla + "," + arr[i].clo + _s3 + arr[i].n.toUpperCase() + _s4;


      }

      _s = _s0 + _s + ']' + newline + '}';

c(_s)

  Meteor.call("writeFile", _s, "countryLabels.json")



  }



countFlagMemes = function() {

  var count = 0;

  var arr = db.ghC.find( {} ).fetch();

      arrCollection = new Meteor.Collection(null);

 
  for (var i = 0; i < arr.length; i++) {

      var _obj = arr[i];

      var _arrMeme = db.ghMeme.find( { cc: _obj.c, dt: "flg" } ).fetch();

if (_arrMeme.length) console.log( db.getCountryName( _obj.c) + " has " + _arrMeme.length + " flag memes.")

      //arrCollection.insert( { q: _arrMeme.length, n: _obj.n } );

//c( _obj.n + " -- " + _arrMeme.length);

  }

c("done counting flag memes")

//console.log(arrCollection);

//return;
/*
c(count + " countries need additional memes.");

  var _arrSort = arrCollection.find({}, {sort: {  q: -1}}).fetch();


  for (var j = 0; j < _arrSort.length; j++) {

    c(_arrSort[j].n + " -- " + _arrSort[j].q);

  }
*/
}


fixCodes = function() {

  var count = 0;

  var _s = "";

  var arr = db.ghWeb.find( {} ).fetch();

  for (var i = 0; i < arr.length; i++) {

      var ID = arr[i]._id;

      if ( !arr[i].dt ) continue;

      var _baseCode = arr[i].dt.substring(0,3);

      if ( editor.arrFreeCode.indexOf( _baseCode) != -1 ) {

c("found a rec with a freeCode in web: " + arr[i].cc + " -- " + arr[i].dt )

        //var _val = _baseCode + "0";

        //db.ghMeme.update( {_id: ID }, { $set: { dt: _val }  } );          

        count++;
      }
  }
c(count + " web recs found.")
}

testagg = function(_days) {

    Meteor.call("getTopBadges", _days, function( _err, _res )  {

      if (_err) c(_err);

      if (_res) console.log(_res);
    });
}

testDT = function(_cc, _fld) {

    Meteor.call("testDT", _cc, _fld, function( _err, _res )  {

      if (_err) c(_err);

      if (_res) console.log(_res);
    });
}

testdays = function(_days) {

      var d = new Date();
    var n = d.getTime();

var _day = 60 * 60 * 24 * 1000;

var _startDate = n - (_days * _day);

var d2 = new Date(_startDate);

  return Meteor.users.find( { "profile.sn": { $gt: d2 } } ).fetch()
}


var _countryIndex = -1;

var _arrCountries = [];


dofake = function() {

  Meteor.subscribe("registeredUsers", function() {

          _arrCountries = db.ghC.find().fetch();

          for (var i=0; i < _arrCountries.length; i++) {

            var _code = _arrCountries[ i ].c;

            var _agent = Meteor.users.findOne( { 'profile.cc': _arrCountries[ i ].c} );

              if ( !_agent )  {


                  c("no  agent in country " +  _arrCountries[ i ].n)
              }
              else {

                  c(" agent in " +  _arrCountries[ i ].n + " is " +  _agent.username);

                  var _gicAgent = Meteor.users.findOne( { 'profile.cc': _arrCountries[ i ].c, 'profile.ut': utGeohackerInChiefCountry } );

                  if (!_gicAgent) {

                     var _obj = {};

                     _obj.profile = _agent.profile;

                     _obj.profile.ut = utGeohackerInChiefCountry;

                     _obj.profile.t = "Geohacker-in-Chief, " + db.getCountryName( _arrCountries[ i ].c );

c("promoting " + _agent.username + " to GIC for " + db.getCountryName( _arrCountries[ i ].c ))

                     Meteor.call("updateRecordOnServerWithDataObject", cUser, _agent._id, _obj);
                  }
              }          
          }



      });

}




//var fakeCountry = _arr[i].c;


doNextFake = function(  ) {

          _countryIndex++;

c("checking " + _arrCountries[ _countryIndex ].n)

var _code = _arrCountries[ _countryIndex ].c; 


                Meteor.call("createGuest", function(_err, data){

                    if (_err) {

                        console.log(_err);

                        return;
                    }
        console.log(data);


                    data.results[0].ut = utGeohackerInChiefCountry;

                    data.results[0].st = usFake;

                    data.results[0].countryID = _code;

                    data.results[0].password = Meteor.settings.public.GENERAL_PASSWORD;

                     data.results[0].av = data.results[0].picture.medium;                


                    //we could create a guest record here in the db (ghGuest) and stamp with time started
                    //but currently all of that info and more is going into mixpanel, which we may want to prevent

                    submitApplication( data.results[0] );           

                }); 

}



/*
addfields = function() {


  var arr = Meteor.users.find({}).fetch();

      for (var i = 0; i < arr.length; i++) {


        if (arr[i].profile.st == usActive ) {

          c("checking user " + i);

          if ( arr[i].emails[0].address.indexOf("example.com") != -1) {

                Meteor.users.update( {_id: arr[i]._id}, { $set: { 'profile.st': usFake } } ) ;
          }

            
        }
    }
}
*/

//****************************************
//   edit hacks
//****************************************


fixFakes = function() {

c("calling registeredUsers sub")

  Meteor.subscribe("registeredUsers", function() {

  var arr = Meteor.users.find({}).fetch();


      for (var i = 0; i < arr.length; i++) {

        var _obj = arr[i];

        if (!_obj.emails) continue;

        var email = _obj.emails[0].address;

        if (!email) continue;

        var _index = email.indexOf("@example.com");


        if (_index != -1)  {

          if (_obj.profile.ut == utAgent && _obj.profile.h.length == 0)

          Meteor.users.remove( { _id: _obj._id } );

          c("removed user " + _obj.username)

          c(_obj.username + " -- " + _obj.profile.ut + " -- hacks = " + _obj.profile.h.length )

        }
  continue;

        var _st = _obj.profile.st;



            var data = {};

            data.profile = _obj.profile;

            if (data.profile.h.length == 0) {

                data.profile.a = [];

                data.profile.lesson = [];

                Meteor.call("updateRecordOnServerWithDataObject", cUser, _obj._id, data);

            }

           continue;


            data.profile.h = [];

            delete data.profile.ag;

            delete data.profile.ge;

            delete data.profile.ex;

            delete data.profile.sc;

            delete data.profile.in;

            delete data.profile.ft;

            delete data.profile.sp;

            

c("updating " + _obj.username)
            
            Meteor.call("updateRecordOnServerWithDataObject", cUser, _obj._id, data)



    }

  });

}

fixFakes2 = function() {


  var arr = Meteor.users.find({}).fetch();

      for (var i = 0; i < arr.length; i++) {

        var _st = arr[i].profile.st;

        if (_st == usFake ||  _st == usVirtual || _st == usHonorary ) {

          c("checking user " + i);

          if ( arr[i].emails[0].address.indexOf("example.com") != -1) {

                Meteor.users.update( {_id: arr[i]._id}, { $set: { 'profile.st': usFake } } ) ;
          }

            
        }
    }
}


//remove dupes
/*
        var _arr = arr[0].profile.ag;

        var _arr2  = _arr.filter(function(item, pos) {
            
            return _arr.indexOf(item) == pos;
        })
*/ 


fix1 = function() {

var _title = 0;

  var arr = Meteor.users.find({}).fetch();

      for (var i = 0; i < arr.length; i++) {

       if ( arr[i].profile.st == usVirtual) {

          c("updating user " + i);

          Meteor.users.update( {_id: arr[i]._id}, { $set: { 'profile.ut': utGeohackerInChiefCountry  } } ) ;
       }
    }
}

fix2 = function() {

  var _arr = db.ghC.find().fetch();


  //Now loop thru the countries and any of them that have a region code that's in our array get added

c(_arr.length + " country recs found")

  for (var i = 0; i < _arr.length; i++) {



    if ( !Meteor.users.findOne( { 'profile.ut': { $in: [utGeohackerInChiefCountry, utHonoraryGeohackerInChiefCountry]  }, 'profile.cc': _arr[i].c } ) ) {

c("no gic in country " + _arr[i].n)

         if ( Meteor.users.findOne( { 'profile.ut': utAgent, 'profile.cc': _arr[i].c } ) ) {

              var _rec = Meteor.users.findOne( { 'profile.ut': utAgent, 'profile.cc': _arr[i].c } );

c("promoting agent in country " + _arr[i].n)

              Meteor.users.update( { _id: _rec._id  } , { $set: { 'profile.ut': utGeohackerInChiefCountry } } ) ;             
         }
    }
  }
}

/*

var _miss = new Mission("europe_1");

var arr3 = [];

  arr3 = _miss.items;


  _miss = new Mission("europe_2");

      var arr4 = arr3.concat(_miss.items);

      _miss = new Mission("europe_3");

      var arr5 = arr4.concat(_miss.items);

      _miss = new Mission("europe_4");

      var arr6 = arr5.concat(_miss.items);


c(arr6);

c(arr6.length + " items in missions")


  var _arr2 = [];

  for (var i = 0; i < _arr.length; i++) {

    if ( arr6.indexOf( arr6[i] ) != arr6.lastIndexOf( arr6[i] )) _arr2.push( arr6[i] );
  }

  c(_arr2);
  c(_arr2.length + " duped items found")
}

*/

tw = function(_city) {

  Meteor.call("getWeatherStringFor", _city , function(err, res) {

      if (err) console.log(err);

      console.log(res);

  })

}

insertCountry = function() {

      var id = db.ghC.insert( { n: "French Southern and Antartic Lands", c: "TF", co: "#FF0000", r: "saf", xl: 0.45, yl: 0.43, lt: "Préfet"  } );
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

  var count = 0;

  var _s = "";

  var arr = db.ghWeb.find( {} ).fetch();

  for (var i = 0; i < arr.length; i++) {

      var ID = arr[i]._id;

      var _u = arr[i].f.substring(0);

      if ( _u.substring(arr[i].f.length - 4) == "jjpg" ) {

          _u = _u.substring(0, arr[i].f.length - 4);

          _u = _u + "jpg";

          console.log( arr[i].cc + " -- " + _u );

        db.ghImage.update( {_id: ID }, { $set: { u: _u }  } );          

        count++;
      }

//c(count + " images updated.")

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

var getFileBlob = function (url, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.addEventListener('load', function() {
            cb(xhr.response);
        });
        xhr.send();
};

var blobToFile = function (blob, name) {
        blob.lastModifiedDate = new Date();
        blob.name = name;
        return blob;
};

var getFileObject = function(filePathOrUrl, _name, cb) {
       getFileBlob(filePathOrUrl, function (blob) {
          cb(blobToFile(blob, _name));
       });
};




arrCountry = [];

_index = -1;


var uploader = new Slingshot.Upload("ghImage");

uploadPublic = function() {

   arrCountry = db.ghC.find().fetch();

   uploadPublic5();
}

//"/Users/michaelmccrickard/geohacker/public/"




uploadPublic5 = function() {

  _index++;

  if (_index == arrCountry.length) {

    return;
  }

  var _cc = arrCountry[_index].c;

  var _name = arrCountry[_index].n;

  _name = _name.replaceAll(" ","_");

  _name = _name.toLowerCase();

  _name = "redacted_" + _name + "_map.jpg";

c(_cc + " -- " + _name)

  var rec = db.ghImage.findOne( { cc: _cc, dt: "rmp"} );

  if (!rec) {

    uploadPublic5();

    return;
  }

    var id = rec._id


c(_name);

      db.ghImage.update( { _id: id}, { $set: { f: _name }}, function (err) {

                if (err) {
                  console.log(err);
                  return;
                }

                uploadPublic5();
            
            });

return;

  getFileObject( _file, _name, function (fileObject) {

        console.log(fileObject);

        if (fileObject.type == "text/html") {

          console.log(_file + " -- " + db.getCountryName( _cc ));

          uploadPublic5()

          return;
        }


        uploader.send(fileObject, function (error, downloadUrl) {

            if (error) {

              console.log(error);             

              uploadPublic5();
            }
            else {

              db.ghImage.insert( { cc: _cc, dt: "rmp", u: downloadUrl  }, function (err) {

                if (err) {
                  console.log(err);
                  return;
                }

                uploadPublic5();
            
            });

          }

        });
    });
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

    db.ghVideo.insert(_fileObj, function (err, fileObj) {

      if (err) {
        console.log(err);
        return;
      }

      db.ghVideo.update( {_id: fileObj._id }, { $set: { f: _name, s: arrImage[ _index ].s, cc: arrImage[ _index].cc } });

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

  _file = getLocalPrefix() +  "redacted_" + name.toLowerCase() + "_map.jpg";


  console.log("trying to insert " + _file )

  var _fileObj = new FS.File();

  _fileObj.attachData( _file, {type: 'image/png'},  function(error){

    if (error) {
      console.log(error);
      return;
    }

    db.ghImage.insert(_fileObj, function (err, fileObj) {

      if (err) {
        console.log(err);
        return;
      }

      db.ghImage.update( {_id: fileObj._id }, { $set: { cc: _code, dt: "cmp" } });

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

    db.ghWeb.insert(_fileObj, function (err, fileObj) {

      if (err) {
        console.log(err);
        return;
      }

      db.ghWeb.update( {_id: fileObj._id }, { $set: { s: arrImage[ _index ].s, f: arrImage[ _index ].f, cc: arrImage[ _index].cc } });

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