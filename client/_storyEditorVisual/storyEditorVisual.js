StoryEditorVisual = function() {

	this.menuOpen = new Blaze.ReactiveVar( false );

	this.menuElementType = new Blaze.ReactiveVar( 0 ); 
	
	this.charEdit = function() {

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

}