

Template.scanning.helpers({

    nationsCount: function() {

        return db.ghC.find( { d: 1 } ).fetch().length;

    },

    scanningNow: function() {

        if (!display) return;

        var _state = display.scanner.centerState.get();

    	if ( _state == "scan" ) return true;

    	return false;
    },

    getProgress: function() {

        var _state = display.scanner.centerState.get();

        if (_state != "scan" && _state != "rescan") return;

    	if (display.scanner.progress.get() >= display.scanner.progressLimit ) {

            if (display.scanner.checkScan("scanner") == true) display.scanner.stopScan();

    		return display.scanner.progressLimit - 1;
    	}


    	return display.scanner.progress.get();
    },

    getTotal: function() {

    	return display.scanner.totalTime.get();
    },

    getScannerCenterImage: function() {

        var _default = "3DGlobe.png"; 

        return _default;
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

