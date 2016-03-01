
//************************************************************
//     filename utilities
//************************************************************


getS3Prefix = function() { return prefix; } 

getLocalPrefix = function() { return "http://localhost:3000/";}

getS3FileFromPath = function(_path) {

    var i = _path.lastIndexOf("/");

    var s = _path.substring(i+1);

    i = s.indexOf("-");

    return (s.substring(i+1));
}

isURL = function( _name ) {

  if (_name.substr(0,7) == "http://" || _name.substr(0,8) == "https://") return true;

  return false;
}

videoControl = function() {

    if (display == null) return false;

    if (!display.ctl["VIDEO"]) return false;

    return true;
}

waitOnDB = function() {

    Session.set("sWaitingOnDatabase", true);
}

stopWaitOnDB = function() {

    Session.set("sWaitingOnDatabase", false);
}
//************************************************************
//     Update the screen element proportions
//************************************************************

$(window).resize(function(){
    
    refreshWindow("window-resize");

});



refreshWindow = function(_which) {

    Session.set("gWindowHeight", $(window).height() );

    Session.set("gWindowWidth", $(window).width() );

    var url = FlowRouter.current().path;

    if (url == "/start" || url == "/editor" || url == "/selectCountry" || url == "/congrats" ) return;

    var name = FlowRouter.getRouteName();

    if (name == "browseWorldMap") {

        display.ctl["MAP"].browseWorldMap.map.clearLabels();

        display.ctl["MAP"].browseFinishDraw();

        return;
    }

    if (name == "closeup") {

        display.closeUp.draw();

        return;
    }

    if (name == "debrief") {

        hack.debrief.draw();

        return;
    }

    if (name == "home") {

        if (game.user.template.get() == "profile") game.user.profile.draw();

        if (game.user.template.get() == "bio") game.user.bio.draw();
    
        return;
    }

    if (name == "main") {

        display.redraw();

        return;
    }

    if (name == "worldMap") {

        display.ctl["MAP"].worldMap.map.clearLabels();

        display.ctl["MAP"].finishDraw();

        return;
    }




}



// YouTube API will call onYouTubeIframeAPIReady() when API ready.
// Make sure it's a global variable.

onYouTubeIframeAPIReady = function () {

    var _file = null;

    youTubeLoaded = true;

    if (display != null) {

      if (display.ctl["VIDEO"]) {

        _file = display.feature.video;

      }

      if (editor && hack.mode == mEdit) {

        if (editor.videoFile) {

          _file = editor.videoFile;
        }
      }
    }

    //We are either sizing this to fit the featured area or just doing
    //a preset size for the editor

    var myVideo = { width: 0, height: 0, top: 0, left: 0 };

    if (hack.mode == mEdit) {

        myVideo = { width: 720, height: 480, top: 0, left: 0 };
    }
    else {

        display.feature.dimension( "video", myVideo, null );
        
        $(".featuredYouTubeVideo").css("left",  myVideo.left);  

        $(".featuredYouTubeVideo").css("top", myVideo.top);
    }

    ytplayer = new YT.Player("ytplayer", {

        height: myVideo.height, 
        width: myVideo.width,
        
        playerVars: {
                rel: "0",
                modestbranding: "1",
                showinfo: "0",
                iv_load_policy: "3"
         },

        videoId: _file,

        // Events like ready, state change, 
        events: {

            onReady: function (event) {

                // Play video when player ready.

               if ( videoControl() ) {

                    display.ctl["VIDEO"].youTubeWaiting.set( false );
                }

                if (_file) event.target.playVideo();

            },

            onStateChange: function (event) {

                // Play video when player ready.

                if (event.data == YT.PlayerState.PLAYING) {

                    if ( videoControl() ) {

                        display.ctl["VIDEO"].setState( sPlaying );

                        $("img#picVIDEO").attr("src", display.ctl["VIDEO"].pauseControlPic);
                    }
                }

                if (event.data == YT.PlayerState.PAUSED) {

                    if ( videoControl() ) {

                        display.ctl["VIDEO"].setState( sPaused );

                        $("img#picVIDEO").attr("src", display.ctl["VIDEO"].playControlPic);
                    }
                }

            }

        }

    });

}; 


Meteor.Spinner.options = {
    lines: 13, // The number of lines to draw
    length: 10, // The length of each line
    width: 5, // The line thickness
    radius: 15, // The radius of the inner circle
    corners: 0.7, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#FFFFFF', // #rgb or #rrggbb
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: true, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: 'auto', // Top position relative to parent in px
    left: 'auto' // Left position relative to parent in px
};
