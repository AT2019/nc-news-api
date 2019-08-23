const {
  fetchArticleById,
  changeArticleById,
  fetchArticles,
  removeArticleById,
  insertArticle,
  countArticles
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
  const { sort_by, order, author, topic, limit = 10, p = 1 } = req.query;
  const offset = limit * (p - 1);
  const correctOrder = ["asc", "desc"].includes(order);
  const correctSort_by = [
    "article_id",
    "title",
    "body",
    "votes",
    "topic",
    "author",
    "created_at",
    "comment_count"
  ].includes(sort_by);
  if (order && !correctOrder) {
    next({ status: 400, msg: "Bad request" });
  }
  if (sort_by && !correctSort_by) {
    next({ status: 400, msg: "Bad request" });
  } else
    fetchArticles(sort_by, order, author, topic)
      .then(articles => {
        const total_count = countArticles();
        return Promise.all([total_count, articles]);
      })
      .then(([total_count, articles]) => {
        res.status(200).send({ total_count, articles });
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
  const newArticle = req.body;
  insertArticle(newArticle)
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
