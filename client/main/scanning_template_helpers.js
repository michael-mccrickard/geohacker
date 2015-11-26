


Template.scanning.helpers({

    scanningNow: function() {

    	if (Session.get("sScanState") == "on" ) return true;

    	return false;
    },

    TEXTisLoaded: function() {

        if (display.loadedControl.name.get( "TEXT" ) return true;

        if (display.loadedControl.name.get( "MAP" ) return true;

        return false;
    },

    featuredText: function() {

        if (display.feature.getName() == "MAP") return display.ctl["MAP"].getTextContent();  

        if (display.feature.getName() == "TEXT") return display.ctl["TEXT"].getTextContent();           
    },

    loadedNow: function() {

        if (Session.get("sScanState") == "loaded" ) return true;

        return false;
    },   

    getProgress: function() {

        if (Session.get("sScanState") != "on") return;

    	if (Session.get("sScanProgress") >= 360 ) {

            if (display.scanner.checkScan() == true) {c("calling stopScan fm helpers.getProgress") ; display.scanner.stopScan(); }

    		return 359;
    	}


    	return Session.get("sScanProgress");
    },

    getTotal: function() {

    	return Session.get("sScanTotalTime");
    },

    getControlPic: function() {

        return display.loader.newControl.getControlPic();
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





