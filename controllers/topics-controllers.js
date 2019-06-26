const { fetchTopics } = require("../models/topics-model.js");

const sendTopics = (req, res, next) => {
  console.log("topics are here");
  fetchTopics()
    .then(topics => {
      console.log(topics);
      res.status(200).send({ topics });
    })
    .catch(next);
};

module.exports = { sendTopics };
