


Template.scanning.helpers({

    scanningNow: function() {

    	if (Session.get("sScanState") == "on" ) return true;

    	return false;
    },

    getProgress: function() {

        if (Session.get("sScanState") != "on") return;

    	if (Session.get("sScanProgress") >= 360 ) {

            //can't get the interval to clear, so need to rewrite the progress meter to use setTimeout instead

            Meteor.clearInterval( gScanProgressID );

            if (display.scanner.checkScan() == true) {c("calling stopScan fm helpers.getProgress") ; display.scanner.stopScan(); }

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





