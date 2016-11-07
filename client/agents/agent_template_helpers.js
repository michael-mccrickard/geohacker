//agents_template_helpers.js

var index = -1;

arrS = [];

arrA = [];

Session.set("sUpdate", false);

Template.agent.rendered = function() {

Meteor.subscribe("agentsInNetwork", function() { 

  stopSpinner();  
  
 // arrS = Meteor.users.find( { _id: { $in: Meteor.user().profile.ag  } } ).fetch(); 
  
  //arrS.reverse();
  //nextAgent(); 

});


}

Template.bigAgent.rendered = function() {

  stopSpinner();

}

Template.miniAgent.rendered = function() {

  Meteor.subscribe("agentsInNetwork");

}


function nextAgent() {

    index++;

    if (index == arrS.length) return;

    if (arrS[index]) arrA.push( arrS[index] );

    var _val = Session.get("sUpdate");

    Session.set("sUpdate", !_val);

    Meteor.setTimeout( function() { nextAgent() }, 150 );
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

showMessage("contact agent temporarily disabled")

return;

      doSpinner();

      game.user.msg.targetID.set( e.currentTarget.id );

      game.user.msg.startThread();


    },

});



Template.bigAgent.events({

  //clicking anywhere on the agent banner hides the agent

  'click .imgBigAgentDeleteButton': function(e) { 

      e.preventDefault();  

      $(".divWelcomeAgent").css("display", "none");  

    },

});
