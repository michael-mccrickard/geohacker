

//*********************************************
//      GEOHACKER SERVER
//*********************************************

var countryCode;

var featuredUserID;

var arrCongrats = [];


//*********************************************
//      ENVIRONMENT AND SETTINGS
//*********************************************

/*
console.log(process.env.MAIL_URL)

console.log(process.env.AWS_ACCESS_KEY_ID)

console.log(process.env.AWS_SECRET_ACCESS_KEY)

console.log(process.env.INSTAGRAM_CLIENTID)

console.log(process.env.INSTAGRAM_SECRET)
*/


if (Meteor.isDevelopment) {

  process.env.MAIL_URL = Meteor.settings.MAIL_URL;
  process.env.AWS_ACCESS_KEY_ID = Meteor.settings.AWS_ACCESS_KEY_ID;
  process.env.AWS_SECRET_ACCESS_KEY = Meteor.settings.AWS_SECRET_ACCESS_KEY;
  process.env.GOOGLE_MAPS_KEY = Meteor.settings.GOOGLE_MAPS_KEY;
  process.env.OPENWEATHERMAP_KEY = Meteor.settings.OPENWEATHERMAP_KEY;

  process.env.INSTAGRAM_CLIENTID = Meteor.settings.INSTAGRAM_CLIENTID;
  process.env.INSTAGRAM_SECRET = Meteor.settings.INSTAGRAM_SECRET;
}

/*
console.log( Meteor.settings.MAIL_URL)

console.log( Meteor.settings.AWS_ACCESS_KEY_ID)

console.log( Meteor.settings.AWS_SECRET_ACCESS_KEY)

console.log( Meteor.settings.INSTAGRAM_CLIENTID)

console.log( Meteor.settings.INSTAGRAM_SECRET)
*/


//*********************************************
//      EMAIL SETTINGS
//*********************************************

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
       accessKeyId: process.env.AWS_ACCESS_KEY_ID,
       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});


//*********************************************
//      STARTUP
//*********************************************

