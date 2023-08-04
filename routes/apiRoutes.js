const express = require('express');
const router = express.Router();
const controllers = require('../controllers/apiControllers');

router.get('/organizations', controllers.getOrganizations);
router.get('/organizations/:orgId/networks', controllers.getOrganizationNetworks);
router.get('/organizations/:orgId/allDevices', controllers.getOrganizationAllDevices);
router.get('/organizations/:orgId/devices', controllers.getOrganizationDevices);
router.get('/organizations/:orgId/clients/search', controllers.searchClients);

module.exports = router;