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
        const authorExist = author
          ? checkExists(author, "users", "username")
          : null;
        const topicExist = topic ? checkExists(topic, "topics", "slug") : null;
        return Promise.all([authorExist, topicExist, articles]);
      })
      .then(([authorExist, topicExist, articles]) => {
        if (authorExist === false) {
          return Promise.reject({ status: 404, msg: "Author not found" });
        } else if (topicExist === false) {
          return Promise.reject({ status: 404, msg: "Topic not found" });
        } else {
          res.status(200).send({ articles });
        }
      })
      .catch(next);
};

const checkExists = (value, table, column) => {
  return connection
    .select("*")
    .from(table)
    .where(column, value)
    .then(rows => {
      return rows.length !== 0;
    });
};

module.exports = { sendArticleById, updateArticleById, sendArticles };
