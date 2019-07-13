const connection = require("../db/connection.js");

const fetchUserByUsername = username => {
  return connection
    .select("*")
    .from("users")
    .where("username", username)
    .then(user => {
      if (!user.length) {
        return Promise.reject({
          status: 404,
          msg: `No user found for username: ${username}`
        });
      } else return user[0];
    });
};

const insertUser = () => {
  return connection
    .insert({
      username: userObj.username,
      name: userObj.name,
      avatar_url: userObj.avatar_url
    })
    .into("users")
    .returning("*")
    .then(user => {
      if (Object.keys(userObj).length !== 3) {
        return Promise.reject({
          status: 400,
          msg: "Bad request"
        });
      } else if (userObj.hasOwnProperty("username") === false) {
        return Promise.reject({ status: 400, msg: "Bad request" });
      } else if (userObj.hasOwnProperty("name") === false) {
        return Promise.reject({ status: 400, msg: "Bad request" });
      } else if (userObj.hasOwnProperty("avatar_url") === false) {
        return Promise.reject({ status: 400, msg: "Bad request" });
      } else if (userObj.length === 0) {
        return Promise.reject({ status: 400, msg: "Bad request" });
      }
      return user[0];
    });
};

const fetchUsers = () => {
  return connection.select("*").from("users");
};

module.exports = { fetchUserByUsername, insertUser, fetchUsers };
