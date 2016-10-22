Template.layout.helpers({

  zoomInModalTitle: function() {

      return hacker.meme.name;
  },

  srcImgZoomInModal: function() {

      hacker.updateFlag.get();

      return hacker.meme.src;
  },

  zoomInModalText: function() {

      return hacker.meme.text;
  }

})