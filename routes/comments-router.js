const commentsRouter = require("express").Router();

const {
  deleteCommentById,
  updateCommentById
} = require("../controllers/comments-controller.js");

const send405 = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed" });
};

commentsRouter
  .route("/:comment_id")
  .patch(updateCommentById)
  .delete(deleteCommentById)
  .all(send405);

module.exports = commentsRouter;
