"use strict"
var Payment = require("../models/Payment");
var crypto = require('crypto');
const jwt_decode = require("jwt-decode");
// const { type } = require("os");
const booking = require("../models/Booking");
// const sdk = require('api')('@cashfreedocs-new/v3#1224ti1hl4o0uyhs');
const sdk = require('api')('@cashfreedocs-new/v3#4xc3n730larv4wbt');

var Tracking = require("../models/Tracking");
const { PaymentGateway } = require('@cashfreepayments/cashfree-sdk');

const cfSdk = require('cashfree-sdk');
const request = require('request');
const { default: axios } = require("axios");


async function paymentRequest(req, res) {
  try {

    var postData = {
      //"appId" : req.body.appId,
      "appId": process.env.APP_ID,
      "orderId": req.body.orderId,
      "orderAmount": req.body.orderAmount,
      "orderCurrency": req.body.orderCurrency,
      "orderNote": req.body.orderNote,
      "customerName": req.body.customerName,
      "customerEmail": req.body.customerEmail,
      "customerPhone": req.body.customerPhone,
      //"returnUrl" : req.body.returnUrl,
      "returnUrl": "http://192.168.0.123:8088/bikedoctor/payment/paymentResponse",
      // "notifyUrl" : req.body.notifyUrl
    },


      mode = "TEST",
      // mode = "PROD",
      // secretKey = "<YOUR SECRET KEY HERE>",
      secretKey = process.env.SECRET_KEY,
      sortedkeys = Object.keys(postData),
      url = "",
      signatureData = "";
    sortedkeys.sort();
    for (var i = 0; i < sortedkeys.length; i++) {
      k = sortedkeys[i];
      signatureData += k + postData[k];
    }
    // console.log(signatureData);
    var signature = crypto.createHmac('sha256', secretKey).update(signatureData).digest('base64');

    postData['signature'] = signature;

    // console.log(postData);

    if (mode == "PROD") {
      url = "https://www.cashfree.com/checkout/post/submit";
    } else {
      url = "https://test.cashfree.com/billpay/checkout/post/submit";
    }


    // const options = {
    // 	method: 'POST',
    // 	url: "https://test.cashfree.com/billpay/checkout/post/submit",
    // 	headers: {'Content-Type': 'application/json'},
    // 	body: postData,
    // 	json:true
    // };
    // request(options, function (error, response, body) {
    // 	if (error) throw new Error(error);
    // 	//console.log(response);
    // 	console.log(body);
    //   });


    res.render('request', { postData: JSON.stringify(postData), url: url })

  } catch (error) {
    console.log("error", error);
    response = {
      status: 201,
      message: "Operation was not successful",
    };
    return res.status(201).send(response);
  }
}


async function paymentResponse(req, res) {
  try {

    //let bookings = await booking.findOne({_id:req.body.orderId})
    //console.log("booking",bookings);
    //
    //let track = await Tracking.findOne({booking_id:req.body.orderId})
    //console.log("track",track);

    console.log(req.body);
    var postData = {
      "orderId": req.body.orderId,
      //"dealer_id": bookings.dealer_id,
      //"user_id": bookings.created_by,
      "orderAmount": req.body.orderAmount,
      "referenceId": req.body.referenceId,
      "txStatus": req.body.txStatus,
      "paymentMode": req.body.paymentMode,
      "txMsg": req.body.txMsg,
      "txTime": req.body.txTime
    },

      //secretKey = "<YOUR SECRET KEY HERE>",
      secretKey = process.env.SECRET_KEY,

    signatureData = "";
    for (var key in postData) {
      signatureData += postData[key];
    }

    var computedsignature = crypto.createHmac('sha256', secretKey).update(signatureData).digest('base64');
    postData['signature'] = req.body.signature;
    postData['computedsignature'] = computedsignature;

    res.status(201).send(postData);
    // res.render('response', { postData: JSON.stringify(postData) });
    console.log(postData);
    //res.send("hello");
    //       if(postData){

    //         const data =await Tracking.findByIdAndUpdate({_id:track._id},{status:"Payment"},{new:true})
    //         // console.log(data);
    //         const paymentres = await Payment.create(postData)
    //         // var datetime = new Date().toISOString().slice(0,10);
    //         // console.log(datetime);
    //         const response={
    //             status:200,
    //             message:"Payment Successfull",
    //             data:paymentres	
    //         }
    //         res.status(200).json(response)
    //       } else {
    //         const response = {
    //             status: 201,
    //             message: "Operation was not successful",
    //       }
    //      return res.status(201).send(response);
    // }
  } catch (error) {
    console.log("error", error);
    response = {
      status: 201,
      message: "Operation was not successful",
    };
    return res.status(201).send(response);
  }
}


