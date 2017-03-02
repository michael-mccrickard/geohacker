StoryCongrats = function() {
	
	this.complete = function() {

		var _text = "div.stamp";

		$(_text).css("visibility","visible");

		TweenMax.to( _text, 0, {scaleX: 12, scaleY: 12, opacity: 0} );

		Meteor.defer( function() { TweenMax.to( _text, 1, {scaleX: 1, scaleY: 1, opacity: 1, rotation: 15, ease: Expo.easeOut } );})
	}

	this.hideComplete = function() {

		var _text = "div.stamp";

		$( _text ).velocity( "fadeOut", {_duration: 1000} );
	}

	this.colorEffect = function( _flag ) {

		var _arr = story.charObjs;

		for (var i = 0; i < _arr.length; i++) {

			if (_flag) {

				$( _arr[i].imageElement).addClass("animatedHue")
			}
			else {

				$( _arr[i].imageElement).removeClass("animatedHue");				
			}
		}

	}

}