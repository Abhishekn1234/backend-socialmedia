const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = require("./user");
const Post = require("./posts");

const Comment = sequelize.define("Comment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postId: {
    type: DataTypes.INTEGER,
    references: {
      model: Post,
      key: "id",
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
});

// Defining the relationships
Post.hasMany(Comment, { foreignKey: "postId", as: "comments" }); // A post can have many comments
User.hasMany(Comment, { foreignKey: "userId", as: "comments" }); // A user can write many comments

Comment.belongsTo(User, { foreignKey: "userId", as: "user" }); // A comment belongs to a user
Comment.belongsTo(Post, { foreignKey: "postId", as: "post" }); // A comment belongs to a post

module.exports = Comment;
