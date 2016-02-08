
_height = null;

Template.bio.rendered = function() {
	
	var top = 60 + $(".divHomeTop").height();

_height = $(window).height();

	var _width = $(window).width();	

	_height = _height - top;

$("#flex-image-main").css("height", _height * 0.875);
}