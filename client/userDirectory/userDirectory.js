Template.userDirectory.rendered = function(){

  stopWait();
}

Template.userDirectory.events = {

  'click #closeUserDirectory': function (e) { 

  	  e.preventDefault();

      nav.closeEditor();
  	},

  'click .deleteRecord': function(e) {

  	  e.preventDefault();

      game.deleteUser( e.target.id );
  },
}

Template.userDirectory.helpers({

	//when we have roles, we will use a parameter on the find()
	//to limit which users show up  (super-admin = all, curator = all for their country or countries)

	ghUser: function() {

		return Meteor.users.find( {} );
	}

})