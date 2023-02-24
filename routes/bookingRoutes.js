var express = require('express');
var multer = require('multer');
var fs = require('fs-extra');
const router = express.Router();
const { 
    addbooking, 
    getallbookings, 
    getbooking, 
    deletebooking, 
    getuserbookings,
    updatebooking,
} = require("../controller/booking")

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        var path = `./upload/booking`;
        fs.mkdirsSync(path);
        callback(null, path);
    },
    filename(req, file, callback) {
        callback(null, Date.now() + '_' + file.originalname);
    },
});
const upload = multer({ storage });

/* POST users listing. */
router.post('/addbooking/:id',addbooking)
router.get('/getallbookings',getallbookings)
router.get('/getuserbookings/:id',getuserbookings)
router.get('/getbooking/:id',getbooking)
router.delete('/deletebooking',deletebooking)
router.put('/updatebooking/:id',updatebooking)



module.exports = router;
