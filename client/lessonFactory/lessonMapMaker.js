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

    This is the top-level function, called by doMap() in worldMap.js and browseMap.js

    _code = the area code (either a continent or a region)

    _level = world, continent or region

    lockMap = false, write zoom data to the areas
    lockMap = true, don't write zoom data (locks the map down)
    */


    this.getJSONForMap = function(_continentID, _regionID, _drawLevel, _detailLevel) {

        var _rec = null;

        var s = '[';


        if (_drawLevel == mlWorld) {

          //get an array of the continents

          var arr = db.ghZ.find( {} ).fetch();

          for (var i = 0; i < arr.length; i++) {  

              _rec = arr[i];

              s = s + this.getJSONForContinent(_rec.c, null, _drawLevel, _detailLevel);

          }

        } 
        else {  //then we're only drawing part of the map; continent or region

            s = s + this.getJSONForContinent(_continentID, _regionID, _drawLevel, _detailLevel);
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


    this.getJSONForContinent = function(_code, _regionID, _drawLevel, _detailLevel) {

      var arrR = [];

      var rec;

      var _areaID;

      var _areaName;

      var _customData;

      var _color;

      var _zoomLevel;

      var _zoomLatitude;

      var _zoomLongitude;

      var s = '';

      //set the continent-level properties from the continent record

       rec = db.getContinentRec(_code);

      _areaID = _code;

      _areaName = rec.n;

      _customData = rec.n;

      _color = rec.co;


      _zoomLevel = rec.z1;

      _zoomLatitude = rec.z2;

      _zoomLongitude = rec.z3;


    //get an array of the regions for this continent

      if (_drawLevel == mlWorld || _drawLevel == mlContinent) arrR = db.ghR.find( {z: _areaID } ).fetch();

      if (_drawLevel == mlRegion) arrR = db.ghR.find( {r: _regionID } ).fetch();          

          for (var i = 0; i < arrR.length; i++) {  

              var _rec = arrR[i];

              var _regionName = _rec.n;

              var _regionID = _rec.c;

              var _color = _rec.co;

              s = s + this.getJSONForRegion(_detailLevel, _regionName, _regionID, _areaID, _areaName, _zoomLevel, _zoomLatitude, _zoomLongitude, _color);

          }

          return s;

    }


    this.getJSONForRegion = function(_detailLevel, _regionName, _regionID, _areaID, _areaName, _zoomLevel, _zoomLatitude, _zoomLongitude, _color) {

          var newline = "\n\r";

          var s = '';

          var _groupID = "";

          //look up all the countries for the region

          var arr = db.ghC.find( {r: _regionID } ).fetch();

          for (var i = 0; i < arr.length; i++) { 


              s = s + '{' + newline;

              s = s + '"title"' + ': "' + arr[i].n + '", ' + newline; 

              s = s + '"id"' + ': "' + arr[i].c + '", ' + newline; 

              if (_detailLevel == mlCountry) {

                _groupID = arr[i].c;  
              } 
              else {

                 _groupID = _areaID;
              }

                
              s = s + '"customData"' +  ': "' + _areaName + '", ' + newline; 

              s = s + '"groupId"' +  ': "' + _areaID + '", ' + newline; 


              s = s + '"zoomLevel"' + ': "' + _zoomLevel + '", ' + newline;  

              s = s + '"zoomLatitude"' + ': "' + _zoomLatitude + '", ' + newline;  

              s = s + '"zoomLongitude"' + ': "' + _zoomLongitude + '", ' + newline; 

            

              if (_detailLevel == mlCountry) {
                
                s = s + '"color"' +  ': "' +  arr[i].co + '"' + newline;            
              }
              else {

              s = s + '"color"' +  ': "' +  _color + '"' + newline;  
            }
            

            s = s + "},"

          }

        return s;
    }
}


//temporary

dotest2 = function() {
      var strJSON = getJSONForArea("north_america", mlContinent);

    //console.log(strJSON);
}

