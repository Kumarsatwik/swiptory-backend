const Story = require("../models/storyModel");
const Post = require("../models/postModel");
const User = require("../models/userModel");

// Create Post
const createPost = async (req, res, next) => {
  try {
    const { story } = req.body;
    // console.log(story);
    const storySlides = story.map((storyData, index) => {
      return new Story({
        indexNumber: index,
        heading: storyData.heading,
        description: storyData.description,
        image: storyData.image,
        category: storyData.category,
        likes: [],
      });
    });
    const newStory = await Story.create(storySlides);

    const newPost = new Post({
      story: newStory.map((slide) => slide._id),
      postedBy: req.user.id,
    });

    await newPost.save();

    res.status(201).json({ message: "Story created successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// UpdatePost
const editPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { story } = req.body;

    // console.log(postId);
    // console.log(story);

    const existingPost = await Post.findById({ _id: postId });

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    const updatedStory = await Promise.all(
      story.map(async (slide, index) => {
        const existingSlide = existingPost.story[index];

        if (!existingSlide) {
          return new Story({
            indexNumber: index,
            heading: slide.heading,
            description: slide.description,
            image: slide.image,
            category: slide.category,
            likes: [],
          });
        } else {
          const storyData = await Story.findById({
            _id: existingSlide.toString(),
          });
          storyData.indexNumber = index;
          storyData.heading = slide.heading;
          storyData.description = slide.description;
          storyData.image = slide.image;
          storyData.category = slide.category;
          return storyData.save();
        }
      })
    );
    // existingPost.story = updatedStory.map((slide) => slide._id);
    await existingPost.save();

    res.status(201).json({ message: "Post updated successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// All Posts
const allPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    const postWithStory = [];

    for (const post of posts) {
      const num_of_story = post.story.length;
      const storyList = [];
      let category = "";
      for (let i = 0; i < num_of_story; i++) {
        const story = await Story.findById(post.story[i]);
        if (category == "") {
          category = story.category;
        }
        storyList.push(story);
      }
      // console.log(category);
      postWithStory.push({
        category,
        post: { id: post.id, postedBy: post.postedBy },
        storyList,
      });
    }
    // console.log(postWithStory);
    const data = [];
    const categoryList = Array.from(
      new Set(postWithStory.map((post) => post.category))
    );

    for (const post of postWithStory) {
      const existingCategory = data.find(
        (categoryData) => categoryData.category === post.category
      );

      if (existingCategory) {
        existingCategory.posts.push({
          postId: post.post.id,
          postedBy: post.post.postedBy,
          story: post.storyList,
        });
      } else {
        data.push({
          category: post.category,
          posts: [
            {
              postId: post.post.id,
              postedBy: post.post.postedBy,
              story: post.storyList,
            },
          ],
        });
      }
    }

    // console.log(data);

    res.json({ posts: data });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// category Post
const categoryPost = async (req, res, next) => {
  try {
    const { category } = req.params;
    const posts = await Post.find({}).populate({
      path: "story",
      match: { category: category },
    });
    const filteredPosts = posts.filter((post) =>
      post.story.some((story) => story !== null)
    );
    console.log(filteredPosts);
    res.status(200).json(filteredPosts);
    // res.status(200).json(posts);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Like Post
const likePost = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id);
    const user = req.user.id;
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    const exisitingLike = story.likes.find((like) => like.user === user);

    if (exisitingLike) {
      story.likes = story.likes.filter((like) => like.user != user);
      await story.save();
      return res.status(400).json({ message: "Disliked post" });
    }
    story.likes.push({ user });
    await story.save();

    res.status(200).json({ message: "Post Liked" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// get Stoy Details
const getStoryDetails = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    res.status(200).json(story);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createPost,
  editPost,
  categoryPost,
  allPosts,
  getStoryDetails,
  likePost,
};
