
//************************************************************
//    CONTROL  (parent object of the individual controls)
//************************************************************

Control = {

  //********************************************
  //          Low-level functions
  //********************************************

    getIndex : function() {

      return this.index.get();
    },

    setIndex : function(_val) {

      this.index.set( _val );

    },

    getState : function() {

      return this.state.get();
    },

    setState : function(_val) {

      this.state.set( _val );
    },

  featuredBackdrop : function() { return  "featuredBackdrop.jpg"; },

  hilitedBackdrop : function() { return  "hilitedBackdrop.jpg"; },


  //*******************************************************************
  //  Use data collection to create item array-related properties
  //********************************************************************

  setCountry : function(_countryCode, _collection) {

    this.collection = _collection;

    this.countryCode = _countryCode;

    if (_collection) {

      //Just zero out the map clue counts, b/c these are inserted at 
      //specific points under conditions by newLoader.js

      if (this.name == "MAP") {

        this.fullCount = 0;

        this.loadedCount = 0;

      }
      else {

        if (this.name == "SOUND") {

          //don't count the anthems 

          this.fullCount = this.collection.find ( { cc: this.countryCode, dt: {$ne: "ant"} } ).count();
        }
        else {

          this.fullCount = this.collection.find ( { cc: this.countryCode } ).count();         
        }

        this.loadedCount = 0;
      }

    }

    this.items = [];

      //***************************************************
      //      Set the items array (process and shuffle)
      //***************************************************

      this.setItems();
      
      //process items here

      this.items = Database.shuffle(this.items);   
    
  }, //end setCountry

  setItems: function() {

    if (this.name == "MAP") {

      this.items = this.collection.find({}).fetch();  //this must be happening somewhere else and failing, b/c this should not be necessary
    }
    else {
      this.items = this.collection.find( { cc: this.countryCode } ).fetch();
    }
    
  },

  //********************************************
  //          Data functions
  //********************************************

  //the image for the control buttons

  getControlPic: function() {
    
    var pic = "";

    if (this.getState() == sIcon) pic = this.iconPic;

    if (this.getState() == sScanning) pic = this.scanningPic;

    if (pic == "") pic = this.items[ this.getIndex() ].u;

    return pic;
  },

  setControlPicSource: function() {

    if ( typeof this.items[ this.getIndex() ] === 'undefined') return;

    var pic = this.items[ this.getIndex() ].u;

    this.src = Control.getImageFromFile( pic );

  },

  setPicDimensions: function() {

//c("set pic dims is doing " + this.name)

    this.iconSizeLimit = 128;

    this.picFrame = { width: 0, height: 0, top: 0, left: 0 };

    //first get the dimensions of the control area (the background image)

    var sel = "img#ctlBG_" + this.name

    var fullWidth = $( sel ).width();

    var maxWidth = fullWidth * 0.8;

    var fullHeight =  $( sel ).height();

    //now figure the dimensions for the picture based on it's actual size

    var _width = 0;

    var _height = fullHeight * 0.7;

    //check the state to see how we need to proceed ...

    var state = this.getState();

    if (state == sLoaded) {

      //sLoaded means we have an arbitrary pic out of the database that was
      //preloaded by the loader, so we can use it's dimensions to keep the aspect ratio correct

      //if we're browsing, then we don't necessarily have this.src set yet

      if (!this.src) this.setControlPicSource();

      if (this.src) {

        _width = (fullHeight / this.src.height ) * this.src.width;

        if (_width > maxWidth) _width = maxWidth;
      }
      else {

        console.log( "No image source for control pic (" + this.name + ")" );

        return;
      }

    }
    else {

        //otherwise we have an icon of some kind and we can just square it

        if (_height > this.iconSizeLimit) _height = this.iconSizeLimit;

        _width = _height;

    }

    this.picFrame.height = _height;

    this.picFrame.width = _width;

    //determine the position

    var _top = fullHeight * 0.05;

    var _left = (fullWidth/2) - (_width/2);

    this.picFrame = { top: _top, left: _left, height: _height, width: _width };
    

    //set the properties of the image

    sel = "img#pic" + this.name;

    $(sel).css("left", this.picFrame.left);

    $(sel).css("width",  this.picFrame.width);

    $(sel).css("height",  this.picFrame.height);

    $(sel).css("top",  this.picFrame.top);
  },

  getTextContent: function() {

    return this.items[ this.getIndex() ].f;
  },

  setFeaturedContent : function() {

    Session.set("gFeaturedPic", this.getContent());
  },

  getFile : function() {

    if ( ! this.items.length ) {

      showMessage("Item collection for " + this.name + " is empty." );

      return null;
    }

    if (this.name == "TEXT") return this.getTextContent();

    return this.items[ this.getIndex() ].u;
  },

  doNavButtons : function() {

    if (this.loadedCount > this.getIndex() + 1) {

      $("img.navButton.navNext").removeClass("invisible");
    }
    else {

       $("img.navButton.navNext").addClass("invisible");     
    }


    if (this.getIndex() > 0) {

      $("img.navButton.navPrev").removeClass("invisible");
    }
    else {

       $("img.navButton.navPrev").addClass("invisible");     
    }
    
  },
  //********************************************
  //          General media functions
  //********************************************

  toggleMedia: function() {

    if (this.getState() == sPaused) {

        c("control.toggleMediaState is playing the media")

        this.play();

        return;

    }

    if (this.getState() == sPlaying) {

          c("control.toggleMediaState is pausing the media")

          this.pause();

          return;
    }

  },

  hilite : function() {

    this.unhiliteAll();

    $("#ctlBG_" + this.name ).attr("src", this.hilitedBackdrop() );
  },


  unhiliteAll : function() {

      $("#ctlBG_SOUND" ).attr("src", this.featuredBackdrop() );
      $("#ctlBG_VIDEO" ).attr("src", this.featuredBackdrop() );
      $("#ctlBG_TEXT" ).attr("src", this.featuredBackdrop()) ;
      $("#ctlBG_WEB" ).attr("src", this.featuredBackdrop() );
      $("#ctlBG_IMAGE" ).attr("src", this.featuredBackdrop() );
  },

}  //end Control constructor



