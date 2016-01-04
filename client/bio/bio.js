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

  Meteor.setTimeout( function() { game.user.profile.draw(); }, 100 );

}


