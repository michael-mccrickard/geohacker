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

var ghPublicImage = new FS.Collection("ghPublicImage", {
    stores: [ publicStore ]
});

var ghPublicSound = new FS.Collection("ghPublicSound", {
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

    ghT = new Meteor.Collection('alText');    

    ghI = new Meteor.Collection('alImage');

    ghS = new Meteor.Collection('alSound');  

    ghV = new Meteor.Collection('alVideo');

    ghW = new Meteor.Collection('alWeb');

    ghD = new Meteor.Collection('alDebrief');

    ghM = new Meteor.Collection('alMap');


    //editing collections

    Meteor.publish("allImages", function() {
      return ghI.find( {} );
    });

    Meteor.publish("allSounds", function() {
      return ghS.find( {} );
    });

    Meteor.publish("allTexts", function() {
      return ghT.find( {} );
    });

    Meteor.publish("allVideos", function() {
      return ghV.find( {} );
    });

    Meteor.publish("allWebs", function() {
      return ghW.find( {} );
    });

    Meteor.publish("allDebriefs", function() {
      return ghD.find( {} );
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
      return ghI.find( { dt: "flg" } );
    });  

    //map control -- generic clues, not specific to countries

    Meteor.publish("ghMap", function () {
      return ghM.find( {} );
    });

    //"normal" controls

    Meteor.publish("ghText", function () {
      return ghT.find( { cc: countryCode });
    });

    Meteor.publish("ghSound", function () {
      return ghS.find( { cc: countryCode });
    });

    Meteor.publish("ghImage", function () {
      return ghI.find( { cc: countryCode });
    });

    Meteor.publish("ghVideo", function () {
      return ghV.find( { cc: countryCode });
    });

    Meteor.publish("ghWeb", function () {
      return ghW.find( { cc: countryCode });
    });

    //debriefs

    Meteor.publish("ghDebrief", function () {
      return ghD.find( { cc: countryCode });
    });

    //avatar

    Meteor.publish("ghAvatar", function () {
      return ghAvatar.find();
    });

    //tags

    Meteor.publish("ghTag", function () {
      return ghTag.find();
    });

    //images and sounds (publish all for now)

    Meteor.publish("ghPublicImage", function () {
      return ghPublicImage.find();
    });

    Meteor.publish("ghPublicSound", function () {
      return ghPublicSound.find();
    });

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


    ghPublicImage.allow({

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

    ghPublicSound.allow({

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

    if (_type == cMap) col = ghM;

if (_type == cSound) col = ghPublicSound;

if (_type == cImage) col = ghPublicImage; 

    if (_type == cVideo) col = ghV;

    if (_type == cWeb) col = ghW;

    if (_type == cText) col = ghT;

    if (_type == cDebrief) col = ghD;

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

  clearImages: function() {

    ghPublicImage.remove({});
  },

  clearSounds: function() {

    ghPublicSound.remove({});
  },

  clearTags: function() {

    ghTag.remove({});
  },

  makeAvatar: function(_gender, userID) {  
    
    var avatar = Meteor.npmRequire('avatar-generator')(),
          fs = Npm.require('fs');

      var newFile = new FS.File();

      //create the file with the supplied params

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

      if (res) console.log("Fields updated on server: " + res);   
  }



});