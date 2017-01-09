Template.debrief.events = {

  'click #divDebrief': function (e) { 

  		e.preventDefault();

  		display.playEffect("new_feedback.mp3");

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

    		return "MISSION DEBRIEFING FOR STREAM " + hack.messageID;  			
  		}
    }

})
