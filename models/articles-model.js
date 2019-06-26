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
      console.log(article);
      if (!article.length) {
        return Promise.reject({
          status: 400,
          msg: `No article found for id ${id}`
        });
      } else return article[0];
    });
};

// const fetchArticleById = id => {
//     return connection
//       .select("*")
//       .from("articles")
//       .join("comments", "comments.article_id", "=", "articles.article_id")
//       .count({ comment_count: "comments.article_id" })
//       .where("articles.article_id", id)
//       .groupBy(
//         "articles.author",
//         "title",
//         "articles.article_id",
//         "articles.body",
//         "topic",
//         "articles.created_at",
//         "articles.votes",
//         "comments.comment_id"
//       )
//       .then(article => {
//         if (!article.length) {
//           return Promise.reject({
//             status: 400,
//             msg: `No article found for id ${id}`
//           });
//         } else return article[0];
//       });
//   };

module.exports = { fetchArticleById };
