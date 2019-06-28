const connection = require("../db/connection.js");

const insertCommentToArticle = (
  id,
  commentUsername,
  commentBody,
  commentObj
) => {
  return connection
    .insert({
      author: commentUsername,
      body: commentBody,
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
      } else if (commentBody.length === 0) {
        return Promise.reject({ status: 400, msg: "Bad request" });
      } else if (commentBody.length === 0) {
        return Promise.reject({ status: 400, msg: "Bad request" });
      }
      return comment[0];
    });
};

const fetchCommentByArticleId = (id, sort_by) => {
  return connection
    .select("*")
    .from("comments")
    .leftJoin("articles", "articles.article_id", "comments.article_id")
    .groupBy("comments.comment_id", "articles.article_id")
    .where("articles.article_id", id)
    .orderBy(sort_by || "comments.created_at", "desc")
    .then(comments => {
      //   console.log(comments);
      if (!comments.length) {
        return Promise.reject({
          status: 400,
          msg: `No comment found for article id ${id}`
        });
      } else return comments;
    });
};

const changeCommentById = (comment_id, votes, obj) => {
  return connection("comments")
    .where("comments.comment_id", comment_id)
    .increment("votes", votes)
    .returning("*")
    .then(comment => {
      if (Object.keys(obj).length !== 1) {
        return Promise.reject({
          status: 400,
          msg: "Bad request"
        });
      } else if (obj.hasOwnProperty("inc_votes") === false) {
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
