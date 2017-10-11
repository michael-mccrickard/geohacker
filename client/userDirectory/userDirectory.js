var allUsersFilter = [1,2,3,4,5,6,7,8,9];

var userTypeLimit = allUsersFilter.length;


onlineOnly = false;

arrUserFilter = allUsersFilter;

var userSortBy = "profile.sn";

var userSortDir = -1;

userSort = { "profile.sn": -1 };

sortNow = new Blaze.ReactiveVar(1);

Template.userDirectory.rendered = function(){

  stopSpinner();
}

Template.userDirectory.helpers({

  //when we have roles, we will use a parameter on the find()
  //to limit which users show up  (super-admin = all, curator = all for their country or countries)

  ghUser: function() {

    var _sortNow = sortNow.get();

    var _out = [];
    
    var _users = null;

    if (userSortBy == "username") _users = Meteor.users.find( { 'profile.st': { $in: arrUserFilter } }, { sort:  userSort } ).fetch();

     if (userSortBy == "profile.sn") _users = Meteor.users.find( { 'profile.st': { $in: arrUserFilter } }, { sort:  { "profile.sn": userSortDir } } ).fetch();   
/*
    if ( onlineOnly ) {  //online users only

        for (var i = 0; i < _users.length; i++) {

            if ( Meteor.presences.findOne({userId: _users[i]._id } ) ) _out.push( _users[i] );
        }

        return _out;
    }
    else {

      return _users;
    }
*/

return _users;
  },

  isActive: function() {

     if (this.profile.st == usActive) return true;

     return false;
  },

  userStatus: function() {

    return arrUserStatus;
  },

  selectedValue: function(key) {

    return key ==  this.profile.st ? 'selected' : '';
  },

  titleString: function(_val) {

    var _title = arrUserTitle[ _val ];

    if (_val == utGeohackerInChiefCountry || _val == utHonoraryGeohackerInChiefCountry) _title = _title + " " + db.getCountryName( this.profile.cc );

    return _title;
  },
/*
  presence: function() { 

    return Meteor.presences.findOne({userId: this._id});
  },
*/
  lastSeen: function() {

    return this.profile.sn;
  }

})

function updateSort()  {

      var _sortNow = sortNow.get();

    sortNow.set( _sortNow * -1 );
}


Template.userDirectory.events = {

  'click img.userDirectoryAvatar': function(e) {

    Session.set("sProfiledUserID", $(e.target).attr("data-userID"));

    FlowRouter.go("/home");

    game.user.setMode( uBio );   

  },

  'click .sortByDate': function(e) {

    var _dir = userSortDir;

    if ( userSortBy == "profile.sn" ) userSortDir = _dir * -1;

    userSortBy = "profile.sn";

    userSort = {};

    userSort[ userSortBy ] = userSortDir;

    updateSort();
  },

  'click .sortByName': function(e) {

    var _dir = userSortDir;

    if ( userSortBy == "username" ) userSortDir = _dir * -1;

    userSortBy = "username";

    userSort = {};

    userSort[ userSortBy ] = userSortDir;

    updateSort();
  },

  'click .userFilterButton': function(e) {

    var selected = false;

    var ID = e.target.id;

    if ( $("button#" + ID).hasClass("menuBarBtnCont") ) {

      setModeButton( ID, 1);

      selected = true;
    }
    else {

      setModeButton( ID, 0);      
    }


    if ( ID == "0" ) {  //a zero ID (not yet incrmemented) means "NONE" was selected (no records, reset essentially)

        var btnNone = "button#0";

        var _tmpArr = allUsersFilter;

        if ( $(btnNone).hasClass("menuBarBtnContSel") ) {

          setAllModeButtons( 0 );   

          setModeButton(ID, 1);            

          _tmpArr = [];          
        }
        else {

          setAllModeButtons( 1 );   

          setModeButton(ID, 0);   

        }

        if (onlineOnly) _tmpArr.push(0);  //add the onlineOnly flag back to the array

        arrUserFilter = _tmpArr;

        updateSort();

        return;

    }


    var intID = parseInt( ID );

    if (intID > 0 && selected) setModeButton(0, 0);  //i.e., if a specific type was selected, deselect the NONE button

    var _arr = arrUserFilter; 

    var _index = _arr.indexOf( intID )

    if ( _index  == -1 ) {  //i.e., not there

      _arr.push( intID )
    } 
    else {

      _arr.splice( _index, 1 );
    }


    if ( _arr.indexOf( -1 ) != -1 && selected) {  // -1 in the array means onlineOnly mode

        onlineOnly = true;
    }
    else {

      onlineOnly = false;
    }

    arrUserFilter = _arr;

    updateSort();
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

      var _lastSeen = $("td#" + e.target.id + ".lastSeen" ).html();

      db.updateUserStatus( e.target.id, _status, _lastSeen);
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

  for (var i = 1; i <= userTypeLimit; i++) {

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