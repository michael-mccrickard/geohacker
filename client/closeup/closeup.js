Session.set("sTagURL", "");

Template.closeup.rendered = function() {

  stopSpinner();

  display.closeUp.draw();
}


Template.closeup.events = {

  'submit #tagData-form' : function(e, t){

      e.preventDefault();
      
      // retrieve the input field values
      
      var _dt = t.find('#debriefType').value;

      var _text = t.find('#customText').value;

      insertNewTagRecord(_dt, _text);

      $('#tagDataModal').modal('hide');
   },


  'click #closeUpBox': function (e) { 

  		e.preventDefault();

      if ( gCropPictureMode.get() ) {

        showMessage("Crop mode is on.  F6 to exit.");

        Control.playEffect("locked.mp3");

        return;
      } 

//      display.mainTemplateReady = false;

      if (display.feature.getName() == "MAP") {

        FlowRouter.go("/debrief");

        return;
      }

  		FlowRouter.go("/main");
  	},

    'click #closeUpSource': function(e) {

      e.preventDefault();

      if (display.closeUp.source == "0") {

        alert("Go to Unknown Source page here.")
      }
      else {

        window.open(display.closeUp.source);
      }
    },

    'click #btnFinishCrop': function(e) {

      e.preventDefault();

      finishCrop();
    }
}

Template.closeup.helpers({

    tag: function() {

       return db.ghTag.find( { cc: hack.countryCode });
    },

    cropMode: function() {

      return gCropPictureMode.get();
    },

    getNewTagURL: function() {

      return Session.get("sTagURL");
    }
  
})

CloseUp = function() {

  this.source = null;

  this.setText = function(_str) {

      var container = "h4#closeUpSource.sourceText";

      $( container ).text(_str );
  }

  this.draw = function() {

      var img = display.feature.imageSrc;

      if (display.feature.getName() == "MAP") {

        var _filename = hack.getCountryMapURL();

        img = Control.getImageFromFile( _filename );
      }

      var fullScreenWidth = $(window).width();

      var fullScreenHeight = $(window).height();

      //the background box

      var container = "div#closeUpBox";

      var maxWidth = $( container ).width() * 0.98;

      fullScreenHeight = fullScreenHeight - display.menuHeight;

      $( container ).css("top", display.menuHeight + (fullScreenHeight * 0.01) );

      var fullHeight = fullScreenHeight * 0.98;

      $( container ).css("height", fullHeight );

      $( container ).css("left", fullScreenWidth * 0.01 );
       
      //the picture

      var _width = (fullHeight / img.height ) * img.width; 

      if (_width > maxWidth) _width = maxWidth;

      var _left = ($( container ).width()/2) - (_width / 2 );

    	container = "img#closeUpPic";

    	$( container ).css("left",  _left );  

    	$( container ).css("top", "1%");

    	$( container ).attr("height", fullHeight * 0.93 );

    	$( container ).attr("width", _width );    

    	$( container ).attr("src", img.src );    	

      //source text
      container = "h4#closeUpSource.sourceText";

      var s = null;

      if (hack.mode == mHackDone)  {

        s = hack.getCountryMapSource();
      }
      else{

        s = display.feature.source;
      }

      var s = null;

      if (hack.mode == mHackDone)  {

        s = hack.getCountryMapSource();
      }
      else{

        s = display.feature.source;
      }

      this.source = s;

      if (s == "0") s = "Unknown";

      s = "SOURCE: " + s;

      this.setText(s);
  }

}

function insertNewTagRecord(_dt, _text) {

  db.ghTag.insert( { cc: hack.countryCode, u: Session.get("sTagURL"), dt: _dt, t: _text }, function(error, result) {

    if (error) {

      showMessage(error.reason);

      console.log(error);
    }

    Meteor.setTimeout( function() { $("#closeUpPic").cropper('destroy') }, 500 );  

    gCropPictureMode.set( true );
 
    var rec = db.ghText.findOne({ cc: hack.countryCode, dt: _dt } );

    if (typeof rec === 'undefined') {

        db.ghText.insert({ cc: hack.countryCode, dt: _dt, f: _text }, function(error, result) {

        if (error) {

          showMessage(error.reason);

          console.log(error);
        }

      });
    }  

alert("Formerly a call to loadMainForBrowsing was made here.")
        //Meteor.setTimeout( function() { display.loadMainForBrowsing(); }, 600 );  

  });
}


function finishCrop() {

  var uploader = game.user.bio.tagUploader;

  $("#closeUpPic").cropper('getCroppedCanvas', { width: 128, height: 128 }).toBlob(function (_blob) {

      uploader.send(_blob, function (error, downloadUrl) {

        if (error) {

          console.log(error);
        }
        else {

            Session.set("sTagURL", downloadUrl);

            gCropPictureMode.set( false ); 

            $('#tagDataModal').modal('show');
        
        }

      });           

  });

}
