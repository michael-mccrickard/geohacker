//*********************************************
//      GEOHACKER SERVER
//*********************************************

var countryCode;

var featuredUserID;

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

    //ghMap = new Meteor.Collection('alMap');

    ghText = new Meteor.Collection('alText');

    ghTag = new Meteor.Collection("ghTag");

    ghUser = new Meteor.Collection("ghUser")

    ghMusic = new Meteor.Collection("ghMusic")

    //ghGuest =  new Meteor.Collection("ghGuest")


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

  //Meteor.users collection

    Meteor.publish("chiefUser", function () {

      return Meteor.users.find( { _id: getChiefID2() } );
    });

     Meteor.publish("agentsInNetwork", function () {

        if (!this.userId) return null;

        var _user = Meteor.users.findOne( { _id: this.userId } );

        return Meteor.users.find( { _id: { $in: _user.profile.ag } } );
    
    });   

     Meteor.publish("agentsInCountry", function () {

      return Meteor.users.find( { 'profile.cc': countryCode } );
    });   




    //only for super-admin?
    Meteor.publish("registeredUsers", function () {

      return Meteor.users.find( {} );
    });

    //featuredUser on the bio screen
    Meteor.publish("featuredUser", function () {
      return Meteor.users.find( { _id: featuredUserID } );
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

    //leaders (images)
    Meteor.publish("allLeaders", function () {
      return ghImage.find( { dt: "ldr" } );
    }); 

    //capitals (text) 
    Meteor.publish("allCapitalsText", function () {
      return ghText.find( { dt: "cap" } );
    }); 

    //map control -- generic clues, not specific to countries
/*
    Meteor.publish("ghMap", function () {
      return ghMap.find( {} );
    });
*/
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

    //map tags

    Meteor.publish("ghTag", function () {
      return ghTag.find();
    });




    //user messaging

    Meteor.publish("conversation",function(){
      return Conversation.find({});
    });

/*
    Meteor.publish('userPresence', function() {
      
      // Setup some filter to find the users your user
      // cares about. It's unlikely that you want to publish the 
      // presences of _all_ the users in the system.

      // If for example we wanted to publish only logged in users we could apply:
      var filter = { userId: { $exists: true }};

      return Presences.find(filter, { fields: { state: true, userId: true }});
    });
*/
    //music

    Meteor.publish("allMusic", function() {
      return ghMusic.find( {} );
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

function getChiefID2() {

  var res = Meteor.users.findOne( { username: "Mac Sea" } );

  return res._id;
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

//assumes a positive integer and calcs BACKWARDS in time

function getXDaysFromNow( _x ) {

      var d = new Date();
      var n = d.getTime();

      var _day = 60 * 60 * 24 * 1000;

      var _startDate = n - (_x * _day);

      return new Date(_startDate); 

}



var _index = -1;

//set self to this before doing a synchronous HTTP call

var self = null;

Meteor.methods({

    setFeaturedUserID: function( _id ) {

      featuredUserID = _id;
    },

    writeActiveUsers: function() {

      var fs = Npm.require('fs');

      var p = "/Users/michaelmccrickard/Desktop/";

      var s = "username,email\n";

      var _count = 0;

      var _arr = Meteor.users.find( { "profile.st": usActive } ).fetch();

      for (var i = 0; i < _arr.length; i++) {

         var _email = _arr[i].emails[0].address;

         if ( _email.indexOf( "example.com") == -1) {

          s = s + _arr[i].username + "," + _email + "\n";

          console.log( "added user " + _arr[i].username );
          _count++;
        }

      }

      console.log( _count + " users added.");

      fs.writeFileSync(p +"activeUsers.csv", s);

    },


    getTopBadges: function(_days) {

    var d2 = new Date(0);

    if (_days) {

      d2 = getXDaysFromNow( _days );
    }

      return (Meteor.users.aggregate([

          {"$match": {"profile.st": usActive } },       

          {
              "$project": {

              "_id": 1,
              "username": 1,
              "profile": 1
            }
          },

          {"$unwind": "$profile.sp" },

           { "$group": {

                "_id": "$_id",

                "username": { "$first": '$username' },

                "profile": { "$first": '$profile' },

                "totalSpeed": {"$sum" : "$profile.sp" }
            }
          },  


          {"$unwind": "$profile.sc" },

           { "$group": {

                "_id": "$_id",

                "username": { "$first": '$username' },

                "profile": { "$first": '$profile' },

                "totalSpeed": { "$first": '$totalSpeed' },

                "totalScholar": {"$sum" : "$profile.sc" }        
            }
          },

           {"$unwind": "$profile.in" },

           { "$group": {

                "_id": "$_id",

                "username": { "$first": '$username' },

                "profile": { "$first": '$profile' },

                "totalSpeed": { "$first": '$totalSpeed' },

                "totalScholar": { "$first": '$totalScholar' },         

                "totalInvestigator":  {"$sum" : "$profile.in" }              
            }
          }, 

           {"$unwind": "$profile.ft" },

           { "$group": {

                "_id": "$_id",

                "username": { "$first": '$username' },

                "profile": { "$first": '$profile' },

                "totalSpeed": { "$first": '$totalSpeed' },

                "totalScholar": { "$first": '$totalScholar' }, 

                "totalInvestigator": { "$first": '$totalInvestigator' },             

                "totalFirstTime":  {"$sum" : "$profile.ft" }              
            }
          },         

          {"$match": { $or: [ { "totalSpeed": { $ne: 0 } }, { "totalScholar": { $ne: 0 } }, { "totalInvestigator": { $ne: 0 } }, { "totalFirstTime": { $ne: 0 } } ], "profile.sn": { $gt: d2 } } },

          {
              "$project": {

              "_id": 1,

              "profile.av": 1,
              
              "username": 1,

              "totalBadges": {"$add" : ["$totalSpeed", "$totalScholar", "$totalInvestigator", "$totalFirstTime", "$profile.ge", "$profile.ex" ] }    
            }
          },

          { "$sort": { "totalBadges": -1 } }

        ])
      );

    },



    getTopHackers: function( _days ) {

    var d2 = new Date(0);

    if (_days) {

      d2 = getXDaysFromNow( _days );
    }

      return Meteor.users.aggregate([ 

        { $match:{ 'profile.st': usActive, "profile.sn": { $gt: d2 } } }, 

        { $project:  { username: 1, "profile.av": 1, numberOfHacks: { $size: "$profile.h" } } }, 

        { $sort : { numberOfHacks: -1 } } ]);

    },


  createGuest: function() {

      // avoid blocking other method calls from the same client
      this.unblock();

      var apiUrl = 'http://api.randomuser.me/?inc=gender,name,nat,picture,id,email&noinfo';

    // asynchronous call to the dedicated API calling function
    var response = Meteor.wrapAsync(apiCall)(apiUrl);

    return response;
  },

  getWeatherStringFor: function (_city) {

    // avoid blocking other method calls from the same client
    this.unblock();

    var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + _city + '&units=imperial' + '&appid=' + process.env.OPENWEATHERMAP_KEY;

    // asynchronous call to the dedicated API calling function
    var response = Meteor.wrapAsync(apiCall)(apiUrl);
    
    return response;
  },

  test1: function() {

    //to add another editor or admin, replace this.userId below with
    //their userId and call this method

console.log(this.userId);

//Roles.addUsersToRoles( this.userId, [ 'admin', 'editor' ] );

  },

  test2:  function() {
    
    fs = Npm.require('fs');

    __ROOT_APP_PATH__ = fs.realpathSync('.'); 

    console.log(__ROOT_APP_PATH__);
  },

  getChiefID: function() {
    
    return getChiefID2();
  },

  clearAvatars:  function() {

    ghAvatar.remove({});
  },

  clearTags: function() {

    ghTag.remove({});
  },

  deleteS3File: function(_key) {

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


    var email = Meteor.user().emails[0].address;

    var url =  Gravatar.imageUrl( email, {default: 'retro'} );


    Meteor.users.update( {_id: userID }, { $set: { 'profile.av': url }  });

  },  

  addRecord: function(_ID, _type) {

    var col = getCollectionForType(_type);

    var rec = null;

    rec = col.insert( { cc: _ID } );

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

testImages: function() {


arrImages = ghImage.find({}).fetch();

//c(arrImages.length = " files in db")

_index = 0;

  testImages2();
},

});

var apiCall = function (apiUrl, callback) {
  // try…catch allows you to handle errors 
  try {
    var response = HTTP.get(apiUrl).data;
    // A successful API call returns no error 
    // but the contents from the JSON response
    callback(null, response);
  } catch (error) {
    // If the API responded with an error message and a payload 
    if (error.response) {
      var errorCode = error.response.data.code;
      var errorMessage = error.response.data.message;
    // Otherwise use a generic error message
    } else {
      var errorCode = 500;
      var errorMessage = 'Cannot access the API';
    }
    // Create an Error object and return it via callback
    var myError = new Meteor.Error(errorCode, errorMessage);
    callback(myError, null);
  }
}


//********************************************************************
//      TEST CODE
//********************************************************************

  var good = 0;

  var bad = 0;

testImages2 = function() {

  _index++;



  if (_index == arrImages.length) {

console.log( good + " good image links found")
console.log( bad + " bad image links found")
    return;

  }

    var URL = arrImages[ _index ].u;


    //doing a synchronous call, so unblock the server

    //this.unblock();

//console.log("trying URL: " + URL);

    //try the URL and timeout after 5 seconds

    try {

      var result = HTTP.call("GET", URL, { timeout: 5000});

//console.log(URL + " -- OK");

      good++;

    } 
    catch (e) {
      
      // Got a network error, time-out or HTTP error in the 400 or 500 range.

       // var errorJson = JSON.parse(result.content);
        
      //var ind = URL.lastIndexOf("-");

var _obj = arrImages[_index];

        console.log(_obj.cc + " -- " + _obj.dt + " -- BAD");

        bad++;

    }

    testImages2();
}
