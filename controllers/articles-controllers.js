const {
  fetchArticleById,
  changeArticleById,
  fetchArticles
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
  // console.log(req.body.inc_votes, "<-- console.log votes");
  const votes = req.body.inc_votes;
  const obj = req.body;
  // console.log(typeof votes);
  changeArticleById(article_id, votes, obj)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const sendArticles = (req, res, next) => {
  const { sort_by } = req.query;
  fetchArticles(sort_by)
    .then(articles => {
      // console.log(articles, "<-- from the controller");
      res.status(200).send(articles);
    })
    .catch(next);
};

module.exports = { sendArticleById, updateArticleById, sendArticles };
