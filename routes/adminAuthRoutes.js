var express = require('express');
var {suadminLogin,suadminsignup,getAllAdmin,deleteAdmin,subadminsignup} =  require('../controller/adminAuth');
const router = express.Router();


/* POST users listing. */
router.post('/suadminLogin', suadminLogin);
router.post('/subadminsignup', subadminsignup);
router.post('/suadminsignup', suadminsignup);
router.get('/getalladmin', getAllAdmin);
router.delete('/deleteadmin', deleteAdmin);


module.exports = router;
