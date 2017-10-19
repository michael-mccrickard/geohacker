Template.missionListing.rendered = function(){

  display.scrollToTop();

  stopSpinner();
}

function doMission(e) {

      	var id = e.currentTarget.id;

      	if (mission) {

	  		if (mission.status == msInProgress && id == mission.code) {

	  			game.user.resumeMission();

	  			return;
	  		}
  		}

      	game.user.bumpAssign( id );

      	game.user.assignAndStartMission( id );

      	Database.registerEvent( eMissionStart, game.user._id, id);
}

Template.missionItemDetails.events = {

  'click .missionButton': function (e) { 

  		e.preventDefault();

  		doMission(e);
  	}
}

Template.missionListing.helpers({

	missionItem: function() {

		return game.user.getRootLevelAssigns();
	},
});


Template.missionItemDetails.helpers({

	missionCode: function() {

		//if (this.mapCode) return this.mapCode;

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

		if (hack != null) {

			if (mission) {

				if (this.name == mission.name && this.hacked.length != mission.items.length) return "CONTINUE";			
			}			
		}

		return "GO";
	},

	subMission: function(_code) {

		//var _parentAssign = game.user.assigns[_n];

		return game.user.getSubAssignsForContinent( _code );
	}
});

