create_story_defaultAgent = function( _rec ) {

	//set the src of this preload element to the pic

	$("#preloadFeature").attr("src", _rec.profile.av);


	imagesLoaded( document.querySelector('#preloadFeature'), function( instance ) {

		story.tempAgentImage = display.getImageFromFile( _rec.profile.av);


		Meteor.setTimeout( function() { story.da = new story_defaultAgent( _rec ); }, 500 );

    });	

}

story_defaultAgent = function( _rec ) { 

	var _obj = {

		n: capitalizeAllWords( _rec.username ), 
		sn: "da",         //default agent
		top: 0.47,
		l: 0.47,
		scx: 0.10,
		scy: 0.15,
		origSize: { width: story.tempAgentImage.width, height: story.tempAgentImage.height },
		p: _rec.profile.av,
		t: "g",               //process this agent like a guest
		ID: story.name + "_" + getRandomString()
	}

	this.init( _obj, 0 );	//default agent is always index zero
}

story_defaultAgent.prototype = new Char();

Tracker.autorun( function(comp) {

  if ( Session.get("sStoryAgentReady") ) {

  	console.log("story agent data ready")

	console.log("calling finishSubs in autorun")

	if (typeof story === 'undefined') return;

  	story.finishSubscriptions( );
  } 

  console.log("story agent data not ready")

});  

storyDefault_cue = function( _name ) {

	var _cue = [];
	
	if ( _name == "default") {

		_cue  = [

					'story.da.add()',
					'story.da.show()',
					'story.da.fadeIn()'

				];	
	}

	if ( _name == "refuseItem") {

		_cue  = [

					'story.da.say("Sorry, I cannot use that.")'

				];	
	}

	return _cue;			

}

storyDefault_chat_preintro = [

	{
		"i": "h",
		"n": "root",
		"d": [ { "t": "Agent, you need to report to your base to get your mission!", "g":"*" } ]
	},

	{
		"i": "u",
		"n": "*",
		"d": [ { "t": "Bye.", "g": "exit"}  ]  

	}
];