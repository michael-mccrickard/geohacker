//bio.js

Bio = function() {

	this.imageSrc = null;

	this.avatarUploader = new Slingshot.Upload("ghAvatar");

	this.userFeaturedPicUploader = new Slingshot.Upload("ghUserFeaturedPic");

	this.tagUploader = new Slingshot.Upload("ghTag");  //only for curators initially


	this.getImageHeight = function() {

		return this.imageSrc.height;
	}

	this.getImageWidth = function() {

		return this.imageSrc.width;
	}	

	this.load = function() {

		this.image = game.user.profile.p;

		//borrow the debrief preload element

		$("#preloadDebrief").attr("src", this.image );

        imagesLoaded( document.querySelector('#preloadDebrief'), function( instance ) {

        	game.user.bio.imageSrc = Control.getImageFromFile(game.user.bio.image );  

        	game.user.bio.redraw();

        });
	}

	this.redraw = function() {

	  Meteor.setTimeout( function() { game.user.bio.draw(); }, 100 );

	}

	this.draw = function() {

		var top = 60 + $(".divHomeTop").height();

		var availHeight = $(window).height() - top;

		var availWidth = $("#divBio").width() * 0.75;


		//if wide

		if (this.imageSrc.width > this.imageSrc.height) {

			var newWidth = this.imageSrc.width * availHeight / this.imageSrc.height;

			if (newWidth < availWidth) {

				$("#flex-image-main").css("height", availHeight * 0.875);


			}
			else {

				$("#flex-image-main").css("width", availWidth * 0.875);
			}		
		
		} else  { // then it's tall

			var newHeight = this.imageSrc.height * availWidth / this.imageSrc.width;

			$("#flex-image-main").css("height", availHeight * 0.875);
		
		}

		var top = $("div.flex-container-right").position().top + $("div.flex-container-right").innerHeight();

		$("div.divBioEditIcon").css("top", top + "px");

		//stretch the height of the div to accomodate the edit button, if appropriate

		if ( Session.get("sProfiledUserID") == Meteor.userId() ) {

			var _height = $("#divBio").innerHeight();

			$("#divBio").css("height", _height + 40);  //height of the edit button

			if ( $("#startBioEdit").css("opacity") == "0" ) fadeIn( "startBioEdit" ); 

		}

		if (game.user.editMode.get() ) {	


		    if ( $("#saveBioEdit").css("opacity") == "0" ) fadeIn( "saveBioEdit" );

		    if ( $("#cancelBioEdit").css("opacity") == "0" ) fadeIn( "cancelBioEdit" );

		    if ( $("#editAvatar").css("opacity") == "0" ) fadeIn( "editAvatar" );

		    if ( $("#editFeaturedPic").css("opacity") == "0" ) fadeIn( "editFeaturedPic" );

	  	}
	  	else {

	    	if ( $("#startBioEdit").css("opacity") == "0" ) fadeIn( "startBioEdit" ); 

	  	}

	}	


}