//agents_template_helpers.js

Template.agents.helpers({

	agent: function() {

		return Meteor.users.find( { _id: { $ne: Meteor.user()._id  } } );
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

      return arrUserStatus[ this.profile.st - 1 ];
    },

    hackCount: function() {

    	return this.profile.h.length;
    },

    pic: function() {

    	return this.profile.p;
    }


}); 


Template.miniAgent.helpers({

  agent: function() {

    return Database.getRandomElement( Meteor.users.find( { _id: { $ne: Meteor.user()._id  } } ).fetch() );
  },
  
  name: function() {

    return this.username;
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

      return arrUserStatus[ this.profile.st - 1 ];
    },

    hackCount: function() {

      return this.profile.h.length;
    },


}); 

Template.agents.events({

  'click .divAgentAvatar': function(e) { 

      e.preventDefault();  

      Session.set("sProfiledUserID", e.currentTarget.id);

      game.user.setMode( uBio );   

    },

  'click .divAgentFlag': function(e) { 

      e.preventDefault();  

      game.user.browseCountry( e.target.id );

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

}) 