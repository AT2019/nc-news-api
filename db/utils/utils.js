exports.formatDate = list => {
  list.map(listItem => {
    listItem.created_at = new Date(listItem.created_at);
  });
  return list;
};

exports.makeRefObj = list => {
  if (!list.length) return {};
  const refObj = {};
  list.forEach(listItem => {
    refObj[listItem.title] = listItem.article_id;
  });
  return refObj;
};

exports.formatComments = (commentData, articleRef) => {
  return commentData.map(comment => {
    let { created_by, belongs_to, created_at, ...restOfComment } = comment;
    const author = created_by;
    const article_id = articleRef[belongs_to];
    const newDate = new Date(created_at);
    created_at = newDate;
    return { author, created_at, article_id, ...restOfComment };
  });
};
