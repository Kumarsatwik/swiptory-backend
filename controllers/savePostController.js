const User = require("../models/userModel");
const Post = require("../models/postModel");
const Story = require("../models/storyModel");

const addBookmark = async (req, res, next) => {
  const { post_id } = req.params;
  const user_id = req.user.id;

  try {
    const foundPost = await User.findOne({ _id: user_id });

    if (!foundPost) {
      return res.status(400).json({ message: "User not found" });
    }

    const foundBookmark = foundPost.bookmarks.find((bookmark) => bookmark == post_id);

    if (foundBookmark) {
      foundPost.bookmarks = foundPost.bookmarks.filter((bookmark) => bookmark != post_id);
      await foundPost.save();
      return res.status(200).json({ message: "Bookmark removed" });
    }

    foundPost.bookmarks.push(post_id);
    await foundPost.save();
    return res.status(200).json({ message: "Bookmark added" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


const removeBookmark = async (req, res, next) => {
  const { post_id } = req.body;
  const user_id = req.user.id;
  try {
    const foundPost = await User.findOne({ _id: user_id });
    if (!foundPost) {
      return res.status(400).json({ message: "User not found" });
    }
    const foundBookmark = foundPost.bookmarks.find((bookmark) => {
      return bookmark == post_id;
    });
    if (foundBookmark) {
      return res.status(400).json({ message: "Already Bookmark" });
    }
    foundPost.bookmarks = foundPost.bookmarks.filter((bookmark) => {
      return bookmark != post_id;
    });
    await foundPost.save();
    res.status(200).json({ message: "Bookmark removed" });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const showBookmarks = async (req, res, next) => {
  const user = req.user.id;
  try {
    const savedPosts = await User.findById({ _id: user });
    if (!savedPosts) {
      return res.status(404).json({ error: "User not found" });
    }

    const stories = [];
    for (const bookmark of savedPosts.bookmarks) {
      const liststory = await Story.findById(bookmark);
      stories.push(liststory);
    }
    res.status(200).json({ stories });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  addBookmark,
  removeBookmark,
  showBookmarks,
};
