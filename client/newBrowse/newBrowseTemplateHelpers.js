//newBrowseTemplateHelpers.js

var fullWidth = 1500;


function scaleMe( _val ) {

   var _w = $(window).width();

   _val = _val * (_w / fullWidth);

   return _val + "px";

}

Template.newBrowse.helpers({

	country: function() {

		if (display.browser) display.browser.updateFlag.get();

		return db.getCountryRec( hack.countryCode );

	},

	countryColor: function() {

		return this.co;
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

	countryName: function() {

		return hack.getCountryName();
	},

    capitalImage: function() {

    	return hack.getCapitalPic();
  	},

     capitalName: function() {

    	return hack.getCapitalName();
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

     leaderImage: function() {

    	return hack.getLeaderPic();
  	},

     leaderName: function() {

    	return hack.getLeaderName();
  	},

  	video: function() {

      display.browser.updateFlag.get();

  		return display.browser.videoCtl.items;
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

  		if ( Control.isYouTubeURL(this.u) ) {

  			 return ("http://img.youtube.com/vi/" + this.u + "/default.jpg");
  		}
  		else {

			   return display.browser.videoCtl.playControlPic;
		  }
  	},

    youTubeWaiting: function() {

      return display.ctl["VIDEO"].youTubeWaiting.get();
    },

  	primary: function() {

      display.browser.updateFlag.get(); 

  		return display.browser.primaryItems;
  	},

    returnName: function() {

      return game.user.returnName;
    },

   	leftPrimaryEdge: function( _index ) {

  		display.browser.updateFlag.get();

  		var _count = display.browser.primaryItems.length;

  		var _fullWidth = _count * (120 + 8);

  		return ( $(window).width() / 2) - (_fullWidth/2) + (_index * (120 + 8) );
  	},

   	leftVideoEdge: function( _index ) {

  		display.browser.updateFlag.get();

  		var _count = display.browser.videoCtl.items.length;

  		var _fullWidth = _count * (120 + 8);

  		return ( $(window).width() / 2) - (_fullWidth/2) + (_index * (120 + 8) );
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

Template.newBrowse.events({

    'click .imgFlag': function(event, template) {

		      game.user.browseCountry( db.getRandomRec( db.ghC ).c, "newBrowse" );
      },

    'click .ytthumb': function(event, template) {

        var _id = event.target.id;

        var _videoid = $("img#" + _id).data("videoid");

        display.browser.playVideo( _videoid, _id );

    },

    'click .imgPrimaryThumb': function(event, template) {

    		var _id = event.target.id;

    		var _type = $("#" + _id).data("type");

    		var _name = $("#" + _id).data("name");

    		var _videoid = $("#" + _id).data("videoid");

    		var _src = $("#" + _id).attr("src");

    		
    		if ( _type == "modal" ) {

    			display.meme = new Meme("modal", _name, _src);

    			display.meme.preloadImage();

    			$('#zoomInModal').modal('show');

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

      'click .btnReturn': function(e) {
        
        e.preventDefault();

        display.browser.returnToPrevious();
      },
 });


Template.newBrowse.rendered = function() {

  if (hack.countryCode != display.browser.countryCode) {

c("playing video b/c countryCodes don't match")

    display.browser.countryCode = hack.countryCode;

    var _count = display.browser.videoCtl.items.length;

    display.browser.playVideoByIndex( Database.getRandomValue(_count) );    

//display.browser.playVideoByIndex( 3 );

  }
  else {
c("not playing video b/c countryCodes do match")
    if (ytplayer) {
      
      Session.set("sYouTubeOn", true);

      game.pauseMusic();

      Meteor.setTimeout( function() {refreshWindow("newBrowse"); }, 250 );

    }
  }

	stopSpinner();
}

