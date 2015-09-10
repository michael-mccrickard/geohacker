//****************************************************************
//                  HELPERS
//****************************************************************

var resetPrompts = function() {

   Session.set("sLoginPrompt", "CLOCK IN TO BEGIN YOUR SHIFT...");

   Session.set("sLoginPromptTextColor", "yellowText");

   Session.set("sRegistrationPrompt", "APPLY TO BECOME A GEOHACKER AGENT...");

   Session.set("sRegistrationPromptTextColor", "yellowText");
}

var passwordTooShortError = function() {

   Session.set("sRegistrationPrompt", "ERROR: THE PASSWORD MUST BE AT LEAST 6 CHARACTERS ...");

   Session.set("sRegistrationPromptTextColor", "redText");
}

var customError = function(_which, _err) {

   Session.set("s" + _which + "Prompt", _err.toUpperCase() );

   Session.set("s" + _which + "PromptTextColor", "redText");
}


Template.login.helpers({

  badPasswordEntered: function() {

    return Session.get("sBadPasswordEntered");
  },

  loginStatus:  function() {

    if (Meteor.user() == null) return "this terminal available.";

    return "agent " + Meteor.user().username + " is clocked in.";
  },

  loginNow: function() {

    return Session.get("sLoginNow");
  },

  loginPrompt: function() {

    return Session.get("sLoginPrompt");
  },

  loginPromptTextColor: function() {

    return Session.get("sLoginPromptTextColor");
  },

  registrationPrompt: function() {

    return Session.get("sRegistrationPrompt");
  },

  registrationPromptTextColor: function() {

    return Session.get("sRegistrationPromptTextColor");
  },

  resetPassword : function(t) {
  
    return Session.get('sResetPassword');
  }

})


//react to the resetPasswordToken property in accounts
//Tracker.autorun( function(comp) {

  if (Accounts._resetPasswordToken) {
      
      Session.set('sResetPassword', Accounts._resetPasswordToken);  
  } 
//});

Template.login.events({

    'submit #login-form' : function(e, t){

      e.preventDefault();
      
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

          resetPrompts();
        }

      });

        return false; 
      },


    'click #goHack': function (e) { 

      e.preventDefault();

      //should check for class faded on the button here and return if found

      if (game.user == null) game.user = game.createGeohackerUser();

      //go to Continue / Select Mission screen

      Control.playEffect("startButton.mp3");

      Router.go("/missionSelect");

    },

    'click #goRegistration': function (e) { 

      e.preventDefault();

      Session.set("sLoginNow", false);

    },

    'click #submitApplication' : function(e, t) {

      e.preventDefault();

      var name = t.find('#registration-name').value
      
      var email = t.find('#registration-email').value

      var password = t.find('#registration-password').value

      if ( isValidPassword( password ) ) {

            game.user = new User( name, "0", 0); //name, id, scroll pos (for content editors)

            game.user.createAssigns();

            var options = {

                username: name,
                
                email: email,
                
                password: password,

                //profile is the portion that users can update themselves

                profile: {
                    a: [],
                    h: [],
                    c: "",
                    s: 0
                },
            
            };


            Accounts.createUser( options, function(err){

              if (err) {
                
                // log the error

                console.log("account was not created: " + email + ".  " + err );

                customError(err.reason);

              } else {
                
                // Success. Account has been created and the user
                // has logged in successfully. 

                console.log("account successfully created: " + email);

                game.user.makeAvatar();

              }
              
            });
        }

        else {

          passwordTooShortError();

        }

      return false;
    },

    'click #updatePassword': function (e, t) { 

        e.preventDefault();

        var pw = t.find('#new-password').value;
      
        if ( isValidPassword(pw) ) {
        
          Accounts.resetPassword(Session.get('sResetPassword'), pw, function(err){
        
            if (err)
        
              customError(err.reason);
        
            else {
        
              Session.set('sResetPassword', null);
            }
        
          });
        }

        return false; 
    }
  });

/*

Template.templateResetPassword.events = {

    'click #updatePassword': function (e) { 

        e.preventDefault();

        var pw = t.find('#new-password').value;
        
        if (isNotEmpty(pw) && isValidPassword(pw)) {
        
          Accounts.resetPassword(Session.get('resetPassword'), pw, function(err){
        
            if (err)
        
              customError(err.reason);
        
            else {
        
              Session.set('sResetPassword', null);
            }
        
          });
        }

        return false; 
    }
};


Template.templateResetPassword.helpers({

  resetPassword : function(t) {
  
    return Session.get('sResetPassword');
  }

});

*/

// trim helper
var trimInput = function(val) {

  return val.replace(/^\s*|\s*$/g, "");

}

isValidPassword = function(val) {

  return val.length >= 6 ? true : false; 
}
