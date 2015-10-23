//profile.js

Template.profile.helpers({

    userEditMode: function() {

      return game.user.editMode.get();
    },

    profile: function() {

      return Meteor.user().profile;
    }


}); 

Template.profile.events({

  'click #editProfile': function(e) {

      e.preventDefault();  

      game.user.editMode.set( true );

      redrawProfile();

  },

  'click #cancelProfileEdit': function(e) {

      e.preventDefault();  

      endEditMode();

  },

  'click #saveProfileEdit': function(e) {

      e.preventDefault();  

      db.updateUserProfile();

      endEditMode();

  },


});

Template.profile.rendered = function() {

  //Better to wait on a callback from imagesRendered, but for now ...

  redrawProfile();

}

function endEditMode() {

    game.user.editMode.set( false );

    redrawProfile();
}


function redrawProfile() {

  Meteor.setTimeout( function() { game.user.profile.draw(); }, 100 );

  //Meteor.setTimeout( function() { drawEditButtons(); }, 101 );



}

/*
function drawEditButtons() {

  if (game.user.editMode.get() ) {

    if ( $("#saveProfileEdit").css("opacity") == "0" ) fadeIn( "saveProfileEdit" );

    if ( $("#cancelProfileEdit").css("opacity") == "0" ) fadeIn( "cancelProfileEdit" );

    if ( $("#editAvatar").css("opacity") == "0" ) fadeIn( "editAvatar" );

    if ( $("#editFeaturedPic").css("opacity") == "0" ) fadeIn( "editFeaturedPic" );

  }
  else {

    if ( $("#startProfileEdit").css("opacity") == "0" ) fadeIn( "startProfileEdit" ); 
  }
}
*/
