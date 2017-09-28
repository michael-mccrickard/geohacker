//accounts.js

Accounts.onCreateUser((options, user) => {

console.log("creating user with " + loginMethod + " -- options follows")

console.log(options)

  if (loginMethod == "password") user.profile = options;

  if (loginMethod == "instagram") {

      var _obj = {};

      _obj.name = "";

      _obj.password = "";

      _obj.countryID = "";

      _obj.ut = 0;

      _obj.st = 0;

      _obj.countryID = db.getRandomCountryRec().c;

     _obj.ut = utAgent;    

      _obj.st = usActive;

      var _date = new Date().toLocaleString();

      var _index = _date.indexOf(",");

      _obj.date = _date.substring(0, _index);

      var _profile = createUserOptions( _obj );

      user.profile = _profile;

  	  user.username = options.services.instagram.username;

  	  user.profile.av = options.services.instagram.profile_picture;

console.log("createdUserOptions follow")
console.log(_profile)
   }

  return user;

});

