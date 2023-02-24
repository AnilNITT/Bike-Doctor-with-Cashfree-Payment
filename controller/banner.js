require("dotenv").config();
const Banner = require("../models/banner_model");
const jwt_decode = require("jwt-decode");
const sharp = require('sharp');
sharp.cache(false);

// Add Banner
async function addbanner(req, res) {
  try {
    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    const user_type = data.user_type;
    if (user_id == null || user_type != 1 && user_type != 3) {
      var response = {
        status: 401,
        message: "admin is un-authorised !",
      };
      return res.status(401).send(response);
    }

    const { name } = req.body;

    if(req.file){

      let buffer = await sharp(req.file.path)
      .resize(1000, 1000, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .toBuffer();
    await sharp(buffer).toFile(req.file.path);

      const data = {
            banner_image: req.file.filename,
            name: name,
          };

      const bannerresponce = await Banner.create(data);
      
      if (bannerresponce) {
             var response = {
               status: 200,
               message: "banner added successfully",
               // image_base_url: process.env.BASE_URL,
             };
             return res.status(200).send(response);
           } else {
             var response = {
               status: 201,
               message: "Unable to add banner",
             };
             return res.status(201).send(response);
           }
    } else {
        var response = {
           status: 201,
           message: "please upload banner image",
        };
        return res.status(201).send(response);
      }
  } catch (error) {
    console.log("error", error);
    response = {
      status: 201,
      message: "Operation was not successful",
    };

    return res.status(201).send(response);
  }
}


async function bannerlist(req, res) {
  try {
    
    var manufactureResposnse = await Banner.find().sort( { "_id": -1 } );
    //console.log("manufactureResposnse: ", manufactureResposnse);

    var response = {
      status: 200,
      message: "success",
      data: manufactureResposnse,
      image_base_url: process.env.BASE_URL,
    };
    return res.status(200).send(response);
  } catch (error) {
    console.log("error", error);
    response = {
      status: 201,
      message: "Operation was not successful",
    };

    return res.status(201).send(response);
  }
}


async function deletebanner(req, res) {
  try {
    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    const user_type = data.user_type;
    const type = data.type;
    if (user_id == null || user_type != 1) {
      if(user_type === 3 ){
        var response = {
          status: 201,
          message: "SubAdmin is un-authorised !",
        };
        return res.status(201).send(response);
      } else {
        var response = {
          status: 401,
          message: "Admin is un-authorised !",
        };
        return res.status(401).send(response);
      }
    }

    const { banner_id } = req.body;
    const manufactureRes = await Banner.findOne({ _id: banner_id });
    if (manufactureRes) {
    Banner.findByIdAndDelete({ _id: banner_id }, async function (err, docs) {
        if (err) {
          var response = {
            status: 201,
            message: "employee delete failed",
          };
          return res.status(201).send(response);
        } else {
          var response = {
            status: 200,
            message: "banner deleted successfully",
          };
          return res.status(200).send(response);
        }
      });
    } else {
      var response = {
        status: 201,
        message: "banner not Available",
      };

      return res.status(201).send(response);
    }
  } catch (error) {
    console.log("error", error);
    response = {
      status: 201,
      message: "Operation was not successful",
    };
    return res.status(201).send(response);
  }
}


async function editbanner(req, res) {
  try {
    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    const user_type = data.user_type;
    const type = data.type;
if (user_id == null || user_type != 1) {
            if(user_type === 3 ){
              var response = {
                status: 201,
                message: "SubAdmin is un-authorised !",
              };
              return res.status(201).send(response);
            } else {
              var response = {
                status: 401,
                message: "Admin is un-authorised !",
              };
              return res.status(401).send(response);
            }
          }
    const { banner_id, name, bannertype, banner_image } = req.body;
    const bannerRes = await Banner.findOne({ _id: banner_id });

    if (bannerRes) {
      const data = {
        name: name,
        bannertype: bannertype,
        banner_image: banner_image,
        //update_dt: new Date,
      };
      Banner.findByIdAndUpdate(
        { _id: banner_id },
        { $set: data },
        { new: true },
        async function (err, docs) {
          if (err) {
            var response = {
              status: 201,
              message: err,
            };
            return res.status(201).send(response);
          } else {
            var response = {
              status: 200,
              message: "banner updated successfully",
              data: docs,
              image_base_url: process.env.BASE_URL,
            };
            return res.status(200).send(response);
          }
        }
      );
    } else {
      response = {
        status: 201,
        message: "banner not available",
      };
      return res.status(201).send(response);
    }
  } catch (error) {
    console.log("error", error);
    response = {
      status: 201,
      message: "Operation was not successful",
    };
    return res.status(201).send(response);
  }
}

module.exports = {
  addbanner,
  bannerlist,
  deletebanner,
  editbanner,
};

