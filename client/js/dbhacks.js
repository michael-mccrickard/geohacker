/*

var composite: {
    "url": "mapbox://mapbox.mapbox-streets-v7,geohackergame.9d95zvrn",
    "type": "vector"
}

addAllLayers = function() {
*/


makeLayers = function()  {

map.setPaintProperty('admin_level_2', 'line-opacity', 0);

map.setPaintProperty('admin_level_3', 'line-opacity', 0);

var newline = "\n\r";

 var _s0 = 'map.addLayer(' + newline;

  var _s1 = '{' + newline + '"id": "';

  var _s2 = '",' + newline + '"type": "fill",' + newline + '"source": "composite",'  + newline + '"source-layer": "ne_10m_admin_0_countries_1-drrv7p",'  + newline + '"filter": ['  + newline +'"==",'  + newline + '"ADM0_A3_IS",'  + newline + '"';  
  
  var _s3 =  '"' + newline + '],' + newline + '"layout": {' + newline + '"visibility": "visible"' + newline + '},' + newline + '"paint": {' + newline + '"fill-color": "';

  var _s4 = '"' + newline + '}' + newline + '}, "tanzania"' + newline + ');' + newline;

  var _s = "";


  var _arr = db.ghC.find( { r: { $in: ["neaf","saf","caf","nwaf"]  } }).fetch();

      for (var i = 0; i < _arr.length; i++) {

        _s = "";

        var _obj = _arr[i];

        var _code = _obj.d;  //the 3 letter code

        var _name = _obj.c;

        var _color = _obj.co;


        _s = _s + _s0 + _s1 + _name + _s2 + _code + _s3 + _color + _s4;

eval( _s );

      }



        //Meteor.call("writeFile", _s, "layers.js");
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


dofake = function() {



  var _arr = db.ghC.find().fetch();

      for (var i = 0; i < _arr.length; i++) {


        if ( !Meteor.users.findOne( { 'profile.cc': _arr[i].c } ) ) {

          c("no agent in country " + _arr[i].n)
        } 

        

    }

return;

var fakeCountry = _arr[i].c;

c("no agent in country " + _arr[i].n)

        $.ajax({

          url: 'http://api.randomuser.me/?inc=gender,name,nat,picture,id,email&noinfo',
          
          dataType: 'json',
          
          success: function(data) {

            //console.log(data);

            data.results[0].ut = utGeohackerInChiefCountry;

            data.results[0].st = usFake;

            data.results[0].nat = fakeCountry;


            //we could create a guest record here in the db (ghGuest) and stamp with time started
            //but currently all of that info and more is going into mixpanel, which we may want to prevent

            submitApplication(null, data.results[0]);

          }
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