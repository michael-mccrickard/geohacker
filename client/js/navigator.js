//navigator.js

Navigator = function() {

  this.adminHistory = [];

	this.editRoute = "";

  this.goContactUs = function() {

    $('#contactUsModal').modal('show');
  }

  this.goFAQ = function()  {

      FlowRouter.go("/faq");
  }


  this.goHome = function()  {

      alert("You can also get to the Menu screen by clicking your photo in the upper-right corner.");

      game.user.goHome();
  }

  this.goPrivacy = function()  {

      FlowRouter.go("/privacy");
  }

	this.goAdmin = function( _which ) {

		if (_which == "/selectCountry" || _which == "/editor" || _which == "/dataChecker") {

      game.user.mode = uEdit;

			this.editRoute = _which;

      this.addToAdminHistory( _which );

      this.prepareEditor();


			if (!editor.dataReady) {

        FlowRouter.go("/waiting");

				Meteor.setTimeout( function() { editor.subscribeToData(); }, 100 );

			}
			else {

				doSpinner();

        Meteor.setTimeout( function() { nav.goEditRoute(); }, 100 );
			}

      return;

		}

    if (_which == "/userDirectory") {

      this.prepareEditor();

      this.addToAdminHistory( _which );

      doSpinner();

      //this pub will have to be modified to show only the appropriate users
      //once we have roles in place

      if ( !editor.userDirectoryDataReady ) {

        Meteor.setTimeout(function(_which) { 

            Meteor.subscribe("registeredUsers", function() {

                 editor.userDirectoryDataReady = true;

                 Meteor.setTimeout( function() { FlowRouter.go( _which ); }, 100 );

                 return;
              });

            }, 100);
        }    
        else {

            Meteor.setTimeout( function() { FlowRouter.go( _which ); }, 100 );
        }

      //all other routes (or any we didn't need to wait on)\

      FlowRouter.go( _which );
    }
	}

  this.addToAdminHistory = function( _which ) {

    if (this.adminHistory.length == 0) {

       this.adminHistory.push( FlowRouter.current().path );
    }

    this.adminHistory.push( _which );
  }

  this.goBackAdmin = function() {

    this.adminHistory.pop();

    if (!this.adminHistory.length) {

      showMessage("No routes left in navigator history.  Returning to login screen.");

      FlowRouter.go("/start");

      return;
    }

    //make sure we're not "going back" to the same screen we're on

    var _last = this.adminHistory[ this.adminHistory.length - 1 ];

    var _current = FlowRouter.current().path;

    while (_current == _last) {

      this.adminHistory.pop();

      _last = this.adminHistory[ this.adminHistory.length - 1 ];
    }

    //if there's only one route left, it will be the non-admin screen we started from,
    //so clear it off the list, so we start fresh next time

    if (this.adminHistory.length == 1) {

        this.adminHistory.pop();

        //returning to game, so switch the global objects

        this.switchToGame( _last);
    }

    doSpinner();

    Meteor.setTimeout( function() { FlowRouter.go( _last ); }, 100 );
  }


  /**********************************************************
  //
  //                  EDITOR FUNCTIONS
  //
  /**********************************************************/

  this.closeEditor = function() {

    editor.stopEditMedia();

    game.playMusic();

    this.goBackAdmin();
  }

	this.goEditRoute = function() {

    //in this case, we have to check and see if a country is actually selected,
    //so we handle it separately

		if (this.editRoute == "/editor") {

			this.switchToEditCountry();

			return;
		}

		FlowRouter.go(this.editRoute);
	}

    this.switchToEditCountry = function() {
        
        if (!hack) {

            showMessage("No country selected.");

            return;
        }

        if (!hack.countryCode.length) {

            showMessage("No country selected.");

            return;            
        }

        FlowRouter.go("/editor");
    }

    this.prepareEditor = function() {

      display.suspendAllMedia();

      if (editor == null) editor = new Editor();

      //bring over the countryCode from the global hack (only necessary for the Edit this country ... menu option)

      if (hack) {

        if (hack.countryCode.length)  editor.hack.countryCode = hack.countryCode;

        editor.hack.index = Database.getIndexForCountryCode( editor.hack.countryCode);
      }

      //turn off game editor (may or may not be running)

      if (gGameEditor) toggleGameEditor();


      //Switch the global to be the edit hack

      hack = editor.hack;

      hack.mode = mEdit;

      hacker.closeOutMain();

    }


    this.switchToGame = function( _route) {

      editor.hack.mode = mNone;

      if (!game.user) return;

      if (_route == "/newBrowse2") {

        game.user.mode = uBrowseCountry;

        game.user.setGlobals("browse");

        return;

      }

      if (_route == "/browseWorldMap") {

        game.user.mode = uBrowseMap;
        
        game.user.setGlobals("browse");

        return;
      }

      if (_route == "/main" || _route == "/worldMap" || _route == "/congrats") {

        game.user.mode = uHack;

        game.user.setGlobals("mission");

        return;
      
      }

      game.user.mode = uNone;

      game.user.setGlobals("mission");

    }
}