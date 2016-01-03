


Editor = function() {

	this.hack = new Hack();

	this.arrField = ["f", "dt","s"];

	this.arrFieldDebrief = ["f", "t", "dt"];

	this.arrFieldCountry = ["n","c","r","co","d"];  //name, code, region, color, dataFlag

	this.scroll = 0;

  	Object.defineReactiveProperty(this, "controlType", cNone);

  	Object.defineReactiveProperty(this, "controlName", "");

  	Object.defineReactiveProperty(this, "recordID", "");

  	this.videoFile = null;

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

    	this.youTubeOn = false;   
	}


	this.addThisRecord = function(_ID, _type)  {

		db.addRecord(_ID, _type);
	}

	this.deleteCurrentRecord = function(_ID, _type)  {

		Meteor.call("deleteRecord", _ID, _type);
	}

	this.doUpdateRecord = function(ID) {

		var _type = this.controlType;

		if (_type == cCountry) {

			db.updateRecord(this.arrFieldCountry, _type, ID);

			return;
		}

		if (_type == cDebrief) {

			db.updateRecord(this.arrFieldDebrief, _type, ID);
		}
		else {

			db.updateRecord(this.arrField, _type, ID);
		}

	}

}