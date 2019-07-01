const {
  insertCommentToArticle,
  fetchCommentByArticleId,
  changeCommentById,
  removeCommentById
} = require("../models/comments-model.js");

const addCommentToArticle = (req, res, next) => {
  const { article_id } = req.params;
  const commentObj = req.body;
  insertCommentToArticle(article_id, commentObj)
    .then(comment => res.status(201).send({ comment: comment }))
    .catch(next);
};

const sendCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  const correctOrder = ["asc", "desc"].includes(order);
  const correctSort_by = [
    "comment_id",
    "body",
    "votes",
    "created_at",
    "author"
  ].includes(sort_by);
  if (order && !correctOrder) {
    next({ status: 400, msg: "Bad request" });
  }
  if (sort_by && !correctSort_by) {
    next({ status: 400, msg: "Bad request" });
  } else
    fetchCommentByArticleId(article_id, sort_by, order)
      .then(comments => {
        res.status(200).send({ comments });
      })
      .catch(next);
};

const updateCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const votes = req.body.inc_votes;
  const obj = req.body;
  changeCommentById(comment_id, votes, obj)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

const deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(comment => {
      res.status(204).send("Comment deleted");
    })
    .catch(next);
};

module.exports = {
  addCommentToArticle,
  sendCommentByArticleId,
  updateCommentById,
  deleteCommentById
};
