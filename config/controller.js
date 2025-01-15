const db = require("./database");


const getAllPosts = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT posts.id, posts.username, posts.content, posts.likes,
        JSON(comments.comment) AS comments
      FROM posts
      LEFT JOIN comments ON posts.id = comments.post_id
      GROUP BY posts.id;
    `;
    db.query(query, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};


const addPost = (username, content) => {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO posts (username, content) VALUES (?, ?)";
    db.query(query, [username, content], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};
const addComment = (postId, comment) => {
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO comments (post_id, comment) VALUES (?, ?)";
      db.query(query, [postId, comment], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  };
const likePost = (id) => {
  return new Promise((resolve, reject) => {
    const query = "UPDATE posts SET likes = likes + 1 WHERE id = ?";
    db.query(query, [id], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

module.exports = { getAllPosts, addPost, likePost,addComment };
