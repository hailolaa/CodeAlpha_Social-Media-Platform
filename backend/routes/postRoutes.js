const express = require('express');
const router = express.Router();
const { createPost,  updatePost,  deletePost , likePost, unlikePost, commentOnPost, getAllPosts, getTimeline , getPostsByUser } = require('../controllers/postController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload'); 

router.get('/all', auth, getAllPosts);
router.get('/timeline', auth, getTimeline);
router.get('/user/:userId', auth, getPostsByUser);
router.post('/', auth, upload.single('image'), createPost);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.post('/:id/like', auth, likePost);
router.post('/:id/unlike', auth, unlikePost);
router.post('/:id/comment', auth, commentOnPost);


module.exports = router;
