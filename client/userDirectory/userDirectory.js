Template.userDirectory.rendered = function(){

  stopWait();
}

Template.userDirectory.events = {

  'click #closeUserDirectory': function (e) { 

  	  e.preventDefault();

      nav.closeEditor();
  	},

  'click .deleteRecord': function(e) {

  	  e.preventDefault();

      game.deleteUser( e.target.id );
  },

  'click .saveRecord': function(e) {

      e.preventDefault();

      var _status = $("select#" + e.target.id + " option:selected" ).index();

      db.updateUserStatus( e.target.id, _status );
  },

  'click .loginAs': function(e) {

      e.preventDefault();

      //nullify this, so that onLogin will create the new game.user

      game.user = null;

      var email = e.target.id;

      Meteor.loginWithPassword(email, Meteor.settings.public.GENERAL_PASSWORD, function(err){

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
        }

      });
  }
}

Template.userDirectory.helpers({

	//when we have roles, we will use a parameter on the find()
	//to limit which users show up  (super-admin = all, curator = all for their country or countries)

	ghUser: function() {

		return Meteor.users.find( {} );
	},

  userStatus: function() {

    return arrUserStatus;
  },

  selectedValue: function(key) {

    return key ==  this.profile.st ? 'selected' : '';
  }


})