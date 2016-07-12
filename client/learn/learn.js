//learn.js

Template.learnCountry.rendered = function() {


}

Template.learnCountry.helpers({


    capitalImage: function() {

    	return hack.getCapitalPic();
  	},

     capitalName: function() {

    	return hack.getCapitalName();
  	}
 });