//userProfile.js

UserProfile = function() {

    this.text = "I'm a Geohacker.",

    this.pic = "geohacker_logo.png",

    this.av = "0",

    this.cc = "0",

    this.pt = "Featured picture",

    this.draw = function() {

    	c( $(".divProfileFeaturedPic").height() );

		c ( $(".divProfileFeaturedPic").position().top );

   		var bottom = $(".divProfileFeaturedPic").height() +  $(".divProfileFeaturedPic").position().top;

   		var top = bottom - 0.02 * $(".divProfileFeaturedPic").height();

   		$(".imgProfileEditIcon").css("top", top);


   		var left = $(".divProfile").width() + $(".divProfile").position().left - 32 - 0.01 * $(".divProfileFeaturedPic").width();

     	$(".imgProfileEditIcon").css("left", left); 		


    }
	
}