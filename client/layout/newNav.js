Template.newNav.helpers({

  userHasAvatar: function() {

    if (Meteor.user() == null) return false;

    if (game.user == null) return false;

    if (game.user.avatarURL.get().length &&  game.user.avatarURL.get() != "0") return true;
  },

  displayIsReady: function() {

  	if (Session.get("sDisplayReady") == true) return true;

  	return false;
  },

  avatarURL: function() {

  	return game.user.avatarURL.get();
  }

})