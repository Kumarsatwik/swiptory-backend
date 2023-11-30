const express = require("express");
const router = express.Router();
const {
  createPost,
  allPosts,
  getStoryDetails,
  likePost,
  editPost,
  categoryPost,
} = require("../controllers/postController");

const validToken = require("../middleware/validToken");

router.post("/create-post", validToken, createPost);
router.put("/edit-post/:postId", validToken, editPost);
router.get("/allposts", allPosts);
router.get("/category/:category", categoryPost);
router.post("/like/:id", validToken, likePost);
router.get("/getStory/:storyId", getStoryDetails);

module.exports = router;
