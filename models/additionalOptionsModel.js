const mongoose = require("mongoose");
const additionalOptionsSchema = new mongoose.Schema({
    name: String,
    cost: Number,
    image:{
        type:String,
      },
  },
  {
    timestamps:true,
  }
  );

module.exports = mongoose.model(
    "additionalOptions", additionalOptionsSchema
   );