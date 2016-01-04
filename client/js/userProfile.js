//userProfile.js

UserProfile = function() {

    //badge counts

    this.readInBadges = function() {

      this.profile = Meteor.user().profile;

      this.ge = this.profile.ge;

      this.ex = this.profile.ex;

      this.sp = this.profile.sp;

      this.in = this.profile.in;

      this.sc = this.profile.sc;

      this.ft = this.profile.ft;

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

   		var bottom = $(".divBioFeaturedPic").height() +  $(".divBioFeaturedPic").position().top;

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