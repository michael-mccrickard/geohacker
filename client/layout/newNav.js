Template.newNav.helpers({

  ghCurrentUser: function() {

    if (Meteor.user() != null) return true;

    return false;
  },

  displayIsReady: function() {

  	if (Session.get("sDisplayReady") == true) return true;

  	return false;
  }

})