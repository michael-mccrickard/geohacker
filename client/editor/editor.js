


Editor = function() {

	this.hack = new Hack();

	this.arrField = ["f","dt","s"];

	this.arrFieldDebrief = ["t", "dt"];

	this.arrFieldCountry = ["n","c","r","co","d"];  //name, code, region, color, dataFlag

	this.scroll = 0;

  	Object.defineReactiveProperty(this, "controlType", cNone);

  	Object.defineReactiveProperty(this, "controlName", "");

  	Object.defineReactiveProperty(this, "recordID", "");

  	this.newRecordID = new Blaze.ReactiveVar("0");

  	this.videoFile = null;

  	this.soundUploader = new Slingshot.Upload("ghSound");

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

	this.updateURLForNewRecord = function( _url, ID, _dt, _source ) {

		var data = {};

		data["u"] = _url;

		data["f"] = getS3FileFromPath(_url);

		data["cc"] = this.hack.countryCode;

		data["dt"] = _dt;

		data["s"] = _source;

console.log(data);

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

      		data[ field ] = value;

			db.updateRecord(this.arrFieldDebrief, _type, _id);
		}

		if (_type == cImage || _type == cSound || _type == cWeb || _type == cVideo) {

			db.updateContentRecord(this.arrField, _type, _id, _countryCode);
		}
		else {

			db.updateRecord(this.arrField, _type, _id);
		}

	}

}