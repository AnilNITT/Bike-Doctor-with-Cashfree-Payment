const mongoose = require("mongoose");
const serviceSchema = new mongoose.Schema({
  name: String,
  image:String,
  city:String,
  area:String,
  description: String,
  estimated_cost: Number,
  tax: Number,
  created_by: String,
  features:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Feature"
  }],
  salient_features:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Salientfeature"
  }],
  status:{
    type: Number,
    default: 1, // 0 = inactive , 1 = active
  },
},
{
  timestamps:true,  
}
);

module.exports = mongoose.model("service", serviceSchema);
