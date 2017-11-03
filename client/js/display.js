
/**************************************************************/
/*              DISPLAY OBJECT         
/**************************************************************/

Display = function() {

  /*********************************************/
  /*            Change all refs on these from hacker.  to display.       
  /*********************************************/


    this.browser = new Browser2();

    this.help = new Help();

    this.stats = new Stats();

this.unit = new Unit();

    this.featuredMeme = new Meme();

    this.mapboxCongrats = null;

    //layout constants

    this.menuHeight = 50;

    this.videoParent = null;

    this.devScreenWidth = 1920;

    //this.screenRatio = screen.width/screen.height;

    this.xFactor = this.devScreenWidth / screen.width;


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

      this.stopEffects();

    }

    this.soundEffectDone = function() {

      if (game.user.mode == uBrowseCountry) {

         display.browser.soundEffectDone();
      }

    }


    this.playEffect = function(_file, _detectEndFlag) {

      document.getElementById("effectsPlayer").loop = false;

      $("#effectsPlayer").attr("src", _file);

      document.getElementById("effectsPlayer").play();

      if (_detectEndFlag) {

          Meteor.setTimeout(function() { 

            var _effects = document.getElementById("effectsPlayer");

            _effects.addEventListener('ended', display.soundEffectDone); 
          
         }, 4000);        
      }
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

        document.getElementById("effectsPlayer3").pause();
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

  this.fadeInElement = function(_element, _val) {

    var _duration = 500;

    if (_val) _duration = _val;

    if ( $(_element).css("opacity") == 0 ) $( _element).velocity( "fadeIn", { duration: _duration} );

  }

  this.fadeOutElement = function( _element, _val ) {
    
    var _duration = 500;

    if (_val) _duration = _val;

    $( _element ).velocity( "fadeOut", { duration: _duration} );
  }


  this.goToImageSource = function() {

    var _imageFile = "";

    var _source = "";

    var _mode = game.user.mode;

    if (_mode == uBrowseCountry) _source = display.featuredMeme.source;

    if (_mode == uHack) _source = hacker.feature.item.source;  

    //if the source is a link, go to it

    if (_source.substr(0,4) == "http") {

        window.open(_source);
    }
    else {

       this.showPhotoClaimForm();
    }
  } 

  this.showPhotoClaimForm = function() {

      var _imageFile = "";

      var _source = "";

      var _mode = game.user.mode;

      if (_mode == uBrowseCountry) {

        _source = display.featuredMeme.source;

        _imageFile = display.featuredMeme.image;
      }

      if (_mode == uHack) {

        _source = hacker.feature.item.source;

        _imageFile = hacker.feature.item.imageFile;
      }   

      if (!_source) _source == "UNKNOWN";

      $('#sourceAttributionModal').modal('show');

      Meteor.setTimeout( function() {

        $("#s3PhotoURL").text( _imageFile);

        $("#photoSource").text( _source );        

      }, 500);
  }
}


function getScrollX() {
  return (window.pageXOffset != null) ? window.pageXOffset : (document.documentElement.scrollLeft != null) ? document.documentElement.scrollLeft : document.body.scrollLeft;
}
//returns the current vertical scroll position
function getScrollY() {
  return (window.pageYOffset != null) ? window.pageYOffset : (document.documentElement.scrollTop != null) ? document.documentElement.scrollTop : document.body.scrollTop;
}