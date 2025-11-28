const router = require('express').Router();
const { isLoggedIn } = require('../middlewares/auth.middleware');
const essayController = require('../controllers/essay.controller');

router.use(isLoggedIn);

router.get('/', essayController.listEssays);
router.post('/', essayController.createEssay);
router.put('/:id', essayController.updateEssay);
router.delete('/:id', essayController.deleteEssay);

module.exports = router;
