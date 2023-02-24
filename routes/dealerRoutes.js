var express = require('express');
var { addDealer, editDealer, dealerList, deleteDealer,singledealer } =  require('../controller/dealer');

const router = express.Router();

/* POST users listing. */
router.post('/addDealer', addDealer);
router.put('/editDealer', editDealer);
router.get('/dealerList', dealerList);
router.get('/dealer/:id', singledealer);
// router.post('/addDealer',upload.fields([{ name: 'image', maxCount: 1}]),addBike);
router.delete('/deleteDealer',deleteDealer); 


module.exports = router;
