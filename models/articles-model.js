const connection = require("../db/connection.js");

const fetchArticleById = id => {
  return connection
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "comments.article_id", "=", "articles.article_id")
    .groupBy("articles.article_id")
    .where("articles.article_id", id)
    .then(article => {
      console.log(article[0]);
      if (!article.length) {
        return Promise.reject({
          status: 404,
          msg: `No article found for id ${id}`
        });
      } else return article[0];
    });
};

const changeArticleById = (id, votes, obj) => {
  return connection("articles")
    .where("articles.article_id", id)
    .increment("votes", votes)
    .returning("*")
    .then(article => {
      if (!article.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else if (Object.keys(obj).length !== 1) {
        return Promise.reject({
          status: 400,
          msg: "Bad request"
        });
      } else if (obj.hasOwnProperty("inc_votes") === false) {
        return Promise.reject({ status: 400, msg: "Bad request" });
      }
      // console.log(article[0]);
      return article[0];
    });
};

const fetchArticles = (sort_by, query, author, topic) => {
  return connection
    .select(
      "articles.author",
      "articles.title",
      "articles.article_id",
      "articles.topic",
      "articles.created_at",
      "articles.votes"
    )
    .from("articles")
    .count({ comment_count: "comment_id" })
    .join("comments", "comments.article_id", "=", "articles.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by || "articles.created_at", "desc")
    .modify(query => {
      if ((author, topic)) query.where({ articles: author, articles: topic });
    })
    .then(articles => {
      const authorExists = author
        ? checkExists(author, "articles", "author")
        : null;
      const topicExists = topic
        ? checkExists(topic, "articles", "topic")
        : null;
      return Promise.all([authorExists, topicExists, articles]).then(
        ([authorExists, topicExists, article]) => {
          if (authorExists === false) {
            return Promise.reject({ status: 404, msg: "Author not found" });
          } else if (topicExists === false) {
            return Promise.reject({ status: 404, msg: `${Topic} not found` });
          } else if (article.length === 0) {
            return Promise.reject({
              status: 404,
              msg: `Article with id ${9999} not found`
            });
          }
          // console.log(articles);
          return articles;
        }
      );
    });
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

module.exports = { fetchArticleById, changeArticleById, fetchArticles };
