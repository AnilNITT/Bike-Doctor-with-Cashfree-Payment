var express = require("express");
var multer = require("multer");
var fs = require("fs-extra");
const  { verifyToken } = require('../helper/verifyAuth');
var {
  addbanner,
  bannerlist,
  deletebanner,
  editbanner,
} = require("../controller/banner");
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
router.post("/addbanner",verifyToken, upload.single("images"),addbanner);
router.get("/bannerlist", bannerlist);
router.delete("/deletebanner", deletebanner);
router.put("/editbanner", editbanner);

module.exports = router;