const Post = require('../models/Post');
const User = require('../models/User');



// Create a post
exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id; // get from auth middleware

    // Save image path if file uploaded
    let imagePath = null;
    if (req.file) {
      imagePath = `/images/${req.file.filename}`;
    }

    const post = new Post({
      content,
      userId,
      image: imagePath, // save image path
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error(err); // This will show the real error in your backend console
    res.status(500).json({ error: err.message || "Failed to create post" });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.userId.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    post.content = content;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to update post" });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.userId.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete post" });
  }
};


exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({ message: "Already liked" });
    }

    post.likes.push(req.user.id);
    await post.save();

    res.status(200).json({ message: "Post liked" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ error: "Post not found" });

    post.likes = post.likes.filter((id) => id.toString() !== req.user.id);
    await post.save();

    res.status(200).json({ message: "Post unliked" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// backend/controllers/postController.js

exports.commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) return res.status(400).json({ error: "Comment cannot be empty" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const comment = {
      userId: req.user.id,
      text,
    };

    post.comments.push(comment);
    await post.save();

    res.status(200).json({ message: "Comment added", comment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTimeline = async (req, res) => {
  try {

    const currentUser = await User.findById(req.user.id);
    if (!currentUser) return res.status(404).json({ error: "User not found" });

    const followingIds = currentUser.following;



    const posts = await Post.find({
      userId: { $in: [...followingIds, req.user.id] },
    })
      .sort({ createdAt: -1 })
      .populate("userId", "username") // to get user names
      .populate("comments.userId", "username"); // to get commenter names

    res.status(200).json(posts);
  
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("userId", "username")
      .populate("comments.userId", "username");

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } 
};


exports.getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('userId', 'username')
      .populate('comments.userId', 'username');

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



