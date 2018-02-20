//Login.js

newUserObj = {};

var mCapNameSub = null;

var mCapPicSub = null;

var mFlagPicSub = null;

resetPrompts = function() {

   Session.set("sLoginPrompt", "IF YOU ARE ALREADY AN AGENT, CLOCK IN ...");

   Session.set("sLoginPromptTextColor", "yellowText");

   Session.set("sRegistrationPrompt", "APPLY TO BECOME A GEOHACKER AGENT...");

   Session.set("sRegistrationPromptTextColor", "yellowText");

  Session.set("sUserContinent","");

  Session.set("sUserRegion", "");
}

passwordTooShortError = function() {

   Session.set("sRegistrationPrompt", "ERROR: THE PASSWORD MUST BE AT LEAST 6 CHARACTERS ...");

   Session.set("sRegistrationPromptTextColor", "redText");
}

emailExistsError = function( _email ) {

    Session.set("sRegistrationPrompt", "ERROR: EMAIL ALREADY EXISTS: " + _email );

    Session.set("sRegistrationPromptTextColor", "redText"); 
}

customError = function(_which, _err) {

   if (_err) Session.set("s" + _which + "Prompt", _err.toUpperCase() );

   Session.set("s" + _which + "PromptTextColor", "redText");
}



// trim helper
var trimInput = function(val) {

  return val.replace(/^\s*|\s*$/g, "");

}

isValidPassword = function(val) {

  return val.length >= 6 ? true : false; 
}

function validateEmail(email) {

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
    return re.test(email);
}

loginUser = function(t) {

      Meteor.setTimeout( function() {

        // retrieve the input field values
        
        var email = t.find('#login-email').value;

        //store the email, in case they need a password reset

        game.currentEmail = email;


        var password = t.find('#login-password').value;

        // Trim and validate your fields here.... 

        email = trimInput( email );

        Meteor.loginWithPassword(email, password, function(err){

          if (err) {

            // The user might not have been found, or their passwword
            // could be incorrect. Inform the user that their
            // login attempt has failed. 

            console.log("user not logged in: " + email + ".  " + err.reason );

            if ( err.reason.indexOf("Incorrect password") != -1) Session.set("sBadPasswordEntered", true);

            customError( "Login", err.reason );

          }
          else {

            // The user has been logged in.

            console.log("user logged in: " + email )

            Database.registerEvent( eLogin, Meteor.userId() );

            analytics.identify( Meteor.userId(), {
              email: Meteor.user().emails[0].address,
              name: Meteor.user().profile.name
            });

            resetPrompts();
          }

          stopSpinner();

        }, 200);

      });

  }


submitApplication = function(_obj2) {

      game.setLoginMethod( "email" );

      newUserObj = {};

      //pick the country for the new user assignment
      //this will get changed below if _obj2 was passed in

      var _countryCode = db.getRandomCountryRec().c;

      Meteor.call("setLoginMethod", "password");

        var _obj = {};

        _obj.email = "";

        _obj.name = "";

        _obj.password = "";

        _obj.countryID = "";

        _obj.ut = 0;

        _obj.st = 0;

        Session.set("sProcessingApplication", true);

        if (_obj2) {

          _obj.email = _obj2.email;

          _obj.name = _obj2.name.first + " " + _obj2.name.last;

          _obj.password = _obj2.password;

          _obj.countryID = _obj2.countryID;

          //set our local var also

          _countryCode =  _obj2.countryID;

          _obj.ut = _obj2.ut;

          _obj.st = _obj2.st;

          if (_obj2.av) _obj.av =  _obj2.av;   
        }
        else {

          _obj.email = $('input#registration-email').val();

          if ( !validateEmail( _obj.email ) ) {

              customError("Registration", "YOU MUST ENTER AN EMAIL ADDRESS.")

              return; 
          }

          _obj.name = $('input#registration-name').val();
          
          _obj.password = $('input#registration-password').val();

          _obj.countryID = _countryCode;

         _obj.ut = utAgent;    

          _obj.st = usActive;  

        }

        mNewUserObj = _obj;

        subscribeToNewUserAssignmentData( _countryCode );
}

