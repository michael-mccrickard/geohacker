//learn.js


Template.learnCountry.rendered = function() {

}

Template.learnCountry.onCreated(function () {

  // Use this.subscribe inside onCreated callback
  this.subscribe("allLeaders");
  this.subscribe("allCapitals");
  this.subscribe("allFlags");  

});


Template.learnCountry.helpers({

	country: function() {

		var _val = game.lesson.updateFlag.get();

		return db.getCountryRec( hack.countryCode );

	},

	countryColor: function() {

		return this.co;

	},

	homelandText: function() {

		return this.ht;

		//return hack.getHomelandText();
	},

	TTSize: function() {

		if (this.tts) return this.tts + "px";

		return "18px";
	},

	TTColor: function() {

		if (this.ttc) return this.ttc;

		return "yellow";
	},	


	HTSize: function() {

		if (this.hts) return this.hts + "px";

		return "28px";
	},

	HTColor: function() {

		if (this.htc) return this.htc;

		return "white";
	},	

	HTMarginLeft: function() {

		if (this.htl) return this.htl + "px";

		return "-134px"
	},

	countryName: function() {

		return this.n;

		//return hack.getCountryName();
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

		if (this.co == "#FFD700") return "black"

		return "white";
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