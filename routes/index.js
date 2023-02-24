const express = require('express');
const  { verifyToken } = require('../helper/verifyAuth');
const router = express.Router();


const genrateToken = require('./tokenRoute');
const adminauth = require('./adminAuthRoutes');
// const employee = require('./employeeRoutes');
const customers = require('./customerRoutes');
const service = require('./serviceRoutes');
const servicefeature = require('./servicefeatureRoute');
const bikes = require('./bikeRoutes');
const locations = require('./locationsRoutes');
const dealers = require('./dealerRoutes');
const userauth = require('./userAuthRoutes');
const banner = require('./bannerRoutes');
const offer = require('./offerRoutes');
const additionalOption = require('./additionalOptionsRoute');
const servicesalientfeature = require("./service_Salient_feature_Route")
const booking = require("./bookingRoutes")
const tracking = require("./trackingRoute")
const payment = require("./payment")
const statencity = require("./StatenCity")
const bank = require("./bankroute")
const dealerauth = require("./dealerAuthRoutes");


// User App Admin
router.use('/tokenGenrate',genrateToken);
router.use('/adminauth',verifyToken,adminauth);
// router.use('/employee',verifyToken,employee);
router.use('/customers',verifyToken,customers);
router.use('/service',verifyToken,service);
router.use('/servicefeature',verifyToken,servicefeature);
router.use('/servicesalientfeature',verifyToken,servicesalientfeature);
router.use('/bike',verifyToken,bikes);
router.use('/locations',verifyToken,locations);
router.use('/dealer',verifyToken,dealers);
router.use('/userAuth',verifyToken, userauth);
router.use('/banner',banner);
router.use('/offer',verifyToken,offer);
router.use('/additionalOptions',verifyToken,additionalOption);
router.use('/bookings',verifyToken,booking);
router.use('/trackings',verifyToken,tracking);
//router.use('/payment',verifyToken,payment);
router.use('/payment',payment);
router.use('/statencity',verifyToken,statencity);
router.use('/bank',verifyToken,bank);


// Provider APP
router.use('/dealerAuth',verifyToken,dealerauth);


module.exports = router;

