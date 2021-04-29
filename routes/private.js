const { Router } = require('express');
const router = Router();
const { getCustomerPrivateData, getTechnicianPrivateData } = require('../controllers/private');
const { protectCustomerRoute, protectTechnicianRoute } = require('../middleware/auth');

router.route('/customerPrivateData').get( protectCustomerRoute, getCustomerPrivateData );

router.route('/technicianPrivateData').get( protectTechnicianRoute, getTechnicianPrivateData );

module.exports = router;

