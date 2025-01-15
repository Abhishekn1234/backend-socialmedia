const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = require("./user");
const Post = require("./posts");

const Like = sequelize.define("Like", {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
  postId: {
    type: DataTypes.INTEGER,
    references: {
      model: Post,
      key: "id",
    },
  },
});

// Defining the relationships
User.hasMany(Like, { foreignKey: "userId", as: "likes" }); // A user can like many posts
Post.hasMany(Like, { foreignKey: "postId", as: "likes" }); // A post can have many likes

Like.belongsTo(User, { foreignKey: "userId", as: "user" }); // A like belongs to a user
Like.belongsTo(Post, { foreignKey: "postId", as: "post" }); // A like belongs to a post

module.exports = Like;
