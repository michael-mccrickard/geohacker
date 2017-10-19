Template.debrief.events = {

  'click #divDebrief': function (e) { 

  		e.preventDefault();

  		display.playEffect("new_feedback.mp3");

      //if the mission is over, then we have a special congrats sequence

      if (game.user.assign.pool.length == 0) {

          FlowRouter.go("missionCongrats");

          return;
      }

  		Meteor.setTimeout( function() { FlowRouter.go("/congrats") }, 100 ) ;
  	}

}

Template.debrief.helpers({

    debriefFontsize: function() {

      if (this.s) return this.s;

      return "3.5vh";
    },

    headline: function() {

    	if (game.user.mode == uBrowseCountry) {

    		return "DEBRIEFING FOR " + hack.getCountryName();
  		}
  		else {

    		return "DEBRIEFING FOR AGENT " + game.user.name;  			
  		}
    }

})
