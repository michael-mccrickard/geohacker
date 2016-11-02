
/**************************************************************/
/*              DISPLAY OBJECT         
/**************************************************************/

Display = function() {

  /*********************************************/
  /*            Change all refs on these from hacker.  to display.       
  /*********************************************/


    this.browser = new Browser();

    this.help = new Help();

    this.stats = new Stats();

    //layout constants

    this.menuHeight = 50;

    this.videoParent = null;


    this.disableHomeButton = function() {

        $("#navHomeButton").addClass("disabled");

        $("#imgNavHomeButton").css("opacity", "0.35");
    }

    this.enableHomeButton = function() {

        $("#navHomeButton").removeClass("disabled");

        $("#imgNavHomeButton").css("opacity", "1.0");
    }

    this.getImageFromFile = function(_file) {

      // Create new offscreen image to test

      var theImage = new Image();

      theImage.src = _file;

      return theImage;
    }


    this.homeButtonDisabled = function() {

        if ( $("#navHomeButton").hasClass("disabled") ) return true;

        return false;
    }

    this.scrollToBottom = function() {

        document.documentElement.scrollTop = document.body.scrollTop = $(document).height();
    }

    this.scrollToTop = function() {

        document.documentElement.scrollTop = document.body.scrollTop = 0;
    }

    this.suspendAllMedia = function() {

      if (hacker.ctl["SOUND"]) {

        if (hacker.ctl["SOUND"].getState() == sPlaying) hacker.ctl["SOUND"].suspend();

        if (hacker.ctl["VIDEO"].getState() == sPlaying) hacker.ctl["VIDEO"].suspend();
      }
      
      if (display.browser.video) {

         if (display.browser.video.isYouTube) display.browser.video.suspend();
      }

    }

    this.focusLost = function() {

      if ( youtube.on.get() ) this.reshowYouTube = true;

      this.suspendAllMedia();

      game.suspendGameSound();
    }

    this.focusGained = function() {

      if (this.reshowYouTube) {

        this.reshowYouTube = false;

        youtube.show();

        c( 'in focus gained, state of video control is ' + hacker.ctl["VIDEO"].getState())
      }

      if (hacker.ctl["SOUND"]) {

        if (hacker.ctl["SOUND"].getState() == sSuspended) hacker.ctl["SOUND"].play();

        if (hacker.ctl["VIDEO"].getState() == sSuspended) hacker.ctl["VIDEO"].play();
      }

      game.resumeGameSound();

    }

    this.playEffect = function(_file) {

    if (game.gameSoundSuspended) return;

      $("#effectsPlayer").attr("src", _file);

      document.getElementById("effectsPlayer").play();
    }

    this.playEffect2 = function(_file) {

    if (game.gameSoundSuspended) return;

      $("#effectsPlayer2").attr("src", _file);

      document.getElementById("effectsPlayer2").play();
    }

    this.playEffect3 = function(_file) {

    if (game.gameSoundSuspended) return;

      $("#effectsPlayer3").attr("src", _file);

      document.getElementById("effectsPlayer3").play();
    }

    this.stopEffects = function() {

      document.getElementById("effectsPlayer").pause();

      document.getElementById("effectsPlayer2").pause();

      document.getElementById("effectsPlayer3").pause();
    }


    this.unfocusMe = function(which) {

      document.getElementById( which ).blur();
    }

    this.unfocusMyClass = function(which) {

      document.getElementsByClassName( which ).blur();
    }
}
