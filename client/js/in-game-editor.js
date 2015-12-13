//in-game-editor.js

gInstantMode = false;

gGameEditor = false;

//turn in-game editor off / on

$(window).on('keyup', function(e){

    if (e.keyCode == 116) {  //f5

         gGameEditor = !gGameEditor;

         if (gGameEditor) {

         	startGameEditor();

         	showMessage( "Game editor on");
         }

         if (!gGameEditor) {

         	stopGameEditor();        	

         	showMessage ( "Game editor off");  
         }
    }
});


stopGameEditor = function() {

	$(window).off('keyup.69');  //e = editLabels

	$(window).off('keyup.73');  //i = instant mode

}

stopEditLabels = function() {

	$(window).off('keyup.37');  //arrow keys

	$(window).off('keyup.38');

	$(window).off('keyup.39');

	$(window).off('keyup.40');	

	$(window).off('keyup.71');  //g = go() (continue hackDone sequence)
}


startGameEditor = function() {

//main screen edit hacks

	$(window).on('keyup', function(e){

	    if (e.keyCode == 73) {  //i

	         gInstantMode = !gInstantMode;

	         if (gInstantMode) showMessage( "Instant mode on");

	         if (!gInstantMode) showMessage( "Instant mode off");  
	         
	    }
	});

//map screen edit hacks

	$(window).on('keyup', function(e){

	      if (e.keyCode == 69) {  //e

	           if (editLabels) {

	              editLabels = false;

	              stopEditLabels();

	              showMessage("Edit labels is off")

	              return;
	           }
	           else {

	              editLabels = true;

	              showMessage("Edit labels is on")   

	              return;          
	           }
	      }

	      if (!editLabels) return;

	      var map = display.ctl["MAP"].worldMap.map;

	      var _x = map.allLabels[0].x;

	      var _y = map.allLabels[0].y;

	      if (e.keyCode == 71) {  //g

	           go();
	      }

	      if (e.keyCode == 37) {  //left

	           map.allLabels[0].x = _x * 0.98;

	           updateLabel();
	      }

	      if (e.keyCode == 38) {  //down

	           map.allLabels[0].y = _y * 0.98;

	           updateLabel();
	      } 

	      if (e.keyCode == 39) {  //right

	           map.allLabels[0].x = _x * 1.02;

	           updateLabel();
	      }

	      if (e.keyCode == 40) {  //up

	           map.allLabels[0].y = _y * 1.02;

	           updateLabel();
	      }


	});


}



