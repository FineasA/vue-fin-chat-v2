const users = [];

//join user to chat

userJoin = (id, username) => {
  const user = {
    id,
    username,
  };

  users.push(user);

  return user;
};

//get current user

getCurrentUser = (id) => {
  return users.find((user) => user.id === id);
};

module.exports = {
  userJoin,
  getCurrentUser,
};
