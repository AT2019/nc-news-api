exports.formatDate = list => {
  list.forEach(listItem => {
    listItem.created_at = new Date(listItem.created_at);
  });
  return list;
};

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};
