const router = require('express').Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { createUser, updateUser, getUser } = require('../controllers/userController');

router.post('/', createUser);
router.put('/:id', verifyToken, updateUser);
router.get('/:id', verifyToken, getUser);

module.exports = router;
