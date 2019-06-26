const connection = require("../db/connection.js");

const fetchUserByUsername = username => {
  return connection
    .select("*")
    .from("users")
    .where("username", username)
    .then(user => {
      console.log(user, "<-- res console log");
      console.log(user.length);
      if (!user.length) {
        return Promise.reject({
          status: 400,
          msg: `No user found for username: ${username}`
        });
      } else return user[0];
    });
};

module.exports = { fetchUserByUsername };
