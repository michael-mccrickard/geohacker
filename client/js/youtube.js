Template.youtube.helpers({

  youTubeClass: function() {

    var _val = Session.get("sYouTubeOn");
  
    if (_val == true) return "";

    return "invisible";

  },

  youTubePosition: function() {

  	if (hack) {

  		if (hack.mode == mEdit) {

  			return "relative";
  		}
  	}

  	return "absolute";
  }

});