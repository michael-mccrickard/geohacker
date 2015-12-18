//************************************************************
//                 Update the screen element proportions
//************************************************************

$(window).resize(function(){
    
    refreshWindow("window-resize");

});



refreshWindow = function(_which) {

    c("refreshWindow -- " + _which);

    Session.set("gWindowHeight", $(window).height() );

    Session.set("gWindowWidth", $(window).width() );

    var url = FlowRouter.current().path;

    if (url == "/start" || url == "/editor" || url == "/selectCountry" || url == "/congrats" ) return;

    var name = FlowRouter.getRouteName();

    if (name == "closeup") {

        game.display.closeUp.draw();

        return;
    }

    if (name == "debrief") {

        game.debrief.draw();

        return;
    }

    if (name == "worldMap") {

        game.display.ctl["MAP"].finishDraw();

        return;
    }

    if (name == "main") {

        game.display.redraw();

        return;
    }

    if (name == "home") {

        if (game.user.template.get() == "profile") game.user.profile.draw();
    
        return;
    }

}

// YouTube API will call onYouTubeIframeAPIReady() when API ready.
// Make sure it's a global variable.

onYouTubeIframeAPIReady = function () {

    var _file = null;

    if (display != null) {

      if (game.display.ctl["VIDEO"]) {

        game.display.ctl["VIDEO"].youTubeLoaded = true;

        _file = game.display.feature.video;

      }

      if (editor && hack.mode == mEdit) {

        editor.youTubeLoaded = true;
        
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

        game.display.feature.dimension( "video", myVideo, null );
        
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

                game.display.ctl["VIDEO"].youTubeWaiting.set( false );

                if (_file) event.target.playVideo();

            }

        }

    });

}; 

