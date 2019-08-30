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
      if (!article.length) {
        return Promise.reject({
          status: 404,
          msg: `No article found for id ${id}`
        });
      } else return article[0];
    });
};

const changeArticleById = (id, votes = 0, obj) => {
  return connection("articles")
    .where("articles.article_id", id)
    .increment("votes", votes)
    .returning("*")
    .then(article => {
      if (Object.keys(obj).length === 0 && !article.length === false) {
        return article[0];
      }
      if (!article.length === true) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else if (Object.keys(obj).length !== 1) {
        return Promise.reject({
          status: 400,
          msg: "Bad request"
        });
      } else if (
        Object.keys(obj).length >= 1 &&
        obj.hasOwnProperty("inc_votes") === false
      ) {
        return Promise.reject({ status: 400, msg: "Bad request" });
      }
      return article[0];
    });
};

const fetchArticles = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic,
  limit = 10,
  p = 1
) => {
  const offset = (p - 1) * limit;
  return connection
    .select("articles.*")
    .from("articles")
    .count("comments.comment_id as comment_count")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by, order)
    .limit(limit)
    .offset(offset)
    .modify(query => {
      if (author) {
        query.where("articles.author", author);
      } else if (topic) {
        query.where("articles.topic", topic);
      }
    })
    .then(articles => {
      const authorExists = author
        ? checkExists(author, "users", "username")
        : null;
      const topicExists = topic ? checkExists(topic, "topics", "slug") : null;
      return Promise.all([authorExists, topicExists, articles]);
    })
    .then(([authorExists, topicExists, articles]) => {
      if (authorExists === false) {
        return Promise.reject({
          status: 404,
          msg: `Author not found`
        });
      } else if (topicExists === false) {
        return Promise.reject({ status: 404, msg: `Topic not found` });
      } else return articles;
    });
};

const fetchAllArticlesCount = (topic, author) => {
  return connection
    .select("*")
    .from("articles")
    .modify(query => {
      if (topic) {
        query.where("articles.topic", topic);
      } else if (author) {
        query.where("articles.author", author);
      }
    })
    .returning("*")
    .then(articles => {
      return articles.length;
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

const removeArticleById = article_id => {
  return connection
    .delete()
    .from("articles")
    .where("article_id", article_id)
    .then(deleteCount => {
      if (!deleteCount) {
        return Promise.reject({
          status: 404,
          msg: `Article with id ${article_id} not found`
        });
      } else return deleteCount;
    });
};

const insertArticle = article => {
  return connection
    .insert(article)
    .returning("*")
    .from("articles")
    .then(article => {
      return article[0];
    });
};

// const countArticles = () => {
//   return connection
//     .select("article_id")
//     .from("articles")
//     .then(articles => articles.length);
// };

module.exports = {
  fetchArticleById,
  changeArticleById,
  fetchArticles,
  removeArticleById,
  insertArticle,
  fetchAllArticlesCount
};
