const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashed });
  res.json(user);
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); // <-- use env secret
    res.json({ token, user });
  } else {
    res.status(401).json({ msg: 'Invalid credentials' });
  }
};



// controllers/userController.js

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('followers', 'username email')
      .populate('following', 'username email');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Get User Error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.followUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const { currentUserId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(targetUserId) || !mongoose.Types.ObjectId.isValid(currentUserId)) {
      return res.status(400).json({ msg: 'Invalid user ID(s)' });
    }
    if (targetUserId === currentUserId) {
      return res.status(400).json({ msg: "You can't follow yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const isFollowing = targetUser.followers.some(id => id.toString() === currentUserId);

    if (isFollowing) {
      // Unfollow
      targetUser.followers.pull(currentUserId);
      currentUser.following.pull(targetUserId);
      await targetUser.save();
      await currentUser.save();
      return res.json({ msg: 'Unfollowed user' });
    } else {
      // Follow
      if (!targetUser.followers.includes(currentUserId)) {
        targetUser.followers.push(currentUserId);
      }
      if (!currentUser.following.includes(targetUserId)) {
        currentUser.following.push(targetUserId);
      }
      await targetUser.save();
      await currentUser.save();
      return res.json({ msg: 'Followed user' });
    }
  } catch (error) {
    console.error('Follow route error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};





exports.updateUser = async (req, res) => {
  try {
    const { username, email, bio, location } = req.body;
    const userId = req.params.id;

    // Build update data object
    const updateData = { username, email, bio, location };

    // If an image was uploaded, set profileImg to filename only
    if (req.file) {
      updateData.profileImg = `/images/${req.file.filename}`;
    }
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
};





exports.searchUsers = async (req, res) => {
  try {
    const query = req.query.q;

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
      ]
    }).select("username name profileImage");

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search error" });
  }
};




