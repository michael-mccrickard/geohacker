


Editor = function() {

	this.hack = new Hack();

	this.dataReady = false;

	this.userDirectoryDataReady = false;

	this.controlType = new Blaze.ReactiveVar( cSound );

	this.controlName = new Blaze.ReactiveVar( "" );

	this.recordID = new Blaze.ReactiveVar( "0" );
  	
  	this.newRecordID = new Blaze.ReactiveVar("0");

  	this.dt = new Blaze.ReactiveVar("");


	this.arrField = ["s"];

	this.arrFieldText = ["f", "s", "dt"];	//this is the only one that still uses the "pass an array of field names to update" method 
											//and it would be better if it used the data object update method

	this.arrFieldDebrief = ["t","ta","tc"];

	this.arrFieldCountry = ["n","c","r","co","d","ht"];  //name, code, region, color, dataFlag, homelandText

	this.scroll = 0;

  	this.video = null;

  	this.soundUploader = new Slingshot.Upload("ghSound");

  	this.imageUploader = new Slingshot.Upload("ghImage");

  	this.webUploader = new Slingshot.Upload("ghWeb");

  	this.videoUploader = new Slingshot.Upload("ghVideo");

 	this.arrCodeText = [];

	this.arrCode = [];

	this.arrCodeExplain = [];

	this.codeExplainText = new Blaze.ReactiveVar("0");

	this.arrFreeCode = [ "art", "cus", "lan" ];

	this.updateContentFlag = new Blaze.ReactiveVar( false );


	//image, text, sound, image/text pairs, text/sound pairs

	this.arrCodeText[0] = "national anthem";
	this.arrCode[0] = "ant";
	this.arrCodeExplain[0] = "Sound file (.mp3) of this country's national anthem";

	this.arrCodeText[1] = "leader";
	this.arrCode[1] = "ldr";
	this.arrCodeExplain[1] = "Text = Name of the country's leader; Image = photo of the country's leader; Meme.text = title of country's leader (President, e.g.);"

	this.arrCodeText[2] = "capital";
	this.arrCode[2] = "cap";
	this.arrCodeExplain[2] = "Text = Name of the country's capital city; Image = photo of the country's capital city; Meme record needs code only.";

	this.arrCodeText[3] = "country map";
		this.arrCode[3] = "cmp";
	this.arrCodeExplain[3] = "Normal country map with the name of the country visible; Image.file = map";

	this.arrCodeText[4] = "country map -- name marked out";
		this.arrCode[4] = "rmp";
	this.arrCodeExplain[4] = "Country map with the name of the country marked out; Image.file = map";

	this.arrCodeText[5] = "country map -- no name";
		this.arrCode[5] = "map";
	this.arrCodeExplain[5] = "Country map without the name of the country at all; Image.file = map";

	this.arrCodeText[6] = "official language (only one)";
		this.arrCode[6] = "lng_o";
	this.arrCodeExplain[6] = "Meme.text = name of this language";

	this.arrCodeText[7] = "official language (1 of multiple languages)";
		this.arrCode[7] = "lng_om";
	this.arrCodeExplain[7] = "Meme.text = name of this language";

	this.arrCodeText[8] = "indigenous language";
		this.arrCode[8] = "lng_i";
	this.arrCodeExplain[8] = "Meme.text = name of this language";

	this.arrCodeText[9] = "language";
		this.arrCode[9] = "lng";
	this.arrCodeExplain[9] = "Sound.file = sound file of this language (.mp3);";

	this.arrCodeText[10] = "custom";
		this.arrCode[10] = "cus";
	this.arrCodeExplain[10] = "Custom message -- could be anything (fun fact, interesting photo, historical info, etc.).  Image.file = photo or other graphic;  Meme.text = text to accompany graphic";

	this.arrCodeText[11] = "headquarters";
		this.arrCode[11] = "hqt";
	this.arrCodeExplain[11] = "Any well-known business headquartered in this country. Image.file = photo or graphic; Meme.text = name of the business";

	this.arrCodeText[12] = "landmark";
		this.arrCode[12] = "lan";
	this.arrCodeExplain[12] = "Any well-known natural or man-made landmark in this country. Image.file = photo or graphic; Meme.text = name of the landmark";

	this.arrCodeText[13] = "artist";
		this.arrCode[13] = "art";
	this.arrCodeExplain[13] = "Any well-known artist based or born in this country (visual artist, writer, musician, etc). Image.file = photo or graphic; Meme.text = name of the artist";

	this.arrCodeText[14] = "flag";
		this.arrCode[14] = "flg";
	this.arrCodeExplain[14] = "Image.file = flag; (if used as Debrief) Meme.text=text for debrief"; 

	//video codes

	this.arrCodeText[15] = "Geography Now";
		this.arrCode[15] = "gn";
	this.arrCodeExplain[15] = "Geography Now video, if available"; 

	this.arrCodeText[16] = "Seeker Daily";
		this.arrCode[16] = "sd";
	this.arrCodeExplain[16] = "Discovery Network YouTube channel"; 

	this.arrCodeText[17] = "Top Ten Archive";
		this.arrCode[17] = "tt";
	this.arrCodeExplain[17] = "Top Ten Archive video"; 

	this.arrCodeText[18] = "Music";
		this.arrCode[18] = "mu";
	this.arrCodeExplain[18] = "Music video or live performance"; 

	this.arrCodeText[19] = "Dance";
		this.arrCode[19] = "da";
	this.arrCodeExplain[19] = "Any dance performance from this country"; 

	this.arrCodeText[20] = "Documentary";
		this.arrCode[20] = "do";
	this.arrCodeExplain[20] = "Any documentary about this country"; 

	this.arrCodeText[21] = "Historical";
		this.arrCode[21] = "hi";
	this.arrCodeExplain[21] = "Any archival footage or historical video"; 

	this.arrCodeText[22] = "Tourism";
		this.arrCode[22] = "to";
	this.arrCodeExplain[22] = "General tourism video"; 

	this.arrCodeText[23] = "Lists";
		this.arrCode[23] = "li";
	this.arrCodeExplain[23] = "Lists other than named lists above; things you will love and hate about the country, etc."; 

	this.arrCodeText[24] = "Other";
		this.arrCode[24] = "ot";
	this.arrCodeExplain[24] = "Videos that don't fit into the other categories"; 

	this.arrCodeText[25] = "7 Facts";
		this.arrCode[25] = "7f";
	this.arrCodeExplain[25] = "Seven Facts video from youtube"; 

	this.arrCodeText[26] = "8 Facts";
		this.arrCode[26] = "8f";
	this.arrCodeExplain[26] = "Eight Facts video from youtube"; 

	this.arrCodeText[27] = "Victoria";
		this.arrCode[27] = "vi";
	this.arrCodeExplain[27] = "Victoria Flamel video from youtube (Victoria Judges)"; 



	//which of the above codes are used with each type

	this.getCodes = function( _coll ) {

		var res = [];

		if (_coll == cSound) res = [ 0, 9];

		if (_coll == cText) res = [ 1, 2 ];

		if (_coll == cImage) res = [ 1, 2, 3, 4, 5, 10, 11, 12, 13, 14 ];

		if (_coll == cWeb) res = [10, 11, 12, 13];

		if (_coll == cVideo) res = [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27];

		if (_coll == cDebrief) res = [ 1, 2, 6, 7, 8, 10, 11, 12, 13, 14 ];

		return res;
	}


  	this.resetDataFlags = function() {

      Session.set("sEditImageReady", false );

      Session.set("sEditSoundReady", false );

      Session.set("sEditTextReady", false );

      Session.set("sEditVideoReady", false );

      Session.set("sEditWebReady", false );

      Session.set("sEditDebriefReady", false );

  	}

	this.subscribeToData = function() {

		this.resetDataFlags();

		Meteor.subscribe("allImages", function() { Session.set("sEditImageReady", true ) });

		Meteor.subscribe("allSounds", function() { Session.set("sEditSoundReady", true ) });

		Meteor.subscribe("allVideos", function() { Session.set("sEditVideoReady", true ) });

		Meteor.subscribe("allWebs", function() { Session.set("sEditWebReady", true ) });

		Meteor.subscribe("allTexts", function() { Session.set("sEditTextReady", true ) });

		Meteor.subscribe("allDebriefs", function() { Session.set("sEditDebriefReady", true ) });     
	}


  	this.saveScroll = function() {

  		this.scroll = document.documentElement.scrollTop || document.body.scrollTop;

  		db.saveScroll( this.scroll );

  	}

  	this.loadScroll = function() {

  		if (game.user) this.scroll = game.user.scroll;

  		document.documentElement.scrollTop = document.body.scrollTop = this.scroll;
  	}


	this.addThisRecord = function(_countryCode, _controlType, cb)  {

		db.addRecord(_countryCode, _controlType, function(err, result) {

			cb(err, result);

		});

	}

	this.getUploader = function() {

		if (this.controlType.get() == cSound) return this.soundUploader;

		if (this.controlType.get() == cImage) return this.imageUploader;

		if (this.controlType.get() == cWeb) return this.webUploader;

		if (this.controlType.get() == cVideo) return this.videoUploader;


	}

	this.updateURLForNewRecord = function( _url, ID, _dt, _source ) {

		var data = {};

		data["u"] = _url;

		data["f"] = getS3FileFromPath(_url);

		data["cc"] = this.hack.countryCode;

		data["dt"] = _dt;

		data["s"] = _source;

		Meteor.call("updateRecordOnServerWithDataObject", this.controlType.get(), ID, data, function(err, result) {

			if (err) {

				console.log(err);
			}

			editor.newRecordID.set("0");

		}); 

	}

	this.deleteCurrentRecord = function(_ID, _type)  { 

		Meteor.call("deleteRecord", _ID, _type, function(err, result) {

			stopSpinner();

			if (err) console.log(err);

		});
	}

	this.getDTValue = function( _id ) {

		var sel = "select#" + _id + ".form-control.dt";

		var val = $(sel).prop("selectedIndex");

		var arr = editor.getCodes( editor.controlType.get() );

		var _code = this.arrCode[ arr[  val - 1 ]  ];

		if ( this.arrFreeCode.indexOf( _code ) != -1) {

			sel = "input#" + _id + ".textDTValue";

			val = $(sel).prop("value");
							
			return val;  
		}

		return _code;
	}

	this.doUpdateRecord = function(_id, _countryCode) {

		var _type = this.controlType.get();

		if (!_type) return;

		doSpinner();

		if (_type == cCountry) {

			db.updateRecord(this.arrFieldCountry, _type, _id);

			return;
		}


		if (_type == cDebrief) {

      		var data = {};

      		for (var i = 0; i < this.arrFieldDebrief.length; i++) {

  				var sel = "";

				sel = "#" + _id + "." + this.arrFieldDebrief[i];

  				data[ this.arrFieldDebrief[i] ] = $(sel).val();

      		}

      		data[ "dt" ] = this.getDTValue( _id );


			Meteor.call("updateRecordOnServerWithDataObject", _type, _id, data, function(err, result) {

				stopSpinner();

				if (err) {

					console.log(err);
				}

			}); 
		}

		if (_type == cImage || _type == cSound || _type == cWeb || _type == cVideo) {

			var _dt = "";

			_dt = this.getDTValue( _id );

			db.updateContentRecord(this.arrField, _dt, _type, _id, _countryCode);

		}
		
		if (_type == cText) {

			db.updateRecord(this.arrFieldText, _type, _id);
		}

	}


	this.stopEditMedia = function() {

	  if (youtube.loaded) {

	     youtube.stop();

	     youtube.hide();
	  }

	  display.stopEffects();

	  try {

	    document.getElementById("editorSoundPlayer").pause();

	  }
	  catch(err) {

	     console.log(err.reason);
	  }
	}

	this.setVideoPos = function( _obj ) {

		_obj.top = -16;

		_obj.left = $(window).width()/2 - _obj.width/2;


	}

	this.updateContent = function() {

		var _val = this.updateContentFlag.get();

		this.updateContentFlag.set( !_val );

	}

}

Tracker.autorun( function(comp) {



  if (Session.get("sEditImageReady") && 
      Session.get("sEditTextReady") && 
      Session.get("sEditVideoReady") && 
      Session.get("sEditWebReady") && 
      Session.get("sEditSoundReady") && 
      Session.get("sEditDebriefReady")

      ) {

          console.log("editor data ready")

			if (typeof editor === 'undefined') return;

      	  editor.dataReady = true;

      	  nav.goEditRoute();

          return; 
  } 

  console.log("editor data not ready")

});  