const router = require('express').Router();
const { isLoggedIn } = require('../middlewares/auth.middleware');
const readinessController = require('../controllers/readiness.controller');

router.use(isLoggedIn);

router.get('/', readinessController.getReadiness);
router.put('/', readinessController.saveReadiness);

module.exports = router;
