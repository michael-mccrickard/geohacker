//storyPreload.js



//story.updatePreloads()

testsp = function() {



		$("#ps1").attr("src", _img1 );

		$("#ps2").attr("src", _img2 );

        imagesLoaded( document.querySelector('#preloadStoryFiles'), function( instance ) {

        });	
}


/*

Tracker.autorun( function(comp) {

  		var _flag = Session.get("sCheckStoryPreloads") 

  		console.log("story preloads equal " + _flag)

	}

);  

*/