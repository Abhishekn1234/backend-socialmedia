const express = require("express");
const router = express.Router();
const upload = require("./upload");
const User = require("../models/user");
const Post = require("../models/posts");
const Comment = require("../models/comments");
const Like = require("../models/like");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password });
    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", err });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const isValid = await user.isValidPassword(password);
    if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, "your_secret_key", { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", err });
  }
});

// Create Post (with image upload)
router.post("/posts", upload.single("image"), async (req, res) => {
  const { userId, content } = req.body;
  const mediaUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const newPost = await Post.create({ userId, content, mediaUrl });
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: "Unable to create post", err });
  }
});


router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          as: "user", // Assuming "user" is the alias defined in the associations
          attributes: ["username"],
        },
        {
          model: Like,
          as: "likes", // Assuming "likes" is the alias defined in the associations
          include: [
            {
              model: User, // Here, ensure that the "User" model is correctly referenced
              as: "user",  // Assuming "user" is the alias used in the Like model association
              attributes: ["username"]
            }
          ],
        },
        {
          model: Comment,
          as: "comments", // Assuming "comments" is the alias defined in the associations
          include: [
            {
              model: User, // Same here: ensure "User" is properly referenced
              as: "user",  // Assuming "user" is the alias in the Comment model association
              attributes: ["username"]
            }
          ],
        },
      ],
    });

    console.log(posts);
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Unable to fetch posts", err });
  }
});




router.post("/like/:postId", async (req, res) => {
  const { userId } = req.body;
  const { postId } = req.params;

  try {
    const existingLike = await Like.findOne({ where: { userId, postId } });

    if (existingLike) {
      await existingLike.destroy();
      await Post.decrement("likesCount", { by: 1, where: { id: postId } });
      res.json({ message: "Post unliked" });
    } else {
      await Like.create({ userId, postId });
      await Post.increment("likesCount", { by: 1, where: { id: postId } });
      res.json({ message: "Post liked" });
    }
  } catch (err) {
    res.status(500).json({ message: "Unable to toggle like", err });
  }
});


router.post("/comment/:postId", async (req, res) => {
  const { userId, content } = req.body;
  const { postId } = req.params;

  try {
    const newComment = await Comment.create({ userId, postId, content });
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ message: "Unable to add comment", err });
  }
});

module.exports = router;
