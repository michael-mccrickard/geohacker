//home.js

function deselectAll() {

	$(".divHomeButtonPic").css("border-color","gray");


}

Template.home.helpers({

    homeContent: function() {

        return Session.get("sHomeContent");
    },

});

Template.home.events({

  'click #divHomeHackPic': function(e) {

      e.preventDefault();  

      deselectAll();

      Session.set("sHomeContent", "missionListing")

	  $("#divHomeHackPic").css("border-color","red");

  },

  'click #divHomeStatsPic': function(e) {

      e.preventDefault();  

      deselectAll();

      Session.set("sHomeContent", "stats")

    $("#divHomeStatsPic").css("border-color","red");

  },

});
