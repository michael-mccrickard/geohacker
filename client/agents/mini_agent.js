Template.miniAgent.rendered = function() {

  Meteor.subscribe("agentsInNetwork");

}

Template.miniAgent.helpers({

  agent: function() {

    var _agentID = hack.browseAgentID.get();

    return Meteor.users.findOne( { _id: _agentID } );

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

      if (_val == utHonoraryGeohackerInChiefCountry) return "Honorary Chief";

      if (_val == utGeohackerInChiefCountry || _val == utGeohackerInChiefPlanet ) return "Chief Agent";     

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