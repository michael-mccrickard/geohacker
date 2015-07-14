Template.newNav.helpers({

  userLoggedIn:  function() {

    return game.loginStatus.get();
  },

  userName:  function() {

    if (game.loginStatus.get() == true) return game.user.name.toUpperCase();

    return "LOGIN";
  },

  displayIsReady: function() {

  	if (Session.get("sDisplayReady") == true) return true;

  	return false;
  }

})