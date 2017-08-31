//mapboxSequence.js

ghSequenceMove = function() {

 	this.start = [10.523, 35.648];

 	this.finish =  [10.523, 35.648];

 	this.startZoom = 2.1;

 	this.finishZoom = 2.1;

 	this.startPitch = 60;

 	this.finishPitch = 60;

 	this.startBearing = 0;

 	this.finishBearing = 0;
}

ghMapboxSequence = function( _code, _picType, _textType ) {

 	this.code = "";

 	this.dt = "";

 	this.picType = 0;

 	this.textType = 0;

	this.iconWidth = 64;

	this.iconHeight = 64;

 	this.move = [];

 	//***************

	this.code = _code;

	this.textType = _textType;

	this.picType = _picType;

	if (_picType || _textType == cLeader) this.dt = "ldr";

	if (_picType  == cCountry) this.dt = "flg";	

	//move 0

	var _move = new ghSequenceMove();

	if (this.code == "north_america") {

	 	_move.start = [-79, 8.6];

	 	_move.finish = [-88.5, 15.5];

	 	//_move.finish = [-101, 24];

	 	_move.startZoom = 7.7;

	 	_move.finishZoom = 7.7;

	 	_move.startBearing = -56.7;

	 	_move.finishBearing = -56.7;

	 	_move.startPitch = 60;

	 	_move.finishPitch = 60;

	 	_move.speed = 0.15;

	 	this.move.push( _move );	


		//after the first move, no start, startZoom, startBearing or startPitch value is needed
		_move = new ghSequenceMove();

	 	_move.finish = [-95, 24];

	 	_move.finishZoom = 4.4;

	 	_move.finishBearing = 0;

	 	_move.finishPitch = 60;

	 	_move.speed = 0.19;

	 	this.move.push( _move );		


		_move = new ghSequenceMove();

	 	_move.finish = [-73, 22.8];

	 	_move.finishZoom = 5.2;

	 	_move.finishBearing = 0;

	 	_move.finishPitch = 60;

	 	_move.speed = 0.19;

	 	this.move.push( _move );		


		_move = new ghSequenceMove();

	 	_move.finish = [-71, 59];

	 	_move.finishZoom = 4.2;

	 	_move.finishBearing = 0;

	 	_move.finishPitch = 60;

	 	_move.speed = 0.25;

	 	this.move.push( _move );	
	}


	if (this.code == "south_america") {

	 	_move.start = [-65, -45];

	 	_move.finish = [-58, 4];

	 	_move.startZoom = 4.3;

	 	_move.finishZoom = 5.5;

	 	_move.startBearing = 20;

	 	_move.finishBearing = 20;

	 	_move.startPitch = 52.5;

	 	_move.finishPitch = 52.5;

	 	_move.speed = 0.1;

	 	this.move.push( _move );	
	 }

	if (this.code == "africa") {

	 	_move.start = [26.3, -26];

	 	_move.finish = [28.5,19.6];

	 	_move.startZoom = 4.8;

	 	_move.finishZoom = 4.8;

	 	_move.startBearing = 0;

	 	_move.finishBearing = 0;

	 	_move.startPitch = 47;

	 	_move.finishPitch = 47;

	 	_move.speed = 0.1;

	 	this.move.push( _move );	


		_move = new ghSequenceMove();

	 	_move.finish = [-0.66, 11.8];

	 	_move.finishZoom = 6.2;

	 	_move.finishBearing = -72;

	 	_move.finishPitch = 57.5;

	 	_move.speed = 0.1;

	 	this.move.push( _move );	


		_move = new ghSequenceMove();

	 	_move.finish = [-11, 16.7];

	 	_move.finishZoom = 6.2;

	 	_move.finishBearing = -72;

	 	_move.finishPitch = 57.5;

	 	_move.speed = 0.15;

	 	this.move.push( _move );	
	 }

	if (this.code == "europe") {

	 	_move.start = [-6.7, 39.3];

	 	_move.finish = [18.2, 44.6];

	 	_move.startZoom = 6.2;

	 	_move.finishZoom = 6.2;

	 	_move.startBearing = 57.2;

	 	_move.finishBearing = 57.2;

	 	_move.startPitch = 43;

	 	_move.finishPitch = 43;

	 	_move.speed = 0.1;

	 	this.move.push( _move );	

		_move = new ghSequenceMove();

	 	_move.finish = [19.3, 60];

	 	_move.finishZoom = 5.4;

	 	_move.finishBearing = 17.2;

	 	_move.finishPitch = 50;

	 	_move.speed = 0.1;

	 	this.move.push( _move );	

	}

	if (this.code == "oceania") {

	 	_move.start = [148, -33];

	 	_move.finish = [163, -12.8];

	 	_move.startZoom = 3.7;

	 	_move.finishZoom = 5.17;

	 	_move.startBearing = 17.2;

	 	_move.finishBearing = 50;

	 	_move.startPitch = 50;

	 	_move.finishPitch = 51;

	 	_move.speed = 0.1;

	 	this.move.push( _move );	
	 }

	if (this.code == "asia") {

	 	_move.start = [118, -5];

	 	_move.finish = [127, 36];

	 	_move.startZoom = 5.1;

	 	_move.finishZoom = 5.1;

	 	_move.startBearing = 18.8;

	 	_move.finishBearing = 18.8;

	 	_move.startPitch = 60;

	 	_move.finishPitch = 60;

	 	_move.speed = 0.1;

	 	this.move.push( _move );	
	 

		_move = new ghSequenceMove();

	 	_move.finish = [108.8, 42];

	 	_move.finishZoom = 5.1;

	 	_move.finishBearing = 18.8;

	 	_move.finishPitch = 60;

	 	_move.speed = 0.15;

	 	this.move.push( _move );	


		_move = new ghSequenceMove();

	 	_move.finish = [67, 43];

	 	_move.finishZoom = 4.4;

	 	_move.finishBearing = 18.8;

	 	_move.finishPitch = 60;

	 	_move.speed = 0.15;

	 	this.move.push( _move );


		_move = new ghSequenceMove();

	 	_move.finish = [46.5, 26];

	 	_move.finishZoom = 5;

	 	_move.finishBearing = 18.8;

	 	_move.finishPitch = 60;

	 	_move.speed = 0.2;

	 	this.move.push( _move );



		_move = new ghSequenceMove();

	 	_move.finish = [36.6, 32.1];

	 	_move.finishZoom = 7.2;

	 	_move.finishBearing = 18.8;

	 	_move.finishPitch = 60;

	 	_move.speed = 0.2;

	 	this.move.push( _move );


		_move = new ghSequenceMove();

	 	_move.finish = [81, 23];

	 	_move.finishZoom = 5.9;

	 	_move.finishBearing = 18.8;

	 	_move.finishPitch = 60;

	 	_move.speed = 0.25;

	 	this.move.push( _move );

		_move = new ghSequenceMove();


	 	_move.finish = [102, 15.6];

	 	_move.finishZoom = 5.9;

	 	_move.finishBearing = 18.8;

	 	_move.finishPitch = 60;

	 	_move.speed = 0.3;

	 	this.move.push( _move );

	 }  //asia


	if (this.code == "ttp") {

	 	_move.start = [-92, -7];

	 	_move.finish = [-61, 17];

	 	_move.startZoom = 3.7;

	 	_move.finishZoom = 3.7;

	 	_move.startBearing = 22.3;

	 	_move.finishBearing = 22.3;

	 	_move.startPitch = 33;

	 	_move.finishPitch = 33;

	 	_move.speed = 0.1;

	 	this.move.push( _move );	


		_move = new ghSequenceMove();

	 	_move.finish = [0, 15.7];

	 	_move.finishZoom = 3.7;

	 	_move.finishBearing = 22.3;

	 	_move.finishPitch = 33;

	 	_move.speed = 0.1;

	 	this.move.push( _move );


		_move = new ghSequenceMove();

	 	_move.finish = [66, 25];

	 	_move.finishZoom = 3.7;

	 	_move.finishBearing = 22.3;

	 	_move.finishPitch = 33;

	 	_move.speed = 0.1;

	 	this.move.push( _move );


		_move = new ghSequenceMove();

	 	_move.finish = [110.7, 18.4];

	 	_move.finishZoom = 3.7;

	 	_move.finishBearing = 22.3;

	 	_move.finishPitch = 33;

	 	_move.speed = 0.1;

	 	this.move.push( _move );


		_move = new ghSequenceMove();

	 	_move.finish = [107.8, 45.8];

	 	_move.finishZoom = 3.7;

	 	_move.finishBearing = 22.3;

	 	_move.finishPitch = 33;

	 	_move.speed = 0.1;

	 	this.move.push( _move );
	}

	if (this.code == "ttp_africa") {

 		_move.start = [18.9, 42];

		_move.finish = [24.7, -21];

	 	_move.startZoom = 4.3;

	 	_move.finishZoom = 4.3;

	 	_move.startBearing = 0;

	 	_move.finishBearing = 0;

	 	_move.startPitch = 39;

	 	_move.finishPitch = 39;

	 	_move.speed = 0.075;

	 	this.move.push( _move );	
	 }


	if (this.code == "ttp_asia") {

 		_move.start = [63.7, 22.8];

		_move.finish = [88, 22];

	 	_move.startZoom = 4.3;

	 	_move.finishZoom = 4.3;

	 	_move.startBearing = 0;

	 	_move.finishBearing = 0;

	 	_move.startPitch = 39;

	 	_move.finishPitch = 39;

	 	_move.speed = 0.075;

	 	this.move.push( _move );	


		_move = new ghSequenceMove();

	 	_move.finish = [98, 51.2];

	 	_move.finishZoom = 3.7;

	 	_move.finishBearing = 0;

	 	_move.finishPitch = 39;

	 	_move.speed = 0.1;

	 	this.move.push( _move );


		_move = new ghSequenceMove();

	 	_move.finish = [124.7, 11.5];

	 	_move.finishZoom = 3.7;

	 	_move.finishBearing = 0;

	 	_move.finishPitch = 39;

	 	_move.speed = 0.15;

	 	this.move.push( _move );
	 }

	if (this.code == "ttp_europe") {

 		_move.start = [-1.6, 40.8];

		_move.finish = [8.9, 49.4];

	 	_move.startZoom = 5.7;

	 	_move.finishZoom = 5.7;

	 	_move.startBearing = 0;

	 	_move.finishBearing = 0;

	 	_move.startPitch = 39;

	 	_move.finishPitch = 39;

	 	_move.speed = 0.1;

	 	this.move.push( _move );	


		_move = new ghSequenceMove();

	 	_move.finish = [21.6, 45.5];

	 	_move.finishZoom = 5.3;

	 	_move.finishBearing = 0;

	 	_move.finishPitch = 39;

	 	_move.speed = 0.1;

	 	this.move.push( _move );
	 }


	if (this.code == "ttp_north_america") {

 		_move.start = [-79, 10.2];

		_move.finish = [-80.7, 17.1];

	 	_move.startZoom = 5.7;

	 	_move.finishZoom = 5.7;

	 	_move.startBearing = 0;

	 	_move.finishBearing = 0;

	 	_move.startPitch = 33;

	 	_move.finishPitch = 33;

	 	_move.speed = 0.075;

	 	this.move.push( _move );	


		_move = new ghSequenceMove();

	 	_move.finish = [-85, 25];

	 	_move.finishZoom = 4.45;

	 	_move.finishBearing = 0;

	 	_move.finishPitch = 33;

	 	_move.speed = 0.125;

	 	this.move.push( _move );


		_move = new ghSequenceMove();

	 	_move.finish = [-98, 45];

	 	_move.finishZoom = 4.45;

	 	_move.finishBearing = 0;

	 	_move.finishPitch = 56;

	 	_move.speed = 0.15;

	 	this.move.push( _move );
	 }

	if (this.code == "ttp_south_america") {

 		_move.start = [-77.8, 12.6];

		_move.finish = [-61.8, -13.5];

	 	_move.startZoom = 4.9;

	 	_move.finishZoom = 4.9;

	 	_move.startBearing = 0;

	 	_move.finishBearing = 0;

	 	_move.startPitch = 33;

	 	_move.finishPitch = 33;

	 	_move.speed = 0.075;

	 	this.move.push( _move );	


		_move = new ghSequenceMove();

	 	_move.finish = [-64.5, -37];

	 	_move.finishZoom = 4.45;

	 	_move.finishBearing = 0;

	 	_move.finishPitch = 33;

	 	_move.speed = 0.1;

	 	this.move.push( _move );

	 }

	if (this.code == "ttp_oceania") {

 		_move.start = [121.7, -0.3];

		_move.finish = [164.7, -17];

	 	_move.startZoom = 4;

	 	_move.finishZoom = 5.1;

	 	_move.startBearing = 0;

	 	_move.finishBearing = 0;

	 	_move.startPitch = 39;

	 	_move.finishPitch = 39;

	 	_move.speed = 0.1;

	 	this.move.push( _move );	


		_move = new ghSequenceMove();

	 	_move.finish = [155.9, -31.8];

	 	_move.finishZoom = 4;

	 	_move.finishBearing = 0;

	 	_move.finishPitch = 39;

	 	_move.speed = 0.1;

	 	this.move.push( _move );
	 }

	if (this.code == "pg") {

 		_move.start = [20.6, 24.6];

		_move.finish = [37.6, 31.5];

	 	_move.startZoom = 5.7;

	 	_move.finishZoom = 6.8;

	 	_move.startBearing = -11;

	 	_move.finishBearing = -11;

	 	_move.startPitch = 50;

	 	_move.finishPitch = 50;

	 	_move.speed = 0.1;

	 	this.move.push( _move );	


		_move = new ghSequenceMove();

	 	_move.finish = [51.5, 21.4];

	 	_move.finishZoom = 5.45;

	 	_move.finishBearing = -11;

	 	_move.finishPitch = 50;

	 	_move.speed = 0.1;

	 	this.move.push( _move );
	 }
}
