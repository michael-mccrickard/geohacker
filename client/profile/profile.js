//profile.js

Template.profile.helpers({

    flag: function() {

        return db.getFlagPicByCode( game.user.profile.cc );
    },

    country: function() {

    	return db.getCountryName( game.user.profile.cc ).toUpperCase();
    },

    utext: function() {

    	return game.user.profile.text;
    },

    pic: function() {

    	return game.user.profile.pic;
    },

    picText: function() {

    	return game.user.profile.picText;
    },

    userEditMode: function() {

      return game.user.editMode.get();
    },


}); 

Template.profile.events({

  'click #editProfile': function(e) {

      e.preventDefault();  

      game.user.editMode.set( true );

      redrawProfile();

  },


});

Template.profile.rendered = function() {

  //Better to wait on a callback from imagesRendered, but for now ...

  redrawProfile();

}

function redrawProfile() {

  Meteor.setTimeout( function() { game.user.profile.draw(); }, 100 );

  Meteor.setTimeout( function() { drawEditButtons(); }, 101 );

  

}

function drawEditButtons() {

    if (game.user.editMode.get() ) {

    if ( $("#saveProfileEdit").css("opacity") == "0" ) fadeIn( "saveProfileEdit" );

    if ( $("#cancelProfileEdit").css("opacity") == "0" ) fadeIn( "cancelProfileEdit" );

  }
  else {

    if ( $("#startProfileEdit").css("opacity") == "0" ) fadeIn( "startProfileEdit" ); 
  }
}