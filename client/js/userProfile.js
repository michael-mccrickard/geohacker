//userProfile.js

UserProfile = function() {

    this.draw = function() {

      var spacer = Session.get("gWindowHeight") * 0.0125;

      var icon1 = null;

      var icon2 = null;

      if ( game.user.editMode.get() ) {

        icon1 = "#saveProfileEdit";

        icon2 = "#cancelProfileEdit";
      }
      else {

        icon1 = "#startProfileEdit";
      }

   		var bottom = $(".divProfileFeaturedPic").height() +  $(".divProfileFeaturedPic").position().top;

   		var top = bottom - 0.02 * $(".divProfileFeaturedPic").height();

   		$(icon1).css("top", top);

      if (icon2) $(icon2).css("top", top);


   		var left = $(".divProfile").width() + $(".divProfile").position().left - 32 - 0.01 * $(".divProfileFeaturedPic").width();

     	$(icon1).css("left", left); 

      if (icon2) $(icon2).css("left", left - 48); 

      if (game.user.editMode.get() ) {     		

          //edit avatar button

          top = $("img.imgProfileAvatar").position().top;

          var bottom = top + $("img.imgProfileAvatar").height();

          $("#editAvatar").css("top", bottom - 32);

          left = $("img.imgProfileAvatar").position().left;

         $("#editAvatar").css("left", left + 4);


          //edit featured pic button

          top = $("img.imgProfileFeaturedPic").position().top;

          bottom = top + $("img.imgProfileFeaturedPic").height();

          $("#editFeaturedPic").css("top", bottom - 36);

          left = $("img.imgProfileFeaturedPic").position().left;

         $("#editFeaturedPic").css("left", left + 4);


        if ( $("#saveProfileEdit").css("opacity") == "0" ) fadeIn( "saveProfileEdit" );

        if ( $("#cancelProfileEdit").css("opacity") == "0" ) fadeIn( "cancelProfileEdit" );

        if ( $("#editAvatar").css("opacity") == "0" ) fadeIn( "editAvatar" );

        if ( $("#editFeaturedPic").css("opacity") == "0" ) fadeIn( "editFeaturedPic" );

      }
      else {

        if ( $("#startProfileEdit").css("opacity") == "0" ) fadeIn( "startProfileEdit" ); 
      }

    }
	
}