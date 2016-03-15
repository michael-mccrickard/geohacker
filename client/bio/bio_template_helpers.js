

Template.bio.helpers({

    userEditMode: function() {

      return game.user.editMode.get();
    },

    profile: function() {

      return Meteor.users.findOne( { _id: Session.get("sProfiledUserID") } ).profile;
    }
}); 

Template.bio.events({

  'click #editBio': function(e) {

      e.preventDefault();  

      game.user.editMode.set( true );

      game.user.bio.redraw();

  },

  'click #cancelBioEdit': function(e) {

      e.preventDefault();  

      endEditMode();

  },

  'click #saveBioEdit': function(e) {

      e.preventDefault();  

      doSpinner();

      db.updateUserBio();

      endEditMode();

  },

  'change #avatarFileInput': function(event, template) {

    game.deleteUserS3File( game.user.profile.av );

    var uploader = game.user.bio.avatarUploader;

    var _file = event.target.files[0];

    doSpinner();

    uploader.send(_file, function (error, downloadUrl) {

      stopSpinner();

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

      game.deleteUserS3File( game.user.profile.p );
    
      var uploader = game.user.bio.userFeaturedPicUploader;

      var _file = event.target.files[0];

      doSpinner();

      uploader.send(_file, function (error, downloadUrl) {

        stopSpinner();

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


function endEditMode() {

    game.user.editMode.set( false );

    game.user.bio.redraw();
}


