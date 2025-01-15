const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("social_feed_db", "social_feed", "Hello@123", {
  host: "localhost",
  dialect: "mysql",
  logging: false, // Disable logging for cleaner output
});
const postRoutes = require("./routes/posts");
const userRoutes=require('./routes/user');
const cors=require('cors');
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/user", postRoutes);
app.get('/',async(req,res)=>{
  res.redirect('/user/posts');
})
const PORT = 5000;

sequelize.sync({ alter: true }).then(() => {
  console.log("Database synchronized");
  app.listen(5000, () => {
    console.log("Server is running on port 5000");
  });
});