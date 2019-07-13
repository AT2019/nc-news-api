const usersRouter = require("express").Router();

const {
  sendUserByUsername,
  addUser,
  sendUsers
} = require("../controllers/users-controllers.js");

const send405 = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed" });
};

usersRouter
  .route("/")
  .post(addUser)
  .get(sendUsers)
  .all(send405);

usersRouter
  .route("/:username")
  .get(sendUserByUsername)
  .all(send405);

module.exports = usersRouter;
