const connection = require("../db/connection.js");

const checkExists = (value, table, column) => {
  return connection
    .select("*")
    .from(table)
    .where(column, value)
    .then(rows => {
      return rows.length !== 0;
    });
};

const insertCommentToArticle = (id, commentObj) => {
  return connection
    .insert({
      author: commentObj.username,
      body: commentObj.body,
      article_id: id
    })
    .into("comments")
    .where("articles.article_id", id)
    .returning("*")
    .then(comment => {
      if (Object.keys(commentObj).length !== 2) {
        return Promise.reject({
          status: 400,
          msg: "Bad request"
        });
      } else if (commentObj.hasOwnProperty("username") === false) {
        return Promise.reject({ status: 400, msg: "Bad request" });
      } else if (commentObj.hasOwnProperty("body") === false) {
        return Promise.reject({ status: 400, msg: "Bad request" });
      } else if (commentObj.body.length === 0) {
        return Promise.reject({ status: 400, msg: "Bad request" });
      }
      return comment[0];
    });
};

const fetchCommentByArticleId = (
  id,
  sort_by = "created_at",
  order = "desc"
) => {
  return connection
    .select(
      "comments.comment_id",
      "comments.body",
      "comments.votes",
      "comments.created_at",
      "comments.author"
    )
    .from("comments")
    .leftJoin("articles", "articles.article_id", "comments.article_id")
    .groupBy("comments.comment_id", "articles.article_id")
    .where("articles.article_id", id)
    .orderBy(sort_by || "comments.created_at", order)
    .then(comments => {
      const articleIdExists = id
        ? checkExists(id, "articles", "article_id")
        : null;
      return Promise.all([articleIdExists, comments]);
    })
    .then(([articleIdExists, comments]) => {
      if (articleIdExists === false) {
        return Promise.reject({
          status: 404,
          msg: `Article with id ${id} not found`
        });
      }
      if (!Number(id)) {
        return Promise.reject({
          status: 400,
          msg: "Bad request"
        });
      }
      return comments;
    });
};

const changeCommentById = (comment_id, votes = 0, obj) => {
  return connection("comments")
    .where("comments.comment_id", comment_id)
    .increment("votes", votes)
    .returning("*")
    .then(comment => {
      if (!comment.length === true) {
        return Promise.reject({
          status: 404,
          msg: `Comment with id ${comment_id} not found`
        });
      }
      if (Object.keys(obj).length > 1) {
        return Promise.reject({
          status: 400,
          msg: "Bad request"
        });
      } else if (
        Object.keys(obj).length >= 1 &&
        obj.hasOwnProperty("inc_votes") === false
      ) {
        return Promise.reject({ status: 400, msg: "Bad request" });
      } else if (!comment) {
        return Promise.reject({
          status: 404,
          msg: `Comment with id ${comment_id} not found`
        });
      } else return comment[0];
    });
};

const removeCommentById = comment_id => {
  return connection
    .delete()
    .from("comments")
    .where("comment_id", comment_id)
    .then(deleteCount => {
      if (!deleteCount) {
        return Promise.reject({
          status: 404,
          msg: `Comment with id ${comment_id} not found`
        });
      } else return deleteCount;
    });
};

module.exports = {
  insertCommentToArticle,
  fetchCommentByArticleId,
  changeCommentById,
  removeCommentById
};
