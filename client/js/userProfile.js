//userProfile.js

UserProfile = function() {

    this.text = "I'm a Geohacker.",

    this.pic = "geohacker_logo.png",

    this.av = "0",

    this.cc = "0",

    this.pt = "Featured picture",

    this.draw = function() {

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


    }
	
}