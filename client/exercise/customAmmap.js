

Template.customAmmap.rendered = function() {

	story.fadeOutTokens();

	customAmmap = new CustomAmmap();

	story.doCustomAmmapForExercise();
}


//create custom ammap map for exercises

CustomAmmap = function() {

    this.map = null;

    this.dp = null;

    //this.mm = this.mm || new BrowseMapMaker();


	this.doThisMap = function( _obj ) {

        //reset this each time, b/c it disappears if we switch hack/display objects

        worldMap = this;

        //initialize variables related to the map

        this.zoomDone = true;  //this is used to keep the zoomCompleted event from redrawing / validating map 
                                //before we're ready


        //initialize the map object and basic map variables

        this.map = new AmCharts.AmMap();

        this.map.fontFamily = "Lucida Console, Monaco, monospace";

        this.map.pathToImages = "packages/mikemccrickard_ammap/lib/images/";

        this.dp = {

            "mapVar":  _obj.mapVar,  //AmCharts.maps.AsiaLow,

			       "getAreasFromMap": true,
        }


        if (_obj.z1) this.dp.zoomLevel = _obj.z1;
        if (_obj.z2) this.dp.zoomLatitude = _obj.z2;
        if (_obj.z3) this.dp.zoomLongitude  = _obj.z3;

        this.dp.images = [];

        //set the data provider and areas settings

        this.map.balloon.fontSize = 16;

        this.map.dataProvider = this.dp;


        this.map.creditsPosition = "top-left";

		this.map.zoomControl.zoomControlEnabled = false;

		this.map.zoomControl.panControlEnabled = false;

		this.map.zoomControl.homeButtonEnabled = false;

        this.map.addClassNames = true;

        this.map.areasSettings = {

            autoZoom: true,
            rollOverOutlineColor: "#000000",
            color: "#BBBB00",
            selectedColor: "#BBBB00",
            selectedOutlineColor: "#FFFFFF",

        };


        // handle the clicks on any map object
        this.map.addListener("clickMapObject", handleClickCustom);

        
        /*

        this.map.areasSettings.balloonText = "[[customData]]";


        // when the zoom is done (going to continent or region) then we need to adjust the zoom on the new map
        this.map.addListener("zoomCompleted", handleZoomCompletedCustom);


*/
        this.map.write("customAmmap");

    }

    this.freezeCountries = function( _obj ) {

        //get an array of the regions for this continent

          var _arr = this.map.dataProvider.areas;

          for (var i = 0; i < _arr.length; i++) {  

              this.map.dataProvider.areas[i].zoomLevel = _obj.z1;

              this.map.dataProvider.areas[i].zoomLatitude = _obj.z2;

              this.map.dataProvider.areas[i].zoomLongitude = _obj.z3;
          }

          this.map.validateData();

    }

    this.colorCountries = function() {

        //get an array of the regions for this continent

          var _arr = this.map.dataProvider.areas;

          for (var i = 0; i < _arr.length; i++) {  

              var _code = _arr[i].id.substr(0,2);

              var _col = db.ghC.findOne( { c: _code} ).co;

              this.map.dataProvider.areas[i].color = _col;
          }

          this.map.validateData();

    }


    //label the clicked map object and pos it appropriately

    this.labelMapObject = function(_text, _lon, _lat, _col) {

        var x, y;

        var _align = "";

        var _obj = this.map.coordinatesToStageXY( _lon, _lat );
        
        var _fontSize = 24;

        if (typeof _col == 'undefined') _col = "black";   

        Meteor.defer( function() { customAmmap.map.addLabel(_obj.x, _obj.y, _text.toUpperCase(), _align, _fontSize, _col); } );
    }

}

handleClickCustom = function(_event) {

console.log( customAmmap.map.getDevInfo().longitude + ", " +  customAmmap.map.getDevInfo().latitude )

  story.mem.char.q();

  story.labelClickedExerciseObject( _event.mapObject.id );

  Meteor.setTimeout( function() { story.mem.exercise.processUserChoice( _event.mapObject.id ) }, 500 );

}


//*************************************************************************
//              TEMPLATE HELPERS FOR CUSTOM AMMAP
//*************************************************************************
Template.customAmmap.helpers({

	exerciseChar: function() {

		return story.mem.char.index;
	},

	picForChar: function() {

		return story.mem.char.pic;
	},

	nameForChar: function() {

		return story.mem.char.name;
	},

  MapHeadline: function() {

     return "PICK A COUNTRY TO EXPLORE";
  },

  mapLeft: function() {

    return $(window).width() * 0.005;

  },

  mapWidth: function() { 

    return $(window).width() * 0.985;

  },


  mapHeight: function() { 

    _factor = 0.79;

    return $(window).height() * _factor;

  }
});

