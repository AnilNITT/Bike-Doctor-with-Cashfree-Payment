var validation = require('../helper/validation');
// var helper = require('../helper/helper');
require('dotenv').config();
const admin = require('../models/admin_model');
var bcrypt = require('bcryptjs');
const jwt_decode = require("jwt-decode");


//user_type = (1=admin, 2=dealer,3= SubAdmin, 4=customer )
// Admin Signup
async function suadminsignup(req, res) {
    try{
        const { name, email, password} = req.body;

        let user = await admin.findOne({email});

        if(user){
            res.status(400).json({
                success:false,
                message:"Email Already Exists"
            });
            return;
        }

        user = await admin({
            name,
            email,
            password,
            role:"Admin",
        });

        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);

        // now we set user password to hashed password
        user.password = await bcrypt.hash(user.password, salt);

        user.save();

        res.status(200).json({
            status:200,
            success:true,
            message :" Admin Created Successfully"
        });

    }catch(error){
        response = {
            status: 201,
            message: 'Operation was not successful',
            Error:error
        };
        return res.status(201).send(response);
    }
}

//user_type = (1=admin, 2=dealer,3= SubAdmin,, 4=customer )
async function suadminLogin(req, res) { 
        
        const { email, password } = req.body;

        let token="";

        if (email === '' || password === '') {
            var response = {
              status: 201,
              message: 'Email and password can not be empty!!!',
            };
            return res.status(201).send(response);
        }

        const userRes = await admin.findOne({email}).select("+password");

        if (!userRes) {
            var response = {
              status: 201,
              message: 'Email not exist',
            };
            return res.status(201).send(response);
        }

        if (validation.comparePassword(userRes.password, password)) {

            if(userRes.role === "Admin"){
                token = validation.generateUserToken(userRes._id , 'logged', 1);
            }
            if(userRes.role === "SubAdmin"){
                token = validation.generateUserToken(userRes._id , 'logged', 3);
            }

            var response = {
                status: 200,
                message: 'Login Successfull',
                // data: userRes,
                token: token,
            }
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }

            return res.status(200).cookie("token",token,options).json({
                response
            });

        } else {
            var response = {
                status: 201,
                message: 'Incorrect password',
            };
            return res.status(201).send(response);
        }
       
    
};

// SubAdmin Signup
async function subadminsignup(req, res) {
    try{
        const data = jwt_decode(req.headers.token);
        const user_id = data.user_id;
        const user_type = data.user_type;
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

        const { name, email, password} = req.body;

        let user = await admin.findOne({email});

        if(user){
            res.status(400).json({
                success:false,
                message:"Email Already Exists"
            });
            return;
        }

        user = await admin({
            name,
            email,
            password,
            role:"SubAdmin",
        });

        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);

        // now we set user password to hashed password
        user.password = await bcrypt.hash(user.password, salt);

        user.save();

        res.status(200).json({
            status:200,
            success:true,
            message :"Sub Admin Created Successfully"
        });

    }catch(error){
        response = {
            status: 201,
            message: 'Operation was not successful',
            Error:error
        };
        return res.status(201).send(response);
    }
}


async function getAllAdmin(req,res) {
    try{
        const data = jwt_decode(req.headers.token);
        const user_id = data.user_id;
        const user_type = data.user_type;
        const type = data.type;
        if (user_id == null || user_type != 1 && user_type != 3) {
          var response = {
            status: 401,
            message: "Admin is un-authorised !",
          };
          return res.status(401).send(response);
        }

        const admins = await admin.find(req.query).sort({ "_id" : -1 });

        var response = {
            status: 200,
            message: "success",
            data: admins,
        };
        return res.status(200).send(response);

    }  catch (error) {
        response = {
            status: 201,
            message: 'Operation was not successful',
            Error:error
        };
        return res.status(201).send(response);
    }
}


async function deleteAdmin(req,res) {
    try {
        const data = jwt_decode(req.headers.token);
        const user_id = data.user_id;
        const user_type = data.user_type;

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
        
        const { admin_id } = req.body;
        const adminRes = await admin.findById(admin_id);

        if (adminRes.role === "Admin") {
            var response = {
                status: 201,
                message: "You Can't Delete Super Admin",
              };
        
              return res.status(201).send(response);
        }

        if (!adminRes) {
            var response = {
                status: 201,
                message: "Admin Not Found",
              };
        
              return res.status(201).send(response);
        }

        admin.findByIdAndDelete(
            { _id: admin_id },
            async function (err, docs) {
              if (err) {
                var response = {
                  status: 201,
                  message: "Admin delete failed",
                };
                return res.status(201).send(response);
              } else {

                var response = {
                  status: 200,
                  message: "Admin deleted successfully",
                };
                return res.status(200).send(response);
              }
            }
        );

    } catch (error) {
        response = {
            status: 201,
            message: 'Operation was not successful',
            Error:error
        };
        return res.status(201).send(response);
    }
}


module.exports = {
    suadminLogin,
    subadminsignup,
    suadminsignup,
    getAllAdmin,
    deleteAdmin
};