


Template.main.events({

  'click .scanCenterImg': function(e) {

      e.preventDefault();  

      var _mode = display.scanner.mode;

      var _state = display.scanner.centerState.get();


    if (_state == "loaded") {

        display.scanner.fadeOut( 250 );

        display.feature.set( display.loadedControlName.get() );

     }
     else {

        Control.playEffect( display.locked_sound_file );
     }
  },

});


Template.scanning.helpers({

    nationsCount: function() {

        return db.ghC.find( { d: 1 } ).fetch().length;

    },

    cursorForScanCenter: function() {

      //var _mode = display.scanner.mode;

      //if (_mode != "scan" && _mode != "rescan" && display.scanner.centerState != "idle") return "default";

        var _state = display.scanner.centerState.get();

        if (_state == "loaded") return "pointer";

        return "default";

    },

    scanningNow: function() {

        if (!display) return;

        var _state = display.scanner.centerState.get();

    	if ( _state == "scan" ) return true;

    	return false;
    },

    getProgress: function() {

        if (!display) return;

        var _state = display.scanner.centerState.get();

        if (_state != "scan" && _state != "rescan") return;

    	if (display.scanner.progress.get() >= display.scanner.progressLimit ) {

            if (display.scanner.checkScan("scanner") == true) display.scanner.stopScan();

    		return display.scanner.progressLimit - 1;
    	}


    	return display.scanner.progress.get();
    },

    getTotal: function() {

        if (!display) return;

    	return display.scanner.totalTime.get();
    },

    getScannerCenterImage: function() {

        if (!display) return;

        var _default =  "3DGlobe.png"; //"geohacker_background2.png";

        var _name = display.loadedControlName.get();

        if ( _name.length ) return display.ctl[ _name ].getControlPic();

        return _default;
    },

    TEXTisFeatured: function() {

        if (!display) return;

         var _name = display.loadedControlName.get();       

        if ( _name == "TEXT") return true;

        return false;
    },

    featuredText: function() {

        if (!display) return;

         var _name = display.loadedControlName.get();       

        if ( _name == "TEXT") return display.ctl[ _name ].getTextContent();

        return "";
    },

    centerText: function() {

        if (!display) return;

        var _state = display.scanner.centerState.get();

    	if (_state == "scan" || _state == "rescan") {

    		var _percent = ( display.scanner.progress.get() / 360 ) * 100;

    		if (_percent >= 100.0) return "SCAN PROGRESS 100%";

    		return "SCAN PROGRESS " + _percent.toPrecision(2) + "%";
    	}

        if ( display.scanner.centerState.get() == "loaded" ) {

            return display.loadedControlName.get() + " FILE";
        }      

    	return "GEOHACKER V 1.0";
    },

    networkIntegrity: function() {

        if (!display) return;

    	var _percent = display.scanner.networkIntegrity.get();

    	return _percent.toString();
    }

 })



/*
tt = function() {

  Meteor.call("test1", function(err, res){ $("span.scrollTextBGText").text( res ) } );  

        $("div.scrollTextBG").velocity({
            top: "0px",
        },{
            duration: 5000,
        });


}
*/

