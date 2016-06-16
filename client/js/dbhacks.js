//****************************************
//   edit hacks
//****************************************

fix1 = function() {

  var ID =  Database.getChiefID();
c(ID)
  var arr = Meteor.users.find({}).fetch();
c(arr.length)
      for (var i = 0; i < arr.length; i++) {

       Meteor.users.update( {_id: arr[i]._id}, { $set: { 'profile.ag': ID } } ) ;

    }
}

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

  var arr = Meteor.users.find( {} ).fetch();

  for (var i = 0; i < arr.length; i++) {



      var ID = arr[i]._id;

      var _str = arr[i].profile.f;



      var filename =  db.getFlagPicByCode( arr[i].profile.cc )

console.log("updating flag for: " + arr[i].username + " with " + filename);

         Meteor.users.update( {_id: ID }, { $set: { 'profile.f': filename }  } );          

        count++;
      }

c(count + " images updated.")

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