
//****************************************************************
//                  HELPERS
//****************************************************************



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

    return db.ghC.find( {r: Session.get("sUserRegion") }, {sort: { n: 1 }} );
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

    'click #loginInstagram': function(e,t) {

        loginWithService("instagram");
    },

    'click #loginGoogle': function(e,t) {

        loginWithService("google");
    },

    'click #clockIn' : function(e, t){

      e.preventDefault();

      doSpinner();
      
      loginUser(t);

    },

    'click #goHack': function (e) { 

      e.preventDefault();

//*************************************************************************************************************
//*************************************************************************************************************
//                  CHANGE WHAT THE BIG START BUTTON DOES HERE
//
//      If everything in the block below is commented out, then the program proceeds normally
//  
//*************************************************************************************************************
//*************************************************************************************************************

//storyManager.startEditor();

//testStory("A");

//game.user.browseCountry( db.getRandomRec( db.ghC ).c, "newBrowse2" );

//FlowRouter.go("mapboxCongrats0");

//return;

//*************************************************************************************************************
//*************************************************************************************************************
//                  END OF CHANGE WHAT THE BIG START BUTTON DOES HERE
//  
//*************************************************************************************************************
//*************************************************************************************************************

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

      display.playEffect2("startButton.mp3");

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





/*

    'click #createGuest': function(event, template) {

        Meteor.call("createGuest", function(_err, _data){

            if (_err) {

              showMessage(_err);

              return;
            }

            _data.results[0].ut = utAgent;

            _data.results[0].st = usActive;  

              doSpinner();

            //we could create a guest record here in the db (ghGuest) and stamp with time started
            //but currently all of that info and more is going into mixpanel, which we may want to prevent

            submitApplication(null, _data.results[0]);         
        });
      
      },
*/
