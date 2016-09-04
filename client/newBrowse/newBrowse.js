//newBrowse.js

Browser = function() {

	this.video = "jdNw0g7SOMc";
}

Template.newBrowse.rendered = function() {

	  if (youTubeLoaded == false) {
	    
	    c("calling YT.load() in browser")
	    
	    YT.load();
	  }
	  else {

	  	c("loading YT vid by ID in browser")
	    
	    ytplayer.loadVideoById( display.browser.video);            
	  }

}