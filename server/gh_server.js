//*********************************************
//      GEOHACKER SERVER
//*********************************************

var countryCode;


//*********************************************
//      EMAIL SETTINGS
//*********************************************


process.env.MAIL_URL = Meteor.settings.MAIL_URL;
process.env.AWS_ACCESS_KEY_ID = Meteor.settings.AWS_ACCESS_KEY_ID;
process.env.AWS_SECRET_ACCESS_KEY = Meteor.settings.AWS_SECRET_ACCESS_KEY;

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
//      AWS S3 OBJECTS
//*********************************************

AWS.config.update({
       accessKeyId: Meteor.settings.AWS_ACCESS_KEY_ID,
       secretAccessKey: Meteor.settings.AWS_SECRET_ACCESS_KEY
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

    ghTag = new Meteor.Collection("ghTag");

    ghUser = new Meteor.Collection("ghUser")

    //ghUserFeaturedPic = new Meteor.Collection("ghUserFeaturedPic")

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

    //capitals (images)
    Meteor.publish("allCapitals", function () {
      return ghImage.find( { dt: "cap" } );
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

    Meteor.publish("ghTag", function () {
      return ghTag.find();
    });

    //user messaging

    Meteor.publish("conversation",function(){
      return Conversation.find({});
    });

    ghText.allow({

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
    });

    Conversation.allow({

        'insert':function(userId, doc){
            return true;
        },

        'update':function(userId, doc, fieldNames, modifier){
            return true;
        },

        'remove':function(userId, doc){
            return false;
        }
    }); 

});


//*********************************************
//      FUNCTIONS
//*********************************************

function setAWSConfig() {
    
    

}

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

var urlTryCount = 0;

function testAvatarURL(_key) {

    var avURL = prefix + _key + ".png";

    //doing a synchronous call, so unblock the server

    self.unblock();

    console.log("trying URL: " + avURL + " for avatar ... " + urlTryCount + "x");

    //try the URL and timeout after 3 seconds

    try {

      var result = HTTP.call("GET", avURL, { timeout: 3000});

      console.log("response received.");

      Meteor.users.update( {_id: _userID }, { $set: { 'profile.av': avURL }  });
    } 
    catch (e) {
      
      // Got a network error, time-out or HTTP error in the 400 or 500 range.

       // var errorJson = JSON.parse(result.content);
        
        console.log(e);

        testAvatarURL(_key);
    }
}

//*********************************************
//      METHODS
//*********************************************



var _index = -1;

//set self to this before doing a synchronous HTTP call

var self = null;

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

  deleteS3File: function(_key) {

    setAWSConfig();

    var s3 = new AWS.S3();
       var params = {
       Bucket: "gh-resource",
       Key: _key
    };

    var deleteObject = Meteor.wrapAsync(

       s3.deleteObject(params, function(error, data) {
          
          if(error) {

             console.log(error);

          } else {

             console.log(data);

             return data;
          }

       })
    );    

  },

  makeAvatar: function(_gender, userID) {  


    var avatar = Meteor.npmRequire('avatar-generator')(), fs = Npm.require('fs');

      //create the file with the supplied params

      self = this;

      avatar(userID, _gender, 256).toBuffer( Meteor.bindEnvironment( function(error, buffer) { 

          if (error) console.log(error.message);

          //When get the callback we attach the picture data to the file

              var _key = "ghAvatar/" + userID + '.png';

              setAWSConfig();

              var s3 = new AWS.S3();

              var params = {
                Bucket: 'gh-resource', /* required */
                Key: _key, /* required */
                ACL: 'public-read-write',
                Body: buffer,
                ContentType: "image/png"
              };

              s3.putObject(params, Meteor.bindEnvironment(function(err, data) {

                if (err) {
                  
                  console.log(err, err.stack); // an error occurred
                }
                else {

                  console.log(data);           // successful response

                  Meteor.users.update( {_id: userID }, { $set: { 'profile.av': prefix + _key }  });

                  //testAvatarURL( _key, userID );
                }    
              
              }));

        }));

  },  

  addRecord: function(_ID, _type) {

    var col = getCollectionForType(_type);

    var rec = col.insert( { cc: _ID } );

    return rec;

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

      return res;
  },

  updateRecordOnServerWithDataObject: function (_type, ID, data) {

      var col = getCollectionForType( _type );

      var res = col.update( {_id: ID }, { $set: data  }); 

      return res;  
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
 
  },  //end updateContentRecordOnServer

testImages: function() {

arrImages = ghSound.find({}).fetch();

//c(arrImages.length = " files in db")

  testImages2();
},

});

testImages2 = function() {

  _index++;

  if (_index == arrImages.length) return;

    var URL = arrImages[ _index ].u;

    //doing a synchronous call, so unblock the server

    //self.unblock();

    console.log("trying URL: " + URL);

    //try the URL and timeout after 5 seconds

    try {

      var result = HTTP.call("GET", URL, { timeout: 5000});

      console.log(URL + " -- OK");

    } 
    catch (e) {
      
      // Got a network error, time-out or HTTP error in the 400 or 500 range.

       // var errorJson = JSON.parse(result.content);
        
        console.log(URL + " -- BAD");

    }

    testImages2();
}
