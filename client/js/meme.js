/*********************************************

	DATA TYPES  -- dt field in database  (which table in db uses this code; plus info about the data in the record)

	These are also documented in editor.js in a more formal way, along with the video dt codes.

common -- used by all countries

	ant = anthem, nation anthem sound file (sound: file = sound file)

	ldr = leader name & pic (image and text and debrief;  text = leader name, debrief text = leader title)
	
	cap = capital name & pic (image and text and debrief; text = capital name, image = capital pic, debrief = code only)

	cmp -- normal map pic with name of country visible (image = pic file)

	rmp -- redacted map pic with name of country obscured (image = pic file)

	map -- a map that naturally has no identifying country name on it, used as both cmp and rmp (image = pic file)


	//By convention, there is only one language sound file per country
	//and it matches whatever lng_ record is found in the debrief records

	lng = language (sound = sound file)
	
	//language name records (one per country)

	lng_o = official language name (debrief text = name)
	lng_om =  official language name, one of multiple official languages (debrief text = name)
	lng_i = indigenous language name (debrief text = name)

optional -- used by some countries

	cus, cus[X] -- "custom" debrief (could be anything)/ (image or web) + debrief (image or web = pic file, debrief text = caption text)

	hqt, hqt[X] --  "headquarters" debrief / businesses headquartered in the country / (image or web) + debrief (image or web = pic file, debrief text = caption text)

	text & image pairs -- used by some countries as debriefs / text clues
	When used as a debrief / text clue:  text = name of entity, debrief = explanatory text, image or web = relevant image

		art -- artist (broadly speaking, could be writer, musician, actor, etc.)

		lan, lan[X] -- landmark

**********************************************/

Meme = function( _rec )  {

	this.type = "";

	this.image = "";

	this.text = "";

	this.textClue = "";

	this.rec = _rec;

	if (_rec) {

		this.rec = _rec;

	}

	this.init = function() {

		this.code = this.rec.dt.substr(0,3);	

		this.setText();

		this.setImage();
	}

	this.setImage = function() {

		this.image = "";

		if (this.code == "lng") this.image = hacker.soundPlayingPic;

		if (this.code == "flg")  this.image = hack.getFlagPic();

		if (this.code == "ldr")  this.image = hack.getLeaderPic();

		if (this.code == "cap")  this.image = hack.getCapitalPic();

		if (!this.image.length) this.image = hack.getCustomPic( this.rec.dt );		

	} 

	this.setText = function() {

		this.text = "";

		if (this.code == "cap") {

			var capital = hack.getCapitalName();

			this.text = capital + " is the capital of " + hack.getCountryName() + ".";
		}

		if (this.code == "ldr") {

			var leaderName = hack.getLeaderName();

			var leaderType = hack.getLeaderType();

			this.text = leaderName + " is the " + leaderType + " of " + hack.getCountryName() + ".";
		}

		//the code is the first 3 letters of the field and dt is the full field

		if (this.code  == "hqt") {

			this.text = this.rec.t + " is headquartered in " + hack.getCountryName() + ".";
		}

		if (this.rec.dt  == "lng_i") {

			this.text = this.rec.t + " is one of the indigenous languages of " + hack.getCountryName() + ".";
		}

		if (this.rec.dt  == "lng_o") {

			this.text = this.rec.t + " is the official language of " + hack.getCountryName() + ".";
		}

		if (this.rec.dt  == "lng_om") {

			this.text = this.rec.t + " is one of the official languages of " + hack.getCountryName() + ".";
		}

		if (!this.text.length) this.text = this.rec.t;

	}

}
