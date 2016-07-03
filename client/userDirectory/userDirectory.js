var allUsersFilter = [1,2,3,4,5,6,7,8];

var userTypeLimit = allUsersFilter.length - 1;


onlineOnly = false;

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

    var _users = Meteor.users.find( { 'profile.st': { $in: Session.get("sArrUserFilter") } } ).fetch();

    if ( onlineOnly ) {  //online users only

        for (var i = 0; i < _users.length; i++) {

            if ( Meteor.presences.findOne({userId: _users[i]._id } ) ) _out.push( _users[i] );
        }

        return _out;
    }
    else {

      return _users;
    }

    //return Meteor.users.find( { 'profile.st': { $in: Session.get("sArrUserFilter") } } );
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

    onlineOnly = false;

    var selected = false;

    var ID = e.target.id;

    if ( $("button#" + ID).hasClass("menuBarBtnCont") ) {

      setModeButton( ID, 1);

      selected = true;
    }
    else {

      setModeButton( ID, 0);      
    }


    if ( ID == "0" ) {  //a zero ID (not yet incrmemented) means "none" (no records, reset essentially)

        var btnNone = "button#0";

        if ( $(btnNone).hasClass("menuBarBtnContSel") ) {

          setAllModeButtons( 0 );   

          setModeButton(ID, 1);            

          Session.set("sArrUserFilter", [] );          
        }
        else {

          setAllModeButtons( 1 );   

          setModeButton(ID, 0);            

          Session.set("sArrUserFilter", allUsersFilter );  

        }

        return;

    }


    var intID = parseInt( ID );

    if (intID > 0 && selected) setModeButton(0, 0);  //i.e., if a specific type was selected, deselect the NONE button


    intID++;  //the ID has to be incremented to work correctly (???)

    var _arr = Session.get("sArrUserFilter"); 

    var _index = _arr.indexOf( intID )

    if ( _index  == -1 ) {  //i.e., not there

      _arr.push( intID )
    } 
    else {

      _arr.splice( _index, 1 );
    }



    if ( _arr.indexOf( 0 ) != -1 ) {  //the zero in the array means onlineOnly mode

        onlineOnly = true;
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