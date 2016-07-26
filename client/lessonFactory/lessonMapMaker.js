//*************************************************************************//
/*
              MAP DATA OBJECT

     Uses data from the db to build the areas object for the current map

      4 levels -- world, continent, region, country

      All of the levels (except world) have these properties in the db: 
          
          --ID (for countries: matches the standard 2-letter ID in worldLow.js)
               (for larger areas, we have devised our own codes)
          --name of the area
          --color of the area

      All but the countries have this property
          --zoom data  
      
      We don't make any programmatic changes to the map when 
      the user clicks on a country (the functions in this module are not called, i.e.) b/c 
      we just take advantage of the autoZoom when clicked feature.
*/
//*************************************************************************

LessonMapMaker = function() {

    /*

    _mapLevel = world, continent or region (used by the calling function in lessonMap.js: doMap() )

                This is the zoom extents for the map, how much of the world map is shown.

    _drawLevel = world, continent or region (the area that will be drawn on the map; the remainder will be greyed out)

    _detailLevel = world, continent, region or country (within the drawn area, how is the map further sub-divided, if at all.

                  Subdivisions are colored the same; highlighted together and share the same identifying popup text.)

    _continentID = if drawLevel is continent, the continent to draw

    _regionID = if drawLevel is region, the region to draw

    _zoom params = the zoom extents to apply to each country, based on the _mapLevel (allows the countries to be clickable, but prevents zooming in)


    */


    this.getJSONForMap = function(_continentID, _regionID, _mapLevel, _drawLevel, _detailLevel, _zoomLevel, _zoomLatitude, _zoomLongitude) {

        var _rec = null;

        var s = '[';


        if (_mapLevel == mlWorld || _drawLevel == mlWorld) {

          //get an array of the continents

          var arr = db.ghZ.find( {} ).fetch();

          for (var i = 0; i < arr.length; i++) {  

              _rec = arr[i];

              s = s + this.getJSONForContinent(_rec.c, null, _mapLevel, _drawLevel, _detailLevel, _zoomLevel, _zoomLatitude, _zoomLongitude);

          }

        } 
        else {  //then we're only showing part of the map; continent or region

            s = s + this.getJSONForContinent(_continentID, _regionID, _mapLevel, _drawLevel, _detailLevel, _zoomLevel, _zoomLatitude, _zoomLongitude);
        }

        s = s.substr(0, s.length - 1);

        if (s.length) {

          s = s + "]";
        }
        else {

          s = '[]';
        }
        
  //console.log(s);

        return JSON.parse(s);

    }

    /*

    The interesting properties here are areaID (called groupId by ammap.js), areaName, color and customData.

    customData always holds the name that is displayed when you mouseOver the area.  
    This name depends on which map level we are displaying.

    areaID is the ID of the larger group (if any) that the area belongs to:

      continent (really part of the world, but not part of any larger group, programmatically speaking, so no areaID for these)

      region (part of a continent)

      country (part of a region)

    Likewise areaName is the name of the larger group.

    We set the areaID on each country:  

            at the world level, each country has the areaID for its continent
            
            at the continent level, each country has the areaID for its region

            at the region level, each country has it's own ID as the areaID

    We put the areaName (name corresponding to the areaID) into the
    customData for the country, and that is the name that is displayed on mouseOver.

    Likewise, we apply the color of the larger group to all countries in that group, when
    we are displaying the world (all the continents) or a single continent (all the regions in it) 

    */


    this.getJSONForContinent = function(_continentID, _regionID, _mapLevel, _drawLevel, _detailLevel, _zoomLevel, _zoomLatitude, _zoomLongitude) {

      var arrR = [];

      var rec;

      var _continentName;

      var _continentColor;


      var s = '';

      //set the continent-level properties from the continent record

       rec = db.getContinentRec(_continentID);

      _continentName = rec.n;

      _continentColor = rec.co;


    //get an array of the regions for this continent

      if (_drawLevel == mlWorld || _drawLevel == mlContinent) arrR = db.ghR.find( {z: _continentID } ).fetch();

      if (_drawLevel == mlRegion ) arrR = db.ghR.find( {c: _regionID } ).fetch();          

      for (var i = 0; i < arrR.length; i++) {  

          var _rec = arrR[i];

          var _regionName = _rec.n;

          var _regionID = _rec.c;

          var _regionColor = _rec.co;

          s = s + this.getJSONForRegion(_detailLevel, _regionID, _regionName, _regionColor, _continentID, _continentName, _continentColor, _zoomLevel, _zoomLatitude, _zoomLongitude);

      }

      return s;

    }


    this.getJSONForRegion = function(_detailLevel, _regionID, _regionName, _regionColor, _continentID, _continentName, _continentColor, _zoomLevel, _zoomLatitude, _zoomLongitude) {

        var newline = "\n\r";

        var s = '';

        var _groupID = "";

        var _groupName = "";

        var _groupColor = null;


        //look up all the countries for the region

        var arr = db.ghC.find( {r: _regionID } ).fetch();

        for (var i = 0; i < arr.length; i++) { 


            if (_detailLevel == mlWorld || _detailLevel == mlContinent) {

               _groupID = _continentID;

               _name = _continentName;

               _groupColor = _continentColor;
            }

            if (_detailLevel == mlRegion) {

              _groupID = _regionID;

              _name = _regionName;

              _groupColor = _regionColor;
            } 

            if (_detailLevel == mlCountry) {

              _groupID = arr[i].c;  

              _groupColor = arr[i].co;

              _name = arr[i].n;
            } 

            s = s + '{' + newline;

            s = s + '"title"' + ': "' + arr[i].n + '", ' + newline; 

            s = s + '"id"' + ': "' + arr[i].c + '", ' + newline; 
              
            s = s + '"customData"' +  ': "' + _name + '", ' + newline; 

            s = s + '"groupId"' +  ': "' + _groupID + '", ' + newline; 


            s = s + '"zoomLevel"' + ': "' + _zoomLevel + '", ' + newline;  

            s = s + '"zoomLatitude"' + ': "' + _zoomLatitude + '", ' + newline;  

            s = s + '"zoomLongitude"' + ': "' + _zoomLongitude + '", ' + newline; 

            s = s + '"color"' +  ': "' +  _groupColor + '"' + newline; 

            s = s + "}," 
        }
          

        return s;

    }

}  //end LessonMapMaker()  




//temporary

dotest2 = function() {
      var strJSON = getJSONForArea("north_america", mlContinent);

    //console.log(strJSON);
}

