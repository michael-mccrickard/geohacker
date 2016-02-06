//bio.js

Template.bio.helpers({

    userEditMode: function() {

      return game.user.editMode.get();
    },

    profile: function() {

      return Meteor.user().profile;
    }


}); 

Template.bio.events({

  'click #editBio': function(e) {

      e.preventDefault();  

      game.user.editMode.set( true );

      redrawBio();

  },

  'click #cancelBioEdit': function(e) {

      e.preventDefault();  

      endEditMode();

  },

  'click #saveBioEdit': function(e) {

      e.preventDefault();  

      db.updateUserBio();

      endEditMode();

  },

  'change #avatarFileInput': function(event, template) {

    var uploader = game.user.bio.avatarUploader;

    var _file = event.target.files[0];


    uploader.send(_file, function (error, downloadUrl) {

      if (error) {
       
        // Log service detailed response.
        console.log(error);

      }
      else {

        game.user.updateAvatar( downloadUrl );
      
      }
    });

  },

   'change #featuredPicFileInput': function(event, template) {
    
      var uploader = game.user.bio.featuredUserPicUploader;

      var _file = event.target.files[0];

      uploader.send(_file, function (error, downloadUrl) {

        if (error) {
         
          // Log service detailed response.
          console.log(error);
        }
        else {

          game.user.updateFeaturedPic( downloadUrl );
        
        }
      });
  }, 


});

/* Now imagesRendered is calling draw()
Template.bio.rendered = function() {

  //Better to wait on a callback from imagesRendered, but for now ...

  redrawBio();

}
*/

function endEditMode() {

    game.user.editMode.set( false );

    redrawBio();
}


