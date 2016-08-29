/*

  /*User profile fields:

  The default / initial values are in login.js.  

  //hacking 
  //see user.js, assignTicketAndTag.js, game.js ( .createGHUser() ) for details

  a = assigns (object array -- assigns)
  c = assign code (current mission)
  h = atlas (object array -- tickets)

  //badge  (all integers, most are arrays [gold, silver, bronze])
  // see badge.js for details
  ge = genius 
  ex = expert
  sp = speed
  in = investigator
  sc = scholar
  ft = first time

  //bio
  //see bio.html and bio.js for details
  st = user status  (active, virtual, etc.)
  t = text
  p = picture
  pt = picture text
  av = avatar or photo  //widely used in the code; bio, template_helpers, newNav, userDirectory
  f = flag pic
  cn = country name
  cc = country code  //essentially read-only, created when user is first created
                     //but reader has no way to edit this value (or cn's value, either)
                     //so these two not included in updates currently
  ag = agents in network (array of user ids)
  t = title (no programmatic way to add or edit this, so not used in updates either) 

  //lessons

  l_africa = array of scores for each lesson on this continent
  l_asia = array of scores for each lesson on this continent
  l_europe = array of scores for each lesson on this continent
  l_north_america = array of scores for each lesson on this continent
  l_south_america = array of scores for each lesson on this continent
  l_oceania = array of scores for each lesson on this continent


  //miscellaneous

  sn: last seen (date object)
  roles: array of roles (for users that actually work on or administrate the game)  
        "admin", "editor" are currently the only roles


  //??? 
  s=  ???




//country records

{
    "_id": "HeGDLhqX9XhnPneFy",  //"meteor" mongo id
    "c": "NG",                   //2 letter country ID
    "co": "#7B68EE",			 //color on map
    "d": 1,						 //data?
    "n": "Nigeria",				 //name
    "r": "nwaf",				 //region
    "xl": 0.42044444444444445,   //x label pos (normalized) for map in full-width mode
    "yl": 0.4121739130434783,	 //y label pos (normalized) for map in full-width mode
    "s": "0",					 //source  (for the detailed map)
    "xl2": 0.39032298784349473,	 //x label pos (normalized) for map in half-width mode
    "yl2": 0.46118408,			 //y label pos (normalized) for map in half-width mode
    "ht": "Nigeria",			 //homeland text
    "hts": 28,					 //homeland text size (font)
    "htc": "rgb(255, 255, 255)", //homeland text color
    "tts": 20,					 //translated homeland text size
    "ttc": "rgb(255, 255, 0)",	 //translated homeland text color
    "htl": -124,				 //homeland text left position
    "hto": "0.6",				 //homeland picture opacity (capital)
    "lat": -7.558169,			 //??
    "lon": 36.707646,			 //??
    "xl3": 0.3146491043542884,	 //x position, label on continent map (old method)
    "yl3": 0.3990511447637803,	 //y position, label on continent map (old method)
    "xc": 0.37930890227576974,   //x position of country capsule (old method)
    "yc": 0.5274212110481586,	//y position of country capsule (old method)
    "llon": 4.597815,			//x position of country label on continent map (longitude)
    "llat": 10.505739,			//y position of country label on continent map (latitude)
    "ll_r": -45,                //rotation of country label on continent map
    "ll_co": "yellow",          //color of country label on continent map
    "cpLon": 13.850708,			//x position of capsule on continent map (longitude)
    "cpLat": 0.687274			//y position of capsule on continent map (latitude)
}


//region records

{
    "_id": "ZWq2o4TTCFap8akk9",  //meteor mongo id
    "c": "nwaf",				 //region code
    "co": "#723C1A",			 //color of region
    "xl": 0.10005981374340799,	 //x of label pos (normalized, old method)
    "yl": 0.2855710452617941,	 //y of label pos (normalized, old method)
    "z": "africa",				 //continent code
    "z1": "6.03",				 //zoom level
    "z2": "21.9",				 //zoom lat
    "z3": "3.3",				 //zoom long
    "n2": "N",					 //???
    "n": "Northwestern Africa",	 //name
    "lc": -5,					 //???
    "llon": -15.202173,			 //label position longitude (new method)
    "llat": 18.898455			 //label position latitude (new method)
}

*/