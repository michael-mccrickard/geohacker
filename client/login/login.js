//Login.js

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


submitApplication = function(_t) {

      Meteor.call("setLoginMethod", "password");

      var _obj = {};

      _obj.email = "";

      _obj.name = "";

      _obj.password = "";

      _obj.countryID = "";

      _obj.ut = 0;

      _obj.st = 0;

      Session.set("sProcessingApplication", true);

      _obj.email = _t.find('#registration-email').value

      if ( !validateEmail( _obj.email ) ) {

          customError("Registration", "YOU MUST ENTER AN EMAIL ADDRESS.")

          return; 
      }

      _obj.name = _t.find('#registration-name').value
      
      _obj.password = _t.find('#registration-password').value

      _obj.countryID = db.getRandomCountryRec().c;

     _obj.ut = utAgent;    

      _obj.st = usActive;


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

                console.log("account successfully created: " + _obj.email);

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

    Meteor.call("setLoginMethod", _service);


    if (_service == "instagram") {

       Meteor.loginWithInstagram({

          loginStyle: 'popup'
          
          //loginStyle: 'redirect'  you can use redirect for mobile web app
        
        }, function () {


            // Success. Account has been created and the user
            // has logged in successfully. 

            console.log("account successfully created: " + _service);

            Database.registerEvent(eHire, Meteor.userId());

            FlowRouter.go("/intro");
      });     
    }

    if (_service == "google") {

       Meteor.loginWithGoogle({

          loginStyle: 'popup'
          
          //loginStyle: 'redirect'  you can use redirect for mobile web app
        
        }, function () {


            // Success. Account has been created and the user
            // has logged in successfully. 

            console.log("account successfully created: " + _service);

            Database.registerEvent(eHire, Meteor.userId());

            FlowRouter.go("/intro");
      });     
    }

}