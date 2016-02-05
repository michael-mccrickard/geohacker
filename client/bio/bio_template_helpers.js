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

Template.bio.rendered = function() {

  //Better to wait on a callback from imagesRendered, but for now ...

  redrawBio();

}

function endEditMode() {

    game.user.editMode.set( false );

    redrawBio();
}


function redrawBio() {

  Meteor.setTimeout( function() { draw(); }, 100 );

}

function draw() {

  var icon1 = null;

  var icon2 = null;

  if ( game.user.editMode.get() ) {

    icon1 = "#saveBioEdit";

    icon2 = "#cancelBioEdit";
  }
  else {

    icon1 = "#startBioEdit";
  }

  var _height = $(window).height();

  var _width = $(window).width();

  var thisDivTop = $("div.divHomeTop").position().top + $("div.divHomeTop").height();




  var bottom = $(".divBioFeaturedPic").height() +  $(".divBioFeaturedPic").position().top;

  var top = bottom - 0.02 * $(".divBioFeaturedPic").height();

  $(icon1).css("top", top);

  if (icon2) $(icon2).css("top", top);


  var left = $(".divBio").width() + $(".divBio").position().left - 32 - 0.01 * $(".divBioFeaturedPic").width();

  $(icon1).css("left", left); 

  if (icon2) $(icon2).css("left", left - 48); 

  if (game.user.editMode.get() ) {        

      //edit avatar button

      top = $("img.imgBioAvatar").position().top;

      var bottom = top + $("img.imgBioAvatar").height();

      $("#editAvatar").css("top", bottom - 32);

      left = $("img.imgBioAvatar").position().left;

     $("#editAvatar").css("left", left + 4);


      //edit featured pic button

      top = $("img.imgBioFeaturedPic").position().top;

      bottom = top + $("img.imgBioFeaturedPic").height();

      $("#editFeaturedPic").css("top", bottom - 36);

      left = $("img.imgBioFeaturedPic").position().left;

     $("#editFeaturedPic").css("left", left + 4);


    if ( $("#saveBioEdit").css("opacity") == "0" ) fadeIn( "saveBioEdit" );

    if ( $("#cancelBioEdit").css("opacity") == "0" ) fadeIn( "cancelBioEdit" );

    if ( $("#editAvatar").css("opacity") == "0" ) fadeIn( "editAvatar" );

    if ( $("#editFeaturedPic").css("opacity") == "0" ) fadeIn( "editFeaturedPic" );

  }
  else {

    if ( $("#startBioEdit").css("opacity") == "0" ) fadeIn( "startBioEdit" ); 
  }

}