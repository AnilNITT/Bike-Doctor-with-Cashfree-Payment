require('dotenv').config();
const Dealer = require('../models/Dealer');
const jwt_decode = require("jwt-decode");
var validation = require('../helper/validation');


async function addDealer(req, res) {
    try {

        const data = jwt_decode(req.headers.token);
        const user_id = data.user_id;
        const user_type = data.user_type;
        // const type = data.type;
        if (user_id == null || user_type != 1 && user_type != 3) 
        {
            var response = {
                status: 401,
                message: 'admin is un-authorised !'
            };
            return res.status(401).send(response);
        }

        const {name, email, password, phone, state, city, address, latitude, longitude } = req.body;

        if (email != '' && password != '') {
            
            const emailCheck = await Dealer.findOne({ email: email });
            
            if(emailCheck) {
                var response = {
                    status: 201,
                    message: 'Email already exist',
                };
                return res.status(201).send(response);
            }

            const data = {
                    name:name,
                    email: email,
                    phone: phone,
                    password: validation.hashPassword(password),
                    // password: password,
                    state:state,
                    city:city,
                    address: address,
                    latitude: latitude, 
                    longitude: longitude,
                    create_by: user_id    
                };
                const dealerResposnse = await Dealer.create(data);

                var response = {
                    status: 200,
                    success:true,
                    message: 'Dealer Added successfully',
                    // data: dealerResposnse,
                };
                return res.status(200).send(response);

        } else {
            var response = {
                status: 201,
                message: 'email and password can not be empty value !',
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


async function editDealer(req, res) {

    try {
        const data = jwt_decode(req.headers.token);
        const user_id = data.user_id;
        const user_type = data.user_type;
        // const type = data.type;
        if (user_id == null || user_type != 1 && user_type != 2) {
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

        const {dealer_id, name, address, latitude, longitude, phone ,state,city } = req.body;

        const datas = {
            name: name,
            phone: phone,
            state: state,
            city: city,
            address: address,
            latitude: latitude, 
            longitude: longitude,
        };
        var where = { _id: dealer_id };

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
                        message: 'dealer updated successfully',
                        data: docs,
                       // _url: process.env.BASE_URL + '/employee',
                    };
                    return res.status(200).send(response);
                }
        });
    
    } catch (error) {
        console.log("error", error);
        response = {
            status: 201,
            message: 'Operation was not successful',
        };
        return res.status(201).send(response);
    }
};


async function dealerList(req, res) {
    try {

        const data = jwt_decode(req.headers.token);
        const user_id = data.user_id;
        const user_type = data.user_type;
        const type = data.type;
        if (user_id == null || user_type != 1 && user_type != 3) {
            var response = {
                status: 401,
                message: 'admin is un-authorised !'
            };
            return res.status(401).send(response);
        }

        var dealerResposnse = await Dealer.find(req.query).sort( { "_id": -1 } );

        if(dealerResposnse.length > 0){
            var response = {
                status: 200,
                message: 'success',
                data: dealerResposnse,
            };
            return res.status(200).send(response);
        } else {
            var response = {
                status: 201,
                message: 'No Dealer Found',
                data: [],
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


async function singledealer(req, res) {
    try {
        const data = jwt_decode(req.headers.token);
        const user_id = data.user_id;
        const user_type = data.user_type;
        const type = data.type;
        if (user_id == null || user_type != 1 && user_type != 3 && user_type != 2 ) {
            var response = {
                status: 401,
                message: 'admin is un-authorised !'
            };
            return res.status(401).send(response);
        }

        var dealerResposnse = await Dealer.findById(req.params.id)

        if(dealerResposnse){
            var response = {
                status: 200,
                message: 'success',
                data: dealerResposnse,
            };
            return res.status(200).send(response);
        }else{
            var response = {
                status: 201,
                message: 'No Dealer Found',
                data: [],
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


async function deleteDealer(req, res) {
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
      

        const { dealer_id } = req.body;
        const dealerRes = await Dealer.findOne({user_id: dealer_id });

        if(!dealerRes) {
            var response = {
                status: 201,
                message: 'No Dealer Found',
            };
            return res.status(201).send(response);
        }
        
        Dealer.findByIdAndDelete({ _id: dealer_id },
                async function (err, docs) {
                    if (err) {
                        var response = {
                            status: 201,
                            message: 'Dealer delete failed'
                        };
                        return res.status(201).send(response);
                    }
                    else {
                        var response = {
                            status: 200,
                            message: 'Dealer deleted successfully',
                        };
                        return res.status(200).send(response);
                    }
        });
    } catch (error) {
        console.log("error", error);
        response = {
            status: 201,
            message: 'Operation was not successful',
        };
        return res.status(201).send(response);
    }
};


module.exports = {
    addDealer,
    editDealer,
    dealerList,
    deleteDealer,
    singledealer
}