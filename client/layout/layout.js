Template.layout.helpers({

  zoomInModalTitle: function() {

      return display.meme.name;
  },

  srcImgZoomInModal: function() {

      display.updateFlag.get();

      return display.meme.src;
  },

  zoomInModalText: function() {

      return display.meme.text;
  }

})