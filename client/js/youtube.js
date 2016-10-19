YouTube = function()  {

   this.on = new Blaze.ReactiveVar( false );

   this.loaded = false;

   this.waiting = new Blaze.ReactiveVar( false );

   this.load = function() {

      if (!this.loaded) {
      
        console.log("ytplayer being created in youtube.js")

        this.waiting.set( true );
        
        //in this case, we let onYouTubeIframeAPIReady() load the correct file and play it
        //it will also set youTubeLoaded

        YT.load();

        return;

      }
   }

   this.play = function( _file ) {

      this.show();

      ytplayer.loadVideoById( _file ); 
   }

   this.pause = function() {

      ytplayer.pauseVideo(); 
   }

   this.stop = function() {

      ytplayer.stopVideo(); 
   }

   this.hide = function() {

      this.on.set( false );
   }

   this.show = function() {

      this.on.set( true );
   }

   this.isFile = function( _s ) {

      //check for the file type designator and return false if found

      if (!_s) return false;

      if (_s.substr(_s.length - 4) == ".gif") return false;

      return true;
    } 

}

Template.youtube.helpers({

  youTubeClass: function() {

    var _val = youtube.on.get();
  
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