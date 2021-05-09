const { Router } = require('express');
const router = Router();
const { getCustomerPrivateData, getTechnicianPrivateData } = require('../controllers/private');
const { protectCustomerRoute, protectTechnicianRoute } = require('../middleware/auth');

router.route('/customer-private-data').get( protectCustomerRoute, getCustomerPrivateData );

router.route('/technician-private-data').get( protectTechnicianRoute, getTechnicianPrivateData );

module.exports = router;

