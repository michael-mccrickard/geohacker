//*********************************************
//      GEOHACKER SERVER
//*********************************************

var countryCode;


//*********************************************
//      EMAIL SETTINGS
//*********************************************


process.env.MAIL_URL = Meteor.settings.MAIL_URL;

Accounts.emailTemplates.siteName = "Geohacker";
Accounts.emailTemplates.from = "Geohacker In Chief <mikemccrickard@gmail.com>";
Accounts.emailTemplates.resetPassword.subject = function (user) {
    return "Password reset";
};

Accounts.emailTemplates.resetPassword.text = function (user, url) {

   return "To reset the password on your Geohacker account, click the link below:\n\n"
     + url + "\n\n"
     + "Keep on hacking, " + user.username + "!" 
};

//*********************************************
//      AWS S3 / CFS OBJECTS
//*********************************************

var publicStore = new FS.Store.S3("ghPublic", {
  region: "us-east-1", //optional in most cases
  bucket: "gh-resource", //required
  accessKeyId: Meteor.settings.AWS_ACCESS_KEY_ID,
  secretAccessKey: Meteor.settings.AWS_SECRET_ACCESS_KEY,
  ACL: "public-read-write", //optional, default is 'private', but you can allow public or secure access routed through your app URL
});

var ghAvatar = new FS.Collection("ghAvatar", {
    stores: [ publicStore ]
});

var ghTag = new FS.Collection("ghTag", {
    stores: [ publicStore ]
});

var ghUserFeaturedPic = new FS.Collection("ghUserFeaturedPic", {
  stores: [ publicStore ]
});

var ghPublicImage = new FS.Collection("ghPublicImage", {
    stores: [ publicStore ]
});

var ghPublicSound = new FS.Collection("ghPublicSound", {
    stores: [ publicStore ]
});

var ghPublicVideo = new FS.Collection("ghPublicVideo", {
    stores: [ publicStore ]
});

var ghPublicWeb = new FS.Collection("ghPublicWeb", {
    stores: [ publicStore ]
});

//*********************************************
//      STARTUP
//*********************************************

Meteor.startup(

  function () {

    //temporarily allow all user deletes and updates
    Meteor.users.allow({remove: function (){ return true;}}); 

    Meteor.users.allow({update: function (){ return true;}}); 

    console.log("server is creating collections")

    ghZ = new Meteor.Collection('alContinent');   //n = name, c = code

    ghR = new Meteor.Collection('alRegion');     //n = name, c = code, z = continent code

    ghC = new Meteor.Collection('alCountry');    //n = name, c = code, r = region code


//new collections

    ghImage = new Meteor.Collection('ghImage');

    ghSound = new Meteor.Collection('ghSound');  

    ghVideo = new Meteor.Collection('ghVideo');

    ghWeb = new Meteor.Collection('ghWeb');

    ghDebrief = new Meteor.Collection('alDebrief');

    ghMap = new Meteor.Collection('alMap');

    ghText = new Meteor.Collection('alText');

    //editing collections

    Meteor.publish("allImages", function() {
      return ghImage.find( {} );
    });

    Meteor.publish("allSounds", function() {
      return ghSound.find( {} );
    });

    Meteor.publish("allTexts", function() {
      return ghText.find( {} );
    });

    Meteor.publish("allVideos", function() {
      return ghVideo.find( {} );
    });

    Meteor.publish("allWebs", function() {
      return ghWeb.find( {} );
    });

    Meteor.publish("allDebriefs", function() {
      return ghDebrief.find( {} );
      });

  //user collection


//only for super-admin?
    Meteor.publish("registeredUsers", function () {

      return Meteor.users.find( {} );
    });

  //area collections

    Meteor.publish("continent", function () {
      return ghZ.find();
    }); 

    Meteor.publish("country", function () {
      return ghC.find();
    });

    Meteor.publish("region", function () {
      return ghR.find();
    });

    //other collections

    //debrief  (all flags)
    Meteor.publish("allFlags", function () {
      return ghImage.find( { dt: "flg" } );
    });  

    //map control -- generic clues, not specific to countries

    Meteor.publish("ghMap", function () {
      return ghMap.find( {} );
    });

    //"normal" controls

    //hack collections, single country

    Meteor.publish("ghText", function () {
      return ghText.find( { cc: countryCode });
    });

    Meteor.publish("ghSound", function () {
      return ghSound.find( { cc: countryCode });
    });

    Meteor.publish("ghImage", function () {
      return ghImage.find( { cc: countryCode });
    });

    Meteor.publish("ghVideo", function () {
      return ghVideo.find( { cc: countryCode });
    });

    Meteor.publish("ghWeb", function () {
      return ghWeb.find( { cc: countryCode });
    });

    //debriefs

    Meteor.publish("ghDebrief", function () {
      return ghDebrief.find( { cc: countryCode });
    });

    //user collections

    Meteor.publish("ghAvatar", function () {
      return ghAvatar.find();
    });

    Meteor.publish("ghTag", function () {
      return ghTag.find();
    });

    Meteor.publish("ghUserFeaturedPic", function () {
      return ghUserFeaturedPic.find();
    });

    ghImage.allow({

      insert: function() {
          return true;
      },
      update: function() {
          return true;
      },
      remove: function() {
          return true;
      }
    });

    ghSound.allow({

      insert: function() {
          return true;
      },
      update: function() {
          return true;
      },
      remove: function() {
          return true;
      }
    });

    ghWeb.allow({

      insert: function() {
          return true;
      },
      update: function() {
          return true;
      },
      remove: function() {
          return true;
      }
    });

    ghVideo.allow({

      insert: function() {
          return true;
      },
      update: function() {
          return true;
      },
      remove: function() {
          return true;
      }
    });
//end new, start CFS collections

    ghAvatar.allow({

      insert: function() {
          return true;
      },
      update: function() {
          return true;
      },
      remove: function() {
          return true;
      },
      download: function() {
          return true;
      }
    });

    ghTag.allow({

      insert: function() {
          return true;
      },
      update: function() {
          return true;
      },
      remove: function() {
          return true;
      },
      download: function() {
          return true;
      }
    });

    ghUserFeaturedPic.allow({

      insert: function() {
          return true;
      },
      update: function() {
          return true;
      },
      remove: function() {
          return true;
      },
      download: function() {
          return true;
      }
    });

});


