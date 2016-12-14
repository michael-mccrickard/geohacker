Template.miniAgent.rendered = function() {

  Meteor.subscribe("agentsInNetwork");

}

Template.miniAgent.helpers({

  agent: function() {

    if (!Meteor.user()) return Meteor.users.findOne( { _id: Database.getChiefID()[0] } ); 


    //this could be the agent most recently added or interacted with

    return Meteor.users.findOne( { _id: { $in: Meteor.user().profile.ag  } } );
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

      _status = this.profile.st;

      if (_status == usFake) _status = usActive;

      return arrUserStatus[ _status - 1 ];

    },

    hackCount: function() {

      return this.profile.h.length;
    },


}); 