
//****************************************************************
//                  FILE UPLOADING CONFIGURATION
//****************************************************************


Slingshot.fileRestrictions("ghAvatar", {
  allowedFileTypes: ["image/png", "image/jpeg", "image/jpg", "image/gif"],
  maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited).
});

Slingshot.fileRestrictions("ghUserFeaturedPic", {
  allowedFileTypes: ["image/png", "image/jpeg", "image/jpg", "image/gif"],
  maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited).
});

Slingshot.fileRestrictions("ghTag", {
  allowedFileTypes: ["image/png", "image/jpeg", "image/jpg", "image/gif"],
  maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited).
});

Slingshot.fileRestrictions("ghWeb", {
  allowedFileTypes: ["image/png", "image/jpeg", "image/jpg", "image/gif"],
  maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited).
});

Slingshot.fileRestrictions("ghImage", {
  allowedFileTypes: ["image/png", "image/jpeg", "image/jpg", "image/gif"],
  maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited).
});

Slingshot.fileRestrictions("ghVideo", {
  allowedFileTypes: ["image/gif"],
  maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited).
});

Slingshot.fileRestrictions("ghSound", {
  allowedFileTypes: ["audio/mpeg","audio/mp3"],
  maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited).
});


prefix = 'https://s3.amazonaws.com/gh-resource/';

avatarPrefix = 'https://s3.amazonaws.com/gh-resource/ghAvatar/';

//****************************************************************
//                   COMMON COLLECTIONS / FUNCTIONS
//****************************************************************

Conversation = new Meteor.Collection("conversation");

//****************************************************************
//                  CONSTANTS
//****************************************************************

arrUserStatus = ["(none)", "Active", "Virtual", "Honorary", "Inactive", "Deleted", "Admin", "Test"];

//user status
usNone =      1;
usActive =    2;
usVirtual =   3;
usHonorary =  4;
usRetired =   5;
usDeleted =   6;
usAdmin =     7;
usTest =      8;
usFake =      9;


//user titles

arrUserTitle = ["(none)", "Agent", "Geohacker-in-Chief, ", "Honorary Geohacker-in-Chief, ", "Geohacker-in-Chief, Planet Earth"];

utAgent                   = 1;
utGeohackerInChiefCountry = 2;
utHonoraryGeohackerInChiefCountry = 3;
utGeohackerInChiefPlanet  = 4;


//user modes
uNone = 	0;
uBio =		1;
uHack = 	2;
uStats = 	3;
uAgents = 	4;
uMessage = 	5;
uBrowseMap = 	6;
uBrowseCountry = 7;
uClockOut = 8;
uMessage = 9;
uIntro  = 10;
uLearn = 11;
uHelp = 12;
uEdit = 13;

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
sCountryBad =   18;  //User chose wrong country
sCountryOK =		19;  //User chose correct country
sMapDone = 			20;	 //User is finished and congratulated




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

