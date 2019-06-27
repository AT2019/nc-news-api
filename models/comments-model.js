const connection = require("../db/connection.js");

const insertCommentToArticle = (id, commentUsername, commentBody) => {
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
      //   console.log(comment[0]);
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
    .orderBy(sort_by || "comments.comment_id", "asc")
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

const changeCommentById = (comment_id, votes) => {
  return connection("comments")
    .where("comments.comment_id", comment_id)
    .increment("votes", votes)
    .returning("*")
    .then(comment => {
      //   console.log(comment);
      if (!votes) {
        return Promise.reject({
          status: 400,
          msg: `Bad request`
        });
      }
      return comment[0];
    });
};

const removeCommentById = comment_id => {
  return connection
    .delete()
    .from("comments")
    .where("comment_id", comment_id)
    .then(deleteCount => {
      //   console.log(deleteCount);
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
