//accounts.js

Accounts.onCreateUser((options, user) => {

  //console.log(options)

  //console.log(user)

  user.profile = options;

  return user;

});

