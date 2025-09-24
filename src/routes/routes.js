const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routes');

router.post('/', routeController.createRoute);
router.get('/', routeController.getRoutes);
router.get('/:id', routeController.getRoute);

module.exports = router;