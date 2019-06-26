const {
  fetchArticleById,
  changeArticleById
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
  console.log(req.body.inc_votes, "<-- console.log votes");

  const votes = req.body.inc_votes;
  console.log(typeof votes);
  changeArticleById(article_id, votes)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

module.exports = { sendArticleById, updateArticleById };
