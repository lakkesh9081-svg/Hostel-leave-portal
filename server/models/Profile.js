const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  department: String,
  year: String,
  roomNumber: String,
  phone: String,
  parentPhone: String,
  address: String
});

module.exports = mongoose.model("Profile", ProfileSchema);
