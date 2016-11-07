getRandomString = function() {

    var id = "";

    var num = parseInt( Math.random() * 10000 ) ;

    for (var i = 1; i <= 4; i++) {

        var charCode = Math.floor( Math.random() * ( 90 - 65 + 1) + 65);

        id = id + String.fromCharCode(charCode);
    }

    return (id + num);
}

//************************************************************
//    Array functions
//************************************************************

isInReactiveArray = function(_ele, _arr) {

    for (var i = 0; i < _arr.length(); i++) {

        if (_arr.get(i) == _ele) return true;
    }

    return false;
}

findObjectWithID = function( _id, _arr) {

     for (var i = 0; i < _arr.length; i++) {

        if (_arr[i].id == _id) return _arr[i];
    }

    return null;   
}

getElementIndexForObjectID = function( _id, _arr) {

     for (var i = 0; i < _arr.length; i++) {

        if (_arr[i].id == _id) return i;
    }

    return -1;  

}

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

    if (!hacker.ctl["VIDEO"]) return false;

    return true;
}

doSpinner = function() {

    Session.set("sWaitingOnDatabase", true);
}

stopSpinner = function() {

    Session.set("sWaitingOnDatabase", false);
}

whichBrowser = function(){
    var ua= navigator.userAgent, tem,
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
}

//************************************************************
//     Formatting functions
//************************************************************

capitalizeFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

centerDivOnDiv = function( _eleNarrow, _eleWide ) {

    var fullWidth = $(_eleWide).innerWidth();

    var narrowWidth = $(_eleNarrow).innerWidth();

    $(_eleNarrow).css("left", fullWidth/2 - narrowWidth/2 + "px"); 

}

centerDivOnDiv2 = function( _eleToCenter, _eleToCenterWidth, _eleWide ) {

    var fullWidth = $(_eleWide).innerWidth();

    var narrowWidth = _eleToCenterWidth;

    $(_eleToCenter).css("left", fullWidth/2 - narrowWidth/2 + "px"); 

}

getTextColorForBackground = function( _col )  {

    if (_col == "#FFD700" || _col == "#FFFF00" || _col == "#33FFFF" || _col == "#7FFFD4" || _col == "#00FFFF" || _col =="#87CEFA" || _col == "#66FFFF" || _col == "#FFB6C1" || _col == "#87CEEB") return "black"

    return "white";
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

        browseMap.worldMap.map.clearLabels();

        browseMap.finishDraw();

        return;
    }

    if (name == "closeup") {

        hacker.closeUp.draw();

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

        hacker.redimension();

        return;
    }

    if (name == "worldMap") {

        hackMap.worldMap.map.clearLabels();

        hackMap.finishDraw();

        return;
    }

    if (name == "newBrowse") {

        var myVideo = { width: 0, height: 0, top: 0, left: 0 };

        display.browser.draw( myVideo );

        Video.setSize( myVideo );

        Video.setPos( myVideo );

        display.browser.updateContent();
    }

    if (name == "help") {

        var myVideo = { width: 0, height: 0, top: 0, left: 0 };

        display.help.drawVideo(myVideo);

        Video.setSize( myVideo );

        Video.setPos( myVideo );
    }
}



myVideo = null;

// YouTube API will call onYouTubeIframeAPIReady() when API ready.
// Make sure it's a global variable.

onYouTubeIframeAPIReady = function () {

c("youtube ready")

    var _file = null;

    youtube.loaded = true;

    youtube.waiting.set(false);


    switch (game.user.mode) {

        case uBrowseCountry:

            _file = display.browser.video.file;

            break;
        
        case uHack:

             _file = hacker.ctl["VIDEO"].video.file;
 
            break;

        case uHelp:

              _file = display.help.video.file;

            break;

        case uEdit:

              _file = editor.video.file;

            break;

    }   


    //We are either sizing this to fit the featured area or just doing
    //a preset size for the editor or relative one for the intro

    var myVideo = { width: 0, height: 0, top: 0, left: 0 };


    switch (game.user.mode) {

        case uIntro: {

            myVideo = { width: $(window).width(), height: $(window).height() * 9/16, left: 0, top: 70 };

            Video.setPos( myVideo );

            break;
        }

        case uEdit:

            myVideo = { width: 720, height: 480, top: 0, left: 0 };

            editor.setVideoPos( myVideo );

            Video.setPos( myVideo );

            break;
        
        case uBrowseCountry:

            display.browser.draw( myVideo );
 
            break;

        case uHack: 

            hacker.feature.dimension( "video", myVideo, null );
            
            Video.setPos( myVideo );

            break;

        case uHelp: 

            display.help.drawVideo( myVideo );
            
            Video.setPos( myVideo );

            break;

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

                if (_file) event.target.playVideo();

                if (game.user.mode == uBrowseCountry) {
c("setting pos of browse video in onYouTubeIframeAPIReady")
                    Video.setPos( myVideo );               
                }  
c("showing yt in onYouTubeIframeAPIReady")
                youtube.show();
            },

            onStateChange: function (event) {

                // Play video when player ready.

                if (event.data == YT.PlayerState.PLAYING) {
c("yt is now playing in onYouTubeIframeAPIReady")
                      //redundant, except when we are coming here from a hack, or after a hack 

                      if (game.user.mode == uBrowseCountry) {

                        c("yt player is pausing the music b/c video is playing in browse mode")

                          game.pauseMusic();

                          refreshWindow("ytplayer");
                      }

                      if (game.user.mode == uHelp) refreshWindow("ytplayer");

                      if ( !youtube.on.get() ) youtube.show();
                }

                if (event.data == YT.PlayerState.PAUSED) {

                      if (game.user.mode == uBrowseCountry) {

                        c("yt player is playing the music b/c video is paused in browse mode")

                        game.playMusic();
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
    color: '#FFFF00', // #rgb or #rrggbb
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: true, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: 'auto', // Top position relative to parent in px
    left: 'auto' // Left position relative to parent in px
};
