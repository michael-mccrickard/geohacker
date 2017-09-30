Template.instagramPictures.events({

  'click .instagram': function( e, t) {

     var _id = e.currentTarget.id;

     console.log( $("#" + _id).data("url") );

     game.user.bio.selectInstagramImage( $("#" + _id).data("url") );
  }

});
