Template.miniAgent.rendered = function() {

  Meteor.subscribe("agentsInNetwork");

}

Template.miniAgent.helpers({

  agent: function() {

    var _agent = hack.getWelcomeAgent();

    if (_agent) return _agent;

    return Meteor.users.findOne( { _id: Database.getChiefID()[0] } ); 

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

    miniAgentTitle: function() {

      _val = this.profile.ut;

      if (_val == utHonoraryGeohackerInChiefCountry) return "Honorary GIC";

      if (_val == utGeohackerInChiefCountry) return "GIC";     

      return "Agent"

    },

    hackCount: function() {

      return this.profile.h.length;
    },


}); 

Template.miniAgent.events({


  'click .divAgentMini' : function(e, t) {

      var _id = t.find('.imgAgentAvatarMini').id;


      display.browser.showAgentModal( _id)
  }

})