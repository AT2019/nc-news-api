const articlesRouter = require("express").Router();

const {
  sendArticleById,
  updateArticleById,
  sendArticles
} = require("../controllers/articles-controllers.js");
const {
  addCommentToArticle,
  sendCommentByArticleId
} = require("../controllers/comments-controller.js");

const send405 = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed" });
};

articlesRouter
  .route("/")
  .get(sendArticles)
  .all(send405);

articlesRouter
  .route("/:article_id")
  .get(sendArticleById)
  .patch(updateArticleById)
  .all(send405);

articlesRouter
  .route("/:article_id/comments")
  .post(addCommentToArticle)
  .get(sendCommentByArticleId)
  .all(send405);

module.exports = articlesRouter;
