//bio.js

Bio = function() {

	this.imageSrc = null;


	this.getImageHeight = function() {

		return this.imageSrc.height;
	}

	this.getImageWidth = function() {

		return this.imageSrc.width;
	}	

	//borrow the debrief preload element

	this.preloadImage = function() {

		$("#preloadDebrief").attr("src", this.image );

        imagesLoaded( document.querySelector('#preloadDebrief'), function( instance ) {

        	game.user.bio.imageSrc = Control.getImageFromFile(game.user.bio.image );  

        	Meteor.setTimeout( function() { game.user.bio.draw(); }, 200 );


        });

	}

}