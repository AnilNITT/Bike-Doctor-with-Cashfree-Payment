var express = require("express");
var multer = require("multer");
var fs = require("fs-extra");

var {
  addAdditionalOption,
  additionalList,
  updateAdditional,
  deleteAdditional,
} = require("../controller/additionalOptionscontroller");
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
 
  }
})

const upload = multer({ 
  storage : storage,
  limits: {
      fileSize: 20*1048576,  // 20MB
  }
})


/* POST users listing. */
router.post("/addAdditionalOption", upload.single("images"),addAdditionalOption);
router.get("/additionalList", additionalList);
router.put("/updateAdditional", updateAdditional);
router.delete("/deleteAdditional", deleteAdditional);

module.exports = router;
