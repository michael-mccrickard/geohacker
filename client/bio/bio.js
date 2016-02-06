//bio.js

Bio = function() {

	this.imageSrc = null;

	this.avatarUploader = new Slingshot.Upload("ghAvatar");

	this.userFeaturedPicUploader = new Slingshot.Upload("ghUserFeaturedPic");


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

        	Meteor.setTimeout( function() { game.user.bio.draw(); }, 200 );

        });
	}

	this.redraw = function() {

	  Meteor.setTimeout( function() { draw(); }, 100 );

	}

	this.draw = function() {

	  var icon1 = null;

	  var icon2 = null;

	  if ( game.user.editMode.get() ) {

	    icon1 = "#saveBioEdit";

	    icon2 = "#cancelBioEdit";
	  }
	  else {

	    icon1 = "#startBioEdit";
	  }

	  var _height = $(window).height();

	  var _width = $(window).width();

	  var thisDivTop = $("div.divHomeTop").position().top + $("div.divHomeTop").height();

	  var picHeight = this.imageSrc.height;

	  var picWidth = this.imageSrc.width;

	  if (picWidth > picHeight) {

	  	  $(".imgBioFeaturedPic").width() = 0.7 * _width;
	  }
	  else {

	  	  $(".imgBioFeaturedPic").height() = 0.9 * $(".divBio").height();	  	
	  }

	  var top = bottom - 0.02 * $(".divBioFeaturedPic").height();

	  $(icon1).css("top", top);

	  if (icon2) $(icon2).css("top", top);


	  var left = $(".divBio").width() + $(".divBio").position().left - 32 - 0.01 * $(".divBioFeaturedPic").width();

	  $(icon1).css("left", left); 

	  if (icon2) $(icon2).css("left", left - 48); 

	  if (game.user.editMode.get() ) {        

	      //edit avatar button

	      top = $("img.imgBioAvatar").position().top;

	      var bottom = top + $("img.imgBioAvatar").height();

	      $("#editAvatar").css("top", bottom - 32);

	      left = $("img.imgBioAvatar").position().left;

	     $("#editAvatar").css("left", left + 4);


	      //edit featured pic button

	      top = $("img.imgBioFeaturedPic").position().top;

	      bottom = top + $("img.imgBioFeaturedPic").height();

	      $("#editFeaturedPic").css("top", bottom - 36);

	      left = $("img.imgBioFeaturedPic").position().left;

	     $("#editFeaturedPic").css("left", left + 4);


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