

InventoryItem = function( _obj ) {

	this.element1 = "img#imgStoryInventoryButton";

	this.element2 = ".imgStoryInventoryButton.imgStoryButtonContent";
	
	this.name = _obj.name;

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

	this.add = function( _obj ) {

		_obj.index = this.getNextSlot();

		if (_obj.index == -1) {

			console.log("Inventory is full.  Cannot put item " + _obj.name + " into Inventory.");

			return;
		}

		this.slot[ _obj.index ] = _obj;

		var _pic = story[ _obj.name ].pic;

		$( _obj.getElement() ).attr("src", _pic);

		$( _obj.getElement() ).attr("data-shortname", _obj.name);

		story.hidePrompt();
	}

	this.remove = function( _name ) {

		for (var i = this.firstSlot; i <= this.lastSlot; i++) {

			var _obj = this.slot[i];

			if ( _obj ) {

					if (_obj.name == _name) {

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