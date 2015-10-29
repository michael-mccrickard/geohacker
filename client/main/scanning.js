 Meteor.setInterval( function () {
        Session.set("sDateTime", Date().toLocaleString() ); 
}, 1000 );

Template.scanning.helpers({


    getDateTime: function() {

      return (Session.get("sDateTime"));
    },
 })
