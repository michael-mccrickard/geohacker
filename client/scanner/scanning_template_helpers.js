

Template.scanning.helpers({

    nationsCount: function() {

        return db.ghC.find().fetch().length;

    },

    scanningNow: function() {

        if (!display) return;

        var _state = hacker.scanner.centerState.get();

    	if ( _state == "scan" ) return true;

    	return false;
    },

    getProgress: function() {

        var _state = hacker.scanner.centerState.get();

        if (_state != "scan" && _state != "rescan") return;

    	if (hacker.scanner.progress.get() >= hacker.scanner.progressLimit ) {

            if (hacker.scanner.checkScan("scanner") == true) hacker.scanner.stopScan();

    		return hacker.scanner.progressLimit - 1;
    	}


    	return hacker.scanner.progress.get();
    },

    getTotal: function() {

    	return hacker.scanner.totalTime.get();
    },

    getScannerCenterImage: function() {

        var _default = "3DGlobe.png"; 

        return _default;
    },

    centerText: function() {

        if (!display) return;

        var _state = hacker.scanner.centerState.get();

    	if (_state == "scan" || _state == "rescan") {

    		var _percent = ( hacker.scanner.progress.get() / 360 ) * 100;

    		if (_percent >= 100.0) return "SCAN PROGRESS 100%";

    		return "SCAN PROGRESS " + _percent.toPrecision(2) + "%";
    	}

        if ( hacker.scanner.centerState.get() == "loaded" ) {

            return hacker.loadedControlName.get() + " FILE";
        }      

    	return "GEOHACKER V 1.0";
    },

    networkIntegrity: function() {

        if (!display) return;

    	var _percent = hacker.scanner.networkIntegrity.get();

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

