
var deadline = 0;


Template.missionCongrats.rendered = function() {

	var _time = parseInt( (mission.finish - mission.start) / 1000 );

	_time = _time.toFixed(2);

	$("#msCongratsMission").text( mission.name.toUpperCase() );

	var _s = game.user.assign.hacked.length + " countries hacked in " + (_time) + " seconds"

	$("#msCongratsStats").text( _s.toUpperCase() );	

	$("#msCongratsAgent").text( "AGENT " + game.user.name.toUpperCase() );	

	$("#msCongratsPic").attr("src", game.user.avatar() );	

	display.fadeInElement("#msCongratsInfo");

	Session.set("sCongratsImageDataReady", false);

	Meteor.subscribe("allFlagsForMission", game.user.assign.hacked, function() { Session.set("sCongratsImageDataReady", true);})
}

Tracker.autorun( function(comp) {

  if (Session.get("sCongratsImageDataReady") ) {

        console.log("mission congrats image data ready")

		if (typeof display === 'undefined') return;

		if (mission) {

			if (mission.status == msComplete)	{

				var _num = Database.getRandomFromRange(1,8);

				display.playLoop( "congrats" + _num + ".mp3");

				sprayDivs();

			}
		}
  } 
  else {

  	console.log("congrats map data not ready")

  }

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
