var allUsersFilter = [1,2,3,4,5,6,7,8];

var userTypeLimit = allUsersFilter.length - 1;

Session.set("sArrUserFilter", allUsersFilter );


Template.userDirectory.rendered = function(){

  stopSpinner();
}

Template.userDirectory.helpers({

  //when we have roles, we will use a parameter on the find()
  //to limit which users show up  (super-admin = all, curator = all for their country or countries)

  ghUser: function() {

    var _arr = Session.get("sArrUserFilter");

    var _out = [];

    if ( _arr[0] == -1) {  //online users only; check all types

        var _users = Meteor.users.find().fetch();

        for (var i = 0; i < _users.length; i++) {

            if ( Meteor.presences.findOne({userId: _users[i]._id } ) ) _out.push( _users[i] );
        }

        return _out;
    }

    return Meteor.users.find( { 'profile.st': { $in: Session.get("sArrUserFilter") } } );
  },

  userStatus: function() {

    return arrUserStatus;
  },

  selectedValue: function(key) {

    return key ==  this.profile.st ? 'selected' : '';
  },

  presence: function() { 

    return Meteor.presences.findOne({userId: this._id});
  }

})

Template.userDirectory.events = {


  'click .userFilterButton': function(e) {

    var ID = e.target.id;

    if ( $("button#" + ID).hasClass("menuBarBtnCont") ) {

      setModeButton( ID, 1);
    }
    else {

      setModeButton( ID, 0);      
    }

    var _arr = Session.get("sArrUserFilter");

    var intID = parseInt( ID );

    if ( intID == -1 ) {

       var btnOnline = "button#-1";

       if ( $( btnOnline ).hasClass("menuBarBtnContSel") ) {

c("online button not selected")

          setAllModeButtons( 1 );

          Session.set("sArrUserFilter", [-1] );

       }
       else {
c("online button is selected")

setAllModeButtons( 1 );               

Session.set("sArrUserFilter", allUsersFilter);
       
       }

       return;
    }

    intID++;

    var _index = _arr.indexOf( intID )

    if ( _index  == -1 ) {

      _arr.push( intID )
    } 
    else {

      _arr.splice( _index, 1 );
    }


    Session.set("sArrUserFilter", _arr)
  },

  'click #closeUserDirectory': function (e) { 

  	  e.preventDefault();

      doSpinner();

      if (!Meteor.user() ) {

        nav.closeEditor();

        stopSpinner();

        return;
      }

      Meteor.subscribe("agentsInNetwork", function(err) {

        if (err) console.log(err.reason);

        stopSpinner();

        nav.closeEditor();

      });

      
  	},

  'click .deleteRecord': function(e) {

  	  e.preventDefault();

      game.deleteUser( e.target.id );
  },

  'click .saveRecord': function(e) {

      e.preventDefault();

      var _status = $("select#" + e.target.id + " option:selected" ).index();

      db.updateUserStatus( e.target.id, _status );
  },

  'click .loginAs': function(e) {

      e.preventDefault();

      //nullify this, so that onLogin will create the new game.user

      game.user = null;

      var email = e.target.id;

      doSpinner();

      Meteor.loginWithPassword(email, Meteor.settings.public.GENERAL_PASSWORD, function(err){

        if (err) {

          // The user might not have been found, or their passwword
          // could be incorrect. Inform the user that their
          // login attempt has failed. 

          console.log("user not logged in: " + email + ".  " + err.reason );

          if ( err.reason.indexOf("Incorrect password") != -1) Session.set("sBadPasswordEntered", true);

          customError( "Login", err.reason );

        }
        else {

          // The user has been logged in.

          stopSpinner();

          console.log("user logged in: " + email )
        }

      });
  },

}

function setAllModeButtons( _val ) {

  for (var i = 0; i <= userTypeLimit; i++) {

     setModeButton( i, _val);
  }

}


function setModeButton(_which, _val) {

  var _btn = "button#" + _which;

  if (_val) {

    $( _btn ).removeClass("menuBarBtnCont");

    $( _btn ).addClass("menuBarBtnContSel");
  }
  else {

    $( _btn ).removeClass("menuBarBtnContSel");

    $( _btn ).addClass("menuBarBtnCont");
  }

} 