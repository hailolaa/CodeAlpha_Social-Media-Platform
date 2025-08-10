const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserById, followUser ,updateUser, searchUsers} = require('../controllers/userController');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get("/search", searchUsers);
router.post('/:id/follow', followUser);
router.get('/:id', getUserById);
router.put('/:id', auth, upload.single('profileImg'), updateUser);






module.exports = router;
