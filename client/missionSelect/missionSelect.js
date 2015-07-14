Template.missionSelect.events = {

  'click .missionButton': function (e) { 

  		e.preventDefault();

  		Control.playEffect("goMission.mp3");

      	var id = e.currentTarget.id;

      	game.user.bumpAssign( id );

      	game.user.assignAndStartMission( id );
  	}
}

Template.missionSelect.helpers({

	missionItem: function() {

		return game.user.assigns;
	},

	missionCode: function() {

		return this.code;
	},

	missionName: function() {

		return this.name;
	},

	missionHackTotal: function() {

		return this.hacked.length;
	},

	missionPoolTotal: function() {

		return this.hacked.length + this.pool.length;
	},

	missionCompletions: function() {

		var s = "TIMES";

		if (this.completions == 1) s = "TIME";

		return this.completions + " " + s;
	},

	missionProgress: function() {

		var ratio = this.hacked.length / (this.hacked.length + this.pool.length) * 100.0;

		if (ratio >= 100.0) return 100;

		return ratio.toPrecision(2);
	},

	verb: function() {

		return "GO";
	}

})

