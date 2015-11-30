Template.main.events({

  'click .scanCenterImg': function(e) {

      e.preventDefault();  

      var _mode = display.scanner.mode;

      if (_mode != "scan" && _mode != "rescan") {

        display.scanner.fadeOut( 250 );

        display.feature.set( display.loadedControlName.get() );
     }
     else {

        Control.playEffect( display.locked_sound_file );
     }
  },

});


Template.scanning.helpers({

    scanningNow: function() {

        var _state = display.scanner.centerState.get();

    	if ( _state == "scan" ) return true;

    	return false;
    },

    getProgress: function() {

        var _state = display.scanner.centerState.get();

        if (_state != "scan" && _state != "rescan") return;

    	if (display.scanner.progress.get() >= display.scanner.progressLimit ) {

            //Meteor.clearInterval( display.scanner.progressID );

            if (display.scanner.checkScan() == true) display.scanner.stopScan();

    		return display.scanner.progressLimit - 1;
    	}


    	return display.scanner.progress.get();
    },

    getTotal: function() {

    	return display.scanner.totalTime.get();
    },

    getScannerCenterImage: function() {

        var _default =  "geohacker_background2.png";

        var _name = display.loadedControlName.get();

        if ( _name.length ) return display.ctl[ _name ].getControlPic();

        return _default;
    },

    TEXTisFeatured: function() {

         var _name = display.loadedControlName.get();       

        if ( _name == "TEXT") return true;

        return false;
    },

    featuredText: function() {

         var _name = display.loadedControlName.get();       

        if ( _name == "TEXT") return display.ctl[ _name ].getTextContent();

        return "";
    },

    centerText: function() {


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

    	var _percent = display.scanner.networkIntegrity.get();

    	return _percent.toString();
    }

 })





