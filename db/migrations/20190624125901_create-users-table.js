exports.up = function(connection, Promise) {
  return connection.schema.createTable("users", function(usersTable) {
    usersTable.string("username").primary();
    usersTable.string("name").notNullable();
    usersTable.string("avatar_url");
  });
};

exports.down = function(connection, Promise) {
  return connection.schema.dropTable("users");
};
