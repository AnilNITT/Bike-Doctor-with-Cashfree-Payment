var validation = require('../helper/validation');
const otpAuth = require("../helper/otpAuth");
const Dealer = require('../models/Dealer');


//user_type = ( 2=dealer )
async function usersignin(req, res) {
  try {
    const { phone, password } = req.body;

    if (phone === '' && password === '') {
      var response = {
        status: 201,
        message: 'Email and password can not be empty!!!',
      };
      return res.status(201).send(response);
    }

    let dealer = await Dealer.findOne({phone}).select("+password")

    if (!dealer) {
      var response = {
        status: 201,
        message: 'No Dealer Found',
      };
      return res.status(201).send(response);
    }

    console.log(validation.comparePassword(dealer.password, password));

    if (validation.comparePassword(dealer.password, password)) 
    {
        const token = validation.generateUserToken(dealer._id, 'logged', 2);

        const data = await otpAuth.otp(phone);
        
        Dealer.findByIdAndUpdate({ _id: dealer._id },
          { otp: data.otp },
          { new: true },
          async function (err, docs) {
            if (err) {
              var response = {
                status: 201,
                message: err,
              };
              return res.status(201).send(response);
            } else {
              if (docs) {
                const userData = {
                  user_id: docs.user_id,
                  email: docs.email,
                  phone: docs.phone,
                }

                res.status(200)
                  .cookie('token', token, {
                    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                    sameSite: 'strict',
                    httpOnly: true
                  })
                  .json({
                    success: true,
                    message: "Login OTP send to ur Mobile no",
                    // user: userData,
                    token: token,
                  });
              } else {
                var response = {
                  status: 201,
                  message: 'Login OTP send failed!',
                };
                return res.status(201).send(response);
              }
            }
          })
      } else {
        var response = {
          status: 201,
          message: 'Incorrect password',
        };
        return res.status(201).send(response);
      }

   
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}


async function sendOtp(req, res) { 
  try{
      const { phone } = req.body;

      if (phone != '' || phone === null) {
          var userResm = await Dealer.findOne({phone});

          if(userResm){
              // const optdata = {otp:1111} 
              const data = await otpAuth.otp(phone)

              
              Dealer.findByIdAndUpdate({ _id: userResm._id },
              { otp: data.otp },
              { new: true },
              async function (err, docs) {
                  // const token = validation.generateUserToken(userResm._id, 'logged', 2)
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
                          // token:token
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
                  message: 'Dealer not exist',
              };
              return res.status(201).send(response);
          }
     
      }else {
          var response = {
              status: 201,
              message: 'Phone No can not be empty value!',
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


async function verifyOTP(req, res) {
  try {
    const { otp, phone } = req.body

    const user = await Dealer.findOne({ phone: phone });
    if (!user) {
      res.status(401).json({ success: false, message: "This Mobile is not associated with any account" });
      return;
    }

    if (user.otp === otp) {
      const token = validation.generateUserToken(user._id, 'logged', 2)
      user.save()
        .then((data) => {
          return res.status(200)
            .cookie("token", token, {
              expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
              sameSite: 'strict',
              httpOnly: true
            })
            .json({ status: 200, msg: 'Dealer verified successfully', token: token });
        })
        .catch(error => {
          return res.status(400).send({ verification: false, error, msg: 'Incorrect OTP' });
        })
    } else {
      return res.status(400).send({ verification: false, msg: 'Incorrect OTP' });
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


async function changePassword (req,res){
  try{
    const {phone, new_password, confirm_password} = req.body;

    const dealers = await Dealer.findOne({ phone }).select("+password");

    if (!dealers) {
      var response = {
        status: 201,
        message: 'Mobile no not exist',
      };
      return res.status(201).send(response);
    }

    if(validation.comparePassword(dealers.password, new_password)){
      var response = {
        status: 201,
        message: 'New Password can not Same as Old Password',
      };
      return res.status(201).send(response);
    }

    if(new_password != confirm_password){
      var response = {
        status: 201,
        message: 'Password Not Matched',
      };
      return res.status(201).send(response);
    }
    
    const datas = {
      password : validation.hashPassword(new_password)
    }

    var where = { _id: dealers._id };

    Dealer.findByIdAndUpdate(where,
        { $set: datas },
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
                    message: 'Dealer Password Updated Successfully',
                    // data: docs,
                };
                return res.status(200).send(response);
            }
    });

  } catch (error) {
    console.log("error", error);
    response = {
      status: 201,
      message: "Operation was not successful",
    };
    return res.status(201).send(response);
  }
}


async function logout(req, res) {
  try {
    // res.clearCookie('refreshToken')
    res
      .status(200)
      .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
      .cookie("accessToken", null, { expires: new Date(Date.now()), httpOnly: true })
      .cookie("refreshToken", null, { expires: new Date(Date.now()), httpOnly: true })
      .cookie("authSession", null, { expires: new Date(Date.now()), httpOnly: true })
      .cookie("refreshTokenID", null, { expires: new Date(Date.now()), httpOnly: true })
      .json({
        success: true,
        message: "Logged out",
      });
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
  usersignin,
  sendOtp,
  verifyOTP,
  logout,
  changePassword
};