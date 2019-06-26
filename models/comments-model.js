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
      console.log(comment[0]);
      return comment[0];
    });
};

module.exports = { insertCommentToArticle };
