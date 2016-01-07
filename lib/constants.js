imagePath = "cfs/files/ghImage/";

avatarPath = "cfs/files/ghAvatar/";

tagPath = "cfs/files/ghTag/";

//****************************************************************
//                  CONSTANTS
//****************************************************************

//user modes
uNone = 	0;
uBio =		1;
uHack = 	2;
uStats = 	3;
uAgents = 	4;
uMessage = 	5;
uBrowse = 	6;
uClockOut = 7;
uMap = 		8;


//user badges
vGold = 	0;
vSilver = 	1;
vBronze = 	2;

bBlank = 		0;
bSpeed = 		1;
bScholar = 		2;
bInvestigator = 3;
bGenius = 		4;
bExpert = 		5;
bFirstTime	 = 	6;
bHackComplete = 7;

ftCountry =		0;
ftRegion = 		1;
ftContinent =	2;
ftMission	=	3;
ftPlanet	= 	4;


//pseudo-controls
cTag 	   = -5;
cUser 	   = -4;
cContinent = -3;
cRegion  = 	 -2;
cCountry =   -1;

//game controls
cNone = 	0;
cMap = 		1;
cSound =	2;
cText =		3;
cImage = 	4;
cVideo	=	5;
cWeb	= 	6;
cDebrief = 	7;

//control states  
sNone =		0;		//blank
sIcon = 	1;  	//Control inactive, shows icon pic, but faded
sScanning = 2;  	//control seeking data
sLoaded = 	3;     //control shows loaded data

//these only used for media controls

sPaused = 4; 
sPlaying = 5;  //Control is loaded and featured  (Pause button is shown in the bottom row control, for sound / video controls)

//map only 
sIDContinent = 		6;   //Control is active, ready for continent id by user
sTestContinent = 	7;   //Continent selected by user
sContinentOK =		8;   //User chose correct continent
sContinentBad =		9;   //User chose wrong continent
sContinentFeatured = 10;  //"intercepted data" revealed the continent

sIDRegion =			11;   //Continent has been identified, ready for region ID by user
sTestRegion  =		12;   //Testing the currently selected region
sRegionOK =			13;  //User chose correct region
sRegionBad =		14;	 //User chose wrong region
sRegionFeatured =	15;	//"intercepted data" revealed the region

sIDCountry =		16;   //Region has been identified, ready for country ID by user
sTestCountry =		17;   //Testing the currently selected country
sCountryOK =		18;  //User chose correct country
sCountryBad =		19;	 //User chose wrong country

sMapDone = 			20;	 //User is finished and congratulated

sSuspend =			21;  //Suspension state for media controls


//scanner elements
scTopLeft = 		0;
scTopRight = 		1;
scBottomLeft = 		2;
scBottomCenter = 	3;
scBottomRight = 	4;


//hack modes
mNone = 		0;  		//No "hack" assigned yet
mReady = 		1;  		//Hack is assigned; not currently scanning or autofeaturing found data or finished
mScanning = 	3;  		//System is "scanning" for a data item (loading gif is playing)
mDataFound = 	4;		//System found a data item which is automatically featured
mHackDone = 	5;  	//Hack complete
mEdit = 		6;
mBrowse =		7;


/*display modes  ???
dNone = 		0;
dHack =			1;
dBrowse = 		2;
*/

//mission status
msNone 		 = 		0;
msInProgress =		1;
msComplete	 = 		2;


//map levels
mlNone		= 0;
mlWorld		= 1;
mlContinent = 2;
mlRegion	= 3;
mlCountry	= 4;


//game local languages
glEnglish = 0;

