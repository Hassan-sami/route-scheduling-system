const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/schedule');

router.get('/', scheduleController.getSchedule);
router.post('/assign', scheduleController.assignDriver);
router.post('/complete', scheduleController.completeRoute);

module.exports = router;