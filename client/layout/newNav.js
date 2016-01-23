Template.newNav.helpers({

  countryIsSelected: function() {

    if ( Session.get("sCountryIsSelected") ) return true;

    return false;
  }

  userHasAvatar: function() {

    if (Meteor.user() == null) return false;

    if (Meteor.user().profile.av.length) return true;

    return false;
  },

  displayIsReady: function() {

  	if (Session.get("sDisplayReady") == true) return true;

  	return false;
  }

})

Template.waiting.rendered = function() {

	if (typeof hack === "undefined") return

	if (hack.debrief == null) return;

	//if (hack.debrief.waitingNow) hack.debrief.goNext();
}