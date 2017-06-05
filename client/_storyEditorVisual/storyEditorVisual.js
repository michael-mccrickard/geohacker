//Template helpers are in the layout folder:  layout_template_helpers.js
//b/c the DOM elements need to persist over several templates

StoryEditorVisual = function() {

	this.menuOpen = new Blaze.ReactiveVar( false );

	this.menuElementType = new Blaze.ReactiveVar( 0 ); 

	this.mode = new Blaze.ReactiveVar("none");  //none, play, select, entity, edit

	this.modalTemplate = new Blaze.ReactiveVar("");

	this.localType = new Blaze.ReactiveVar("");

	this.submode = "none";

	this.charArray = [];

	this.selectedEntityName = "";

	this.selectedEntity = null;

	this.sizeIncValue = 0.05;

	this.moveIncValue = 0.015;

	this.storyButtonText =  new Blaze.ReactiveVar("Stories");
 
	this.storyButtonElement = "button.btn-info.topButton2";

	this.picUploaded = "";

	this.bgButtonPicUploaded = "";

	this.recordIDToEdit = "";


//*********************************************************************************
//
//				BASIC FUNCTIONS
//
//*********************************************************************************


	this.setMode = function( _val ) {

		this.mode.set( _val);

		if (_val == "select") sed.template.set("vedSelect");

		if (_val == "edit") sed.template.set("storyData");
	}

	this.setSubmode = function(_ID) {

		this.submode = _ID;

		gGameEditor = 0;

		gSizeEntityMode = 0;

		gMoveEntityMode = 0;

		if (_ID == "none") {

			this.unselectEntity();

			this.mode.set("play");

			return;
		}

		if (_ID == "set") {

			this.saveEntity( this.selectedEntity, null );
		}


		if (_ID == "size") {

			gGameEditor = 1;

			gSizeEntityMode = 1;

			showMessage("Size mode on");
		}

		if (_ID == "move") {

			gGameEditor = 1;

			gMoveEntityMode = 1;

			showMessage("Move mode on")
		}

	}

	this.edit = function( _tableName, _collectionID, _mode ) {

		this.prepareEditor();

		this.setMode( _mode );

	    sed.dataMode.set( "server" );

		sed.table.set( _tableName );


		var _s = "sed.setCollection('" + _tableName + "', db.gh" + _tableName + ", " + _collectionID + ")";

		eval( _s );

		//if we need to select an element to edit, then we're done here

		if ( _mode == "select") {

			FlowRouter.go("/editStory");

			return;
		}

		
		//If we're editing chat or cue, we call showData() to make the local collections for us

		if (_tableName == "Chat") {

			if (story.mode.get() == "chat") {

				this.showData( story.chat );

				return;
			}
			else {  //We were asked to edit the data, but there's no chat selected so switch modes

				this.edit( "Chat", cChat, "select");
			}				

		}

		if (_tableName == "Cue") {

			//there's no editable cue for default, it's just the GIC for that country with the capital in the bg

			if (story.scene != "default" && _mode == "edit") {

				//Again we need to call showData to make the local collection 

				this.showData( story.scene );

				return;				
			}
			else {  //We were asked to edit the data, but the default scene is loaded, so ask user to pick an editable scene

				this.edit( "Cue", cCue, "select");
		
			}
		}

		FlowRouter.go("/editStory");
	}	

//*********************************************************************************
//
//				SELECT FUNCTIONS
//
//*********************************************************************************

	this.selectStory = function() {

		if (story.cutScene) story.cutScene.stop();

		//Usually redundant, but we might be exiting data-edit mode

		sed.setMode("visual");

		sed.template.set("vedSelect");

		this.edit('Story', cStory, 'select');

	}

	this.selectEntity = function( _name ) {

		if (this.menuElementType.get() == cLocation) {

			story.location = _name;

			this.continueStory();

			return;
		}

		if (this.selectedEntity) $( this.selectedEntity.imageElement ).removeClass( "storyEntitySel" );

		this.selectedEntityName = _name;

		if (this.menuElementType.get() == cStoryLabel) {

			this.selectedEntity = story.getLabelByID( _name.substr(1) );
		}
		else {

			this.selectedEntity = story[ _name ];

			sed.recordID.set( story[ _name ].ID );			
		}



		$( this.selectedEntity.imageElement ).addClass( "storyEntitySel" );

		this.showCoordinates();

		this.menuOpen.set( 0 );

		this.mode.set("entity");
	}


	this.unselectEntity = function() {

		if (!this.selectedEntity) return;

		$( this.selectedEntity.imageElement ).removeClass( "storyEntitySel" );

		this.selectedEntity = null;

		this.selectedEntityName = "";
	}



//*********************************************************************************
//
//				EDIT OBJECT TYPE FUNCTIONS
//
//*********************************************************************************


	this.editEntityObject = function() {

		this.prepareEditor();

		if (this.selectedEntity.entityType == "char") this.editCharObject();

		if (this.selectedEntity.entityType == "token") this.editTokenObject();
	}

	this.editCharObject = function() {

		this.edit('Char', cChar, 'select');

		this.picUploaded = "";

		this.showModalForSelected( 'Char', this.selectedEntityName );
	}

	this.editTokenObject = function() {

		this.edit('Token', cToken, 'select');

		this.picUploaded = "";

		this.showModalForSelected( 'Token', this.selectedEntityName );
	}

	this.editStoryObject = function() {

		this.selectStory();

		this.picUploaded = "";

		this.bgButtonPicUploaded = "";

		this.showModalForSelected( 'Story', story.fullName );
	}

	this.editLocationObject = function() {

		this.edit('Location', cLocation, 'select');

		this.picUploaded = "";

		this.showModalForSelected( 'Location', story.location );
	}

	this.editLocalObject = function( _tableName, _collectionID, _mode ) {

		this.localType.set( _tableName );

		this.edit(_tableName, _collectionID, _mode);

	}

	this.createNewEntity = function( _type ) {

		this.selectedEntity = null;

		sed.recordID.set("");

		if ( _type == cChar) this.editCharObject();

		if ( _type == cToken) this.editTokenObject();		
	}

//*********************************************************************************
//
//				UTILITY FUNCTIONS
//
//*********************************************************************************

	this.prepareEditor = function() {

		this.menuOpen.set(0);

		if (story.cutScene) story.cutScene.stop();

		stopGameEditor();

	}

	this.updateContent = function() {

		var _val = Session.get("sUpdateVisualEditor");

		Session.set("sUpdateVisualEditor", !_val );
	}

	this.closeMenu = function() {

		this.menuOpen.set( false );

		this.updateContent();
	}

	this.createCharArray = function() {

		this.charArray = [];

		var _arr = db.ghChar.find( { c: sed.code.get() } ).fetch();

		for (var i=0; i < _arr.length; i++) {

			var _obj = {};

			_obj.sn = _arr[i].sn;

			_obj.p = _arr[i].p;

			if (_arr[i].t == "a") {

				var _rec = Meteor.users.findOne( { username: _arr[i].n } );

				if (!_rec) {

					showMessage( "User record not found for: " + _arr[i].n);

					continue; 
				}

				_obj.p = _rec.profile.av;
			}

			this.charArray.push( _obj);
		}

	}

	this.createLabelArray = function() {

		this.labelArray = story.labelObjs;
	}

	this.createLocationArray = function() {

		this.locationArray = [];

		var _arr = db.ghLocation.find( { c: sed.code.get() } ).fetch();

		for (var i=0; i < _arr.length; i++) {

			var _obj = {};

			_obj.n = _arr[i].n;

			if (!_arr[i].p) {

				_obj.p = db.getCapitalPic( _arr[i].n )		

			}
			else {
				_obj.p = _arr[i].p;

			}

			this.locationArray.push( _obj);
		}

		 _obj = {};
		 _obj.n = "base"
		 _obj.p = story.baseBGPic;

		this.locationArray.push( _obj);

	}

	this.conformInventory = function() {
 
		var _arr = story.inv.slot;

		for (var i = 0; i < _arr.length; i++) {

			if ( _arr[i].index != -1 ) {

				_arr[i].show();
			}

		}
	}

	this.updateScreen = function( _str) {

		this.menuOpen.set(0);

		if (_str) $("div#divVEDText").text( _str );
	}

//*********************************************************************************
//
//				EDIT OPERATION FUNCTIONS
//
//*********************************************************************************

	this.rotateEntity = function( _val ) {

		
	}

	this.sizeEntityXY = function( _val) {

		_val = _val * this.sizeIncValue;

		var _ent = this.selectedEntity;

		var _scaleX = _ent.lastTransform.scaleX;

		var _scaleY = _ent.lastTransform.scaleY;

		var _scaleRatio = _scaleY / _scaleX;

		_scaleX = _scaleX + _val;

		_scaleY = _scaleY + (_scaleRatio * _val);
		
		_ent.transformOnly( { scaleX: _scaleX, scaleY: _scaleY  } );

		this.showCoordinates();
	}

	this.sizeEntityX = function( _val) {

		var _ent = this.selectedEntity;

		var _scaleX = _ent.lastTransform.scaleX;

		_scaleX = _scaleX + _val * this.sizeIncValue;

		_ent.transformOnly( { scaleX: _scaleX  } );

		this.showCoordinates();
	}

	this.sizeEntityY = function( _val) {

		var _ent = this.selectedEntity;

		var _scaleY = _ent.lastTransform.scaleY;

		_scaleY = _scaleY + _val * this.sizeIncValue;

		_ent.transformOnly( { scaleY: _scaleY  } );

		this.showCoordinates();
	}

	this.moveEntityVert = function( _val) {
		
		if (this.menuElementType.get() == cStoryLabel) {

			this.moveLabelVert( _val );

			return;
		}

		var _ent = this.selectedEntity;

		var _translateY = _ent.lastTransform.translateY;

		_translateY = _translateY + _val;

		_ent.transformOnly( { translateY: _translateY  } );

		this.showCoordinates();
	}

	this.moveEntityHoriz = function( _val) {

		if (this.menuElementType.get() == cStoryLabel) {

			this.moveLabelHoriz( _val );

			return;
		}

		var _ent = this.selectedEntity;

		var _translateX = _ent.lastTransform.translateX;

		_translateX = _translateX + _val;

		_ent.transformOnly( { translateX: _translateX  } );

		this.showCoordinates();

	}

	this.moveLabelVert = function( _val ) {

		_val = _val / 100;

		var _ent = this.selectedEntity;

		var _translateY = _ent.y;

		_ent.y = _translateY + _val;

		_ent.place();

		this.showCoordinates();		
	}

	this.moveLabelHoriz = function( _val ) {

		_val = _val / 100;

		var _ent = this.selectedEntity;

		var _translateX = _ent.x;

		_ent.x = _translateX + _val;

		_ent.place();

		this.showCoordinates();		
	}

//*********************************************************************************
//
//				INTERFACE FUNCTIONS
//
//*********************************************************************************

	this.charMenu = function() {

		this.prepareEditor();

		var _arr = this.createCharArray();

		this.menuElementType.set( cChar );

		var _left = $("button#charEdit").offset().left;

		$("div.topButtonSelections").offset( { left: _left } );

		this.menuOpen.set( true );

		Meteor.setTimeout( function() { ved.updateContent(); }, 500);
	}

	this.tokenMenu = function() {

		this.prepareEditor();

		this.menuElementType.set( cToken );

		var _left = $("button#tokenEdit").offset().left;

		$("div.topButtonSelections").offset( { left: _left } );

		this.menuOpen.set( true );

		Meteor.setTimeout( function() { ved.updateContent(); }, 500);
	}

	this.locationMenu = function() {

		this.prepareEditor();

		var _arr = this.createLocationArray();

		this.menuElementType.set( cLocation );

		var _left = $("button#runStory").offset().left;

		$("div.topButtonSelections").offset( { left: _left } );

		this.menuOpen.set( true );

		Meteor.setTimeout( function() { ved.updateContent(); }, 500);
	}


	this.labelMenu = function() {

		this.prepareEditor();

		var _arr = this.createLabelArray();

		this.menuElementType.set( cStoryLabel );

		var _left = $("button#labelEdit").offset().left;

		$("div.topButtonSelections").offset( { left: _left } );

		this.menuOpen.set( true );

		Meteor.setTimeout( function() { ved.updateContent(); }, 500);
	}

	this.showCoordinates = function() {
		
		var _windowWidth = $(window).width();

		var _windowHeight = $(window).height();

		var _element = this.selectedEntity.element;

		var _ent = this.selectedEntity;

		if ( this.menuElementType.get() == cStoryLabel) {

			this.showCoordinatesForLabel( _ent );

			return;
		}

		var _obj = convertMatrixStringToObject( $(_element).css("transform") );

c("matrix object for " + _ent.name + " follows")
c( _obj )

		var _origSize = _ent.origSize;

		var _x = _ent.fixTranslateValueForDB( _obj, "x");

		var _y = _ent.fixTranslateValueForDB( _obj, "y");

		var _scaleX = _ent.fixScaleValueForDB( _obj, "x");

		var _scaleY = _ent.fixScaleValueForDB( _obj, "y");

		 var _s = "{x: " + formatFloat( _x ) + ", " + "y: " + formatFloat( _y ) + ", scaleX: " + formatFloat( _scaleX ) + ", scaleY:" + formatFloat(_scaleY) + "}";

		 this.updateScreen( _s ); 

	}

	this.showCoordinatesForLabel = function( _ent) {

		var _s = "{x: " + formatFloat( _ent.x ) + ", " + "y: " + formatFloat( _ent.y ) + "}";

		this.updateScreen( _s ); 
	}


	this.showData = function( _name ) {

	   if ( sed.table.get() == "Cue") {

	        sed.makeLocalCollection( story.scene );

	        sed.scene.set( story.scene );

	        sed.dataMode.set( "local" );

	        sed.positionTable( "local" );

	       	Meteor.setTimeout( function() { FlowRouter.go("/editStory"); }, 250 );

	        return;
	   }

	    if ( sed.table.get() == "Chat") {

	        smed.initByName( _name );

	       Meteor.setTimeout( function() { FlowRouter.go("/editChat"); }, 250 );
	    }
	}

//*********************************************************************************
//
//				STORY FUNCTIONS
//
//*********************************************************************************

	this.restartStory = function() {

		story.reset( );

		FlowRouter.go("/waiting");

		this.loadStory();

	}

	this.setStoryByName = function( _name)  {

		game.user.profile.lastEditedStory = _name;

		$("button#last").text( _name );

		var _code = db.ghStory.findOne( { n: _name } ).c;

		sed.code.set( _code );

		game.user.updateLastEditedStory( _code );
	}

	this.loadStoryByName = function( _name)  {

		game.user.profile.lastEditedStory = _name;

		$("button#last").text( _name );

		var _code = db.ghStory.findOne( { n: _name } ).c;

		sed.code.set( _code );

		game.user.updateLastEditedStory( _code );

		this.loadStory();
	}


	this.loadStory = function() {

		//reset the editor b/c subscribes to all records and now we just want the records from one story

		sed.reset();

		game.user.mode = uEditStory;

		this.mode.set("play");

		game.mode.set( gmEditStory );

		var _code = sed.code.get();

c("code in loadStory is " + _code);
		
		story = null;

		var _name = "story" + _code;

		  try {

		    eval( _name );

		  }
		  catch(err) {

			var _msg = "Create " + _name + ".js to edit the story.";

			showMessage( _msg );

			alert( _msg );

			return;
		  }

		eval( "story = new " + _name + "()" );

		story._init( _code );

		this.updateContent();

	}


	this.continueStory = function(e) {

		this.closeMenu();

		this.mode.set( "play" );

		this.submode = "none";


		var _code = sed.code.get();

		if (!_code) {

			showMessage("Select a story in the editor.");

			return;
		}

		game.user.mode = uStory;

		FlowRouter.go("/waiting");  


		//Is there a story object loaded?

		if (story.code) {

			//Did we switch stories?

			if ( story.code != _code ) {

				this.loadStory( _code);

				return;
			}

			//same story, just run with it

			FlowRouter.go("/story");

		}
		else {

			//story object not loaded yet

			this.loadStory( _code );
		}

	}

//*********************************************************************************
//
//				DATABASE FUNCTIONS
//
//*********************************************************************************

	this.saveEntity = function( _ent, _obj ) {

		var _element = _ent.element;

		if (!_obj ) _obj = convertMatrixStringToObject( $( _element ).css("transform") );		

		var _update = {};

		_update.l = _ent.fixTranslateValueForDB( _obj, "x");

		_update.top = _ent.fixTranslateValueForDB( _obj, "y");

		_update.scx = _ent.fixScaleValueForDB( _obj, "x");

		_update.scy = _ent.fixScaleValueForDB( _obj, "y");


showMessage( "Saving entity " + _ent.shortName );

console.log( _update );

		var _collection = db.getCollectionForType( _ent.collectionID );

		_collection.update( { _id: _ent.ID }, { $set: _update } );
	}

//*********************************************************************************
//
//				DRIECT EDIT FUNCTIONS
//
//*********************************************************************************

this.getCueScript = function() {

	var _arr = sed.collection.get().findOne( {n: sed.scene.get()} ).d;

	var _out = "";

	for (var i = 0; i < _arr.length; i++) {

		if (_arr[i].length > 2) {

			_out = _out + _arr[i].trim() + "\n";			
		}
	}

	return _out;
}
	
this.rewriteCueScript = function() {

	var _arr = $(".directEditTextArea").val().split("\n");

	var _out = [];

	for (var i = 0; i < _arr.length; i++) {

		if (_arr[i].length > 2) {

			_out.push( _arr[i] )	
		}
	}

	sed.collection.get().update( {_id: sed.recordID.get() }, { $set: { d: _out } } );
}

this.saveLocal = function() {

    if (this.mode.get() == "direct") {

        this.rewriteCueScript();

        return;
    }

    sed.saveAllLocalRecords();

    sed.saveLocalCollectionToRecord();
}

//*********************************************************************************
//
//				MODAL FUNCTIONS
//
//*********************************************************************************

	this.showModal = function() {

		$('#vedModal').modal('show');
	}

	this.hideModal = function() {
		$('#vedModal').modal('hide');
	}

	this.showLocalModal = function( _table ) {

		this.localType.set( _table );

		var _name = "";

		if (sed.recordID.get() ) {

			_name = sed.chat;
		}
		else {

			_name = "NEW " + sed.table.get();
		}

		this.showModalForSelected( "Local", _name );
	}

	this.showTransformModal = function( _ID ) {

		this.recordIDToEdit = _ID;

		this.showModalForSelected( "Transform", "Add position / scale values" )
	}

	this.showModalForSelected = function( _type, _text ) {

		if (!this.selectedEntity) _text = "New " + _type;

		Meteor.setTimeout( function() {

			ved.showModal();

			ved.modalTemplate.set("vedModal" + _type)

			$("#vedModalHeader").text( _text );

			ved.updateContent();

		}, 250 );		
	}
}

/*

//console.log(e)

	    var isRightMB;
	    //e = e || window.event;

		// Gecko (Firefox), WebKit (Safari/Chrome) & Opera
	    if ("which" in e)  {

	    	isRightMB = e.which == 3; 
	    } 
	    else {
	    	
			//IE, Opera
	    	if ("button" in e)  isRightMB = e.button == 2; 
	    }

c("Right mouse button " + (isRightMB ? "" : " was not") + "clicked!");

*/