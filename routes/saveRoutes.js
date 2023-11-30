const express = require("express");
const router = express.Router();
const validToken = require("../middleware/validToken");

const {
  addBookmark,
  removeBookmark,
  showBookmarks,
} = require("../controllers/savePostController");

router.post("/:post_id", validToken, addBookmark);
router.post("/remove", validToken, removeBookmark);
router.get("/show", validToken, showBookmarks);

module.exports = router;
