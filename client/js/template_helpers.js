

Template.registerHelper("waitingOnDatabase", function() {

		return Session.get("sWaitingOnDatabase");
	}
)


Template.registerHelper("agentName",  function() {

		 return game.user.name.toUpperCase();
	}

)

Template.registerHelper("badge", function() {

    var _obj = new BadgeList();

    Session.set("sBadgeCount", _obj.length)

    return ( _obj.generateList() );

  }
)

Template.registerHelper("avatarURL",  function() {

		var defaultPic = "geohacker_logo.png";

		if (Meteor.user() == null) return defaultPic;

		if (Meteor.user().profile.av == "") return defaultPic;

		return Meteor.user().profile.av;
	}
)

Template.registerHelper("avatarURLForUserID",  function(ID) {

		return Meteor.users.findOne( {_id: ID } ).profile.av; 
	}

)

Template.registerHelper("getText",  function() {

		if (this.dt == "cap") {

			var capital = hack.getCapitalName();

			var s = capital + " is the capital of " + hack.getCountryName() + ".";

			return s.toUpperCase();
		}

		if (this.dt == "ldr") {

			var leaderName = hack.getLeaderName();

			var leaderType = hack.getLeaderType();

			var s = leaderName + " is the " + leaderType + " of " + hack.getCountryName() + ".";

			return s.toUpperCase();
		}

		if (this.dt == "hq") {

			var s = this.n + " is headquartered in " + hack.getCountryName() + ".";

			return s.toUpperCase();
		}

		if (this.t) return this.t.toUpperCase();

	}
)


Template.registerHelper("getImage", function(_file) {

		if (_file) return _file;

		if (this == undefined) return "";

		if (!this.dt) return "";

		if (!this.dt.length) return "";

		var _code = this.dt.substr(0,3);

		if (_code == "flg")  return hack.getFlagPic();

		if (_code == "ldr")  return hack.getLeaderPic();

		if (_code == "cap")  return hack.getCapitalPic();

		return hack.getCustomPic(this.dt);		

		//return this.f;  //anymore f fields with pic sources left???

	}
)

Template.registerHelper("messageID", function() {

		return hack.messageID;
	}
)

