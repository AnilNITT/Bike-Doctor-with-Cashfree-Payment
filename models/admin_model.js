const mongoose = require("mongoose");

const suadminSchema = new mongoose.Schema({
    name: String,
    email: String,
    role:String,
    password:{
      type:String,
      select: false,
    },
  },
  {
    timestamps:true,
  })

//module.exports = mongoose.model("Admin", suadminSchema);
module.exports = mongoose.model("admin", suadminSchema);