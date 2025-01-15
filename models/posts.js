const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("social_feed_db", "social_feed", "Hello@123", {
  host: "localhost",
  dialect: "mysql",
});

const User = require("./user"); // Ensure the path is correct

// Define Post model
const Post = sequelize.define("Post", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  mediaUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  likesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
});

// Define associations
User.hasMany(Post, { foreignKey: "userId", as: "posts" }); // A user has many posts
Post.belongsTo(User, { foreignKey: "userId", as: "user" }); // A post belongs to a user

module.exports = Post;
