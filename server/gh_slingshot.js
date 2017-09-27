testvar = "123"

Slingshot.createDirective("ghStoryPic", Slingshot.S3Storage, {
  bucket: "gh-resource",

  acl: "public-read",

  AWSAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  AWSSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,

  authorize: function () {

    //Deny uploads if user is not logged in.
    if (!this.userId) {
      var message = "Please login before posting files";
      throw new Meteor.Error("Login Required", message);
    }

    return true;
  },

  key: function (file) {

    //Store file into a directory by the user's ID.

    return "ghStoryPic/" + this.userId + "-" + file.name;
  }
});

Slingshot.createDirective("ghSound", Slingshot.S3Storage, {
  bucket: "gh-resource",

  acl: "public-read",

  AWSAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  AWSSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,

  authorize: function () {

    //Deny uploads if user is not logged in.
    if (!this.userId) {
      var message = "Please login before posting files";
      throw new Meteor.Error("Login Required", message);
    }

    return true;
  },

  key: function (file) {

    //Store file into a directory by the user's ID.

    return "ghSound/" + this.userId + "-" + file.name;
  }
});

Slingshot.createDirective("ghVideo", Slingshot.S3Storage, {
  bucket: "gh-resource",

  acl: "public-read",

  AWSAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  AWSSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,

  authorize: function () {

    //Deny uploads if user is not logged in.
    if (!this.userId) {
      var message = "Please login before posting files";
      throw new Meteor.Error("Login Required", message);
    }

    return true;
  },

  key: function (file) {

    //Store file into a directory by the user's ID.

    return "ghVideo/" + this.userId + "-" + file.name;
  }
});

Slingshot.createDirective("ghImage", Slingshot.S3Storage, {
  bucket: "gh-resource",

  acl: "public-read",

  AWSAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  AWSSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,

  authorize: function () {

    //Deny uploads if user is not logged in.
    if (!this.userId) {
      var message = "Please login before posting files";
      throw new Meteor.Error("Login Required", message);
    }

    return true;
  },

  key: function (file) {

    //Store file into a directory by the user's ID.

    return "ghImage/" + this.userId + "-" + file.name;
  }
});


Slingshot.createDirective("ghWeb", Slingshot.S3Storage, {
  bucket: "gh-resource",

  acl: "public-read",

  AWSAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  AWSSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,

  authorize: function () {

    //Deny uploads if user is not logged in.
    if (!this.userId) {
      var message = "Please login before posting files";
      throw new Meteor.Error("Login Required", message);
    }

    return true;
  },

  key: function (file) {

    //Store file into a directory by the user's ID.

    return "ghWeb/" + this.userId + "-" + file.name;
  }
});


Slingshot.createDirective("ghAvatar", Slingshot.S3Storage, {
  bucket: "gh-resource",

  acl: "public-read",

  AWSAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  AWSSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,

  authorize: function () {

    //Deny uploads if user is not logged in.
    if (!this.userId) {
      var message = "Please login before posting files";
      throw new Meteor.Error("Login Required", message);
    }

    return true;
  },

  key: function (file) {

    //Store file into a directory by the user's ID.

    return "ghAvatar/" + this.userId + "-" + file.name;
  }
});

Slingshot.createDirective("ghTag", Slingshot.S3Storage, {
  bucket: "gh-resource",

  acl: "public-read",

  AWSAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  AWSSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,

  authorize: function () {

    //Deny uploads if user is not logged in.
    if (!this.userId) {
      var message = "Please login before posting files";
      throw new Meteor.Error("Login Required", message);
    }

    return true;
  },

  key: function (file) {

    //Store file into a directory by the user's ID.

    var d = new Date();

    return "ghTag/" + this.userId + "-" + d.getTime() + ".png";
  }
});

Slingshot.createDirective("ghUserFeaturedPic", Slingshot.S3Storage, {
  bucket: "gh-resource",

  acl: "public-read",

  AWSAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  AWSSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,

  authorize: function () {

    //Deny uploads if user is not logged in.
    if (!this.userId) {
      var message = "Please login before posting files";
      throw new Meteor.Error("Login Required", message);
    }

    return true;
  },

  key: function (file) {

    //Store file into a directory by the user's ID.

    return "ghUserFeaturedPic/" + this.userId + "-" + file.name;
  }
});
