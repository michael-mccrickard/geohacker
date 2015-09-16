

Template.userDirectory.events = {

  'click #closeUserDirectory': function (e) { 

  		e.preventDefault();

      Router.go("/missionSelect")
  	}
}

Template.userDirectory.helpers({

	hackCount: function() {

		return game.user.atlas.length;
	},

})