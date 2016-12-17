storyA_chat_intro = [

	{
		"i": "h",
		"n": "root",
		"d": [{ "t": "Sorry, can't talk now.  Try back in a few minutes.", "g":"*" }]
	},

	{
		"i": "u",
		"n": "*",
		"d": [ { "t": "Bye.", "g": "exit"}  ]  

	}
];

storyA_chat_needAPasscode = [

	{
		"i": "h",
		"n": "root",
		"d": [{ "t": "Yes ...?", "g":"*" }]
	},

	{
		"i": "u",
		"n": "*",
		"d": [ { "t": "Mona Lisa?", "g": "mona"}, { "t": "Timbuktu?", "g": "timbuk"}, { "t": "Bye.", "g": "exit"}  ]  

	},

	{
		"i": "h",
		"n": "mona",
		"d": [{ "t": "The Mona Lisa is a painting by Leonardo Da Vinci.  It hangs in the Louvre.", "g":"louvre?" }]
	},

	{
		"i": "u",
		"n": "louvre?",
		"d": [ { "t": "The Louvre?", "g": "louvre"}, { "t": "OK.", "g": "*"}  ]  

	},


	{
		"i": "h",
		"n": "louvre",
		"d": [{ "t": "The Louvre is a famous art museum in Paris.", "g":"paris?" }]
	},
	
	{
		"i": "u",
		"n": "paris?",
		"d": [ { "t": "Paris?", "g": "paris"}, { "t": "OK.", "g": "*"}  ]  
	},

	{
		"i": "h",
		"n": "paris",
		"d": [ { "t": "Paris is the capital of France.", "g": "*"}  ]  

	},
	
	{
		"i": "h",
		"n": "timbuk",
		"d": [ { "t": "Timbuktu is a city in Mali.", "g": "mali?"} ]  
	},

	{
		"i": "u",
		"n": "mali?",
		"d": [ { "t": "Mali?", "g": "mali"}, { "t": "OK.", "g": "*"}  ]  
	},

	{
		"i": "h",
		"n": "mali",
		"d": [ { "t": "Mali is a country in Northwestern Africa.", "g": "*"}  ]  
	},
];