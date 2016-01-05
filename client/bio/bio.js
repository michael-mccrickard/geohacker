//bio.js

//pictures (featured pic on the agent's home page)

var ghPicture = new FS.Collection("ghPicture", {
  stores: [new FS.Store.FileSystem("ghPicture")]
});

var picturePath = "cfs/files/ghPicture/";


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

    var files = event.target.files;
    
    for (var i = 0, ln = files.length; i < ln; i++) {
    
      game.ghAvatar.insert(files[i], function (err, fileObj) {

          var oldURL = Meteor.user().profile.av;

          var url = avatarPath + fileObj._id + "/" + fileObj.original.name;

          Meteor.setTimeout( function() { Meteor.users.update( {_id: Meteor.userId() }, { $set: { 'profile.av': url}  }); }, 500  );

          Meteor.setTimeout( function() { redrawBio(); }, 750 );

          Meteor.setTimeout( function() { game.ghAvatar.remove( { _id: getCFS_ID( oldURL) })}, 1000);
      
      });

    }
  },

   'change #featuredPicFileInput': function(event, template) {

    var files = event.target.files;
    
    for (var i = 0, ln = files.length; i < ln; i++) {
    
      game.ghImage.insert(files[i], function (err, fileObj) {

          var oldURL = Meteor.user().profile.p;

          var url = imagePath + fileObj._id + "/" + fileObj.original.name;

          Meteor.setTimeout( function() { Meteor.users.update( {_id: Meteor.userId() }, { $set: { 'profile.p': url}  }); }, 500  );

          Meteor.setTimeout( function() { redrawBio(); }, 750 );

          //if it's a public picture (in our public folder) then we don't want to do this, but it's harmless (?)

          Meteor.setTimeout( function() { game.ghImage.remove( { _id: getCFS_ID( oldURL) })}, 1000);
      
      });

    }
  }, 


});

Template.bio.rendered = function() {

  //Better to wait on a callback from imagesRendered, but for now ...

  redrawBio();

}

function getCFS_ID (_url) {

  var _index = _url.lastIndexOf("/");

  //lop off the actual filename part

  _url = _url.substring(0, _index);

  _index = _url.lastIndexOf("/");

  _url = _url.substring(_index + 1);

  return (_url);

}


function chooseAvatarFile() {

  $("#avFileInput").click();
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
