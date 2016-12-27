

InventoryItem = function( _obj ) {

	this.element1 = "img#imgStoryInventoryButton";

	this.element2 = ".imgStoryInventoryButton.imgStoryButtonContent";
	
	this.shortName = _obj.shortName;

	this.pic = _obj.pic;

	this.index = -1;

	this.getElement = function() {

		return this.element1 + this.index + this.element2;
	}

}

Inventory = function() {

	this.slot = [];

	this.firstSlot = 1;

	this.lastSlot = 3;

	this.emptySlotPic = "featuredBackdrop.jpg";

	for (var i = 0; i <= this.lastSlot; i++) {

		this.slot[i] = null;
	}

	this.getNextSlot = function() {

		for (var i = this.firstSlot; i <= this.lastSlot; i++) {

			if (this.slot[i] == null) return i;
		}

		return -1;
	}

	//the obj param here is an inventoryItem, a wrapper around a token object
	//the name property of the inventoryItem object is the shortName of the token

	this.add = function( _obj ) {

c("adding item " + _obj.shortName + " to inv in inventory.js")

		_obj.index = this.getNextSlot();

		if (_obj.index == -1) {

			console.log("Inventory is full.  Cannot put item " + _obj.shortName + " into Inventory.");

			return;
		}

		this.slot[ _obj.index ] = _obj;

		var _pic = _obj.pic;

		$( _obj.getElement() ).attr("src", _pic);

		$( _obj.getElement() ).attr("data-shortname", _obj.shortName);

		story.hidePrompt();
	}

	//the obj param here is an inventoryItem, a wrapper around a token object

	this.remove = function( _name ) {

c("removing item " + _name + " from inv in inventory.js")

		for (var i = this.firstSlot; i <= this.lastSlot; i++) {

			var _obj = this.slot[i];

			if ( _obj ) {

					if (_obj.shortName == _name) {

					$( _obj.getElement() ).attr("src", this.emptySlotPic );

					this.slot[i] = null;

					return i;
				}			
			}

		}

		console.log("The item requested for removal was not found: " + _name);

		return -1;
	}
}