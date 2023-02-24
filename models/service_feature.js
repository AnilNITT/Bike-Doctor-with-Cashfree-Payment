const mongoose  =require("mongoose")

const featureSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    image: {
        type: String,
    },
    description:{
        type:String,
    },
    service_id:{
        type:String,
    },
    service_name:{
        type:String,
    },
},
{
    timestamps:true
})

module.exports = mongoose.model("Feature",featureSchema);