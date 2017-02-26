
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

this.unit = new Unit();

    this.featuredMeme = new Meme();

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


    this.animateScrollToBottom = function() {

      var curScroll = {x:getScrollX(), y:getScrollY()};

      TweenLite.to(curScroll, 2, { y: $(document).height(), onUpdate:function() { window.scrollTo(curScroll.x, curScroll.y); }});
    }


    this.suspendAllMedia = function() {

      //game.pauseMusic();

      if (hacker.ctl["SOUND"]) {

        if (hacker.ctl["SOUND"].getState() > sLoaded) hacker.ctl["SOUND"].pause();

        if (hacker.ctl["VIDEO"].getState() > sLoaded) hacker.ctl["VIDEO"].pause();
      }
      
      if (youtube.loaded) {

          youtube.stop();

          youtube.hide();
      }

    }

    this.playEffect = function(_file) {

      document.getElementById("effectsPlayer").loop = false;

      $("#effectsPlayer").attr("src", _file);

      document.getElementById("effectsPlayer").play();
    }

    this.playEffect2 = function(_file) {

      $("#effectsPlayer2").attr("src", _file);

      document.getElementById("effectsPlayer2").play();
    }

    this.playEffect3 = function(_file) {

      document.getElementById("effectsPlayer3").loop = false;

      $("#effectsPlayer3").attr("src", _file);

      document.getElementById("effectsPlayer3").play();
    }


    this.playLoop = function(_file) {

      $("#effectsPlayer3").attr("src", _file);

      document.getElementById("effectsPlayer3").loop = true;

      document.getElementById("effectsPlayer3").play();
    }

    this.stopLoop = function(_file) {

        document.getElementById("effectsPlayer").pause();
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

    this.replaceNewline = function(input) {

      var newline = String.fromCharCode(13, 10);

      return this.replaceAll(input, '\\n', newline);
    }

    this.replaceAll = function (input, find, replace) {

        var result = input;
      
        do {
            var split = result.split(find);

            result = split.join(replace);
        
        } while (split.length > 1);
      
        return result;
    }
}


function getScrollX() {
  return (window.pageXOffset != null) ? window.pageXOffset : (document.documentElement.scrollLeft != null) ? document.documentElement.scrollLeft : document.body.scrollLeft;
}
//returns the current vertical scroll position
function getScrollY() {
  return (window.pageYOffset != null) ? window.pageYOffset : (document.documentElement.scrollTop != null) ? document.documentElement.scrollTop : document.body.scrollTop;
}