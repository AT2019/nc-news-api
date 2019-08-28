const {
  fetchArticleById,
  changeArticleById,
  fetchArticles,
  removeArticleById,
  insertArticle,
  fetchAllArticlesCount
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
  const { sort_by, order, author, topic, limit, p } = req.query;
  fetchArticles(sort_by, order, author, topic, limit, p)
    .then(articles => {
      if (!articles) {
        res.status(400).send([]);
      } else
        fetchAllArticlesCount(topic, author).then(allArticles => {
          res.status(200).send({ articles, total_count: allArticles });
        });
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
