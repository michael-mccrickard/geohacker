

Template.userDirectory.events = {

  'click .missionButton': function (e) { 

  		e.preventDefault();

  		Control.playEffect("goMission.mp3");

      	var id = e.currentTarget.id;

      	game.user.bumpAssign( id );

      	game.user.assignAndStartMission( id );
  	}
}

Template.userDirectory.helpers({

	hackCount: function() {

		return game.user.atlas.length;
	},

})