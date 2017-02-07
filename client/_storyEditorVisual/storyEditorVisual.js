//Template helpers are in the layout folder:  layout_template_helpers.js
//b/c the DOM elements need to persist over several templates

StoryEditorVisual = function() {

	this.menuOpen = new Blaze.ReactiveVar( false );

	this.menuElementType = new Blaze.ReactiveVar( 0 ); 

	this.mode = new Blaze.ReactiveVar("play");

	this.submode = "none";

	this.charArray = [];

	this.selectedEntity = "";

	this.returnRoute = "";

	this.setDataMode = function( _val, _collectionID ) {

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

		var _arr = this.createCharArray();

		this.menuElementType.set( cChar );

		var _left = $("button#charEdit").offset().left;

		$("div.topButtonSelections").offset( { left: _left } );

		this.menuOpen.set( true );

		Meteor.setTimeout( function() { ved.updateContent(); }, 500);
	}

	this.tokenEdit = function() {

		this.menuElementType.set( cToken );

		var _left = $("button#tokenEdit").offset().left;

		$("div.topButtonSelections").offset( { left: _left } );

		this.menuOpen.set( true );

		Meteor.setTimeout( function() { ved.updateContent(); }, 500);
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

		if (this.selectedEntity) $( story[ this.selectedEntity ].imageElement ).removeClass( "storyCharSel" );

		this.selectedEntity = _name;

		$( story[ _name ].imageElement ).addClass( "storyCharSel" );

		this.menuOpen.set( 0 );

		this.mode.set("entity");
	}

	this.sizeEntity = function( _val) {

		var _scale = story[ this.selectedEntity ].scale;

		_scale = _scale + _val * 0.1;

		story[ this.selectedEntity ].scale = _scale;

		var _str = "scale(" + _scale + "," + _scale + ")";

		$( story[this.selectedEntity].element ).css("transform", _str);
	}

	this.moveEntityVert = function( _val) {
		
		_val = _val * 3;
		
		var _y = story[ this.selectedEntity ].y;

		_y = _y + _val;

		story[ this.selectedEntity ].y = _y;		

		var _str = "translateY(" + _y + "px)";

		$( story[this.selectedEntity].element ).css("transform", _str);
	}

	this.moveEntityHoriz = function( _val) {
		
		_val = _val * 3;
		
		var _x = story[ this.selectedEntity ].x;

		_x = _x + _val;

		story[ this.selectedEntity ].x = _x;		

		var _str = "translateX(" + _x + "px)";

		$( story[this.selectedEntity].element ).css("transform", _str);
	}

	this.setSubmode = function(_ID) {

		this.submode = _ID;

		gGameEditor = 0;

		gSizeEntityMode = 0;

		gMoveEntityMode = 0;

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

		sed.switchTo("story");

	}

}