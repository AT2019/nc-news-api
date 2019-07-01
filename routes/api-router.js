const apiRouter = require("express").Router();
const topicsRouter = require("./topics-router.js");
const usersRouter = require("./users-router.js");
const articlesRouter = require("./articles-router.js");
const commentsRouter = require("./comments-router.js");

const send405 = (req, res) => {
  res.status(405).send({ msg: "Method not allowed" });

  apiRouter
    .route("/")
    .get((req, res) => {
      res.status(200).send(json);
    })
    .all(send405);
};

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
