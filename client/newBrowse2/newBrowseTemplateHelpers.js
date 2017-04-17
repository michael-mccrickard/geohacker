//newBrowseTemplateHelpers.js

var fullWidth = 1500;


function scaleMe( _val ) {

   var _w = $(window).width();

   _val = _val * (_w / fullWidth);

   return _val + "px";

}

Template.newBrowse2.helpers({

	country: function() {

		if (display.browser) display.browser.updateFlag.get();

		return db.getCountryRec( hack.countryCode );

	},

	countryColor: function() {

		return this.co;
	},

  countryMap: function() {

    return hack.getCountryMapURL();
  },

	homelandText: function() {

		return this.ht;
	},

	TTSize: function() {

		if (this.tts) return scaleMe(this.tts);

		return scaleMe(20);
	},

	HTSize: function() {

		if (this.hts) return scaleMe(this.hts);

		return scaleMe(31.11);
	},

	TTColor: function() {

		if (this.ttc) return this.ttc;

		return "yellow";
	},	

	HTColor: function() {

		if (this.htc) return this.htc;

		return "white";
	},	

	translatedCountryText: function() {

		return hack.getCountryName();
	},

     flagImage: function() {

    	return hack.getFlagPic();
  	},

  	flagMaxHeight: function() {

  		return $(window).height() * 0.18;
  	},

  	flagMaxWidth: function() {

  		return $(window).width() * 0.117;
  	},

    flagBorder: function() {

      if (hack.countryCode == "NP") return "";

      return  "border: 4px solid; border-color: gray;"

    },

    globePic: function() {

      display.browser.updateFlag.get();

      if (game.user.returnRoute == "congrats")  return "geohacker_logo.png";

      if (game.user.returnRoute == "home")  return game.user.profile.av;

      return "pixel_globe.png";
    },

    globeSize: function() {

      display.browser.updateFlag.get();

      if (game.user.returnRoute == "congrats")   return "48px";

      if (game.user.returnRoute == "home")   return "48px";

      return "60px";
    },
/*
  leftImage: function() {

      display.browser.updateFlag.get();

      return display.browser.getSidewallImage("left");
    },
*/
     leftText: function() {

      display.browser.updateFlag.get();

      return display.browser.getSidewallText("left");
    },
/*
     rightImage: function() {

      display.browser.updateFlag.get();

      return display.browser.getSidewallImage("right");
    },
*/
     rightText: function() {

      display.browser.updateFlag.get();

      return display.browser.getSidewallText("right");
    },

  	video: function() {

      display.browser.updateFlag.get();

  		return display.browser.items;  //records from ghVideo
  	},

  	videoName: function() {

      display.browser.updateFlag.get(); 

  		var _dt = this.dt;

  		var _index = editor.arrCode.indexOf( _dt );

  		if ( _index != -1) return editor.arrCodeText[ _index ];

  		return "???";
  	},

  	videoThumbnailOrFile: function() {

   		display.browser.updateFlag.get(); 		

  		if ( youtube.isFile(this.u) ) {

  			 return ("http://img.youtube.com/vi/" + this.u + "/default.jpg");
  		}
  		else {

			   return Video.playControlPic;
		  }
  	},

    youTubeWaiting: function() {

      return youtube.waiting.get();
    },

    returnName: function() {

      return game.user.returnName;
    },

   	leftVideoEdge: function( _index ) {

  		display.browser.updateFlag.get();

  		var _count = display.browser.items.length;

  		var _fullWidth = _count * (120 + 8);

  		//return ( $(window).width() / 2) - (_fullWidth/2) + (_index * (120 + 8) );

      return 0.02 * $(window).width() + (_index * (120 + 8) );
  	},

    isBrowseMode: function() {

      if (!game.user) return;

      if (game.user.mode == uBrowseCountry) return true;

      return false;

    },

    lessonModeLearn: function() {

      if (game.lesson.state.get() == "learn") return true;

      return false;
    },

 });

Template.newBrowse2.events({

/*
    'click img#browseLeftImage': function(e) {

        display.featuredMeme = display.browser.leftMeme;
                
        display.browser.showFeatured("/newBrowse2");      


    },
*/
    'click img.flag': function(event, template) {

//game.user.browseCountry( "AU", "newBrowse2" );

		      game.user.browseCountry( db.getRandomRec( db.ghC ).c, "newBrowse2" );
      },

    'click .ytthumb': function(event, template) {

        var _id = event.target.id;

        var _videoid = $("img#" + _id).data("videoid");

        display.browser.playVideo( _videoid, _id );

    },

/*
    'click .imgPrimaryThumb': function(event, template) {

    		var _id = event.target.id;

    		var _type = $("#" + _id).data("type");

    		var _name = $("#" + _id).data("name");

    		var _videoid = $("#" + _id).data("videoid");

    		var _src = $("#" + _id).attr("src");
    		
    		if ( _type == "modal" ) {

    			display.unit = new Unit("modal", _name, _src);

    			display.unit.preloadImage();

    			//$('#zoomInModal').modal('show');

          display.browser.hiliteFrame( _id );

          $('#zoomInModal').on('hidden.bs.modal', function () {

              c("modal hide")

              if (display.browser.videoFrameID.length) {

                display.browser.hiliteFrame( display.browser.videoFrameID );
              }
          });
    		}

    		if (_type == "video") {

    			display.browser.playVideo( _videoid, _id );
    		}

      },
*/
      'click .btnReturn': function(e) {
        
        e.preventDefault();

        display.browser.returnToPrevious();
      },
 });


Template.newBrowse2.rendered = function() {

  if (!display.browser.loaded) {


    display.browser.leftMeme.preloadImagesForSidewall( "left");

    display.browser.rightMeme.preloadImagesForSidewall( "right");
  }

  if (hack.countryCode != display.browser.countryCode) {

    c("playing video b/c countryCodes don't match")

    display.browser.countryCode = hack.countryCode;

    var _count = display.browser.items.length;

    display.browser.playVideoByIndex( Database.getRandomValue(_count) );    

//display.browser.playVideoByIndex( 3 );

  }
  else {
    
    if (display.browser.video) {

      if (display.browser.video.isYouTube) {

          c("browser not playing YT video b/c countryCodes do match")

          youtube.show();

          game.pauseMusic();

          Meteor.setTimeout( function() {refreshWindow("newBrowse2"); }, 250 );      
      }
      else {

        c("browser resuming GIF video")

         display.browser.resumeVideo();
      }
    }
    else {

      c("no browser.video found")
    }
  }

  display.browser.setFontSizesOnMemes();

  display.browser.updateFlag.get();

	stopSpinner();
}

