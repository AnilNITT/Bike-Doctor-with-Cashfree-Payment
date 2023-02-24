
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema (
    {
        service_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"service"
        },
        dealer_id:{
            type:String,
            // type:mongoose.Schema.Types.ObjectId,
            // ref:"login"
        },
        dealer_address:{
            type:String,
        },
        dealer_phone:{
            type:Number,
        },
        bullet_points:{
            type:String,
        },
        additonal_options : [{
            type:String,
            default:[],
        }],
        model:{
            type:String,
        },
        brand:{
            type:String,
        },
        city:{
            type:String,
        },
        area:{
            type:String,
        },
        address:{
            type:String,
        },
        description:{
            type:String,
        },
        estimated_cost:{
            type:Number,
        },
        tax :{
            type:Number,
        },
        created_by:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"customers"
        },
        // payment_type:{
        //     type:String,
        // },
        create_date: {
            type: Date,
            default: Date.now
        },
        otp:Number,
        status:{
            type:String,
            enum : ["pending","confirmed","completed","payment"],
            default:'pending',
        },
},
{
    timestamps:true,
}
);


module.exports = mongoose.model("Booking", bookingSchema );