async function paymentInvoices(req, res) {
  try {
    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    const user_type = data.user_type;
    const type = data.type;
    if (user_id == null || user_type != 1 && user_type != 2 && user_type != 3) {
      var response = {
        status: 401,
        message: "admin is un-authorised !",
      };
      return res.status(401).send(response);
    }


    const payment = await Payment.find(req.query);

    if (payment) {
      var response = {
        status: 200,
        message: "Payment Invoice Successfull",
        data: payment,
      };
      return res.status(200).send(response);
    } else {
      var response = {
        status: 201,
        featureresponce,
        message: "No Payment Invoice Found",
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



async function GetPaymentOrder(req, res) {
  try {

    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    const user_type = data.user_type;
    if (user_id == null || user_type != 1 && user_type != 3 && user_type != 4) {
      var response = {
        status: 401,
        message: "admin is un-authorised !",
      };
      return res.status(401).send(response);
    }

    const { order_id } = req.body
    try {
      // for Production
      //sdk.server('https://api.cashfree.com/pg');
      // console.log(order_id);

      // for testing
      sdk.server('https://sandbox.cashfree.com/pg');
      sdk.GetOrder({
        order_id: order_id,
        'x-client-id': process.env.APP_ID,
        'x-client-secret': process.env.SECRET_KEY,
        'x-api-version': '2022-01-01'
      })
        .then(data => {
          res.json(data);
        })
        .catch(err => {
          var response = {
            status: 201,
            error: err
          };
          return res.status(201).send(response);
        });
    } catch (errs) {
      response = {
        status: 201,
        message: "Operation was not successful",
        error: errs
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


async function GetAllPayment(req, res) {
  try {

    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    const user_type = data.user_type;
    if (user_id == null || user_type != 1 && user_type != 3 && user_type != 2) {
      var response = {
        status: 401,
        message: "admin is un-authorised !",
      };
      return res.status(401).send(response);
    }

    const payment = await Payment.find(req.query).populate({ path: "user_id", select: ['first_name', 'last_name'] })
      .populate({ path: "dealer_id", select: ['name'] })
      .sort({ "_id": -1 });

    if (payment) {

      payment.forEach(async(data) => {
        // for Production
        // sdk.server('https://api.cashfree.com/pg');
        //console.log(order_id);
        // for testing
       const payment_id = data._id
        await axios.get(`https://sandbox.cashfree.com/pg/orders/${data.orderId}`,
          {headers: {
            'Content-Type': 'application/json',
            'x-client-id': process.env.APP_ID,
            'x-client-secret': process.env.SECRET_KEY,
            'x-api-version': "2022-01-01"
          }})
            .then(async (datas) => {

              if (datas.data.order_status == "PAID") 
              {

                // datas.data.order_status = "PAID"
                // await datas.save();

                const dataz =
                {
                  status: "payment",
                };

                const datazz =
                {
                  status: "Payment",
                };

                const datazs =
                {
                  order_status: "PAID",
                };

                await Payment.findByIdAndUpdate(
                  { _id: payment_id },
                  { $set: datazs },
                  { new: true });


                await booking.findByIdAndUpdate(
                  { _id: data.booking_id },
                  { $set: dataz },
                  { new: true });

                const tracks = await Tracking.findOne({ booking_id: data.booking_id });

                await Tracking.findByIdAndUpdate(
                  { _id: tracks._id },
                  { $set: datazz },
                  { new: true });
                  


              }
            })
            .catch(err => console.error("error", err));
        
      })
      var response = {
        status: 200,
        message: "successfull",
        data: payment,
      };
      return res.status(200).send(response);
    } else {
      var response = {
        status: 201,
        data: [],
        message: "No payment Found",
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


async function Cashpayment(req, res) {
  try {

    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    const user_type = data.user_type;
    if (user_id == null || user_type != 1 && user_type != 3 && user_type != 4) {
      var response = {
        status: 401,
        message: "admin is un-authorised !",
      };
      return res.status(401).send(response);
    }


    const { customer_id,
      order_amount, pay_type, booking_id, dealer_id } = req.body;

    var order_id = Math.floor(1000000000000000 + Math.random() * 90000000000000).toString();

    const bookings = await booking.findById(booking_id);

    if (!bookings) {
      var response = {
        status: 201,
        message: "No Booking Found",
      };
      return res.status(201).send(response);
    }

    const trackings = await Tracking.findOne({ booking_id: booking_id });

    const datas = {
      orderId: order_id,
      booking_id: booking_id,
      dealer_id: dealer_id,
      user_id: customer_id,
      orderAmount: order_amount,
      payment_type: pay_type,
      order_status: "PAID",
      // order_token:data.order_token,
    }

    const payment = await Payment.create(datas)

    // Update Booking
    const dataz =
    {
      status: "payment",
    };

    const datazz =
    {
      status: "Payment",
    };

    await booking.findByIdAndUpdate(
      { _id: booking_id },
      { $set: dataz },
      { new: true });

    await Tracking.findByIdAndUpdate(
      { _id: trackings._id },
      { $set: datazz },
      { new: true });

    var response = {
      status: 200,
      message: "Cash Payment successful",
      data: payment,
    };
    return res.status(200).send(response);

    // for production
    // sdk.server('https://api.cashfree.com/pg');
    // sdk.CreateOrder({
    //   customer_details: {
    //     customer_id: customer_id,
    //     customer_email: customer_email,
    //     customer_phone: customer_phone
    //   },
    //   order_tags: {
    //     booking_id: booking_id,
    //     dealer_id:dealer_id
    //   },
    //   order_amount: order_amount,
    //   order_currency: 'INR',
    //   order_id: order_id,
    // },
    // {
    //   'x-client-id': process.env.APP_ID,
    //   'x-client-secret': process.env.SECRET_KEY,
    //   'x-api-version': '2022-01-01'
    // })
    // .then(async(data) => {
    //   // console.log(data)
    //   const datas ={
    //     orderId:order_id,
    //     booking_id:booking_id,
    //     dealer_id:dealer_id,
    //     user_id:customer_id,
    //     orderAmount:order_amount,
    //     payment_type:pay_type,
    //     order_status:"PAID",
    //     order_token:data.order_token,
    //   }

    //   const payment = await Payment.create(datas)
    //   var response = {
    //     status: 200,
    //     message: "Cash Payment successful",
    //     data: payment,
    //   };
    //   return res.status(200).send(response);

    // })
    // .catch(err => {
    //   var response = {
    //     status: 201,
    //     //message: "order with same id is already present",
    //     error:err
    //   };
    //   return res.status(201).send(response);
    // });

  } catch (error) {
    console.log("error", error);
    response = {
      status: 201,
      message: "Operation was not successful",
    };

    return res.status(201).send(response);
  }
}


async function GetPayment(req, res) {
  try {

    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    const user_type = data.user_type;
    if (user_id == null || user_type != 1 && user_type != 3 && user_type != 2) {
      var response = {
        status: 401,
        message: "admin is un-authorised !",
      };
      return res.status(401).send(response);
    }


    const payment = await Payment.findById(req.params.id);

    if (payment) {
      var response = {
        status: 200,
        message: "successfull",
        data: payment,
      };
      return res.status(200).send(response);
    } else {
      var response = {
        status: 201,
        message: "No Payment Found",
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


async function deletePayment(req, res) {
  try {
    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    const user_type = data.user_type;
    const type = data.type;
    if (user_id == null || user_type != 1) {
      if (user_type === 3) {
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


    const { payment_id } = req.body;
    //console.log('offer_id: ', offer_id);
    const payment = await Payment.findOne({ _id: payment_id });

    if (payment) {
      Payment.findByIdAndDelete({ _id: payment_id },
        async function (err, docs) {
          if (err) {
            var response = {
              status: 201,
              message: 'Payment delete failed'
            };
            return res.status(201).send(response);
          }
          else {

            var response = {
              status: 200,
              message: 'Payment deleted successfully',
            };
            return res.status(200).send(response);
          }
        });
    } else {
      var response = {
        status: 201,
        message: 'payment not Available',
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


const pg = new PaymentGateway({

  // For Testing
  // env: 'TEST',
  // apiVersion: '1.0.0',
  // appId: '145051b44a8163dab2b9915df0150541',
  // secretKey: '9f8c083893c1969049995373f3f922c5c7232db5',

  // For PRODUCTION
  env: 'PRODUCTION',
  // apiVersion: '1.0.0',
  appId: '194144a1cddaae2d59e32e001e441491',
  secretKey: 'a7da95769a0db6068316e3c2480f5831de9cfa6d',



});


async function CashfreePayment(req, res) {
  try {

    var order_id = Math.floor(1000000000000000 + Math.random() * 90000000000000).toString();

    pg.orders.createOrders({

      orderId: order_id, // required

      orderAmount: '1', // required

      orderCurrency: 'INR',

      orderNote: 'Subscription',

      customerName: 'Anil Patidar', // required

      customerPhone: '9630196313', // required

      customerEmail: 'johndoe@cashfree.com', // required

      sellerPhone: '',

      returnUrl: 'http://localhost:8088/bikedoctor/payment/paymentResponse', // required

      notifyUrl: 'https://example.com/notify',

      paymentModes: '',

      pc: '',

    })

      .then((data) =>
        res.send(data)
      )
      .catch((error) => console.error(error));

  } catch (error) {
    console.log("error", error);
    response = {
      status: 201,
      message: "Operation was not successful",
    };
    return res.status(201).send(response);
  }
}


async function cashfreePayout(req, res) {
  try {

    const config = {
      Payouts: {
        ENV: "TEST",
        ClientID: "145051b44a8163dab2b9915df0150541",
        ClientSecret: "9f8c083893c1969049995373f3f922c5c7232db5",
      }
    }

    const handleResponse = (response) => {
      if (response.status === "ERROR") {
        throw { name: "handle response error", message: "error returned" };
      }
    }

    const { Payouts } = cfSdk;
    const { Beneficiary, Transfers } = Payouts;

    //main execution function
    const bene = {
      "beneId": "JOHN1801277890990877",
      "name": "john doe",
      "email": "johndoe@cashfree.com",
      "phone": "9876543210",
      "bankAccount": "00011020001772",
      "ifsc": "HDFC0000001",
      "address1": "ABC Street",
      "city": "Bangalore",
      "state": "Karnataka",
      "pincode": "560001"
    };

    const transfer = {
      beneId: bene.beneId,
      transferId: "tranfer0012341239936",
      amount: "10.00",
    };

    Payouts.Init(config.Payouts);
    let addBene = false;
    //Get Beneficiary details
    console.log("request");
    try {
      const response = await Beneficiary.GetDetails({
        "beneId": bene.beneId,
      });
      console.log("get beneficiary details response");
      console.log(response);
      if (response.status === 'ERROR' && response.subCode === '404' && response.message === 'Beneficiary does not exist') {
        addBene = true;
      }
      else {
        handleResponse(response);
      }
    }
    catch (err) {
      console.log("err caught in getting beneficiary details");
      console.log(err);
      return;
    }
    console.log("Add");

    if (addBene) {
      //Beneficiary Addition
      try {
        const response = await Beneficiary.Add(bene);
        console.log("beneficiarry addition response");
        console.log(response);
        handleResponse(response);
      }
      catch (err) {
        console.log("err caught in beneficiarry addition");
        console.log(err);
        return;
      }
    }
    //Request transfer
    try {
      const response = await Transfers.RequestTransfer(transfer);
      console.log("request transfer response");
      console.log(response);
      handleResponse(response);
    }
    catch (err) {
      console.log("err caught in requesting transfer");
      console.log(err);
      return;
    }
    //Get transfer status
    try {
      const response = await Transfers.GetTransferStatus({
        "transferId": transfer.transferId,
      });
      console.log("get transfer status response");
      console.log(response);
      handleResponse(response);
    }
    catch (err) {
      console.log("err caught in getting transfer status");
      console.log(err);
      return;
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


async function Payouts(req, res) {

  const API_KEY = '145051b44a8163dab2b9915df0150541';
  const API_SECRET = '9f8c083893c1969049995373f3f922c5c7232db5';

  const PAYEE_NAME = 'John Doe';
  const PAYEE_EMAIL = 'john.doe@example.com';
  const PAYEE_PHONE = '9876543210';
  const AMOUNT = '1';
  const CURRENCY = 'INR';

  const options = {
    url: 'https://payout-sandbox.cashfree.com/payout/v1/request',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-client-id': API_KEY,
      'x-client-secret': API_SECRET
    },
    form: {
      payeeName: PAYEE_NAME,
      payeeEmail: PAYEE_EMAIL,
      payeePhone: PAYEE_PHONE,
      amount: AMOUNT,
      currency: CURRENCY
    }
  };

  request.post(options, function (error, response, body) {
    if (error) {
      console.error(error);
      res.send(error)
    } else {
      console.log(response.statusCode, body);
      res.send(response)
    }
  })

}


async function Payoutss(req, res) {

  const { Payouts } = cfSdk;

  const config = {
    Payouts: {
      ENV: "TEST",
      ClientID: "2859555327c1556aa98d33808a559582",
      ClientSecret: "f3842c328ef151aee65be1afb0d5bca70c8149f3",
    }
  }

  Payouts.Init(config.Payouts);

  const { Transfers } = Payouts;

  const response = await Transfers.RequestBatchTransfer(

    {
      batchTransferId: 'PAY_14APRIL_2021',

      batchFormat: 'BANK_ACCOUNT',

      deleteBene: 1,

      batch: [

        {
          transferId: 'VENDOR_512623_PAY_14APRIL',

          amount: '1023.4',

          phone: '9999999999',

          bankAccount: '1007766300076281',

          ifsc: 'HDFC0001007',

          email: 'johndoe@cashfree.com',

          name: 'John'
        }

      ]
    })
  res.json(response);
}


async function Payout(req, res) {


  const config = {
    Payouts: {
      ENV: "TEST",
      ClientID: "2859555327c1556aa98d33808a559582",
      ClientSecret: "f3842c328ef151aee65be1afb0d5bca70c8149f3",
    }
  }

  const { Payouts } = cfSdk;
  const { Beneficiary, Transfers } = Payouts;

  //main execution function
  const bene = {
    "beneId": "JOHN1801277890990877",
    "name": "john doe",
    "email": "johndoe@cashfree.com",
    "phone": "9876543210",
    "bankAccount": "00011020001772",
    "ifsc": "HDFC0000001",
    "address1": "ABC Street",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560001"
  };

  const transfer = {
    beneId: bene.beneId,
    transferId: "tranfer0012341239936",
    amount: "1.00",
  };

  (async () => {
    Payouts.Init(config.Payouts);
    let addBene = false;
    //Get Beneficiary details
  })
}


async function payment(req, res) {

  try {

  // const { customer_id, customer_email, customer_phone,
  //   order_amount, pay_type, booking_id, dealer_id,
  //   upi_id,
  //   card_number, card_holder_name, card_expiry_month, card_expiry_year, card_cvv
  // } = req.body;

  const { customer_id, customer_name, customer_email, customer_phone,
    order_amount, booking_id, dealer_id, return_url } = req.body;

  var order_id = Math.floor(1000000000000000 + Math.random() * 90000000000000).toString();


  const user = {
    order_meta: {
      // return_url: `https://merchantsite.com/return?order_id={order_id}`
      return_url: return_url
    },
    customer_details: {
      customer_id: customer_id,
      customer_name: customer_name,
      customer_email: customer_email,
      customer_phone: customer_phone
    },
    order_tags: {
      booking_id: booking_id,
      dealer_id: dealer_id
    },
    order_amount: order_amount,
    order_currency: 'INR',
    order_id: order_id,
    order_note: "Booking order"
  }

  // for production
  // sdk.server('https://api.cashfree.com/pg/orders')
  const rslt = await axios.post("https://sandbox.cashfree.com/pg/orders", user, {
    headers: {
      'Content-Type': 'application/json',
      'x-client-id': process.env.APP_ID,
      'x-client-secret': process.env.SECRET_KEY,
      'x-api-version': "2022-01-01"
    },
  })
    .then((result) => {
      // console.log(result);
      var response = {
        status: 200,
        message: "Payment Order Created Successfully",
        order_token: result.data.order_token,
        payment_link: result.data.payment_link,
      };
      return res.status(200).send(response);
    })
    .catch((e) => {
      console.error(e.stack)
      return res.send(e);
    })

    /*
  sdk.server('https://sandbox.cashfree.com/pg');
  sdk.CreateOrder(
   {
    order_meta: {
      return_url: return_url
    },
     customer_details: {
       customer_id: customer_id,
       customer_name: "Bike Doctor",
       customer_email: customer_email,
       customer_phone: customer_phone
     },
     order_tags: {
       booking_id: booking_id,
       dealer_id: dealer_id
     },
     order_amount: order_amount,
     order_currency: 'INR',
     order_id: order_id,
     order_note: "Additional order info"
   },
     {
       'Content-Type': 'application/json',
       'x-client-id': process.env.APP_ID,
       'x-client-secret': process.env.SECRET_KEY,
       'x-api-version': '2022-01-01'
     })
     .then(async (data) => {
      var response = {
               status: 200,
               message: "Payment Order Created Successfully",
               order_token: data.order_token,
               payment_link: data.payment_link,
             };
             // return res.status(200).send(response);
     })
     .catch((e) => res.send(e.stack))

    */
    } catch (error) {
      console.log("error", error);
      response = {
        status: 201,
        message: "Operation was not successful",
      };
      return res.status(201).send(response);
    }
}


// CashFree payment Return URL
async function Returnurl(req, res) {
  try {
    // for Production
    //sdk.server('https://api.cashfree.com/pg');

    // for testing
    const order_id = req.query.order_id;

    // await axios.get(`https://sandbox.cashfree.com/pg/orders/1081125543909647`,
    await axios.get(`https://sandbox.cashfree.com/pg/orders/${order_id}`,
    {headers: {
      'Content-Type': 'application/json',
      'x-client-id': process.env.APP_ID,
      'x-client-secret': process.env.SECRET_KEY,
      'x-api-version': "2022-01-01"
    }})
    .then(async(result) => {
      // console.log(result);
      const datass = {
        cf_order_id: result?.data.cf_order_id,
        orderId: result?.data.order_id,
        booking_id: result?.data.order_tags.booking_id,
        dealer_id: result?.data.order_tags.dealer_id,
        user_id: result?.data.customer_details.customer_id,
        orderAmount: result?.data.order_amount,
        order_status: result?.data.order_status,
        order_token: result?.data.order_token,
      }

      await Payment.create(datass);
      const dataz = {
        "amount": result?.data.order_amount,
        "Cashfree_order_id":result.data.cf_order_id,
        "orderId": result?.data.order_id,
        "order_status": result?.data.order_status
      }

      // var computedsignature = crypto.createHmac('sha256', secretKey).update(signatureData).digest('base64');
      // dataz['signature'] = req.body.signature;
      // dataz['computedsignature'] = computedsignature;

      res.render('response', { postData: JSON.stringify(dataz) });

      // var response = {
      //   status: 200,
      //   message: "Payment Process Complete",
      //   data: dataz,
      // };
      // return res.status(200).send(response);


      // var response = {
      //   status: 200,
      //   message: "Payment Process Complete",
      //   amount: result?.data.order_amount,
      //   Cashfree_order_id:result.data.cf_order_id,
      //   order_status:result?.data.order_status,
      // };
      // return res.status(200).send(response);
    })
    .catch((e) => {
      console.error(e.stack)
      return res.send(e);
    })

/*
    sdk.server('https://sandbox.cashfree.com/pg');
    const result = await sdk.GetOrder({
      order_id: order_id,
      'x-client-id': process.env.APP_ID,
      'x-client-secret': process.env.SECRET_KEY,
      'x-api-version': "2022-01-01"
    })
  if(result)
  {
    const datass = {
      cf_order_id: result.cf_order_id,
      orderId: result.order_id,
      booking_id: result.order_tags.booking_id,
      dealer_id: result.order_tags.dealer_id,
      user_id: result.customer_details.customer_id,
      orderAmount: result.order_amount,
      order_status: result.order_status,
      order_token: result.order_token,
    }
    await Payment.create(datass);
    const dataz = {
      orderId: result.order_id,
      order_status: result.order_status,
    }
    var response = {
      status: 200,
      message: "Payment Process Complete",
      data: dataz,
    };
    return res.status(200).send(response);
  }
  */
     
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
  paymentRequest,
  paymentResponse,
  paymentInvoices,
  payment,
  GetPaymentOrder,
  GetAllPayment,
  Cashpayment,
  GetPayment,
  CashfreePayment,
  deletePayment,
  cashfreePayout,
  Payout,
  Returnurl
}