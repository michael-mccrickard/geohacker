


Template.main.events({

  'click .scanCenterImg': function(e) {

      e.preventDefault();  

      var _mode = game.display.scanner.mode;

      if (_mode != "scan" && _mode != "rescan") {

        game.display.scanner.fadeOut( 250 );

        game.display.feature.set( game.display.loadedControlName.get() );

     }
     else {

        Control.playEffect( game.display.locked_sound_file );
     }
  },

});


Template.scanning.helpers({

    scanningNow: function() {

        var _state = game.display.scanner.centerState.get();

    	if ( _state == "scan" ) return true;

    	return false;
    },

    getProgress: function() {

        var _state = game.display.scanner.centerState.get();

        if (_state != "scan" && _state != "rescan") return;

    	if (game.display.scanner.progress.get() >= game.display.scanner.progressLimit ) {

            if (game.display.scanner.checkScan("scanner") == true) game.display.scanner.stopScan();

    		return game.display.scanner.progressLimit - 1;
    	}


    	return game.display.scanner.progress.get();
    },

    getTotal: function() {

    	return game.display.scanner.totalTime.get();
    },

    getScannerCenterImage: function() {

        var _default =  "3DGlobe.png"; //"geohacker_background2.png";

        var _name = game.display.loadedControlName.get();

        if ( _name.length ) return game.display.ctl[ _name ].getControlPic();

        return _default;
    },

    TEXTisFeatured: function() {

         var _name = game.display.loadedControlName.get();       

        if ( _name == "TEXT") return true;

        return false;
    },

    featuredText: function() {

         var _name = game.display.loadedControlName.get();       

        if ( _name == "TEXT") return game.display.ctl[ _name ].getTextContent();

        return "";
    },

    centerText: function() {


        var _state = game.display.scanner.centerState.get();

    	if (_state == "scan" || _state == "rescan") {

    		var _percent = ( game.display.scanner.progress.get() / 360 ) * 100;

    		if (_percent >= 100.0) return "SCAN PROGRESS 100%";

    		return "SCAN PROGRESS " + _percent.toPrecision(2) + "%";
    	}

        if ( game.display.scanner.centerState.get() == "loaded" ) {

            return game.display.loadedControlName.get() + " FILE";
        }      

    	return "GEOHACKER V 1.0";
    },

    networkIntegrity: function() {

    	var _percent = game.display.scanner.networkIntegrity.get();

    	return _percent.toString();
    }

 })



tt = function() {

  Meteor.call("test1", function(err, res){ $("span.scrollTextBGText").text( res ) } );  

        $("div.scrollTextBG").velocity({
            top: "0px",
        },{
            duration: 5000,
        });


}


