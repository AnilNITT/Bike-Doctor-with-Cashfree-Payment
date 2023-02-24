var express = require('express');
var multer = require('multer');
var fs = require('fs-extra');

var { addservice, servicelist, updateservice , deleteService, singleservice,servicelistarea} =  require('../controller/service');
const router = express.Router();

// set storage
const storage = multer.diskStorage({
    destination : function ( req , file , callback ){
        var path = `./images`;
        fs.mkdirsSync(path);
        //callback(null, 'uploads')
        callback(null, path);
    },
    filename : function (req, file , callback){
        // image.jpg
        var ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
        return callback(null, file.fieldname + '-' + Date.now() + ext)
        //callback(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
        //callback(null, file.originalname)
        // save file as original name
        // callback(null, file.originalname + ext)
    }
  })
  
  const upload = multer({ 
    storage : storage,
    limits: {
        fileSize: 10*1048576,  // 10MB
    }
  })



/* POST users listing. */
router.post('/addservice',upload.single("images"),addservice);
router.get('/servicelist',servicelist)
router.put('/updateservice',upload.fields([{ name: 'service_image', maxCount: 1}]),updateservice)
router.delete('/deleteService',deleteService)
router.get('/service/:id',singleservice)

router.get('/servicelistarea',servicelistarea)

module.exports = router;
