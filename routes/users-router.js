const usersRouter = require("express").Router();

const { sendUserByUsername } = require("../controllers/users-controllers.js");

const send405 = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed" });
};

usersRouter
  .route("/:username")
  .get(sendUserByUsername)
  .all(send405);

module.exports = usersRouter;
