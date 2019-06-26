const usersRouter = require("express").Router();

const { sendUserByUsername } = require("../controllers/users-controllers.js");

usersRouter.route("/:username").get(sendUserByUsername);

module.exports = usersRouter;
