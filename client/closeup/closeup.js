

Template.closeup.rendered = function() {

  display.closeUp.draw();
}


Template.closeup.events = {

  'click #closeUpPic': function (e) { 

  		e.preventDefault();

      display.mainTemplateReady = false;

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
    }
  
})

CloseUp = function() {

  this.source = null;

  this.draw = function() {

      var img = display.feature.imageSrc;

      if (display.feature.getName() == "MAP") {

        var _filename = hack.getCountryFilename() + "_map.jpg"

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

      this.source = s;

      if (s == "0") s = "Unknown";

      $( container ).text( "SOURCE: " + s );
  }

}


function finishCrop() {

  //var width = $("#closeUpPic").cropper('getData').width;

  //$("#closeUpPic").cropper("scale", 64/width);

  $("#closeUpPic").cropper('getCroppedCanvas', { width: 128, height: 128 }).toBlob(function (_blob) {


      var newFile = new FS.File();

      newFile.name("t.png");

      newFile.attachData( _blob, {type: 'image/png'},  function(error){

          if(error) console.log(error.message);

          //This callback from attachData inserts the file into the CFS collection
          //and then that callback updates the new record with the country code

          db.ghTag.insert(newFile, function (err, fileObj) {

            if (err) {
              console.log(err);
              return;
            }

            db.ghTag.update( {_id: fileObj._id }, { $set: { cc: hack.countryCode } });

             Meteor.setTimeout( function() { $("#closeUpPic").cropper('destroy') }, 1000 );


           });

      });

  });

}