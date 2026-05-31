const Profile = require("../models/Profile");
const User = require("../models/User");

exports.createProfile = async (req, res) => {
  try {
    const profile = await Profile.create({
      ...req.body,
      userId: req.user.id
    });

    res.json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const profile = await Profile.findOne({
      userId: req.user.id
    });

    res.json({
      ...profile?.toObject(),
      role: user?.role || 'student'
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
