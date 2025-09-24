const express = require('express');
const router = express.Router();
const driverController = require('../controllers/drivers');

router.post('/', driverController.createDriver);
router.get('/', driverController.getDrivers);
router.get('/:id', driverController.getDriver);
router.get('/:id/history', driverController.getDriverHistory);

module.exports = router;