


Template.scanning.helpers({

    scanningNow: function() {

    	if (Session.get("sScanningNow") == true ) return true;

    	return false;
    },

    getProgress: function() {

    	if (Session.get("sScanProgress") >= 360 ) {

    		Meteor.clearInterval( gScanProgressID );

    		return 359;
    	}

    	return Session.get("sScanProgress");
    },

    centerText: function() {

    	if (Session.get("sScanningNow") == true ) {

    		var _percent = ( Session.get("sScanProgress") / 360 ) * 100;

    		return "SCAN PROGRESS " + _percent.toPrecision(2) + "%";
    	}

    	return "GEOHACKER V 1.0";

    }

 })





