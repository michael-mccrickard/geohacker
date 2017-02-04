

InventoryItem = function( _obj ) {

	this.element1 = "img#imgStoryInventoryButton";

	this.element2 = ".imgStoryInventoryButton.imgStoryButtonContent";

	this.parentElement1 = "div#storyThing";

	this.parentElement2 = ".divStoryThing";

	this.index = -1;
	
	this.shortName = "";

	this.pic = "";

	this.emptySlotPic = "featuredBackdrop.jpg";

	if (_obj) {

		this.shortName = _obj.shortName;

		this.pic = _obj.pic;
	}

	this.getElement = function() {

		return this.element1 + this.index + this.element2;
	}

	this.getParentElement = function() {

		return this.parentElement1 + this.index + this.parentElement2;
	}

	this.show = function() {

		var _pic = this.pic;

		$( this.getElement() ).attr("src", _pic);

		$( this.getElement() ).attr("data-shortname", this.shortName);

		$( this.getParentElement() ).attr("data-shortname", this.shortName);
	}

	this.hide = function() {

		$( this.getElement() ).attr("src", this.emptySlotPic );

		$( this.getElement() ).attr("data-shortname", "");

		$( this.getParentElement() ).attr("data-shortname", "");
	}
}

Inventory = function() {

	this.slot = [];

//to do: set these from story property (inventoryLength?)

this.firstSlot = 0;

this.lastSlot = 2;



	for (var i = 0; i <= this.lastSlot; i++) {

		this.slot.push( new InventoryItem() );
	}

	this.getNextSlot = function() {

		for (var i = this.firstSlot; i <= this.lastSlot; i++) {

			if ( this.slot[i].index == -1 ) return i;
		}

		return -1;
	}

	//the obj param here is an inventoryItem, a wrapper around a token object
	//the shortName property of the inventoryItem object is the shortName of the token

	this.add = function( _obj ) {

c("adding item " + _obj.shortName + " to inv in inventory.js")

		_obj.index = this.getNextSlot();

		if (_obj.index == -1) {

			console.log("Inventory is full.  Cannot put item " + _obj.shortName + " into inventory.");

			return;
		}

		this.slot[ _obj.index ] = _obj;

		_obj.show();

		story.hidePrompt();
	}


	//the obj param here is an inventoryItem, a wrapper around a token object

	this.remove = function( _name ) {

c("removing item " + _name + " from inv in inventory.js")

		for (var i = this.firstSlot; i <= this.lastSlot; i++) {

			var _obj = this.slot[i];

			if ( _obj ) {

				if (_obj.shortName == _name) {

					_obj.hide();

					this.slot[i] = new InventoryItem();

					return i;
				}			
			}

		}

		console.log("The item requested for removal was not found: " + _name);

		return -1;
	}
}