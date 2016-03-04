//agents_template_helpers.js

Template.agents.helpers({

	agent: function() {

		return Meteor.users.find( {} );
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

    hackCount: function() {

    	return this.profile.h.length;
    },


}); 