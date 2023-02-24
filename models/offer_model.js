const mongoose = require("mongoose");
const moment = require("moment");

const OfferSchema = new mongoose.Schema(
  {
    service_id:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"service"
    },
    promo_code: 
    {
      type:String,
      unique:true
    },
    city:String,
    start_date: Date,
    end_date: Date,
    // noofuses: String,
    discount: Number,
    minorderamt: String,
    // repeat_usage: String,
  },
  {
    timestamps:true,  
  }
  )

module.exports = mongoose.model("offer", OfferSchema)