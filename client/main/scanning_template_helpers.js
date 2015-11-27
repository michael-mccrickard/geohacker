Template.main.events({

  'click .scanCenterImg': function(e) {

      e.preventDefault();  

      if (display.scanner.state.get() == "loaded") {

        display.feature.set( display.loadedControlName.get() );
     }
     else {
        
        Control.playEffect( display.locked_sound_file );
     }
  },

});


Template.scanning.helpers({

    scanningNow: function() {

        var _state = display.scanner.state.get();

    	if ( _state == "on" ) return true;

    	return false;
    },

    getProgress: function() {

        if (display.scanner.state.get() != "on") return;

    	if (display.scanner.progress.get() >= 360 ) {

            Meteor.clearInterval( display.scanner.progressID );

            if (display.scanner.checkScan() == true) display.scanner.stopScan();

    		return 359;
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

    	if ( display.scanner.state.get() == "on" ) {

    		var _percent = ( display.scanner.progress.get() / 360 ) * 100;

    		if (_percent >= 100.0) return "SCAN PROGRESS 100%";

    		return "SCAN PROGRESS " + _percent.toPrecision(2) + "%";
    	}

        if ( display.scanner.state.get() == "loaded" ) {

            return display.loadedControlName.get() + " FILE";
        }      

    	return "GEOHACKER V 1.0";
    },

    networkIntegrity: function() {

    	var _percent = display.scanner.networkIntegrity.get();

    	return _percent.toString();
    }

 })





