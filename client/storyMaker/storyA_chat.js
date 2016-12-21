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


storyA_chat_firstGuardVisit = [

	{
		"i": "h",
		"n": "root",
		"d": [{ "t": "Huh ... what?  Everything's under control!", "g":"*" }]
	},

	{
		"i": "u",
		"n": "*",
		"d": [ { "t": "Excuse me, I need to get a painting from you.", "g": "painting?"}, { "t": "Bye", "g": "exit"}  ]  

	},

	{
		"i": "h",
		"n": "painting?",
		"d": [{ "t": "Painting?  You can't be serious.  This is the world's greatest art museum, not a pawn shop.", "g":"needTheMonaLisa" }]
	},

	{
		"i": "u",
		"n": "needTheMonaLisa",
		"d": [ { "t": "Actually, I need the Mona Lisa.  It is important.", "g": "monaLisa?"}, { "t": "The Mona Lisa, now!", "g": "handItOver?"}, { "t": "Bye", "g": "exit"}  ]  
	},

	{
		"i": "h",
		"n": "handItOver?",
		"d": [{ "t": "Hand it over?  You want to get rough, huh?  Security!!", "g":"youAreSecurity" }]
	},

	{
		"i": "u",
		"n": "youAreSecurity",
		"d": [ { "t": "You are the security.", "g": "monaLisa?"}, { "t": "Never mind.", "g": "exit"}  ]  
	},

	{
		"i": "h",
		"n": "monaLisa?",
		"d": [{ "t": "Well, I know that, but I cannot help you.  I am holding the Mona Lisa for a special Geosquad Agent.", "g":"iAmGeosquad" }]
	},	

	{
		"i": "u",
		"n": "iAmGeosquad",
		"d": [ { "t": "That would be me.  I am from Geosquad.", "g": "youHaveThePasscode?"}, { "t": "Oh, okay, sorry to bother you.", "g": "exit"}  ]  
	},

	{
		"i": "h",
		"n": "youHaveThePasscode?",
		"d": [{ "t": "Oh, I see.  So you have the passcode?", "g":"passcode?" }]
	},	
	{
		"i": "u",
		"n": "passcode?",
		"d": [ { "t": "No.", "g": "noPasscode"}, { "t": "Yes.", "g": "yesPasscode"}  ]
	},
	{
		"i": "h",
		"n": "noPasscode",
		"d": [ { "t": "Well, tough luck then.", "g": "howPasscode"} ]
	},
	{
		"i": "u",
		"n": "howPasscode",
		"d": [ { "t": "How do I get the passcode?", "g": "vanGogh"}, { "t": "Oh, well. Thanks, anyway.", "g": "exit"}  ]
	},
	{
		"i": "h",
		"n": "yesPasscode",
		"d": [ { "t": "I do not see any passcode, Monsieur.", "g": "howPasscode"} ]
	},
	{
		"i": "h",
		"n": "vanGogh",
		"d": [ { "t": "Just between you and me, I understand that a painter named Van Gogh has the passcode.  Good luck with that, though.  He is unusual.", "g": "thanks"} ]
	},

	{
		"i": "u",
		"n": "thanks",
		"d": [ { "t": "Thank you, sir.  This was most helpful.", "g": "exit"}, { "t": "Where do I find him?", "g": "whereVanGogh"}  ] 
	},

	{
		"i": "h",
		"n": "whereVanGogh",
		"d": [ { "t": "I thought you were a Geosquad agent!  Don't you have resources that help you with that stuff?  I would try his home country first.  Ask a senior agent, if you need to.", "g": "thanks2"} ] 
	},

	{
		"i": "u",
		"n": "thanks2",
		"d": [ { "t": "OK.  Goodbye.", "g": "exit"}  ] 
	}
];

storyA_chat_missionToMona = [

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