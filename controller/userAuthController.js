var validation = require('../helper/validation');
require('dotenv').config();
const customers = require('../models/customer_model');
const otpAuth = require("../helper/otpAuth");


async function userLogin(req, res) { //user_type = (1=admin, 2=employee, 3=dealer, 4=customer )
    try {
        const { phone } = req.body;
        if (phone !='') {  

            // Phone otp
                var userResm = await customers.findOne({ phone: phone })
                // console.log('userResm: ', userResm);
                if (userResm) {
                    const data = await otpAuth.otp(phone)

                    customers.findByIdAndUpdate({ _id: userResm._id },
                    { otp: data.otp },
                    { new: true },
                    async function (err, docs) {
                    // console.log('docs:  ', docs);
                        if (err) {
                            var response = {
                                status: 201,
                                message: err,
                            };
                            return res.status(201).send(response);
                        }else {
                            if(docs){
                                const userData = {
                                    user_id: docs.user_id,
                                    // email:docs.email,
                                    // phone:docs.phone,
                                } 
                                var response = {
                                    status: 200,
                                    message: 'OTP send to ur Mobile no n updated successfully',
                                    data : userData
                                };
                                //return res.status(200).send(response);

                                res.status(200)
                                // .cookie('accessToken', data.accessToken, {
                                //     expires: new Date(new Date().getTime() + 60 * 1000),
                                //     sameSite: 'strict',
                                //     httpOnly: true
                                // })
                                // .cookie('refreshToken', data.refreshToken, {
                                //     expires: new Date(new Date().getTime() + 31557600000),
                                //     sameSite: 'strict',
                                //     httpOnly: true
                                // })
                                // .cookie('authSession', true, { 
                                //     expires: new Date(new Date().getTime() + 30 * 1000), 
                                //     sameSite: 'strict' 
                                // })
                                // .cookie('refreshTokenID', true, {
                                //     expires: new Date(new Date().getTime() + 31557600000),
                                //     sameSite: 'strict'
                                // })
                                .json({success:true,msg: "OTP send to ur Mobile no n updated successfully",data : userData });

                            }else{
                                var response = {
                                    status: 201,
                                    message: 'Login otp send failed!',
                                };
                                return res.status(201).send(response);
                            }
                        }
                    });
                }else{
                    var response = {
                        status: 201,
                        message: 'Mobile not exist',
                    };
                    return res.status(201).send(response);
                }
        } else {
            var response = {
                status: 201,
                message: 'Can not be empty value!',
            };
            return res.status(201).send(response);
        }
    } catch (error) {
        console.log("error", error);
        response = {
            status: 201,
            message: 'Operation was not successful',
        };
        return res.status(201).send(response);
    }
};


async function otpVerify(req, res) { //user_type = (1=admin, 2=employee, 3=dealer, 4=customer )
    try {
        
        const { phone, otp} = req.body;
        if (phone != '' && otp != '') {
            var userRes = await customers.findOne({ phone: phone, otp : otp })
            // console.log(userRes);
                if (userRes) {
                    const token = validation.generateUserToken(userRes._id, 'logged', 4)
                    //const optdata = {otp :''}
                    customers.findByIdAndUpdate({ _id: userRes._id },{ otp: otp },{ new: true }, async function (err, docs) {
                        //console.log(docs);
                        const userData = {
                            user_id: docs._id,
                            // email:docs.email,
                            // phone:docs.phone,
                        } 
                        if (err) {
                            var response = {
                                status: 201,
                                message: err,
                            };
                            return res.status(201).send(response);
                        }
                        else {
                            var response = {
                                status: 200,
                                message: 'Customer Login Successfull',
                                data: userData,
                                token: token,
                            };
                            return res.status(200)
                            .cookie("token",token ,{
                                expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                                httpOnly: true})
                            .send(response);
                        }
                    });
    
                } else {
                    var response = {
                        status: 201,
                        message: 'InCorrect OTP',
                    };
                    return res.status(201).send(response);
                }
        } else {
            var response = {
                status: 201,
                message: 'Mobile no and otp can not be empty value!',
            };
            console.log("response", response);
            return res.status(201).send(response);
        }
    } catch (error) {
        console.log("error", error);
        response = {
            status: 201,
            message: 'Operation was not successful',
        };
        return res.status(201).send(response);
    }
};


async function forgetPassword(req, res) { 
    try{
        const { email} = req.body;
        if (email != '') {
            var userResm = await customers.findOne({ email: email })
            
            if (userResm) {

                const optdata = {otp:1111};
                
                customers.findByIdAndUpdate({ _id: userResm._id },
                { $set: optdata },
                { new: true },
                async function (err, docs) {
                    if (err) {
                        var response = {
                            status: 201,
                            message: err,
                        };
                        return res.status(201).send(response);
                    }
                    else {
                        var response = {
                            status: 200,
                            message: 'OTP send successfully',
                        };
                        return res.status(200).send(response);
                    }
                });
            }else{
                var response = {
                    status: 201,
                    message: 'Email not exist',
                };
                return res.status(201).send(response);
            }
       
        }else {
            var response = {
                status: 201,
                message: 'Email and otp can not be empty value!',
            };
            return res.status(201).send(response);
        }


    } catch (error) {
        console.log("error", error);
        response = {
            status: 201,
            message: 'Operation was not successful',
        };
        return res.status(201).send(response);
    }

}


