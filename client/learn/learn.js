//learn.js


Template.learnCountry.rendered = function() {

}

Template.learnCountry.onCreated(function () {

  // Use this.subscribe inside onCreated callback
  this.subscribe("allLeaders");
  this.subscribe("allCapitals");
  this.subscribe("allFlags");  

});

var fullWidth = 1700;


function scaleMe( _val ) {

   var _w = $(window).width();

   _val = _val * (_w / fullWidth);

   return _val + "px";

}

function scaleMe2( _val ) {

   var _w = $(window).width();

   _val = _val * (_w / fullWidth);

   return (_val * 0.95) + "px";

}

Template.lessonMap.events = {

  'click .learnCountry': function (evt, template) {

      Control.playEffect("new_feedback.mp3");

      FlowRouter.go("/main");
  },
}

Template.learnCountry.helpers({

	LCWidth: function() {

		return scaleMe( 400 );

	},

	LCHeight: function() {

		return scaleMe( 222.22 );
	},  

	HTBaseFontSize: function() {

		return scaleMe( 31.11 );
	},

	capitalWidth: function() {

		return scaleMe( 257.77 );
	},

	learnRightWidth: function() {

		return scaleMe( 106.66 );
	}, 

	flagHeight: function() {

		return scaleMe( 64.44 );
	},  

	leaderHeight: function() {
		return scaleMe( 142.22 );
	},  

	capitalMarginTop: function() {
		return scaleMe( 8.88 );
	}, 

	capitalFontSize: function() {
		return scaleMe( 20 );
	}, 

	TTSize: function() {

		if (this.tts) return scaleMe(this.tts);

		return scaleMe( 20 )
	},

	HTSize: function() {

		if (this.hts) return scaleMe(this.hts);

		return scaleMe(31.11);
	},

	HTMarginLeft: function() {

		if (this.htl) return scaleMe2( this.htl );

		return scaleMe( -148.88);
	},

	/*  end scaled values */

	country: function() {

		var _val = game.lesson.updateFlag.get();

		return db.getCountryRec( hack.countryCode );

	},

	countryColor: function() {

		return this.co;
	},

	homelandText: function() {

		return this.ht;
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

		return this.n;
	},

    capitalImage: function() {

    	return hack.getCapitalPic();
  	},

     capitalName: function() {

    	return hack.getCapitalName();
  	},

     capitalOpacity: function() {

		if (this.hto) return this.hto;

		return "1.0";
  	},

    capitalTextColor: function() {

    	//the white text on a light-colored bg is problematic

    	return getTextColorForBackground( this.co );
  	},


     flagImage: function() {

    	return hack.getFlagPic();
  	},

     leaderImage: function() {

    	return hack.getLeaderPic();
  	},

     leaderName: function() {

    	return hack.getLeaderName();
  	}

 });

function goBrowse( _id ) {

	  if (game.lesson.quiz.inProgress.get() ) {

  	  	  Control.playEffect( hacker.locked_sound_file );

	  	  game.lesson.setMessage("BROWSE COUNTRY NOT AVAILABLE DURING QUIZ");

	  	  game.lesson.setTextColor("red");

	  	  return;  	  	
  	  }

      game.user.browseCountry( _id, "lessonMap" );
}


Template.learnCountry.events = {

  'click .learnCountryElement': function (evt, template) {

  		goBrowse( evt.target.id );

  },
}