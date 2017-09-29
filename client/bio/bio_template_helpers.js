


Template.bio.rendered = function() {

  display.scrollToTop();

  Meteor.call( "getServices", function(err, res){

      if (err) {

        console.log(err);

        return;
      }

      if (res.instagram) {

        game.user.bio.hasInstagram.set(true);
      }

  });
}

Template.bio.helpers({

    userEditMode: function() {

      if (!game.user) return;

      return game.user.editMode.get();
    },

    profile: function() {

      return Meteor.users.findOne( { _id: Session.get("sProfiledUserID") } ).profile;
    },

    featuredUserName: function() {

      return Meteor.users.findOne( { _id: Session.get("sProfiledUserID") } ).username;
    },

    isLoggedInUser: function() {

        if ( Session.get("sProfiledUserID") == Meteor.userId() ) return true;
    
        return false;
    },

    hasInstagram: function() {

      return game.user.bio.hasInstagram.get();
    }
}); 

Template.bio.events({

  'click #editBio': function(e) {

      e.preventDefault();  

      if (!game.user) return;

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

    game.deleteUserS3File( Meteor.user().profile.av );

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

      //game.deleteUserS3File( game.user.profile.p );
    
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

  'click #chooseFromInstagramAccount': function( e, t) {


      Meteor.call("getServices", function(err, res) {

          if (err) {

            console.log(err);

            return;
          }

          $('#instafeed').html("");

          $('#instagramPictures').modal('show');

          var feed = new Instafeed({
              get: 'user',
              userId: parseInt(res.instagram.id),
              accessToken: res.instagram.accessToken,
              resolution: 'standard_resolution',
              template: '<span class="instagram" id="i{{id}}" data-url="{{image}}"><img src="{{image}}" width="150" /></span>'
          });
          feed.run();

      });
  }


});


function endEditMode() {

      if (!game.user) return;

    game.user.editMode.set( false );

    game.user.bio.redraw();
}


