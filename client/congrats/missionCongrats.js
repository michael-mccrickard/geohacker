
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

				var _num = Database.getRandomFromRange(0,8);

				display.playLoop( "congrats" + _num + ".mp3");

				sprayDivs();

			}
		}
  } 
  else {

  	console.log("congrats map data not ready")

  }

});  

