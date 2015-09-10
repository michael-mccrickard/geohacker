

Template.registerHelper("avatarURL",  function() {

		return game.user.avatarURL.get();
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

		if (_code == "hq")  return hack.getHeadquartersPic();

		if (_code == "ldr")  return hack.getLeaderPic();

		if (_code == "cap")  return hack.getCapitalPic();

		if (_code.substr(0,3) == "cus")  return hack.getCustomPic(this.dt);		

		return this.f;

	}
)

Template.registerHelper("messageID", function() {

		return hack.messageID;
	}
)

Template.registerHelper("getThisCountryCode", function() {

    	return hack.countryCode;
    }
)    

Template.registerHelper("getThisCountryName", function() {

    	return hack.getCountryName();
    }
)

