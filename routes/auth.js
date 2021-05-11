const { Router } = require('express');

const router = Router();

const { registerCustomer, registerTechnician, loginCustomer, loginTechnician, forgotpasswordcustomer, forgotpasswordtechnician, resetpasswordcustomer, resetpasswordtechnician } = require('../controllers/auth');

router.route("/register-customer").post(registerCustomer);

router.route("/register-technician").post(registerTechnician);


router.route("/login-customer").post(loginCustomer);

router.route("/login-technician").post(loginTechnician);


router.route("/forgotpassword-customer").post(forgotpasswordcustomer);

router.route("/forgotpassword-technician").post(forgotpasswordtechnician);



router.route('/resetpasswordcustomer/:resetToken').put(resetpasswordcustomer);

router.route('/resetpasswordtechnician/:resetToken').put(resetpasswordtechnician);




module.exports = router;