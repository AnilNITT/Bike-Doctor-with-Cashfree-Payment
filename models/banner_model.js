const mongoose = require("mongoose");
const bannerSchema = new mongoose.Schema({
  name: String,
  banner_image: {
    type: String,
    default: "",
  },
},
{
  timestamps:true,
}
);

module.exports = mongoose.model("Banner", bannerSchema);
