
//************************************************************
//    CONTROL  (parent object of the individual controls)
//************************************************************

Control = {

  //********************************************
  //          Low-level functions
  //********************************************

    getIndex : function() {

      if ( this.name == "MEME") {

          return this.sequence[ this.index.get() ];    
      }

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

    getItem : function() {

      return this.items[ this.getIndex() ];
    },

    getFile : function() {

      if ( ! this.items.length ) {

        showMessage("Item collection for " + this.name + " is empty." );

        return null;
      }

      return this.items[ this.getIndex() ].u;
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

        if (this.name == "SOUND") {

          //don't count the anthems 

          this.fullCount = this.collection.find ( { cc: this.countryCode, dt: {$ne: "ant"} } ).count();
        }
        else {

          this.fullCount = this.collection.find ( { cc: this.countryCode } ).count();         
        }

        this.loadedCount = 0;
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

    this.items = this.collection.find( { cc: this.countryCode } ).fetch();

  },

  //********************************************
  //   Control Button drawing / dimensioning
  //********************************************

  //the image for the control buttons

  getControlPic: function() {
    
    var pic = "";

    if (this.getState() == sIcon) pic = this.iconPic;

    if (this.getState() == sScanning) pic = this.scanningPic;

    if (pic == "") {

      if (this.name == "MEME") {

          pic = this.items[ this.getIndex() ].image;
      }
      else {

        pic = this.items[ this.getIndex() ].u;
      }
    } 

    return pic;
  },

  setControlPicSource: function() {

    if ( !this.items[ this.getIndex() ]) return;

    var pic = null;

    if (this.name == "MEME") {

      pic = this.items[ this.getIndex() ].image;
    }
    else {

      pic = this.items[ this.getIndex() ].u;
    } 

    this.src = display.getImageFromFile( pic );

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

  hilite : function() {

    Control.unhiliteAll();

    $("#ctlBG_" + this.name ).attr("src", this.hilitedBackdrop() );
  },

  //********************************************
  //          Nav button functions
  //********************************************

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
  //          Media functions
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

}  //end Control constructor



//************************************************************
//            CONTROL  (static functions)
//************************************************************

Control.switchTo = function( _id ) {

    if (hacker.scanner.mode == "scan" || hacker.scanner.mode == "rescan") {

        display.playEffect( hacker.locked_sound_file );

        return;
    }

    hacker.cue.set();



    if ( hacker.ctl[ _id ].getState() < sLoaded ) {

        display.playEffect( hacker.locked_sound_file );

        return;
    }

    display.playEffect( hacker.fb_sound_file );  

    //for the media controls, we are either clicking to toggle
    //the state (ctl is already active) 
    //or we are clicking to make active and play

    var _name = hacker.feature.item.getName();

    if ((_id == "SOUND" && _name == "SOUND") || (_id == "VIDEO" && _name == "VIDEO")) {
        
        c("'click control' is calling toggleMedia")

        hacker.feature.item.ctl.toggleMedia(); 

        //the feature did not change, only the state of the control,
        //so we're done here

        return;

     }

  c("'click control' is calling feature.switch")

    hacker.feature.switchTo( _id );


    if (_id == "VIDEO") {

      hacker.cue.setAndShow();
    }
    else {

      Meteor.setTimeout( function() { hacker.cue.type() }, 500);
    }

}

//***********************************************************************
//        UTILITIES
//***********************************************************************

Control.hideNavButtons = function() {

  $("img.navButton.navNext").addClass("invisible");     
  $("img.navButton.navPrev").addClass("invisible");     
}


Control.unhiliteAll = function() {

      $("#ctlBG_SOUND" ).attr("src", this.featuredBackdrop() );
      $("#ctlBG_VIDEO" ).attr("src", this.featuredBackdrop() );
      $("#ctlBG_MEME" ).attr("src", this.featuredBackdrop()) ;
      $("#ctlBG_WEB" ).attr("src", this.featuredBackdrop() );
      $("#ctlBG_IMAGE" ).attr("src", this.featuredBackdrop() );
  },


Control.allLoadsAreEqual = function() {

  var _loadCount = 0;

  var _arr = hacker.ctlName;

    for (i = 0; i < _arr.length; i++) {

      var _ctl  = hacker.ctl[ _arr[i] ];

      if (_ctl.name == "MEME") continue;

      if (i == 0) _loadCount = _ctl.loadedCount;

      if (_loadCount != _ctl.loadedCount) { 

        c("Control is returning b/c a ctl loadCount is unequal to " + _loadCount); 

        return false; 
      }

    }
    
    c("Control reports that all loads were equal")
    
    return true;
}

 
//*****************************************************************
// CONTROL CHILD OBJECTS  (SOUND, VIDEO IN SEPARATE FILES)
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

      this.fullCount = this.items.length;
  }

  this.setData = function( _item) {

      _item.setName( this.name );

      _item.imageFile = this.items[ this.getIndex() ].u;

      _item.soundFile = "";

      _item.videoFile = null;

      _item.fileToLoad = _item.imageFile;

      _item.text = "";
  }

  this.setCountry = function(_countryCode, _collection) {

      this.collection = _collection;

      this.countryCode = _countryCode;

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
  this.setData = function( _item) {

      _item.imageFile = this.items[ this.getIndex() ].u;

      _item.soundFile = "";

      _item.videoFile = null;

      _item.fileToLoad = _item.imageFile;

      _item.text = "";
  }
}

MemeCtl = function() {

  this.name = "MEME";

  this.iconPic = "text_icon2.png";   

  this.scanningPic = "anim_text.gif";

  this.memeCollection = null;

  this.meme = null;

  this.sequence = [];


  this.init = function() {

    this.index = new Blaze.ReactiveVar(0);

    this.state = new Blaze.ReactiveVar(0);

    this.sequence = [];

  }

  this.getRealIndex = function() {

     return this.index.get();
  }

  this.getMemeIndex = function() {

      for (var i = 0; i < this.memeCollection.items.length; i++)  {

          if (this.meme.code == this.memeCollection.items[i].code)  return i;
      }

      return i;
  }

  this.addToSequence = function( _val ) {

      this.sequence.push( _val );
  }


  this.setData = function( _item) {

       //redundant to set the meme, except when navigating between memes on hacker screen

       this.meme = this.memeCollection.items[ this.getIndex() ];

      _item.setName( this.name );

      // this.setMeme();  //already set in loader.js

      _item.imageFile = this.meme.image;

      _item.soundFile = "";

      _item.videoFile = null;

      _item.fileToLoad = _item.imageFile;

      _item.text = this.meme.text;
  }

  this.setItems = function() {

    this.memeCollection = new MemeCollection( "hacker" );

    this.memeCollection.make( this.countryCode );

    this.items = this.memeCollection.items;    

    this.fullCount = this.items.length;
  }

  this.dimension = function() {

      Meteor.setTimeout( function() {hacker.ctl["MEME"].meme.dimensionForHack(); }, 250);
  }

  this.show = function() {

    c("calling meme.show")

    if (this.meme) this.meme.show();

  }

  this.hide = function() {

    if (this.meme) this.meme.hide();
  }

  this.suspend = function() {


  }

}

ghImageCtl.prototype = Control;

MemeCtl.prototype = Control;

Web.prototype = Control;
