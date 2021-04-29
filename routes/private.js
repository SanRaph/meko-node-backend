const { Router } = require('express');
const router = Router();
const { getCustomerPrivateData } = require('../controllers/private');
const { protectCustomerRoute } = require('../middleware/auth');

router.route('/').get( protectCustomerRoute, getCustomerPrivateData );

module.exports = router;