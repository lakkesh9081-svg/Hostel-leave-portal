const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({

  studentName: String,

  reason: String,

  fromDate: String,

  toDate: String,

  parentPhone: String,

  status: {
    type: String,
    default: "Pending"
  }

});

module.exports =
mongoose.model("Leave", leaveSchema);