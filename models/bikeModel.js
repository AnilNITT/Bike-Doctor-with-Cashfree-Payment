const mongoose = require("mongoose");
const bikeSchema = new mongoose.Schema(
  {
      name: {
        type:String,
      },
      model:{
        type:String,
      },
      bike_cc:{
        type:Number,
      },
      extra_charges:{
        type:Number,
      },
  },
  {
    timestamps:true,
  }
  );

module.exports = mongoose.model(
    "bike", bikeSchema
  );