//*********************************************
//      FUNCTIONS
//*********************************************

function getCollectionForType(_type) {

    var col = null;

    //user "control"

    if (_type == cUser) col = Meteor.users;

    //area "controls"

    if (_type == cCountry) col = ghC;

    if (_type == cRegion) col = ghR;

    if (_type == cContinent) col = ghZ;

    //data controls

    if (_type == cMap) col = ghMap;

    if (_type == cSound) col = ghSound;

    if (_type == cImage) col = ghImage; 

    if (_type == cVideo) col = ghVideo;

    if (_type == cWeb) col = ghWeb;

    if (_type == cText) col = ghText;

    if (_type == cDebrief) col = ghDebrief;

    return col;
  }


//*********************************************
//      METHODS
//*********************************************

Meteor.methods({

  test1: function() {

    var data = Assets.getText("top50.txt");

    return (data);
  },

  test2:  function() {
    
    fs = Npm.require('fs');

    __ROOT_APP_PATH__ = fs.realpathSync('.'); 

    console.log(__ROOT_APP_PATH__);
  },

  clearAvatars:  function() {

    ghAvatar.remove({});
  },

  clearTags: function() {

    ghTag.remove({});
  },

  makeAvatar: function(_gender, userID) {  
    
    var avatar = Meteor.npmRequire('avatar-generator')(),
          fs = Npm.require('fs');

      var newFile = new FS.File();

      //create the file with the supplied params

      //var uploader = new Slingshot.Upload("ghAvatar");

      avatar(userID, _gender, 256).toBuffer( Meteor.bindEnvironment( function(error, buffer) { 

          if(error) console.log(error.message);

          //When get the callback we attach the picture data to the file


          newFile.attachData( buffer, {type: 'image/png'},  function(error){

              if(error) console.log(error.message);

              newFile.name(userID + '.png');  

              //This callback from attachData inserts the file into the CFS collection
              //and then that callback builds the URL and puts it in the user profile record

              ghAvatar.insert(newFile, function (err, fileObj) {

                  if(err) console.log(err.message);

                  Meteor.setTimeout( function() { Meteor.users.update( {_id: userID }, { $set: { 'profile.av': fileObj.url() }  }); }, 1000 );
                  
              });

          });

        }


      )); 

  },

  addRecord: function(_ID, _type) {

    var col = getCollectionForType(_type);

    return ( col.insert( { cc: _ID } ) );

  },

  initServer: function() {

    doInitServer();
  },

  clearUsers: function() {

    Meteor.users.remove({});

  },

  deleteRecord: function(_ID, _type) {

    var col = getCollectionForType( _type );

    return ( col.remove( _ID ) );
  },

  setCountry: function (_val) {

  	countryCode = _val;

  },

  updateRecordOnServer: function (field, _type, ID, value) {

      var data = {};

      data[ field ] = value;

      var col = getCollectionForType( _type );

      var res = col.update( {_id: ID }, { $set: data  }); 

      if (res) console.log("Records updated on server: " + res);   
  },

  updateRecordOnServerWithDataObject: function (_type, ID, data) {

      var col = getCollectionForType( _type );

      var res = col.update( {_id: ID }, { $set: data  }); 

      if (res) console.log("Records updated on server: " + res);   
  },

  updateContentRecordOnServer: function (data, _type, ID, _file) {

      var col = getCollectionForType( _type );

      var _file = data["f"];

      console.log("trying to update content record with " + _file )

      col.remove( { _id: ID }, function(err, res) {

            var _fileObj = new FS.File();

            _fileObj.attachData( _file,  function(error){

            if (error) {
              console.log(error);
              return;
            }

            col.insert(_fileObj, function (err, fileObj) {

               if (err) {
                 console.log(err);
                 return;
               }

               console.log(fileObj.original.name + " was inserted into collection.");

               col.update( { _id: fileObj._id }, { $set: data }, function(err, res) { 

               if (err) {
                console.log(err);
                return;
               }             

               if (res > 0) {

                console.log( fileObj.original.name + "'s record was updated." );
               }
               else {

                console.log("Record wasn't found for: " + fileObj.original.name);
               }

            }); //end update

          });  //end insert 

        }); //end attachData

    }) //end col.remove
 
  }

});