//Template helpers are in the layout folder:  layout_template_helpers.js
//b/c the DOM elements need to persist over several templates

StoryEditorVisual = function() {

	this.menuOpen = new Blaze.ReactiveVar( false );

	this.menuElementType = new Blaze.ReactiveVar( 0 ); 

	this.mode = new Blaze.ReactiveVar("play");

	this.submode = "none";

	this.charArray = [];

	this.selectedEntityName = "";

	this.selectedEntity = null;

	this.sizeIncValue = 0.05;


	this.setDataMode = function( _val, _collectionID ) {

		this.prepareEditor();

	    sed.dataMode.set( "server" );

		this.mode.set( _val );

		sed.table.set( _val );

		var _s = "sed.setCollection('" + _val + "', db.gh" + _val + ", " + _collectionID + ")";

		eval( _s );

		//doSpinner();

		if (_val == "Chat") {

			if (story.code) {  //if there's no story.code, then no story is loaded

				if (story.mode.get() == "chat") {

					this.showData( story.chat );

					return;
				}				
			}


		}

		if (_val == "Cue") {

			//there's no cue for default, it's just the GIC for that country with the capital in the bg

			if (story.scene != "default") {

				this.showData( story.scene );

				return;				
			}
		}

		FlowRouter.go("/editStory");
	}	

	
	this.charEdit = function() {

		this.prepareEditor();

		var _arr = this.createCharArray();

		this.menuElementType.set( cChar );

		var _left = $("button#charEdit").offset().left;

		$("div.topButtonSelections").offset( { left: _left } );

		this.menuOpen.set( true );

		Meteor.setTimeout( function() { ved.updateContent(); }, 500);
	}

	this.tokenEdit = function() {

		this.prepareEditor();

		this.menuElementType.set( cToken );

		var _left = $("button#tokenEdit").offset().left;

		$("div.topButtonSelections").offset( { left: _left } );

		this.menuOpen.set( true );

		Meteor.setTimeout( function() { ved.updateContent(); }, 500);
	}

	this.prepareEditor = function() {

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

	this.selectEntity = function( _name ) {

		if (this.selectedEntity) $( this.selectedEntity.imageElement ).removeClass( "storyCharSel" );

		this.selectedEntityName = _name;

		this.selectedEntity = story[ _name ];

		$( this.selectedEntity.imageElement ).addClass( "storyCharSel" );

		this.menuOpen.set( 0 );

		this.mode.set("entity");
	}

	this.sizeEntityXY = function( _val) {

		var _ent = this.selectedEntity;

		var _scaleX = _ent.scaleX;

		_scaleX = _scaleX + _val * this.sizeIncValue;
		
		_ent.scaleX = _scaleX;


		var _scaleY = _ent.scaleY;

		_scaleY = _scaleY + _val * this.sizeIncValue;

		_ent.scaleY = _scaleY;
		
		_ent.transform();
	}

	this.sizeEntityX = function( _val) {

		var _ent = this.selectedEntity;

		var _scaleX = _ent.scaleX;

		_scaleX = _scaleX + _val * this.sizeIncValue;

		_ent.scaleX = _scaleX;
		
		_ent.transform();
	}

	this.sizeEntityY = function( _val) {

		var _ent = this.selectedEntity;

		var _scaleY = _ent.scaleY;

		_scaleY = _scaleY + _val * this.sizeIncValue;

		_ent.scaleY = _scaleY;
		
		_ent.transform();
	}

	this.moveEntityVert = function( _val) {
		
		var _ent = this.selectedEntity;

		_val = _val * 3;
		
		var _y = _ent.y;

		_y = _y + _val;

		_ent.y = _y;		

		_ent.transform();

		this.showCoordinates();
	}

	this.moveEntityHoriz = function( _val) {

		var _ent = this.selectedEntity;
		
		_val = _val * 3;
		
		var _x = _ent.x;

		_x = _x + _val;

		_ent.x = _x;		
		
		_ent.transform();

		this.showCoordinates();

	}


	this.showCoordinates = function() {

		var _element = this.selectedEntity.element;

		if (this.selectedEntity.ownerEntity) _element = this.selectedEntity.ownerEntity.contentElement;

		var _obj = convertMatrixStringToObject( $(_element).css("transform") );

		 var _left = _obj.translateX / $(window).width();

		 _left = formatFloat( _left * 100);

		 var _top = _obj.translateY / $(window).height();

		 _top = formatFloat( _top * 100);

		 var _s = "Left: " + _left + "%  --  Top:" + _top + "%";

		 showMessage( _s ); 

	}

	this.setSubmode = function(_ID) {

		this.submode = _ID;

		gGameEditor = 0;

		gSizeEntityMode = 0;

		gMoveEntityMode = 0;

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

	this.showData = function( _name ) {

	   if ( sed.table.get() == "Cue") {

	        sed.makeLocalCollection( story.scene );

	        sed.dataMode.set( "local" );

	       	Meteor.setTimeout( function() { FlowRouter.go("/editStory"); }, 250 );

	        return;
	   }

	    if ( sed.table.get() == "Chat") {

	        smed.initByName( _name );

	       Meteor.setTimeout( function() { FlowRouter.go("/editChat"); }, 250 );
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

	this.restartStory = function() {

		story.reset();

		story.code = "0" //a "non-code", trick SED into loading the story from scratch

		FlowRouter.go("/waiting");

		sed.switchTo("story");

	}

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

}