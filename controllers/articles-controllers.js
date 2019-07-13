const {
  fetchArticleById,
  changeArticleById,
  fetchArticles,
  removeArticleById,
  insertArticle
} = require("../models/articles-model.js");

const sendArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const updateArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const votes = req.body.inc_votes;
  const obj = req.body;
  changeArticleById(article_id, votes, obj)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const sendArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;
  const correctOrder = ["asc", "desc"].includes(order);
  const correctSort_by = [
    "article_id",
    "title",
    "body",
    "votes",
    "topic",
    "author",
    "created_at"
  ].includes(sort_by);
  if (order && !correctOrder) {
    next({ status: 400, msg: "Bad request" });
  }
  if (sort_by && !correctSort_by) {
    next({ status: 400, msg: "Bad request" });
  } else
    fetchArticles(sort_by, order, author, topic)
      .then(articles => {
        res.status(200).send({ articles });
      })
      .catch(next);
};

const deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;
  removeArticleById(article_id)
    .then(article => {
      res.status(204).send("Article deleted");
    })
    .catch(next);
};

const addArticle = (req, res, next) => {
  const articleObj = req.body;
  insertArticle(articleObj)
    .then(article => res.status(201).send({ article: article }))
    .catch(next);
};

module.exports = {
  sendArticleById,
  updateArticleById,
  sendArticles,
  deleteArticleById,
  addArticle
};
