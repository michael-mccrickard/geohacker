story_defaultAgent = function( _rec ) {

	var _obj = {

		n: capitalizeAllWords( _rec.username ),
		sn: "da",         //default agent
		top: 0.47,
		l: 0.47,
		scx: 0.10,
		scy: 0.15,
		p: _rec.profile.av,
		origSize: { width: 72, height: 72}, 
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