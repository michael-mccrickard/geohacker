


Editor = function() {

	this.hack = new Hack();

	this.arrField = ["dt","s"];

	this.arrFieldText = ["f","dt","s"];	

	this.arrFieldDebrief = ["t", "dt"];

	this.arrFieldCountry = ["n","c","r","co","d"];  //name, code, region, color, dataFlag

	this.scroll = 0;

  	Object.defineReactiveProperty(this, "controlType", cNone);

  	Object.defineReactiveProperty(this, "controlName", "");

  	Object.defineReactiveProperty(this, "recordID", "");

  	this.newRecordID = new Blaze.ReactiveVar("0");

  	this.videoFile = null;

  	this.soundUploader = new Slingshot.Upload("ghSound");

  	this.imageUploader = new Slingshot.Upload("ghImage");

  	this.webUploader = new Slingshot.Upload("ghWeb");

  	this.videoUploader = new Slingshot.Upload("ghVideo");

  	Session.set("sYouTubeOn", false);


  	this.saveScroll = function() {

  		this.scroll = document.documentElement.scrollTop || document.body.scrollTop;

  		db.saveScroll( this.scroll );

  	}

  	this.loadScroll = function() {

  		if (game.user) this.scroll = game.user.scroll;

  		document.documentElement.scrollTop = document.body.scrollTop = this.scroll;
  	}


	this.stopYouTube = function() {

    	ytplayer.stopVideo();

  		Session.set("sYouTubeOn", false);  
	}


	this.addThisRecord = function(_countryCode, _controlType, cb)  {

		db.addRecord(_countryCode, _controlType, function(err, result) {

			cb(err, result);

		});

	}

	this.getUploader = function() {

		if (this.controlType == cSound) return this.soundUploader;

		if (this.controlType == cImage) return this.imageUploader;

		if (this.controlType == cWeb) return this.webUploader;

		if (this.controlType == cVideo) return this.videoUploader;


	}

	this.updateURLForNewRecord = function( _url, ID, _dt, _source ) {

		var data = {};

		data["u"] = _url;

		data["f"] = getS3FileFromPath(_url);

		data["cc"] = this.hack.countryCode;

		data["dt"] = _dt;

		data["s"] = _source;

		Meteor.call("updateRecordOnServerWithDataObject", this.controlType, ID, data, function(err, result) {

			if (err) {

				console.log(err);
			}

			editor.newRecordID.set("0");

		}); 

	}

	this.deleteCurrentRecord = function(_ID, _type)  { 

		Meteor.call("deleteRecord", _ID, _type);
	}

	this.doUpdateRecord = function(_id, _countryCode) {

		var _type = this.controlType;

		if (_type == cCountry) {

			db.updateRecord(this.arrFieldCountry, _type, _id);

			return;
		}


		if (_type == cDebrief) {

      		var data = {};

      		for (var i = 0; i < arrFieldDebrief.length; i++) {

				var sel = "#" + _ID + "." + arrFieldDebrief[i];

      			data[ arrFieldDebrief[i] ] = $(sel).val();
      		}

			Meteor.call("updateRecordOnServerWithDataObject", _type, _id, data, function(err, result) {

				if (err) {

					console.log(err);
				}

			}); 
		}

		if (_type == cImage || _type == cSound || _type == cWeb || _type == cVideo) {

			db.updateContentRecord(this.arrField, _type, _id, _countryCode);
		}
		
		if (_type == cText) {

			db.updateRecord(this.arrFieldText, _type, _id);
		}

	}

}