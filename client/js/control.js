
//************************************************************
//    Set  ( clue type; primarily a collection object )
//************************************************************

class Set {

  constructor( _name) {

    this.name = _name;
  }


 //********************************************
  //          Low-level functions
  //********************************************

    getIndex() {

      //the meme items include clues for the helper agent, so we maintain a sequence array
      //of just the indices for the hacker clue items, and then get the index from there

      if ( this.name == "MEME") {

          return this.sequence[ this.index.get() ];    
      }

      return this.index.get();
    }

    setIndex(_val) {

      this.index.set( _val );

    }

    getState() {

      return this.state.get();
    }

    setState(_val) {

      this.state.set( _val );
    }

    getFile() {

      if ( ! this.items.length ) {

        showMessage("Item collection for " + this.name + " is empty." );

        return null;
      }

      return this.items[ this.getIndex() ].u;
    }

  featuredBackdrop() { return  "featuredBackdrop.jpg"; }

  hilitedBackdrop() { return  "hilitedBackdrop.jpg"; }


  //*******************************************************************
  //  Use data collection to create item array-related properties
  //********************************************************************

  setCountry(_countryCode, _collection) {

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
    
  } //end setCountry

  setItems() {

    this.items = this.collection.find( { cc: this.countryCode } ).fetch();

  }

  //********************************************
  //   Control Button drawing / dimensioning
  //********************************************

  //the image for the control buttons


  getControlPic() {

  var pic = "";

    if (this.name == "MEME") pic = this.items[ this.getIndex() ].image;

    if (this.name == "SOUND") pic = this.soundPlayingPic;

    if (this.name == "VIDEO") {

      var _file = this.items[ this.getIndex() ].u;

      if ( youtube.isFile( _file) ) {

        _file = this.items[ this.getIndex() ].f;

         return ("http://img.youtube.com/vi/" + _file + "/default.jpg");
      }
    }

    if (!pic) pic = this.items[ this.getIndex() ].u;


  return pic;
  }

/*
  setControlPicSource = function() {

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
*/

  setPicDimensions() {

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
  }

  hilite() {

    Set.unhiliteAll();

    $("#ctlBG_" + this.name ).attr("src", this.hilitedBackdrop() );
  }

}



//************************************************************
//            CONTROL  (static functions)
//************************************************************

Set.switchTo = function( _name, _index ) {

    hacker.cue.set();


    display.playEffect( hacker.fb_sound_file );  


  c("'click control' is calling feature.switch")

    hacker.feature.switchTo( _name, _index );


    if (_name == "VIDEO") {

      hacker.cue.setAndShow();
    }
    else {

      Meteor.setTimeout( function() { hacker.cue.type() }, 500);
    }

}

//***********************************************************************
//        UTILITIES
//***********************************************************************

Set.unhiliteAll = function() {

  c("Unhilite all needs to be rewritten")
}


