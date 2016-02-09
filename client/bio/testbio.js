
_height = null;

imgSrc = null;

Template.bio.rendered = function() {

	imgSrc = Control.getImageFromFile(game.user.bio.image);

	Meteor.setTimeout( function() { finishBioDraw(); }, 200);

}

function finishBioDraw() {

	var top = 60 + $(".divHomeTop").height();

	var availHeight = $(window).height() - top;

	var availWidth = $("#divBio").width() * 0.75;


	//if wide

	if (imgSrc.width > imgSrc.height) {

		var newWidth = imgSrc.width * availHeight / imgSrc.height;

		if (newWidth < availWidth) {

			$("#flex-image-main").css("height", availHeight * 0.875);


		}
		else {

			$("#flex-image-main").css("width", availWidth * 0.875);
		}		
	
	} else  { // then it's tall

		var newHeight = imgSrc.height * availWidth / imgSrc.width;

		$("#flex-image-main").css("height", availHeight * 0.875);
	
	}

	var top = $("div.flex-container-right").position().top + $("div.flex-container-right").innerHeight();

	top = top - 40;

c(top);

	$("div.divBioEditIcon").css("top", top + "px");

	if ( $("#startBioEdit").css("opacity") == "0" ) fadeIn( "startBioEdit" ); 

}

drawEditBio = function() {



	$("#saveBioEdit").css("opacity", 1)
	$("#cancelBioEdit").css("opacity", 1)
	$("#editAvatar").css("opacity", 1)
	$("#editFeaturedPic").css("opacity", 1)

}