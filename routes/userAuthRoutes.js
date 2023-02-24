var express = require('express');
var {userLogin, otpVerify,forgetPassword,passwordUpdate,resendOtp,changePassword} =  require('../controller/userAuthController');
const router = express.Router();

/* POST users listing. */
router.post('/userLogin', userLogin);
router.post('/otpVerify', otpVerify);
router.post('/forgetPassword',forgetPassword);
router.post('/passwordUpdate',passwordUpdate);
router.post('/resendOtp',resendOtp);
router.post('/changePassword',changePassword);
module.exports = router;