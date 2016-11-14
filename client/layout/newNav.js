Template.newNav.helpers({

  userHasAvatar: function() {

    if (Meteor.user() == null) return false;

    if (Meteor.user().profile.av == null) return false;

    if (game.user) {

      if ( !game.user.photoReady.get() ) return false;    
    }

    if (Meteor.user().profile.av.length) return true;

    return false;
  },

/*
  displayIsReady: function() {

  	if (Session.get("sDisplayReady") == true) return true;

  	return false;
  },
*/

  isAdmin: function() {

    if (Meteor.user() == null) return false;

    if (Meteor.user().profile.st == usAdmin) return true;

    return false;
  }

})
