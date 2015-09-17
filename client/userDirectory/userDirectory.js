

Template.userDirectory.events = {

  'click #closeUserDirectory': function (e) { 

  		e.preventDefault();

      FlowRouter.go("/missionSelect")
  	}
}

Template.userDirectory.helpers({

	hackCount: function() {

		return game.user.atlas.length;
	},

})