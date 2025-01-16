const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("social_feed_db", "social_feed", "Hello@123", {
  host: "localhost",
  dialect: "mysql",
  port: 3306, // Disable logging for cleaner output
});

sequelize
  .authenticate()
  .then(() => console.log("Connected to MySQL database"))
  .catch((err) => console.error("Unable to connect to the database:", err));

module.exports = sequelize;
