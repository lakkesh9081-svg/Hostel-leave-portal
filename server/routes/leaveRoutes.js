const router = require("express").Router();
const twilio = require("twilio");
const Leave = require("../models/Leave");

const normalizePhone = (phone) => {
  const digitsOnly = phone.replace(/[^0-9]/g, "");

  if (/^[0-9]{10}$/.test(digitsOnly)) {
    return `+91${digitsOnly}`;
  }

  if (/^0[0-9]{10}$/.test(digitsOnly)) {
    return `+91${digitsOnly.slice(1)}`;
  }

  if (/^[0-9]{11,15}$/.test(digitsOnly) && phone.trim().startsWith("+")) {
    return `+${digitsOnly}`;
  }

  if (/^\+[0-9]{10,15}$/.test(phone.trim())) {
    return phone.trim();
  }

  return null;
};

router.post("/apply", async (req, res) => {
  try {
    const { studentName, parentPhone } = req.body;

    if (!studentName || !parentPhone) {
      return res.status(400).json({ message: "Student name and parent phone are required." });
    }

    const normalizedPhone = normalizePhone(parentPhone);
    if (!normalizedPhone) {
      return res.status(400).json({ message: "Parent phone must be a valid number. Use 10-digit Indian number like 8667419081 or +919867412345." });
    }

    req.body.parentPhone = normalizedPhone;
    const leave = await Leave.create(req.body);

    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
      return res.status(200).json({
        message: "Leave applied, but Twilio is not configured. Parent call was not sent.",
        leave
      });
    }

    const twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    try {
      const call = await twilioClient.calls.create({
        twiml: `
          <Response>
            <Say voice="alice">
              Hello. Your child ${studentName} has applied for hostel leave.
              Please check the hostel portal for more details.
            </Say>
          </Response>
        `,
        to: normalizedPhone,
        from: process.env.TWILIO_PHONE_NUMBER
      });

      return res.json({
        message: "Leave applied and parent call triggered.",
        leave,
        callSid: call.sid
      });
    } catch (callError) {
      console.error("Twilio call error:", callError);
      return res.status(200).json({
        message: "Leave applied, but parent call failed.",
        leave,
        error: callError.message
      });
    }
  } catch (error) {
    console.error("Leave apply error:", error);
    res.status(500).json({ message: error.message || "Leave apply failed." });
  }
});

module.exports = router;
