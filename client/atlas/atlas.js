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

});

sprayDivs = function() {

	var _arr = game.user.assign.hacked;

	var _delay = 0;

	for (var i = 0; i < _arr.length; i++) {

		_delay += 0.1;

		var _item = "div#" + _arr[i];

		var _top = -1 * $(_item).position().top - 128;

		var _left = -1 * $(_item).position().left - 128;

		$(_item).css("opacity", 1);

		TweenLite.from(_item, 0.5, {opacity: 0, left:_left, top: _top, delay: _delay});

		Meteor.setTimeout( function(){ display.scrollToBottom(); }, _delay*1000 + 1);

	}
	
	Meteor.setTimeout( function(){ FlowRouter.go("/congrats"); }, _delay*1000 + 4000);

} 


Template.atlas2.helpers({

	country: function() {

		return game.user.assign.hacked;
	},

	countryName: function(_id) {

		return db.getCountryName( _id);
	},

	flagPic:  function(_id) {

		return db.getFlagPicByCode( _id );
	}

})