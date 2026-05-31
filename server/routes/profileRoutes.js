const router = require("express").Router();

const auth = require("../middleware/authMiddleware");

const {
  createProfile,
  getProfile
} = require("../controllers/profileController");

router.post("/", auth, createProfile);

router.get("/", auth, getProfile);

module.exports = router;
