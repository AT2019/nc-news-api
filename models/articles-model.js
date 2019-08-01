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

const checkExists = (value, table, column) => {
  return connection
    .select("*")
    .from(table)
    .where(column, value)
    .then(rows => {
      return rows.length !== 0;
    });
};

const fetchArticles = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic
  // limit = 10
) => {
  return (
    connection
      .select(
        "articles.author",
        "articles.title",
        "articles.body",
        "articles.article_id",
        "articles.topic",
        "articles.created_at",
        "articles.votes"
      )
      .from("articles")
      .count({ comment_count: "comment_id" })
      .leftJoin("comments", "comments.article_id", "=", "articles.article_id")

      .groupBy("articles.article_id")
      .orderBy(sort_by || "articles.created_at", order)
      // .offset(0)
      // .limit(limit)
      .modify(function(queryBuilder) {
        if (author && topic) {
          queryBuilder.where("articles.author", author);
        } else if (author) {
          queryBuilder.where("articles.author", author);
        } else if (topic) {
          queryBuilder.where("articles.topic", topic);
        }
      })
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
        }
        if (!articles) {
          return Promise.reject({ status: 404, msg: "Article not found" });
        } else return articles;
      })
  );
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

const insertArticle = articleObj => {
  return connection
    .insert({
      author: articleObj.author,
      title: articleObj.title,
      topic: articleObj.topic,
      body: articleObj.body
    })
    .into("articles")
    .returning("*")
    .then(article => {
      // if (Object.keys(articleObj).length !== 4) {
      //   return Promise.reject({
      //     status: 400,
      //     msg: "Bad request"
      //   });
      // } else
      if (articleObj.hasOwnProperty("author") === false) {
        return Promise.reject({ status: 400, msg: "Bad request" });
      } else if (articleObj.hasOwnProperty("title") === false) {
        return Promise.reject({ status: 400, msg: "Bad request" });
      } else if (articleObj.hasOwnProperty("topic") === false) {
        return Promise.reject({ status: 400, msg: "Bad request" });
      } else if (articleObj.hasOwnProperty("body") === false) {
        return Promise.reject({ status: 400, msg: "Bad request" });
      } else if (articleObj.length === 0) {
        return Promise.reject({ status: 400, msg: "Bad request" });
      }
      return article[0];
    });
};

const countArticles = () => {
  return connection
    .select("article_id")
    .from("articles")
    .then(articles => articles.length);
};

module.exports = {
  fetchArticleById,
  changeArticleById,
  fetchArticles,
  removeArticleById,
  insertArticle,
  countArticles
};
