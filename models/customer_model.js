const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
    {
    first_name:{
        type:String,
    },
    last_name:{
        type:String,
    },
    email: {
        type: String,
        //required: [true, "Please enter an email"],
        //unique: [true, "Email already exists"],
    },
    password: {
        type: String,
        //required: [true, "Please enter a password"],
        // minlength: [6, "Password must be at least 6 characters"],
        select: false
    },
    phone:{
        type:Number,
        //required: [true, "Please enter a mobile no"],
        //minlength: [10, "Mobile no must be at least 10 digits"],
    },
    state:{
        type:String,
    },
    city:{
        type:String,
    },
    address:{
        type:String,
    },
    image: {
        type: String,
        default:"",
    },
    // wallet_money:{
    //   type:Number,
    //   default:0,
    // },
    otp:Number,
    // tnc:{
    //     type:Boolean,
    //     required: [true, "Please select Term n Conditions"],
    // },

    // gender:{
    //     type:String,
    //     enum :["MALE","FEMALE","OTHER"],
    // },
    // services:{
    //     type:[String],
    // },
    
    // img: { 
    //     data: Buffer, 
    //     contentType: String 
    // }, 
},
{
    timestamps:true
}
)

module.exports = mongoose.model("customers",CustomerSchema);