
//****************************************************************
//                  HELPERS
//****************************************************************

var resetPrompts = function() {

   Session.set("sLoginPrompt", "CLOCK IN TO BEGIN YOUR SHIFT...");

   Session.set("sLoginPromptTextColor", "yellowText");

   Session.set("sRegistrationPrompt", "APPLY TO BECOME A GEOHACKER AGENT...");

   Session.set("sRegistrationPromptTextColor", "yellowText");

  Session.set("sUserContinent","");

  Session.set("sUserRegion", "");
}

var passwordTooShortError = function() {

   Session.set("sRegistrationPrompt", "ERROR: THE PASSWORD MUST BE AT LEAST 6 CHARACTERS ...");

   Session.set("sRegistrationPromptTextColor", "redText");
}

var customError = function(_which, _err) {

   if (_err) Session.set("s" + _which + "Prompt", _err.toUpperCase() );

   Session.set("s" + _which + "PromptTextColor", "redText");
}


Template.login.helpers({

  badPasswordEntered: function() {

    return Session.get("sBadPasswordEntered");
  },

  continent: function() {

    return db.ghZ.find( {}, {sort: { n: 1 }} );
  },

  region: function() {

    return db.ghR.find( { z: Session.get("sUserContinent") }, {sort: { n: 1 }} );
  },

  country: function() {

    return db.ghC.find( {r: Session.get("sUserRegion")}, {sort: { n: 1 }} );
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


Template.login.events({

    'change #selectContinent': function(event, template) {

            var _code = $( "#selectContinent option:selected" ).attr("id")

            Session.set("sUserContinent", _code);
      },

    'change #selectRegion': function(event, template) {

            var _code = $( "#selectRegion option:selected" ).attr("id")

            Session.set("sUserRegion", _code);
      },

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

      //This is here b/c we were having instances where the onLogin event
      //was apparently not firing ...

      if (game.user == null) game.user = game.createGeohackerUser();

      //go to Continue / Select Mission screen

      Control.playEffect("startButton.mp3");

      game.user.goHome();

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

            var _text = "Hello, I'm " + name + ".  I live in " + db.getCountryName( $( "#selectCountry option:selected" ).attr("id") ) + ".";

            var _rec = db.getRandomCountryRec (db.ghC );

            var _pic = db.getCapitalPic( _rec.c );

            var _pt = db.getCapitalName( _rec.c ) + " is the capital of " + _rec.n + ".";

            var options = {

                username: name,
                
                email: email,
                
                password: password,

                //profile is the portion that we can update for the logged-in user
                //(without rules or server methods)

                profile: {
                    a: [],
                    h: [],
                    c: "",
                    s: 0,
                    av: "",
                    cc: $( "#selectCountry option:selected" ).attr("id"),
                    cn: db.getCountryName( $( "#selectCountry option:selected" ).attr("id") ),
                    f: db.getFlagPicByCode( $( "#selectCountry option:selected" ).attr("id") ),
                    t: _text,
                    p: _pic, 
                    pt: _pt

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

                var _gender = "female";

                if ( $("chkMale").prop("checked") ) _gender = "male";

                 if ( $("chkMale").prop("checked") ) _gender = "female";               

                game.user.makeAvatar( _gender );

                Meteor.setTimeout( function() { FlowRouter.go("/home"); }, 500);

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
