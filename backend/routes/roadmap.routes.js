const router = require('express').Router();
const { isLoggedIn } = require('../middlewares/auth.middleware');
const roadmapController = require('../controllers/roadmap.controller');

// All routes require authentication
router.use(isLoggedIn);

router.get('/', roadmapController.getTasks);
router.post('/', roadmapController.createTask);
router.put('/bulk', roadmapController.replaceTasks);
router.put('/:id', roadmapController.updateTask);
router.delete('/:id', roadmapController.deleteTask);

module.exports = router;
