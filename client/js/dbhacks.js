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

  if ( arrImage[_index].f.substr(0,3) == "s3@") {

    uploadPublic5();

    return;
  } 

  var _fileObj = new FS.File();

  _fileObj.cc = arrImage[_index].cc;

  _fileObj.s = arrImage[ _index ].s; 

  _fileObj.f = arrImage[ _index ].f;

  var _file = getLocalPrefix() + "dummy.mp3";

  _fileObj.attachData( _file, {type: 'image/*'},  function(error){

      if (error) {
        console.log(error);
        return;
      }

      db.ghPublicVideo.insert(_fileObj, function (err, fileObj) {

        if (err) {
          console.log(err);
          return;
        }

        Meteor.defer( function() { uploadPublic5(); } );


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