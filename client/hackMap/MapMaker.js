//TO DO:  Check these comments against new map scheme

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

MapMaker = function() {

    /*

    This is the top-level function, called by doMap() in worldMap.js and browseMap.js

    _code = the area code (either a continent or a region)

    _level = world, continent or region

    lockMap = false, write zoom data to the areas
    lockMap = true, don't write zoom data (locks the map down)

    drawHackAreaOnly = false (default), draw all the countries on the globe
    drawHackAreaOnly = true, depending on the map level, draw only the continent or region specified by the hack

    */


    this.getJSONForMap = function(_code, _level, _lockMap, _drawHackAreaOnly) {

      var _rec = null;

      var s = '[';

      var arr = db.ghZ.find( {} ).fetch();

      for (var i = 0; i < arr.length; i++) {  

          _rec = arr[i];

          //if the user clicked on a incorrect continent (after the continent has already been established)
          //the we use this option to redraw the map with only the correct continent colored in

          if ( _drawHackAreaOnly ) {

            if (_level == mlContinent && _rec.c != hack.continentCode) continue;

          }

          s = s + this.getJSONForContinent(_rec.c, _level, _lockMap, _code, _drawHackAreaOnly);

      }

      s = s.substr(0, s.length - 1);

      if (s.length) {

        s = s + "]";
      }
      else {

        s = '[]';
      }

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


this.getJSONForContinent = function(_code, _level, _lockMap, _code2, _drawHackAreaOnly) {

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

      arrR = db.ghR.find( {z: _areaID } ).fetch();

      for (var i = 0; i < arrR.length; i++) {  

          var _rec = arrR[i];

          var _regionName = _rec.n;

          var _regionID = _rec.c;

          if (_level == mlWorld) s = s + this.getJSONForRegion(_level, _regionName, _regionID, _areaID, _areaName, _zoomLevel, _zoomLatitude, _zoomLongitude, _color, _lockMap );

          if (_level == mlContinent) {

            s = s + this.getJSONForRegion(_level, _regionName, _regionID, _areaID, _areaName, _rec.z1, _rec.z2, _rec.z3, _rec.co, _lockMap, _code2 );

          }

          if (_level == mlRegion) {

            //if the user clicked on a incorrect region (after the region has already been established)
            //the we use this option to redraw the map with only the correct region colored in

            if ( _drawHackAreaOnly ) {

              if (_rec.c != hack.regionCode) continue;

            }

            s = s + this.getJSONForRegion(_level, _regionName, _regionID, _areaID, _areaName, 0,0,0, _rec.co, _lockMap, _code2 );

          }

      }  

  return s;
}


    this.getJSONForRegion = function(_level, _regionName, _regionID, _areaID, _areaName, _zoomLevel, _zoomLatitude, _zoomLongitude, _color, lockMap, _code2) {

          var newline = "\n\r";

          var s = '';

          //look up all the countries for the region

          var arr = db.ghC.find( {r: _regionID } ).fetch();

          for (var i = 0; i < arr.length; i++) { 

            s = s + '{' + newline;

            s = s + '"title"' + ': "' + arr[i].n + '", ' + newline; 

            s = s + '"id"' + ': "' + arr[i].c + '", ' + newline; 


            if (_level == mlWorld) {
              
              s = s + '"customData"' +  ': "' + _areaName + '", ' + newline; 

              s = s + '"groupId"' +  ': "' + _areaID + '", ' + newline; 

            }

            if (_level == mlContinent) {
              
              s = s + '"customData"' +  ': "' + _regionName + '", ' + newline; 

              s = s + '"groupId"' +  ': "' + _regionID + '", ' + newline; 

            }

            if (_level == mlWorld || _level == mlContinent) {

              if (!lockMap) {

                s = s + '"zoomLevel"' + ': "' + _zoomLevel + '", ' + newline;  

                s = s + '"zoomLatitude"' + ': "' + _zoomLatitude + '", ' + newline;  

                s = s + '"zoomLongitude"' + ': "' + _zoomLongitude + '", ' + newline; 

              }

            }


            //the region level is the only one where the countries use their specified color,
            //and not the color of their larger group
            
            var _color2 = getColor( arr[i].fc );

            if (_level == mlRegion) {

              //at the region level, we color in all the countries individually, but those in the non-target regions
              //will have reduced brightness

              if (_regionID != _code2) _color2 = ColorLuminance(_color2, -0.6);
              
              s = s + '"customData"' +  ': "' + arr[i].n + '", ' + newline; 

              s = s + '"color"' +  ': "' +   _color2 + '"' + newline;              //arr[i].co + '"' + newline;            
            }
            else {

              //at the world level, all the continents are colored equally brightly,
              //but at the continent level, we reduce the brightness of the non-target continents

              //if this is a non-target country, then dim it

              if (_level == mlContinent && (_areaID != _code2)) {

                  _color2 = ColorLuminance(_color, -0.6);

                  s = s + '"color"' +  ': "' +  _color2 + '"' + newline;  
              }
              else {

                 //at this point, we are down to the target countries in continent level
                 //(they all get the region color)

                 s = s + '"color"' +  ': "' +  _color + '"' + newline;                
              }

            }
            

            s = s + "},"

          }  //end of loop


        return s;
    }
}

function getColor( _n ) {

    var _c = "";

    if (_n == "B") _c = "#6495ED";

    if (_n == "G") _c = "#228B22";

    if (_n == "R") _c = "#FF0000";

    if (_n == "P") _c = "#DA70D6";

    if (_n == "N") _c = "#CD853F";

    if (_n == "O") _c = "#FFA500";

    return _c;
}

function ColorLuminance(hex, lum) {

  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '');

  if (hex.length < 6) {
  
    hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  }
  
  lum = lum || 0;

  // convert to decimal and change luminosity
  var rgb = "#", c, i;
  
  for (i = 0; i < 3; i++) {
  
    c = parseInt(hex.substr(i*2,2), 16);
  
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
  
    rgb += ("00"+c).substr(c.length);
  }

  return rgb;
}


//temporary

dotest2 = function() {
      var strJSON = getJSONForArea("north_america", mlContinent);

    //console.log(strJSON);
}

