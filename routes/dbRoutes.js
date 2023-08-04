const express = require('express');
const router = express.Router();
const organizationsController = require('../controllers/dbControllers');

router.get('/organizations', organizationsController.getOrganizations);

module.exports = router;