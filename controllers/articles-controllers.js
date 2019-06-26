const { fetchArticleById } = require("../models/articles-model.js");

const sendArticleById = (req, res, next) => {
  console.log(req.params);
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

module.exports = { sendArticleById };
