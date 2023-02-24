const mongoose = require("mongoose");

const DealerSchema = new mongoose.Schema ({
    name: String,
    email: String,
    password: {
      type:String,
      select:false,
    },
    phone: Number,
    state: String,
    city: String,
    address: String,
    // pincode: Number,
    latitude: Number,
    longitude: Number, 
    create_by: String,
    otp:Number,
},
{
  timestamps:true,
}
);


module.exports = mongoose.model("dealer", DealerSchema);