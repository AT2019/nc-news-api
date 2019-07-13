const { fetchTopics, insertTopic } = require("../models/topics-model.js");

const sendTopics = (req, res, next) => {
  fetchTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

const addTopic = (req, res, next) => {
  const topicObj = req.body;
  insertTopic(topicObj)
    .then(topic => res.status(201).send({ topic: topic }))
    .catch(next);
};

module.exports = { sendTopics, addTopic };
