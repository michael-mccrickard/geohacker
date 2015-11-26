


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

    centerText: function() {

    	if ( display.scanner.state.get() == "on" ) {

    		var _percent = ( display.scanner.progress.get() / 360 ) * 100;

    		if (_percent >= 100.0) return "SCAN PROGRESS 100%";

    		return "SCAN PROGRESS " + _percent.toPrecision(2) + "%";
    	}

    	return "GEOHACKER V 1.0";
    },

    networkIntegrity: function() {

    	var _percent = display.scanner.networkIntegrity.get();

    	return _percent.toString();
    }

 })





