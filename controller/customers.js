var validation = require("../helper/validation");
require("dotenv").config();
const customers = require("../models/customer_model");
const jwt_decode = require("jwt-decode");
const sharp = require('sharp');
sharp.cache(false);


async function customersignup(req, res) {
  try {
    
    if (req.body.email != "" && req.body.passwords != "") {
      var emailCheck = await customers.findOne({ email: req.body.email });

      if(emailCheck){
            res.status(401).json({success:false, message:"Customer Already Exists"});
            return;
      }
      
      if (!emailCheck) {

      if(req.file){

        let buffer = await sharp(req.file.path)
        .resize(1000, 1000, {
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .toBuffer();
      await sharp(buffer).toFile(req.file.path);


        const data = {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          password: validation.hashPassword(req.body.password),
          phone: req.body.phone,
          image: req.file.filename,
          state: req.body.state,
          city: req.body.city,
          address: req.body.address,
        };
        const customerResposnse = await customers.create(data);
        if (customerResposnse) {

          var response = {
            status: 200,
            message: "Customer Registration successfull",
            // data: customerResposnse,
            image_base_url: process.env.BASE_URL,
          };
          return res.status(200).send(response);
        } else {
          var response = {
            status: 201,
            message: "Registration failed",
          };
          return res.status(201).send(response);
        }
      } else {
        var response = {
          status: 201,
          message: "please upload profile image",
        };
        return res.status(201).send(response);
      }
      } else {
        var response = {
          status: 201,
          message: "Email already exist",
        };
        return res.status(201).send(response);
      }
    } else {
      var response = {
        status: 201,
        message: "email and password not be empty value !",
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


async function customerlist(req, res) {
  try {
    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    const user_type = data.user_type;
    const type = data.type;
    if (user_id == null || user_type != 1 && user_type != 3) {
      var response = {
        status: 401,
        message: "admin is un-authorised !",
      };
      return res.status(401).send(response);
    }

    var customerResposnse = await customers.find().sort( { "_id": -1 } );
    //console.log('customerResposnse: ', customerResposnse);

    var response = {
      status: 200,
      message: "success",
      data: customerResposnse,
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


async function getcustomer(req, res) {
  try {

    if(req.params.id.length != 24){
      res.status(401).json({success:false, message:"Enter Correct Customer ID"});
      return;
    }
    
    var customer = await customers.findById(req.params.id);

    //console.log('customerResposnse: ', customer);
    if(!customer){
      res.status(401).json({success:false, message:"No Customer Account Found"});
      return;
    }
    var response = {
      status: 200,
      message: "success",
      data: customer,
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


async function deletecustomer(req, res) {
  try {
    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    const user_type = data.user_type;
    const type = data.type;
    if (user_id == null || user_type != 1) {
      var response = {
        status: 401,
        message: "admin is un-authorised !",
      };
      return res.status(401).send(response);
    }
    const { customer_id } = req.body;
    //console.log('customer_id: ', customer_id);
    const customerRes = await customers.findOne({ _id: customer_id });
    if (customerRes) {
      customers.findByIdAndDelete(
        { _id: customer_id },
        async function (err, docs) {
          if (err) {
            var response = {
              status: 201,
              message: "customer delete failed",
            };
            return res.status(201).send(response);
          } else {
            var response = {
              status: 200,
              message: "customer deleted successfully",
            };
            return res.status(200).send(response);
          }
        }
      );
    } else {
      var response = {
        status: 201,
        message: "customer not Available",
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


async function editcustomer(req, res) {
  try {
    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    const user_type = data.user_type;
    const type = data.type;
    if (user_id == null || user_type != 1 && user_type != 4) {
      var response = {
        status: 401,
        message: "admin is un-authorised !",
      };
      return res.status(401).send(response);
    }

    const {
      first_name,
      last_name,
      email,
      phone,
      state,
      city,
      address,
    } = req.body;
    
    const customerResp = await customers.findOne({ _id: req.params.id });
    // console.log("customerResp : ", customerResp);
    if (customerResp) {
      const data = {
        first_name: first_name,
        last_name: last_name,
        email:email,
        phone: phone,
        state: state,
        city: city,
        address: address,
      };
      customers.findByIdAndUpdate(
        { _id: req.params.id },
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
              message: "customer updated successfully",
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
        message: "customer not available",
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


async function changeImage(req,res){
  try{
    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    const user_type = data.user_type;
    const type = data.type;
    if (user_id == null || user_type != 1 && user_type != 4) {
      var response = {
        status: 401,
        message: "admin is un-authorised !",
      };
      return res.status(401).send(response);
    }

    const customer = await customers.findById(user_id);
    if(!customer){
      res.status(401).json({success:false, message:"No Customer Account Found"});
      return;
    }
    if(req.file)
    {

      let buffer = await sharp(req.file.path)
      .resize(1000, 1000, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .toBuffer();
    await sharp(buffer).toFile(req.file.path);
    
      const data = {
        image:req.file.filename
      }
      customers.findByIdAndUpdate(
        { _id: customer._id },
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
              message: "Profile Image updated Successfully",
              // data: docs,
              image_base_url: process.env.BASE_URL,
            };
            return res.status(200).send(response);
          }
        }
      );

    } else {
      var response = {
        status: 201,
        message: "please upload a image",
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
  customersignup,
  customerlist,
  deletecustomer,
  editcustomer,
  getcustomer,
  changeImage,
};
