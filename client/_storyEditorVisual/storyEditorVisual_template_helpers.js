Template.editEntityButtons.helpers({

  char: function() {

  	 return story.chars;
  },

});


Template.editEntityButtons.events({

	'click button#set': function(event, template) {

		ved.setSubmode( event.currentTarget.id );

	 },

	'click button#move': function(event, template) {

		ved.setSubmode( event.currentTarget.id );

	 },

	'click button#size': function(event, template) {

		ved.setSubmode( event.currentTarget.id );

	 },

	'click button#close': function(event, template) {

		ved.setSubmode( "none" );

	 },

	'click button#edit': function(event, template) {

		ved.editEntityObject();

	 }
});
