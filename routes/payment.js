var express = require('express');
var multer = require('multer');
var fs = require('fs-extra');
const  { verifyToken } = require('../helper/verifyAuth');
const router = express.Router();
const {paymentRequest,GetAllPayment,Cashpayment,GetPayment,
        paymentResponse,paymentInvoices,payment,GetPaymentOrder,
        CashfreePayment,deletePayment,cashfreePayout, Payout,Returnurl} = require("../controller/payment")

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        var path = `./upload/payment`;
        fs.mkdirsSync(path);
        callback(null, path);
    },
    filename(req, file, callback) {
        callback(null, Date.now() + '_' + file.originalname);
    },
});
const upload = multer({ storage });

/* POST users listing. */
router.post('/paymentrequest',paymentRequest);
router.post('/paymentresponse',paymentResponse);
router.get('/Invoices',verifyToken,paymentInvoices);


router.post('/pay',verifyToken,payment);
router.post('/cash',verifyToken,Cashpayment);
router.post('/pay_order',verifyToken,GetPaymentOrder);
router.get('/getall',verifyToken,GetAllPayment);
router.get('/get/:id',verifyToken,GetPayment);
router.get('/cashfree',verifyToken,CashfreePayment);

router.get('/cashfreepayout',cashfreePayout);
router.post('/payout',Payout);

router.delete('/deletepayment',verifyToken,deletePayment);

router.get('/returnurl',Returnurl);

module.exports = router;