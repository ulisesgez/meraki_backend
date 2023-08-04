const express = require('express');
const dbController = require('../controllers/dbController');

const router = express.Router();

router.get('/insert-meraki-organizations', dbController.insertMerakiOrganizations);
router.get('/insert-meraki-networks', dbController.insertMerakiNetworks);
router.get('/insert-meraki-devices', dbController.insertMerakiDevices);

module.exports = router;
