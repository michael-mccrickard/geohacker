
Template.help.rendered = function() {

	game.pauseMusic();

	//prevent the video from playing if we just are restarting the app with this template displayed

	if (game.user == null) return;

	//assuming intro tab selected for now

	display.help.playVideo( "INTRO" );
}