//************************************************************
//            CONTROL  (static functions)
//************************************************************

Control.hideNavButtons = function() {

  $("img.navButton.navNext").addClass("invisible");     
  $("img.navButton.navPrev").addClass("invisible");     
}


Control.switchTo = function( _id ) {

    if (display.scanner.mode == "scan" || display.scanner.mode == "rescan") {

        Control.playEffect( display.locked_sound_file );

        return;
    }

    display.cue.set();

    var id = _id;

    if ( display.ctl[ id ].getState() < sLoaded ) {

        Control.playEffect( display.locked_sound_file );

        return;
    }

    Control.playEffect( display.fb_sound_file );  

    //for the media controls, we are either clicking to toggle
    //the state (ctl is already active) 
    //or we are clicking to make active and play

    var _name = display.feature.getName();

    if ((id == "SOUND" && _name == "SOUND") || (id == "VIDEO" && _name == "VIDEO")) {
        
        c("'click control' is calling toggleMedia")

        display.feature.ctl.toggleMedia(); 

        //the feature did not change, only the state of the control,
        //so we're done here

        return;

     }

  c("'click control' is calling feature.switch")

    display.feature.switch( id );


    if (id == "VIDEO") {

      display.cue.setAndShow();
    }
    else {

      Meteor.setTimeout( function() { display.cue.type() }, 500);
    }

}

//***********************************************************************
//        UTILITIES
//***********************************************************************

Control.unfocusMe = function(which) {

  document.getElementById( which ).blur();
}

Control.unfocusMyClass = function(which) {

  document.getElementsByClassName( which ).blur();
}

Control.getImageFromFile = function(_file) {

  // Create new offscreen image to test

  var theImage = new Image();

  theImage.src = _file;

  return theImage;
}

