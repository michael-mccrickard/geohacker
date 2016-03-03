//navigator.js

Navigator = function() {

  this.adminHistory = [];

	this.editRoute = "";

	this.goAdmin = function( _which ) {

		if (_which == "/selectCountry" || _which == "/editor" || _which == "/dataChecker") {

			this.editRoute = _which;

      this.addToAdminHistory( _which );

      this.prepareEditor();


			if (!editor.dataReady) {

				editor.subscribeToData();
c("editor is subscribing")
				FlowRouter.go("/waiting");
			}
			else {
c("editor data is subscribed")
				this.goEditRoute();
			}

      return;

		}

    if (_which == "/userDirectory") {

      this.prepareEditor();

      this.addToAdminHistory( _which );

      //this pub will have to be modified to show only the appropriate users
      //once we have roles in place

      if ( !editor.userDirectoryDataReady ) {

        waitOnDB();

        Meteor.subscribe("registeredUsers", function() {

             stopWait();

             editor.userDirectoryDataReady = true;

             FlowRouter.go( _which );

             return;
          }); 
        }    
        else {

          FlowRouter.go( _which );
        }

    }


    //all other routes (or any we didn't need to wait on)\

    FlowRouter.go( _which );


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

    if (this.adminHistory.length == 1) this.adminHistory.pop();

    FlowRouter.go( _last );
  }


  /**********************************************************
  //
  //                  EDITOR FUNCTIONS
  //
  /**********************************************************/

  this.closeEditor = function() {

    Control.stopEditVideo();

    editor.hack.mode = mNone;

    if (game.user.mode == uHack) {

      game.user.setGlobals("mission");
    }
    else {

      game.user.setGlobals("browse");
    }


    this.goBackAdmin();
  }

	this.goEditRoute = function() {
c("go edit route")
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

      Control.suspendAllMedia();

      if (editor == null) editor = new Editor();

      editor.controlType.set( cSound );

      //bring over the countryCode from the global hack

      if (hack) {

        if (hack.countryCode.length)  editor.hack.countryCode = hack.countryCode;
      }

      //Switch the global to be the edit hack

      hack = editor.hack;

      hack.mode = mEdit;

      display.closeOutMain();

    }

}