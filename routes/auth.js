const { Router } = require('express');

const router = Router();

const { registerCustomer, registerTechnician, loginCustomer, loginTechnician, forgotpassword, resetpassword, } = require('../controllers/auth');

router.route("/registerCustomer").post(registerCustomer);

router.route("/registerTechnician").post(registerTechnician);


router.route("/loginCustomer").post(loginCustomer);

router.route("/loginTechnician").post(loginTechnician)




router.route('/forgotpassword').post()



router.route('/resetpassword/:resetToken').post()




module.exports = router;