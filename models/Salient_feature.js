var mongoose  =require("mongoose")

const salientFeatureSchema = new mongoose.Schema({
    name:{
        type:String,
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

module.exports = mongoose.model("Salientfeature",salientFeatureSchema);