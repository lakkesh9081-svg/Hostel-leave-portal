const router = require("express").Router();

const auth = require("../middleware/authMiddleware");

const {
  applyOutpass,
  getOutpasses,
  updateStatus
} = require("../controllers/outpassController");

router.post("/", auth, applyOutpass);

router.get("/", auth, getOutpasses);

router.put("/:id", auth, updateStatus);

module.exports = router;
