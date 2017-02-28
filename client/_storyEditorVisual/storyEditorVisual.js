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

			FlowRouter.go("/waiting")

			Meteor.setTimeout( function() { FlowRouter.go("/story"); }, 250);

			return;
		}

		if (_ID == "set") {

			this.saveEntity( this.selectedEntity, null );
		}


		if (_ID == "size") {

			gGameEditor = 1;

			gSizeEntityMode = 1;

			this.selectedEntity.update();

			showMessage("Size mode on");
		}

		if (_ID == "move") {

			gGameEditor = 1;

			gMoveEntityMode = 1;

			this.selectedEntity.update();

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

		//Usually redundant, but we might be exiting data-edit mode

		sed.setMode("visual");

		sed.template.set("vedSelect");

		this.edit('Story', cStory, 'select');

	}

	this.selectEntity = function( _name ) {

		if (this.selectedEntity) $( this.selectedEntity.imageElement ).removeClass( "storyEntitySel" );

		this.selectedEntityName = _name;

		this.selectedEntity = story[ _name ];

		sed.recordID.set( story[ _name ].ID );

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

	this.sizeEntityXY = function( _val) {

		var _ent = this.selectedEntity;

		var _scaleX = _ent.scaleX;

		_scaleX = _scaleX + _val * this.sizeIncValue;
		
		_ent.scaleX = _scaleX;


		var _scaleY = _ent.scaleY;

		_scaleY = _scaleY + _val * this.sizeIncValue;

		_ent.scaleY = _scaleY;
		
		_ent.transform();

		this.showCoordinates();
	}

	this.sizeEntityX = function( _val) {

		var _ent = this.selectedEntity;

		var _scaleX = _ent.scaleX;

		_scaleX = _scaleX + _val * this.sizeIncValue;

		_ent.scaleX = _scaleX;
		
		_ent.transform();

		this.showCoordinates();
	}

	this.sizeEntityY = function( _val) {

		var _ent = this.selectedEntity;

		var _scaleY = _ent.scaleY;

		_scaleY = _scaleY + _val * this.sizeIncValue;

		_ent.scaleY = _scaleY;
		
		_ent.transform();

		this.showCoordinates();
	}

	this.moveEntityVert = function( _val) {

c("vert")
		
		var _ent = this.selectedEntity;
c("ent is ")
c(_ent)
		_val = _val * 3;
		
		var _y = _ent.y;

		_y = _y + _val;

		_ent.y = _y;		

		_ent.transform();

		this.showCoordinates();
	}

	this.moveEntityHoriz = function( _val) {
c("horiz")

		var _ent = this.selectedEntity;
c("ent is " + _ent)
c(_ent)
		_val = _val * 3;
		
		var _x = _ent.x;

		_x = _x + _val;

		_ent.x = _x;		
		
		_ent.transform();

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

	this.showCoordinates = function() {

		var _element = this.selectedEntity.element;

		if (this.selectedEntity.ownerEntity) _element = this.selectedEntity.ownerEntity.contentElement;

		var _obj = convertMatrixStringToObject( $(_element).css("transform") );

		 var _left = _obj.translateX / $(window).width();

		 _left = formatFloat( _left * 100);

		 var _top = _obj.translateY / $(window).height();

		 _top = formatFloat( _top * 100);

		 var _s = "{left: '" + _left + "%', " + "top: '" + _top + "%', scaleX: " + _obj.scaleX + ", scaleY:" + _obj.scaleY + "}";

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

	this.loadStoryByName = function( _name)  {

		var _code = db.ghStory.findOne( { n: _name } ).c;

		sed.code.set( _code );

		this.loadStory();
	}


	this.loadStory = function() {

game.user.mode = uStory;

		this.mode.set("play");

		var _code = sed.code.get();

		var _name = "story" + _code;

		var _s = "story = new " + _name + "()";

		eval( "story = new " + _name + "()" );

		story._init( _code );

		this.updateContent();

	}

	this.continueStory = function() {

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

		if ( _ent.ownerEntity ) _element = _ent.ownerEntity.contentElement;

		if (!_obj ) _obj = convertMatrixStringToObject( $( _element ).css("transform") );		

		var _update = {};

		if ( _obj.translateX ) _update.l = convertPixelsToPercentString( { x: _obj.translateX } );

		if ( _obj.translateY ) _update.top = convertPixelsToPercentString( { y: _obj.translateY } );

		if ( _obj.scaleX ) _update.scx = parseFloat(_obj.scaleX);

		if ( _obj.scaleY ) _update.scy = parseFloat(_obj.scaleY);


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