subscribeToNewUserAssignmentData = function(_countryCode) {

        if (!_countryCode) _countryCode = db.getRandomCountryRec().c;

        //subscribe to the data for country assignment

      c("subbing to data for country " + _countryCode)

      if (mCapNameSub) mCapNameSub.stop();

      if (mCapPicSub) mCapPicSub.stop();

      if (mFlagPicSub) mFlagPicSub.stop();

        mCapNameSub = Meteor.subscribe("oneCapitalName", _countryCode, function() { Session.set("sNewUserCapitalName", true ) });

        mCapPicSub = Meteor.subscribe("oneCapitalPic", _countryCode, function() { Session.set("sNewUserCapitalPic", true ) });

        mFlagPicSub = Meteor.subscribe("oneFlagPic", _countryCode, function() { Session.set("sNewUserFlagPic", true ) });

    }


finishSubmission = function() {

      var _obj = mNewUserObj;

      var _date = new Date().toLocaleString();

      var _index = _date.indexOf(",");

      _obj.date = _date.substring(0, _index);


      if ( isValidPassword( _obj.password ) ) {

            var options = createUserOptions( _obj);     

            Accounts.createUser( options, function(err){

              if (err) {

                //switch back to the login / application template

                Session.set("sApplicationAccepted", false);

                FlowRouter.go('/start');

                display.stopEffects();

                display.playEffect2("fail.mp3");
                
                // log the error

                console.log("account was not created: " + _obj.email + ".  " + err );

                if ( err.reason.indexOf("Email already exists") != -1) {

                  emailExistsError( _obj.email );

                }
                else {

                  customError("Registration", err.reason);                  
                }


                stopSpinner();

              } else {
                
                // Success. Account has been created and the user
                // has logged in successfully. 

                console.log("account successfully created from email: " + _obj.email);

                Database.registerEvent(eHire, Meteor.userId());

                FlowRouter.go("/intro");

              }
              
            });  //end createUser
        
        }  //end if password OK  

        else {


          stopSpinner();

          passwordTooShortError();

        } //end if passwordOK else
}

loginWithService = function(_service) {

    game.setLoginMethod( _service );

    if (_service == "instagram") {

       Meteor.loginWithInstagram({

          loginStyle: 'popup'
          
          //loginStyle: 'redirect'  you can use redirect for mobile web app
        
        }, function (err) {

            if (err)  {

              alert("Sorry, we could not log you in using your Instagram account because: " + err.reason + "  Please try a different login method.")

                console.log("account was not created with instagram: " + _service);

              return;
            }

            // Success. Account has been created and the user
            // has logged in successfully. 

            console.log("account successfully created with instagram: " + _service);
         

           });   
    }

    if (_service == "google") {

       Meteor.loginWithGoogle({

          loginStyle: 'popup'
          
          //loginStyle: 'redirect'  you can use redirect for mobile web app
        
        }, function (err) {
console.log(err);

            if (err)  {

              alert("Sorry, we could not log you in using your Google account because: " + err.reason + "  Please try a different login method.")

                console.log("account was not created with google: " + _service);

              return;
            }


            // Success. Account has been created and the user
            // has logged in successfully. 

            console.log("account successfully created with google: " + _service);

      });     
    }

}


//****************************************************************
//                  WAIT FOR  DATA
//****************************************************************

Tracker.autorun( function(comp) {

  if (Session.get("sNewUserFlagPic") && 
      Session.get("sNewUserCapitalName") && 
      Session.get("sNewUserCapitalPic")
       
  ) {

  Session.set("sNewUserFlagPic", false);  //flag url for incoming new user

  Session.set("sNewUserCapitalName", false);  //capital city name for incoming new user

  Session.set("sNewUserCapitalPic", false);  //capital city pic for incoming new user
  
    c("new user country assignment data ready");

    if (gLoginMethod == "email") {

      finishSubmission();
    }
    else {

      finishNewLogin();
    }

    return;
  }

  c("new user country assignment data not ready")

});
