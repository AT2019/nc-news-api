const topicsRouter = require("express").Router();

const { sendTopics } = require("../controllers/topics-controllers.js");

const send405 = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed" });
};

topicsRouter
  .route("/")
  .get(sendTopics)
  .all(send405);

module.exports = topicsRouter;
