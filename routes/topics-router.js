const topicsRouter = require("express").Router();

const { sendTopics } = require("../controllers/topics-controllers.js");

topicsRouter.route("/").get(sendTopics);

module.exports = topicsRouter;
