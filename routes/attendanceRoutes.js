const router = require('express').Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { attend, monthSummary, analysis, history } = require('../controllers/attendanceController');

router.post('/', verifyToken, attend);
router.get('/summary/:user_id', verifyToken, monthSummary);
router.post('/analysis', verifyToken, analysis);
router.get('/history/:user_id', verifyToken, history);

module.exports = router;
