


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
    }

 })

gScanProgress = 0;

gScanProgressID = null;


startProgressMeter = function() {

	gScanProgress = 0;

	Session.set("sScanProgress", gScanProgress );

	gScanProgressID = Meteor.setInterval( function () {

	 	gScanProgress += 1;

        Session.set("sScanProgress", gScanProgress ); 

	}, 10 );

}

