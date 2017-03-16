getDimensions = function( _s ) {

		//lop off the extension

		var _index = _s.lastIndexOf(".");

		_s = _s.substr(0, _index);

		var _lastIndex = _s.lastIndexOf("_");

		var _front = _s.substr(0, _lastIndex );

		var _height = _s.substr(_lastIndex + 1);

		_lastIndex = _front.lastIndexOf("_");

		var _width = _front.substr( _lastIndex + 1 );

		var _obj = {};

		_obj.width = _width;

		_obj.height = _height;

		return (_obj)

	}

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

		var _obj = getDimensions( _pic );

		story.inv.dimensionButtonImage( this.getElement(), _obj);
	}

	this.hide = function() {

		$( this.getElement() ).attr("src", this.emptySlotPic );

		$( this.getElement() ).attr("data-shortname", "");

		$( this.getParentElement() ).attr("data-shortname", "");
	}

}

Inventory = function() {

	this.slot = [];

	this.firstSlot = 0;

	this.lastSlot = story.inventorySize - 1;

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

//did have an ent.draw() comm here

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

	this.dimensionButtonImage = function( _element, _obj ) {

		//the buttons currently have a width/height ratio of 3/1, which is the result of having 5 buttons (map, base, plus 3 inventory buttons)

		//if future stories need more buttons, the width / height ratio will decrease (become more square) and 
		//could (with enough buttons) become taller than their width.  Currently we don't have a way to calculate
		//the _widthPercent based on the number of buttons -- the current value was determined experimentally

		var _widthPercent = ( (3 * _obj.width) / _obj.height ) * 10;  //multiply by 10 to get a percentage of 100 value

		var _leftPercent = (100 - _widthPercent) / 2;

		_widthPercent = _widthPercent + "%";

		_leftPercent = _leftPercent + "%";		

		$( _element ).css("width", _widthPercent);

		$( _element ).css("left", _leftPercent);	
	}
}