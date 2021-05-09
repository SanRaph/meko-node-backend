const { Router } = require('express');

const router = Router();

const { registerCustomer, registerTechnician, loginCustomer, loginTechnician, forgotpasswordcustomer, forgotpasswordtechnician, resetpassword, } = require('../controllers/auth');

router.route("/registerCustomer").post(registerCustomer);

router.route("/registerTechnician").post(registerTechnician);


router.route("/loginCustomer").post(loginCustomer);

router.route("/loginTechnician").post(loginTechnician);


router.route("/forgotpasswordCustomer").post(forgotpasswordcustomer);

router.route("/forgotpasswordTechnician").post(forgotpasswordtechnician);



router.route('/resetpassword/:resetToken').post()




module.exports = router;