Control.allLoadsAreEqual = function() {

  var _loadCount = 0;

  var _arr = Session.get("sCtlName");

    for (i = 0; i < _arr.length; i++) {

      var _ctl  = display.ctl[ _arr[i] ];

      if (i == 0) _loadCount = _ctl.loadedCount;

      if (_loadCount != _ctl.loadedCount) { 

        c("Control is returning b/c a ctl loadCount is unequal to " + _loadCount); 

        return false; 
      }

    }
    
    c("Control reports that all loads were equal")
    
    return true;
}

//***********************************************************************
//        MEDIA
//***********************************************************************

Control.playEffect = function(_file) {

  $("#effectsPlayer").attr("src", _file);

  document.getElementById("effectsPlayer").play();
}

Control.playEffect2 = function(_file) {

  $("#effectsPlayer2").attr("src", _file);

  document.getElementById("effectsPlayer2").play();
}

Control.playEffect3 = function(_file) {

  $("#effectsPlayer3").attr("src", _file);

  document.getElementById("effectsPlayer3").play();
}

Control.stopSound = function(_which) {

  document.getElementById( _which + "Player").pause();
}

Control.stopEffects = function() {

  document.getElementById("effectsPlayer").pause();

  document.getElementById("effectsPlayer2").pause();

  document.getElementById("effectsPlayer3").pause();
}

Control.suspendAllMedia = function() {

  game.pauseMusic();

  if (display.ctl) {

    if (display.ctl["SOUND"].getState() > sLoaded) display.ctl["SOUND"].pause();

    if (display.ctl["VIDEO"].getState() > sLoaded) display.ctl["VIDEO"].pause();
  }

  youtube.stop();

  youtube.hide();

}

Control.stopEditMedia = function() {

  if (youtube.loaded) {

     youtube.stop();

     youtube.hide();
  }

  Control.stopEffects();

  try {

    c("attempting to stop sound player in control.js")

    document.getElementById("editorSoundPlayer").pause();

  }
  catch(err) {

     console.log(err.reason);
  }
}
 
//*****************************************************************
// CONTROL CHILD OBJECTS  (SOUND, VIDEO AND MAP IN SEPARATE FILES)
//*****************************************************************

ghImageCtl = function() {

  this.name = "IMAGE";

  this.iconPic = "image_icon2.png";    

  this.scanningPic = "anim_image.gif";

  this.init = function() {

    this.index = new Blaze.ReactiveVar(0);

    this.state = new Blaze.ReactiveVar(0);
  }

  this.setItems = function() {

      if (game.user.mode == uBrowseCountry) {

        this.items = this.collection.find( { cc: this.countryCode, dt: { $ne: "rmp"} } ).fetch();
      }
      else {

        this.items = this.collection.find( { cc: this.countryCode, dt: { $ne: "cmp"} } ).fetch();        
      }
  }

  this.setCountry = function(_countryCode, _collection) {

      this.collection = _collection;

      this.countryCode = _countryCode;

      this.fullCount = this.collection.find ( { cc: this.countryCode, dt: {$ne: "cmp"} } ).count();

      this.loadedCount = 0;

      this.items = [];

      //***************************************************
      //      Set the items array (process and shuffle)
      //***************************************************

      this.setItems();
      
      //process items here

      this.items = Database.shuffle(this.items); 
    }

    this.suspend = function() {

    }

}


Web = function() {

  this.name = "WEB";

  this.iconPic = "web_icon2.png"; 

  this.scanningPic = "anim_web.gif";

  this.init = function() {

    this.index = new Blaze.ReactiveVar(0);

    this.state = new Blaze.ReactiveVar(0);
  }

  this.suspend = function() {

  }
}

Text = function() {

  this.name = "TEXT";

  this.iconPic = "text_icon2.png";   

  this.scanningPic = "anim_text.gif";

  this.init = function() {

    this.index = new Blaze.ReactiveVar(0);

    this.state = new Blaze.ReactiveVar(0);
  }

  this.suspend = function() {


    display.feature.hideText();

  }
}

ghImageCtl.prototype = Control;

Web.prototype = Control;

Text.prototype = Control;
