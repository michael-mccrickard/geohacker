Template.atlas.helpers({

	country: function() {

		return game.user.atlasIDs();
	},

	countryName: function() {

		return db.getCountryNameByID( db.getCountryID( this.toString() ) );
	},

	flagPic:  function() {

		return db.getFlagPicByID( db.getCountryID( this.toString() ) );
	},

	hackedText: function() {

		var count = game.user.getTicketCount( this.toString() );

		return "Hacked " + count + "x";
	},

})

Template.atlas.events({

  'click .item': function(e) { 

      e.preventDefault();  

      var _code = e.currentTarget.id;

      game.user.browseCountry( _code, "home" );

    },

}) 