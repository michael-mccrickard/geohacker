Template.bigAgent.rendered = function() {

  stopSpinner();

}

Template.bigAgent.helpers({

  welcomeAgent: function() {

    return hack.getWelcomeAgent();
  },

  agentCountry: function() {

    return db.getCountryName( this.profile.cc )
  },

  agentStatus: function() {

      _status = this.profile.st;

      if (_status == usFake) _status = usActive;

      return arrUserStatus[ _status - 1 ];

  },

    hackCount: function() {

      return this.profile.h.length;
    },

});

Template.bigAgent.events({

  //clicking anywhere on the agent banner hides the agent

  'click .imgBigAgentDeleteButton': function(e) { 

      e.preventDefault();  

      $(".divWelcomeAgent").css("display", "none");  

    },

    'click .imgBigAgentAvatar' : function(e) {

      Session.set("sProfiledUserID", e.currentTarget.id);

      $('#helperAgentBio').modal('show');

      $('h4.modal-title.modalText.helperAgentBioName').text( hack.welcomeAgent.username.toUpperCase() );           
    }

});