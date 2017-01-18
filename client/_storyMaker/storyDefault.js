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