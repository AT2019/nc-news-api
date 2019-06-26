const connection = require("../db/connection.js");

const fetchTopics = () => {
  console.log("topics from the model");
  return connection.select("*").from("topics");
};

module.exports = { fetchTopics };
