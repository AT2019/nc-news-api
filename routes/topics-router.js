const topicsRouter = require("express").Router();

const {
  sendTopics,
  addTopic
} = require("../controllers/topics-controllers.js");

const send405 = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed" });
};

topicsRouter
  .route("/")
  .post(addTopic)
  .get(sendTopics)
  .all(send405);

module.exports = topicsRouter;
