const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  indexNumber: {
    type: Number,
    required: true,
  },
  heading: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Education", "Food", "Medical", "Travel", "Movie"],
  },
  likes: {
    type: Array,
  },
});

module.exports = mongoose.model("Story", storySchema);
