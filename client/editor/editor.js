


Editor = function() {

	this.hack = new Hack();

	this.arrField = ["f", "dt","s"];

	this.arrFieldDebrief = ["f", "t", "dt"];

	this.arrFieldCountry = ["n","c","r","co","d"];  //name, code, region, color, dataFlag

	this.scroll = 0;

  	Object.defineReactiveProperty(this, "controlType", cNone);

  	Object.defineReactiveProperty(this, "controlName", "");

  	Object.defineReactiveProperty(this, "recordID", "");

  	this.youTubeLoaded = false;

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


	this.addThisRecord = function(_countryCode, _controlType)  {

		if (this.controlType == cImage || this.controlType == cSound || this.controlType == cWeb) {

			db.addContentRecord( _countryCode, _controlType );
		
			return;
		}

		//text and video: just add a standard record (non-CFS) to the usual collection

		db.addRecord(_countryCode, _controlType);
	}

	this.deleteCurrentRecord = function(_ID, _type)  { 

		Meteor.call("deleteRecord", _ID, _type);
	}

	this.doUpdateRecord = function(id, _countryCode) {

		var _type = this.controlType;

		if (_type == cCountry) {

			db.updateRecord(this.arrFieldCountry, _type, id);

			return;
		}

		if (_type == cDebrief) {

      		var data = {};

      		data[ field ] = value;

			db.updateRecord(this.arrFieldDebrief, _type, id);

			return;
		}

		if (_type == cImage || _type == cSound || _type == cWeb) {

			db.updateContentRecord(this.arrField, _type, id, _countryCode);

			return;
		}

		//check for "f@" to see if we need to upload

		if (_type == cVideo) {

			if ( editor.videoFile.substring(0,2) == "f@") {

				//search for a content record

				var _str = "s3@" + id;

				var rec = db.ghPublicVideo.findOne( { f: _str } );

				if (typeof _rec !== 'undefined') {

					db.updateContentRecord(this.arrField, _type, id, _countryCode);	

					return;
				}

				var col = db.ghPublicVideo;

				 var _fileObj = new FS.File();

				 _fileObj.cc = _countryCode;

				  var _file = getLocalPrefix() +  "dummy.png";

				  _fileObj.attachData( _file,  function(error){

				    if (error) {
				      console.log(error);
				      return;
				    }

				    col.insert(_fileObj, function (err, fileObj) {

				      if (err) {
				        console.log(err);
				        return;
				      }

				      //we need to update the master record for an uploaded video with the CFS record id

				console.log(fileObj._id);

				      db.ghV.update( { _id: id }, { $set: { f: "s3@" + fileObj._id } }, function(err, res) {


							db.updateContentRecord(editor.arrField, _type, fileObj._id, _countryCode);

				      }); //update


				   });  //insert   

				  });  //attachData


				return;
			
			} //if this is an "f@" file
		} 

		//text and YT videos

		db.updateRecord(this.arrField, _type, id);

	}

}