Set.allLoadsAreEqual = function() {

  var _loadCount = 0;

  var _arr = hacker.ctlName;

    for (i = 0; i < _arr.length; i++) {

      var _ctl  = hacker.ctl[ _arr[i] ];

      if (_ctl.name == "MEME") continue;  //memes have already been used, at this point

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


class Web extends Set {

  constructor() {

    super("WEB")

    this.name = "WEB";

    this.index = new Blaze.ReactiveVar(0);

    this.state = new Blaze.ReactiveVar(0);
  }

  suspend() {

  }

  setData( _item) {

      _item.imageFile = this.items[ this.getIndex() ].u;

      _item.soundFile = "";

      _item.videoFile = null;

      _item.fileToLoad = _item.imageFile;

      _item.text = "";
  }
}

class MemeCtl extends Set {


  constructor() {

    super("MEME");

    this.name = "MEME";

    this.memeCollection = null;

    this.meme = null;

    this.sequence = [];

    this.index = new Blaze.ReactiveVar(0);

    this.state = new Blaze.ReactiveVar(0);

    /* our collection of meme items includes:

      --the regular hacker clues
      --the clues for the helper agent

    Whenever is clue is needed (by loader or the the helper) we just pick one randomly.

    However, we need to be able to refer to the hacker clues by their index, so we keep a separate
    array called "sequence" of just those indices, and return the value from that array when we need a hacker clue by index

    */

    this.sequence = [];

  }

  getMemeIndex() {

      for (var i = 0; i < this.memeCollection.items.length; i++)  {

          if (this.meme.code == this.memeCollection.items[i].code)  return i;
      }

      return i;
  }

  addToSequence( _val ) {

      this.sequence.push( _val );
  }

  setData( _item) {

       //redundant to set the meme, except when navigating between memes on hacker screen

       this.meme = this.memeCollection.items[ this.getIndex() ];

      _item.setName( this.name );

      // this.setMeme();  //already set in loader.js

      _item.imageFile = this.meme.image;

      _item.soundFile = "";

      _item.videoFile = null;

      _item.fileToLoad = _item.imageFile;

      _item.text = this.meme.text;

      _item.source = this.meme.source;
  }

  setItems() {

    this.memeCollection = new MemeCollection( "hacker" );

    this.memeCollection.make( this.countryCode );

    this.items = this.memeCollection.items;    

    this.fullCount = this.items.length;
  }

  dimension() {

      Meteor.setTimeout( function() {hacker.ctl["MEME"].meme.dimensionForHack(); }, 250);
  }

  show() {

    if (this.meme) this.meme.show();

  }

  hide() {

    if (this.meme) this.meme.hide();
  }

  suspend() {

  }

}


class VideoCtl extends Set {

  constructor( _name ) {

    super("VIDEO");

    this.name = "VIDEO";

    this.video = null;

    this.items = [];

    this.collection = db.ghVideo;

    this.element = "img.featuredPic";   

    this.index = new Blaze.ReactiveVar(0);

    this.state = new Blaze.ReactiveVar(0);
  }


  setData( _item) {

    _item.setName( this.name );

    _item.imageFile = "";

    _item.soundFile = "";

    this.video = new Video( this.getFile(), this );

    if ( this.video.isGIF ) {

      _item.imageFile = this.video.file;

      _item.fileToLoad = this.video.file;
    }
    
    this.text = "";
  }

  suspend() {

    if (this.getState() == sPlaying) {

      c("videoctl is suspending the video")

      this.pause();

      this.hide()
    }
   }

  hide() {

    this.video.hide();
  }

  //return the pic that should be displayed in the small control box
  //based on state

/*
  this.getControlPic = function() {

    var pic = "";
   
    var _state = this.getState();

    if (_state == sIcon) pic = this.iconPic;

    if (_state == sScanning) pic = this.scanningPic;

    if (_state == sLoaded || _state == sPaused) pic = this.playControlPic;

    if (_state == sPlaying) pic = this.pauseControlPic;

    return pic;

  }, //end getControlPic
*/

  setItems() {

      //screen out the ones used as primaries in the newBrowser

      this.items = this.collection.find( { cc: this.countryCode, dt: { $nin: ["gn","sd","tt"] },  s: { $nin: ["p"] } } ).fetch();

      this.fullCount = this.items.length;

  }

  //Used to get the file to display in featured area.
  //Usually this returns the content, but if animated gif is paused
  //it returns the big play button

  getFile() {

    var file = null;

    var _file = this.items[ this.getIndex() ].u;

    return _file;
  }


    show() {

      this.video.show();
    }

  pause() {

    this.setState( sPaused );

    this.video.pause();

  }


  play( _id ) {

    this.setState( sPlaying );

    var _file = this.getFile();

    if (_id) _file = _id;

    if (this.video) {

      if (this.video.file == _file) {

        this.video.play();

        return;
      }
    }

    c("new video in videoCtl with " + _file)

    this.video = new Video(_file, this);

    this.video.play();

  }// end play


}  //end Video object

 class Sound extends Set {

    constructor() {

      super("SOUND");

    this.name = "SOUND";

    this.soundPlayingPic = "vu_meter1.gif";

      this.soundPausedPic = "vu_meter1_static.gif"


    this.index = new Blaze.ReactiveVar(0);

    this.state = new Blaze.ReactiveVar(0);
  }


  setData( _item) {

    _item.setName( this.name );

    _item.imageFile = this.soundPlayingPic;

    _item.soundFile = this.items[ this.getIndex() ].u;

    _item.videoFile = null;

    _item.fileToLoad = this.soundPlayingPic;

    this.text = "";
  }

  play() {

    if (this.getState() == sPaused) hacker.feature.item.changeImage( this.soundPlayingPic )

    this.setState( sPlaying );

    this.playMedia();

  }


  pause() {

    c("SOUND pausing")

    this.setState( sPaused );

    hacker.feature.item.changeImage( this.soundPausedPic );

      document.getElementById("soundPlayer").pause();

  }

    playMedia() {

    var _file = this.getFile();

    if (_file == $("#soundPlayer").attr("src")) {

      c("sound.playMedia() is resuming sound play")
    
      document.getElementById("soundPlayer").play();

    }
    else {
      
      c("sound.playMedia() is playing new file")
      
      $("#soundPlayer").attr("src", _file);

      Meteor.setTimeout( function() { document.getElementById("soundPlayer").play(); }, 250);   

      game.setSoundControlListener();   

    }
  }


  setItems() {

    //don't use the anthems

    this.items = this.collection.find( { cc: this.countryCode, dt: { $ne: "ant" } } ).fetch();

    this.fullCount = this.items.length;
  }


  suspend() {

    if (this.getState() == sPlaying) {

      this.pause();
    }
  }
}