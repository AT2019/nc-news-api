exports.formatDate = list => {
  list.forEach(listItem => {
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
  commentData.forEach(comment => {
    comment.created_at = new Date(comment.created_at);
  });
  commentData.forEach(function(obj) {
    obj.author = obj.created_by;
    delete obj.created_by;
  });
  return commentData.map(comment => {
    const { belongs_to, ...restOfComment } = comment;
    const article_id = articleRef[belongs_to];
    // console.log({ article_id, ...restOfComment });
    return { article_id, ...restOfComment };
  });
};
