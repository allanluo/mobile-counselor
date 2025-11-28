const router = require('express').Router();
const { isLoggedIn } = require('../middlewares/auth.middleware');
const profileController = require('../controllers/profile.controller');

router.use(isLoggedIn);

router.get('/', profileController.getProfile);
router.put('/', profileController.saveProfile);
router.delete('/', profileController.deleteProfile);

module.exports = router;
