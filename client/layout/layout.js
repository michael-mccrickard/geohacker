Template.layout.helpers({

  browserZoomMeme: function() {

    return display.browser.zoomMeme.get();
  },

  zoomInModalTitle: function() {

      return hacker.unit.name;
  },

  srcImgZoomInModal: function() {

      hacker.updateFlag.get();

      return hacker.unit.src;
  },

  zoomInModalText: function() {

      return hacker.unit.text;
  }

})