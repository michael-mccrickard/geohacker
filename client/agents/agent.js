//agents_template_helpers.js

Template.agent.helpers({



  welcomeAgent: function() {

    return Meteor.user();
  },

	agentInNetwork: function() {

    if (!Meteor.user() ) return Meteor.users.findOne( { _id: Database.getChiefID()[0] } ).fetch();

		var _arr = Meteor.users.find( { _id: { $in: Meteor.user().profile.ag  } } ).fetch();  

//var _arr = Meteor.users.find().fetch();  

   _arr.reverse();  //see most recently added agents first

    return (_arr);

	},
	
	name: function() {

		return this.username;
	},

	t: function() {

		return this.profile.t;
	},

	f: function() {

		return this.profile.f;
	},

    av: function() {

      return this.profile.av;
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

    pic: function() {

    	return this.profile.p;
    }


}); 

Template.bigAgent.events( {

    'click .imgBigAgentAvatar' : function(e) {

      Session.set("sProfiledUserID", e.currentTarget.id);

      $('#helperAgentBio').modal('show');

      $('h4.modal-title.modalText.helperAgentBioName').text( hack.welcomeAgent.username.toUpperCase() );           
    },

    'click .bigAgentLabel' : function(e) {

      Session.set("sProfiledUserID", e.currentTarget.id);

      $('#helperAgentBio').modal('show');

      $('h4.modal-title.modalText.helperAgentBioName').text( hack.welcomeAgent.username.toUpperCase() );           
    }
})


Template.agent.events({

  'click .divAgentAvatar': function(e) { 

      e.preventDefault();  

      Session.set("sProfiledUserID", e.currentTarget.id);

      game.user.setMode( uBio );   

    },

  'click img.agentFlag': function(e) { 

      e.preventDefault();  

      game.user.browseCountry( e.target.id, "home" );

    },


  'click .imgButtonAgentDelete': function(e) { 

      e.preventDefault();  

      var _userID = e.currentTarget.id;

showMessage("delete not implemented yet")


    },

  'click .imgAgentContactButton': function(e) { 

      e.preventDefault();  

      doSpinner();

      game.user.msg.targetID.set( e.currentTarget.id );

      game.user.msg.startThread();


    },

});