async function passwordUpdate(req, res) { 
    try{
        var {password,email} = req.body;
 
        if(password != '' && email != ''){

            var userResm = await customers.findOne({ email : email})
            if(userResm){

            const updata = {password:validation.hashPassword(password)} 
            customers.findByIdAndUpdate({ _id: userResm._id },
            { $set: updata },
            { new: true },
            async function (err, docs) {
                if (err) {
                    var response = {
                        status: 201,
                        message: err,
                    };
                    return res.status(201).send(response);
                }
                else {
                    var response = {
                        status: 200,
                        message: 'password update successfully',
                    };
                    return res.status(200).send(response);
                }
            });
        }else{
            var response = {
                status: 201,
                message: "Authentication Failed",
            };
            return res.status(201).send(response);
        }
        }else{
            var response = {
                status: 201,
                message: 'Can not be empty value!',
            };
            return res.status(201).send(response);
        }
    }catch(error){
        console.log("error", error);
        response = {
            status: 201,
            message: 'Operation was not successful',
        };
        return res.status(201).send(response);
    }
}


async function resendOtp(req, res) { 
    try{
        const { phone } = req.body;
        //const { email,user_id} = req.body;
        // console.log(req.body.email,'email')
        if (phone != '') {
            // var userResm = await login.findOne({ user_id: user_id})
            var userResm = await customers.findOne({ phone: phone })

            if(userResm){
                // const optdata = {otp:1111} 
                const data = await otpAuth.otp(phone)

                customers.findByIdAndUpdate({ _id: userResm._id },
                { otp: data.otp },
                { new: true },
                async function (err, docs) {
                    if (err) {
                        var response = {
                            status: 201,
                            message: err,
                        };
                        return res.status(201).send(response);
                    }
                    else {
                        var response = {
                            status: 200,
                            message: 'OTP send successfully',
                        };
                        res.status(200)
                                // .cookie('accessToken', data.accessToken, {
                                //     expires: new Date(new Date().getTime() + 60 * 1000),
                                //     sameSite: 'strict',
                                //     httpOnly: true
                                // })
                                // .cookie('refreshToken', data.refreshToken, {
                                //     expires: new Date(new Date().getTime() + 31557600000),
                                //     sameSite: 'strict',
                                //     httpOnly: true
                                // })
                                // .cookie('authSession', true, { 
                                //     expires: new Date(new Date().getTime() + 30 * 1000), 
                                //     sameSite: 'strict' 
                                // })
                                // .cookie('refreshTokenID', true, {
                                //     expires: new Date(new Date().getTime() + 31557600000),
                                //     sameSite: 'strict'
                                // })
                                .json(response);
                    }
                });
            }else{
                var response = {
                    status: 201,
                    message: 'Customer not exist',
                };
                return res.status(201).send(response);
            }
       
        }else {
            var response = {
                status: 201,
                message: 'Phone no can not be empty value!',
            };
            return res.status(201).send(response);
        }
    
    
    } catch (error) {
        console.log("error", error);
        response = {
            status: 201,
            message: 'Operation was not successful',
        };
        return res.status(201).send(response);
    }
}


async function changePassword(req, res) { 
    try{
       
        var {oldpassword,newpassword} = req.body;

        const user_id = req['user_id'];
        
        if(oldpassword != '' && newpassword != ''){
            var userRes = await customers.findOne({ user_id : user_id})

            console.log(userRes);
           
            if(userRes){
                if(validation.comparePassword(userRes.password, oldpassword)){

                    const updata = {password:validation.hashPassword(newpassword)} 

                    customers.findByIdAndUpdate({ _id: userRes._id },
                        { $set: updata },
                        { new: true },
                        async function (err, docs) {
                            if (err) {
                                var response = {
                                    status: 201,
                                    message: err,
                                };
                                return res.status(201).send(response);
                            }
                            else {
                                var response = {
                                    status: 200,
                                    message: 'password change successfully',
                                };
                                return res.status(200).send(response);
                            }
                        });

                }else{
                    var response = {
                        status: 201,
                        message: 'Incorrect oldpassword',
                    };
                    return res.status(201).send(response);
                }
            }else{
                var response = {
                    status: 201,
                    message: "Authentication Failed",
                };
                return res.status(201).send(response);
            }
        }else{
            var response = {
                status: 201,
                message: 'Can not be empty value!',
            };
            return res.status(201).send(response);
        }

    } catch (error) {
        console.log("error", error);
        response = {
            status: 201,
            message: 'Operation was not successful',
        };
        return res.status(201).send(response);
    }
}


module.exports = {
    userLogin,
    otpVerify,
    forgetPassword,
    passwordUpdate,
    resendOtp,
    changePassword
};