


Template.scanning.helpers({

    scanningNow: function() {

    	if (Session.get("sScanningNow") == true ) return true;

    	return false;
    },

    getProgress: function() {

    	if (Session.get("sScanProgress") >= 360 ) {

            if (display.scanner.checkScan() == true) display.scanner.stopScan();

    		Meteor.clearInterval( gScanProgressID );

    		return 359;
    	}


    	return Session.get("sScanProgress");
    },

    getTotal: function() {

    	return Session.get("sScanTotalTime");
    },

    centerText: function() {

    	if (Session.get("sScanningNow") == true ) {

    		var _percent = ( Session.get("sScanProgress") / 360 ) * 100;

    		if (_percent >= 100.0) return "SCAN PROGRESS 100%";

    		return "SCAN PROGRESS " + _percent.toPrecision(2) + "%";
    	}

    	return "GEOHACKER V 1.0";
    },

    networkIntegrity: function() {

    	var _percent = Session.get("sNetworkIntegrity");

    	return _percent.toString();
    }

 })





