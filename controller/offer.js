const service = require("../models/service_model");
require('dotenv').config();
var moment = require('moment');
const offer = require('../models/offer_model'); 
const jwt_decode = require("jwt-decode");


async function addoffer(req, res) {
    try {

        const data = jwt_decode(req.headers.token);
        const user_id = data.user_id;
        const user_type = data.user_type;
        const type = data.type;
        if (user_id == null || user_type != 1 && user_type != 3) {
            var response = {
                status: 401,
                message: 'User is un-authorised !'

            };
            return res.status(401).send(response);
        }

        var promo_codeCheck = await offer.findOne({ promo_code: req.body.promo_code });
        
        const services = await service.findById(req.body.service_id);
        
        if (!promo_codeCheck) {
            
                const data = {
                    service_id: req.body.service_id,
                    promo_code: req.body.promo_code,
                    city:services.city,
                    start_date: req.body.start_date,
                    end_date: req.body.end_date,
                    // noofuses: req.body.noofuses,
                    discount: req.body.discount,
                    minorderamt: req.body.minorderamt,
                };

                const promoResposnse = await offer.create(data);
                if (promoResposnse) {
                   var response = {
                        status: 200,
                        message: 'Offer Added successfully',
                        data: promoResposnse,
                    };
                    return res.status(200).send(response);
                    
                } else {
                    var response = {
                        status: 201,
                        message: 'Offer Added failed',

                    };
                    return res.status(201).send(response);
                }

            } else {
                var response = {
                    status: 201,
                    message: 'Promo code already exist',
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


async function offerlist(req, res) {
    try {

        const data = jwt_decode(req.headers.token);
        const user_id = data.user_id;
        const user_type = data.user_type;
        if (user_id == null || user_type != 1 && user_type != 2 && user_type != 3 && user_type != 4) {
            var response = {
                status: 401,
                message:  'offer is un-authorised !'

            };
            return res.status(401).send(response);
        }

        var offerResposnse = await offer.find(req.query).populate({path:"service_id",select: ['name', 'image', 'description']}).sort( { "_id": -1 } );
        //console.log('offerResposnse: ', offerResposnse);
        if (offerResposnse) {
            var response = {
              status: 200,
              message: "successfull",
              data: offerResposnse,
              image_base_url: process.env.BASE_URL,
            };
            return res.status(200).send(response);
          } else {
            var response = {
              status: 201,
              offerResposnse,
              message: "No PromoCode Found",
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


async function deleteoffer(req, res) {
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
        const { offer_id } = req.body;
        //console.log('offer_id: ', offer_id);
        const offerRes = await offer.findOne({ _id: offer_id });
        if (offerRes) {
            offer.findByIdAndDelete({ _id: offer_id },
                async function (err, docs) {
                    if (err) {
                        var response = {
                            status: 201,
                            message: 'offer delete failed'
                        };
                        return res.status(201).send(response);
                    }
                    else {
                       
                        var response = {
                            status: 200,
                            message: 'offer deleted successfully',
                        };
                        return res.status(200).send(response);
                    }
                });
        } else {
            var response = {
                status: 201,
                message: 'offer not Available',
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


async function editoffer(req, res) {
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
        const { offer_id } = req.body;
        const offerResp = await offer.findOne({ _id: offer_id });
       
        if (offerResp) {
            const data = {
                    promo_code: req.body.promo_code,
                    start_date: req.body.start_date,
                    city:req.body.city,
                    end_date: req.body.end_date,
                    discount: req.body.discount,
                    minorderamt: req.body.minorderamt,
                };
            offer.findByIdAndUpdate({ _id: offer_id },
                { $set: data },
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
                            message: 'offer updated successfully',
                            data: docs,
                        };
                        return res.status(200).send(response);
                    }
                });
        } else {
            response = {
                status: 201,
                 message: 'offer not available',
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
    addoffer,
    offerlist,
    deleteoffer,
    editoffer,
}
