exports.up = function(connection, Promise) {
  return connection.schema.createTable("comments", function(commentsTable) {
    commentsTable.increments("comment_id").primary();
    commentsTable.string("author").references("users.username");
    commentsTable.integer("article_id").references("articles.article_id");
    commentsTable.integer("votes").defaultsTo(0);
    commentsTable.timestamp("created_at");
    commentsTable.text("body");
  });
};

exports.down = function(connection, Promise) {
  return connection.schema.dropTable("comments");
};
