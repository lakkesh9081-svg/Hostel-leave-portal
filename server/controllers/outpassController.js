const Outpass = require("../models/Outpass");

exports.applyOutpass = async (req, res) => {
  try {
    const outpass = await Outpass.create({
      ...req.body,
      studentId: req.user.id
    });

    res.json(outpass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getOutpasses = async (req, res) => {
  try {
    const data = await Outpass.find()
      .populate("studentId", "name email");

    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Outpass.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