Meteor.startup(

  function () {

    Future = Npm.require('fibers/future');

    ServiceConfiguration.configurations.remove({
      service: 'instagram'
    });
    ServiceConfiguration.configurations.insert({
      service: 'instagram',
      scope: ['basic'],
      clientId: process.env.INSTAGRAM_CLIENTID,
      secret: process.env.INSTAGRAM_SECRET,
    });
/*
    ig_config = {
      client_id: process.env.INSTAGRAM_CLIENTID,       // required
      client_secret: process.env.INSTAGRAM_SECRET,   // required  
      redirect_uri: 'http://localhost:3000/_oauth/instagram',   // required
      loginStyle: "popup",
      scope: {
        scope: ['basic', 'public_content'], // optional
      }
    }

*/
    //temporarily allow all user deletes and updates
    Meteor.users.allow({remove: function (){ return true;}}); 

    Meteor.users.allow({update: function (){ return true;}}); 

    console.log("server is creating collections")

    ghZ = new Meteor.Collection('alContinent');   //n = name, c = code

    ghR = new Meteor.Collection('alRegion');     //n = name, c = code, z = continent code

    ghC = new Meteor.Collection('alCountry');    //n = name, c = code, r = region code


//base collections

    ghImage = new Meteor.Collection('ghImage');

    ghSound = new Meteor.Collection('ghSound');  

    ghVideo = new Meteor.Collection('ghVideo');

    ghWeb = new Meteor.Collection('ghWeb');

    ghMeme = new Meteor.Collection('alDebrief');

    ghText = new Meteor.Collection('alText');

    ghTag = new Meteor.Collection("ghTag");

    ghUser = new Meteor.Collection("ghUser")

    ghMusic = new Meteor.Collection("ghMusic")

    //story collections

    ghStory =  new Meteor.Collection("ghStory")

    ghLocation =  new Meteor.Collection("ghLocation")

    ghChar =  new Meteor.Collection("ghChar")

    ghToken =  new Meteor.Collection("ghToken")

    ghStoryAgent =  new Meteor.Collection("ghStoryAgent")

    ghStoryFlag = new Meteor.Collection("ghStoryFlag")

    ghCue = new Meteor.Collection("ghCue")

    ghChat = new Meteor.Collection("ghChat")

    ghStorySound = new Meteor.Collection("ghStorySound")

    //events collection

    ghEvent = new Meteor.Collection("ghEvent");


    //country editing collections

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
      return ghMeme.find( {} );
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

     Meteor.publish("agentsInThisCountry", function (_countryID) {

      return Meteor.users.find( { 'profile.cc': _countryID } );
    });   


     Meteor.publish("agentHelpers", function () {

      return Meteor.users.find( { 'profile.ut': { $gt: 1 }  } );
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

    Meteor.publish("ghMeme", function () {
      return ghMeme.find( { cc: countryCode });
    });


    //map tags
    //accidentally deleted the publish function

    //congrats elements 

    Meteor.publish("congratsImages", function ( _arr, _dt) {

      return ghImage.find( { cc: { $in: _arr  }, dt: _dt });

    });

    Meteor.publish("congratsTexts", function ( _arr, _dt) {

      return ghText.find( { cc: { $in: _arr  }, dt: _dt });

    });

    Meteor.publish("congratsAnthems", function (_arr) {

      return ghSound.find( { cc: { $in: _arr }, dt: "ant" });

    });


    //user messaging

    Meteor.publish("conversation",function(){
      return Conversation.find({});
    });

    //editing stories

     Meteor.publish("allStories",function(){
      return ghStory.find({});
    }); 

     Meteor.publish("allLocations",function(){
      return ghLocation.find({});
    });   

     Meteor.publish("allChars",function(){
      return ghChar.find({});
    });  

     Meteor.publish("allTokens",function(){
      return ghToken.find({});
    });  

    Meteor.publish("allStoryAgents",function(){
      return ghStoryAgent.find({});
    });  

     Meteor.publish("allStoryFlags",function(){
      return ghStoryFlag.find({});
    });  

     Meteor.publish("allCues",function(){
      return ghCue.find({});
    });  

     Meteor.publish("allChats",function(){
      return ghChat.find({});
    });  

     Meteor.publish("allStorySounds",function(){
      return ghStorySound.find({});
    });  

     Meteor.publish("tempAgent",function( _name){

      return Meteor.users.find( { username: _name }, { "_id": 1, "username": 1 } );

    });  


    //stories

     Meteor.publish("storyAssets_Story",function( storyCode ){

      return ghStory.find({ c: storyCode });
    }); 

     Meteor.publish("storyAssets_Location",function( storyCode ){

      return ghLocation.find({ c: storyCode });
    });   

     Meteor.publish("storyAssets_Char",function( storyCode ){
      return ghChar.find({ c: storyCode });
    });  

     Meteor.publish("storyAssets_Token",function( storyCode ){
      return ghToken.find({ c: storyCode });
    });  
     
    Meteor.publish("storyAssets_StoryAgent",function( storyCode ){
      return ghStoryAgent.find({ c: storyCode });
    });  

    Meteor.publish("storyAssets_StoryAgentRecord",function( _storyAgentIDs ){
      return Meteor.users.find( { _id: { $in: _storyAgentIDs } }, { "_id": 1, "username": 1, "profile.av": 1 } );
    }); 

    Meteor.publish("storyAssets_StoryFlag",function( storyCode ){
      return ghStoryFlag.find({ c: storyCode });
    });  
   
    Meteor.publish("storyAssets_Cue",function( storyCode ){

      return ghCue.find({ c: storyCode });
    });  

    Meteor.publish("storyAssets_Chat",function( storyCode ){
      return ghChat.find({ c: storyCode });
    });  

    Meteor.publish("storyAssets_StorySound",function( storyCode ){
      return ghStorySound.find({ c: storyCode });
    });  


    //music

    Meteor.publish("allMusic", function() {
      return ghMusic.find( {} );
    });

    //events
    
    Meteor.publish("allEvents", function() {
      return ghEvent.find( {} );
    });    

    //permissions

    ghStorySound.allow({

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

    ghCue.allow({

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

    ghChat.allow({

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

    ghStoryAgent.allow({

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

    ghStoryFlag.allow({

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

    ghStory.allow({

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

    ghStory.allow({

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

    ghLocation.allow({

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

    ghToken.allow({

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

    ghChar.allow({

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

    ghMeme.allow({

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

    ghEvent.allow({

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

//A function with the same name is available to the client thru the db object;
//it returns the client-side collections, of course.
//Any changes / additions to one should be done to the other

function getCollectionForType(_type) {

    var col = null;

    //user "control"

    if (_type == cUser) col = Meteor.users;

    //area "controls"

    if (_type == cCountry) col = ghC;

    if (_type == cRegion) col = ghR;

    if (_type == cContinent) col = ghZ;

    //data controls

    if (_type == cSound) col = ghSound;

    if (_type == cImage) col = ghImage; 

    if (_type == cVideo) col = ghVideo;

    if (_type == cWeb) col = ghWeb;

    if (_type == cText) col = ghText;

    if (_type == cDebrief) col = ghMeme;

    if (_type == cMeme) col = ghMeme;

    if (_type == cStory) col = ghStory;

    if (_type == cLocation) col = ghLocation;

    if (_type == cToken) col = ghToken;

    if (_type == cChar) col = ghChar;

    if (_type == cStoryFlag) col = ghStoryFlag;

    if (_type == cStoryAgent) col = ghStoryAgent;

    if (_type == cCue) col = ghCue;

    if (_type == cChat) col = ghChat;

    if (_type == cStorySound) col = ghStorySound;

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

//assumes a positive integer and calcs BACKWARDS in time

function getXDaysFromNow( _x ) {

      var d = new Date();
      var n = d.getTime();

      var _day = 60 * 60 * 24 * 1000;

      var _startDate = n - (_x * _day);

      return new Date(_startDate); 

}


//*********************************************
//      METHODS
//*********************************************

var _index = -1;

//set self to this before doing a synchronous HTTP call

var self = null;

Meteor.methods({

    getDataTypeCount: function(_cc, _controlType,  _fld) {

      var _col = getCollectionForType( _controlType );

      return ( _col.aggregate([

          { "$match": { "cc": _cc } },  

          { "$project": { 

            "id": 1,

            "dt": { "$substr": ["$dt",0,3] } 
          }},

          { "$match": { "dt": _fld } },  

          { "$group": {

              "_id": "$_id"

          }}     

        ]).length 

      );

    },

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

    writeFile: function(_s, _name) {


      var fs = Npm.require('fs');

      var p = "/Users/michaelmccrickard/Desktop/";

      fs.writeFileSync(p + _name, _s);
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

  addRecordWithDataObject: function(_type, _data) {

    var col = getCollectionForType(_type);

    var rec = null;

    rec = col.insert( _data );

    return rec;

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


getCountryFromLatLng: function(_lat, _lng, _cb) {


  var geo = new GeoCoder({

    httpAdapter: "https",

    apiKey: process.env.GOOGLE_MAPS_KEY
  
  });

geo.reverse(_lat, _lng);


  },

  testread: function() {

    var fs = Npm.require('fs');

    // file originally saved as public/data/taxa.csv
    
    var data = fs.readFileSync(process.cwd() + '/../web.browser/app/centers.txt', 'utf8');
    //console.log('data', data);

    var arr = data.split(/\r?\n/);


    for (var i = 0; i < arr.length; i++) {

      var _arr = arr[i].split(/\b(\s)/);

      var _code = _arr[0].trim();

      var _lat = _arr[2].trim();

      var _lng = _arr[4].trim();
    
      var res = ghC.update( {c: _code }, { $set: { cla: _lat, clo: _lng }  }); 
    }

  },

  registerEvent: function( _type, _userID, _param, _date, _name) {

       if (!_param) _param = "";

       if (isSameEventAsLast(  _type, _param, _name) ) return;

       ghEvent.insert( { t: _type, u: _userID, p: _param, d: _date, n: _name} );
  },

  clearEvents: function() {

       ghEvent.remove( { } );
  },

  getServices : function() {
    try {
      return Meteor.user().services;
    } catch(e) {
      return null;
    }
  },

  readUserDataFromInstagram: function() {

    var obj = {};

    var _obj =  Meteor.user().services;

        obj.email = _obj.id;  //standin for email

        obj.password = _obj.id;

        obj.name = _obj.fullname;

        obj.gender = "none";

        return obj;
  }

  


});

function isSameEventAsLast(  _type, _param, _name) {

    var _last = ghEvent.findOne({}, {sort: {d: -1, limit: 1}});

    if (!_last) return false;

    if (_last.n == _name && _last.t == _type && _last.p == _param) return true;

    return false;
}


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




