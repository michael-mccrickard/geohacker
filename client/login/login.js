
//****************************************************************
//                  HELPERS
//****************************************************************

var resetPrompts = function() {

   Session.set("sLoginPrompt", "IF YOU ARE ALREADY AN AGENT, CLOCK IN ...");

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

var emailExistsError = function( _email ) {

    Session.set("sRegistrationPrompt", "ERROR: EMAIL ALREADY EXISTS: " + _email );

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

    return db.ghC.find( {r: Session.get("sUserRegion"), d: 1 }, {sort: { n: 1 }} );
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
  },

  processingNow: function() {

    return Session.get('sProcessingApplication');    
  }

})


Template.login.events({

    'click #countryNotListed': function(event, template) {

          $('#countryNotListedModal').modal('show');
      },

    'change #selectContinent': function(event, template) {

            var _code = $( "#selectContinent option:selected" ).attr("id")

            Session.set("sUserContinent", _code);
      },

    'change #selectRegion': function(event, template) {

            var _code = $( "#selectRegion option:selected" ).attr("id")

            Session.set("sUserRegion", _code);
      },

    'click #createGuest': function(event, template) {

        $.ajax({

          url: 'http://api.randomuser.me/?inc=gender,name,nat,picture,id,email&noinfo',
          
          dataType: 'json',
          
          success: function(data) {

            console.log(data);

            doSpinner();

            //we could create a guest record here in the db (ghGuest) and stamp with time started
            //but currently all of that info and more is going into mixpanel, which we may want to prevent

            submitApplication(null, data.results[0]);

          }
        });
      
      },

    'submit #login-form' : function(e, t){

      e.preventDefault();

      doSpinner();
      
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

            analytics.identify( Meteor.userId(), {
              email: Meteor.user().emails[0].address,
              name: Meteor.user().profile.name
            });

            resetPrompts();
          }

          stopSpinner();

        }, 200);

      });


      return false; 

    },

    'click #goHack': function (e) { 

      e.preventDefault();
//game.user.browseCountry( db.getRandomRec( db.ghC ).c );

//return;
      //This is here b/c we were having instances where the onLogin event
      //was apparently not firing ...

      if (game.user == null) {

        c("creating game.user in goHack button")

        game.user = game.createGeohackerUser();

        LessonFactory.updateLessons();

      }

      //Update the assigns with any newly-added or revised missions

      Mission.updateAll( game.user );

      //in case any changes were made in the updateAll function ...

      db.updateUserHacks();  //updates the user's record in the database

      //go to Continue / Select Mission screen

      Control.playEffect2("startButton.mp3");

      game.user.goHome();

    },

    'click #goRegistration': function (e) { 

      e.preventDefault();

      Session.set("sLoginNow", false);

    },

    'click #submitApplication' : function(e, t) {

         e.preventDefault();

        submitApplication( t );

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

function submitApplication(_t, _obj) {

  c("submitApp -- obj follows")
if (_obj) c("incognito object is valid in submitApplication")

      var email = "";

      var name = "";

      var password = "";

      var _gender = "";

      var _countryID = "";

      Session.set("sProcessingApplication", true);

      if ( _obj) {
c("getting data from obj for incognito user")
        email = _obj.email;

        name = _obj.name.first + " " + _obj.name.last;

        password = getRandomString() + getRandomString();

c("password is " + password)

        _gender = _obj.gender;

        _countryID = _obj.nat;       

      }
      else {

        var email = _t.find('#registration-email').value

        if ( !validateEmail( email ) ) {

            customError("Registration", "YOU MUST ENTER AN EMAIL ADDRESS.")

            return; 
        }

        var name = _t.find('#registration-name').value
        
        var password = _t.find('#registration-password').value

        var _gender = "female";

        if ( $("#chkMale").prop("checked") ) _gender = "male";

        if ( $("#chkFemale").prop("checked") ) _gender = "female";  

        var _countryID = $( "#selectCountry option:selected" ).attr("id");       
      }

      var _date = new Date().toLocaleString();

      var _index = _date.indexOf(",");

      _date = _date.substring(0, _index);


      if ( isValidPassword( password ) ) {
 c("password is valid")           
            game.user = new User( name, "0", 0); //name, id, scroll pos (for content editors)

            game.user.createAssigns();

            var _text = "Hello, I'm " + name + ".  I live in " + db.getCountryName( _countryID ) + ".";

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

                    createdAt: _date,

                    a: [],
                    h: [],
                    c: "",
                    s: 0,
                    av: "",
                    cc: _countryID,
                    cn: db.getCountryName( _countryID ),
                    f: db.getFlagPicByCode( _countryID ),
                    t: _text,
                    p: _pic, 
                    pt: _pt,
                    ag: Database.getChiefID(),
                    st: 2,
                    ge: 0,
                    ex: 0,
                    sp: [0,0,0],
                    sc: [0,0,0],
                    in: [0,0,0],
                    ft: [0,0,0,0,0],

                },
            
            };  //end options

c("about to call Accounts.createuser in submitApplication ")
            Accounts.createUser( options, function(err){

              if (err) {
c("error in Accounts.createUser follows")

c(err)
                //switch back to the login / application template

                Session.set("sApplicationAccepted", false);

                FlowRouter.go('/start');

                Control.stopEffects();

                Control.playEffect2("fail.mp3");
                
                // log the error

                console.log("account was not created: " + email + ".  " + err );

                if ( err.reason.indexOf("Email already exists") != -1) {

                  emailExistsError( email );

                }
                else {

                  customError("Registration", err.reason);                  
                }


                stopSpinner();

              } else {
                
                // Success. Account has been created and the user
                // has logged in successfully. 

                console.log("account successfully created: " + email);

                game.user.profile = Meteor.user().profile;

                game.user._id =  Meteor.userId();

                //for the conversations object

                game.user.msg.userID = Meteor.userId();

                mission = null;


                if (_obj) {

                  game.user.isGuest = true;

                  game.user.updateAvatar( _obj.picture.medium );

                  game.user.photoReady.set( true );

                  game.user.mode = uHelp;    

                  stopSpinner();  
c("about to go help route in submitApplication")
                  FlowRouter.go("/help");

                }
                else {
                  
                  game.user.makeAvatar( _gender );

                  FlowRouter.go("/intro");

                }

              }
              
            });  //end createUser
        
        }  //end if password OK  

        else {

c("password was not OK: " +  password)
          stopSpinner();

          passwordTooShortError();

        } //end if passwordOK else
}
