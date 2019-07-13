const connection = require("../db/connection.js");

const fetchTopics = () => {
  return connection.select("*").from("topics");
};

const insertTopic = topicObj => {
  return connection
    .insert({
      slug: topicObj.slug,
      description: topicObj.description
    })
    .into("topics")
    .returning("*")
    .then(topic => {
      if (Object.keys(topicObj).length !== 2) {
        return Promise.reject({
          status: 400,
          msg: "Bad request"
        });
      } else if (topicObj.hasOwnProperty("slug") === false) {
        return Promise.reject({ status: 400, msg: "Bad request" });
      } else if (topicObj.hasOwnProperty("description") === false) {
        return Promise.reject({ status: 400, msg: "Bad request" });
      } else if (topicObj.length === 0) {
        return Promise.reject({ status: 400, msg: "Bad request" });
      }
      return topic[0];
    });
};

module.exports = { fetchTopics, insertTopic };
