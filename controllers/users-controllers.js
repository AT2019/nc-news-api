const {
  fetchUserByUsername,
  insertUser,
  fetchUsers
} = require("../models/users-model.js");

const sendUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUserByUsername(username)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};

const addUser = (req, res, next) => {
  userObj = req.body;
  insertUser(userObj)
    .then(user => res.status(201).send({ user: user }))
    .catch(next);
};

const sendUsers = (req, res, next) => {
  fetchUsers()
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(next);
};

module.exports = { sendUserByUsername, addUser, sendUsers };
