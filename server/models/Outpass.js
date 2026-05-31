const mongoose = require("mongoose");

const OutpassSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  reason: String,
  fromDate: String,
  toDate: String,
  status: {
    type: String,
    default: "Pending"
  }
});

module.exports = mongoose.model("Outpass", OutpassSchema);
