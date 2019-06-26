const {
  insertCommentToArticle,
  fetchCommentByArticleId
} = require("../models/comments-model.js");

const addCommentToArticle = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;
  const commentUsername = req.body.username;
  const commentBody = req.body.body;
  console.log(comment);
  console.log(commentUsername);
  console.log(commentBody);
  insertCommentToArticle(article_id, commentUsername, commentBody)
    .then(comment => res.status(201).send({ comment: comment }))
    .catch(next);
};

const sendCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by } = req.query;
  fetchCommentByArticleId(article_id, sort_by)
    .then(comment => {
      console.log(comment);
      res.status(200).send(comment);
    })
    .catch(next);
};

module.exports = { addCommentToArticle, sendCommentByArticleId };
