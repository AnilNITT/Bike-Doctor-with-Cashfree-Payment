var express = require('express');
var multer = require('multer');
var fs = require('fs-extra');

var { customersignup, customerlist, deletecustomer, editcustomer,getcustomer,changeImage} =  require('../controller/customers');
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
      fileSize: 20*1048576,  // 20MB
  }
})

/* POST users listing. */
router.post('/customersignup',upload.single("images"), customersignup);
router.get('/customerlist',customerlist);
router.get('/customer/:id',getcustomer);
router.delete('/deletecustomer',deletecustomer);
router.put('/editcustomer/:id',editcustomer);
router.put('/editimage',upload.single("images"),changeImage);


//Uploading Single file
router.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    } else{
      console.log('file received');
      return res.send({
        success: true,
        data:file
      })
    }
  })
  
  
//Uploading multiple files
router.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
    const files = req.files
    if (!files) {
      const error = new Error('Please choose files')
      error.httpStatusCode = 400
      return next(error)
    }
    else{
        console.log('file received');
        return res.send({
          success: true,
          data:files
        })
      }
})

module.exports = router;


