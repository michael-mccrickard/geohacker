
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

      this.processItems( this.items );   

    
  }, //end setCountry

  processItems: function( _arr ) {

      if (this.name == "IMAGE" || this.name == "WEB") {

        for (var i = 0; i < _arr.length; i++) {

            _arr[i].f = getS3URL( _arr[i] );
        }
      }

      if (this.name == "SOUND") {

        for (var i = 0; i < _arr.length; i++) {

            if ( !isURL( _arr[i].f ) ) _arr[i].f = getS3URL( _arr[i] ) ;
        }
      }
  },

  setItems: function() {

    this.items = this.collection.find( { cc: this.countryCode } ).fetch();
  },

  //********************************************
  //          Data functions
  //********************************************

  //the image for the control buttons

  getControlPic: function() {
    
    var pic = "";

    if (this.getState() == sIcon) pic = this.iconPic;

    if (this.getState() == sScanning) pic = this.scanningPic;

    if (pic == "") pic = this.items[ this.getIndex() ].f;

    return pic;
  },

  setControlPicSource: function() {

    if ( typeof this.items[ this.getIndex() ] === 'undefined') return;

    var pic = this.items[ this.getIndex() ].f;

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

      if (this.src == undefined) this.setControlPicSource();

      _width = (fullHeight / this.src.height ) * this.src.width;

      if (_width > maxWidth) _width = maxWidth;

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

  clearFeature : function() {

    c("clearFeature in control.js called");
  },

  setFeaturedContent : function() {

    Session.set("gFeaturedPic", this.getContent());
  },

  hasNextItem : function() {

    if (this.loadedCount  > this.getIndex() + 1) return true;

    return false;
  },

  hasPrevItem : function() {

    if (this.getIndex() > 0) return true;

    return false;
  },
  //********************************************
  //          General media functions
  //********************************************

  toggleMediaState: function() {

      if (this.getState() == sPaused) {

        this.setState( sPlaying );

        c("control.toggleMediaState changed the state to playing")

        return;
      }

    if (this.getState() == sPlaying) {

      this.setState( sPaused );

      c("control.toggleMediaState changed the state to paused")
      
      return;
    }

  },

}  //end Control constructor



//************************************************************
//            CONTROL  (static functions)
//************************************************************

Control.unfocusMe = function(which) {

  document.getElementById( which ).blur();
}

Control.unfocusMyClass = function(which) {

  document.getElementsByClassName( which ).blur();
}

//***********************************************************************
//        MEDIA
//***********************************************************************

Control.playEffect = function(_file) {

c(_file);

  $("#effectsPlayer").attr("src", _file);

  document.getElementById("effectsPlayer").play();
}


Control.stopSound = function(_which) {

c(_which + " was stopped.")

  document.getElementById( _which + "Player").pause();
}


//************************************************************
//            YOUTUBE PLAYER
//************************************************************

Control.isYouTubeURL = function(_s) {

    //check for the file type designator and return false if found

    if (_s == undefined) return false;

    if (_s.substr(0,3) == "s3@") return false;

    return true;
 }

Control.getNonYouTubeFile = function(_file) { 

      if (_file.substr(0,3) == "s3@") {

          var rec = db.ghPublicVideo.findOne( { _id: _file.substring(3) } );

          return getS3URL( rec );
      }

      return _file;
}


Control.getImageFromFile = function(_file) {

  // Create new offscreen image to test

  var theImage = new Image();

  theImage.src = _file;

  return theImage;

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

}

Web = function() {

  this.name = "WEB";

  this.iconPic = "web_icon2.png"; 

  this.scanningPic = "anim_web.gif";

  this.init = function() {

    this.index = new Blaze.ReactiveVar(0);

    this.state = new Blaze.ReactiveVar(0);
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
}

ghImageCtl.prototype = Control;

Web.prototype = Control;

Text.prototype = Control;
