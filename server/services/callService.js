const twilio = require("twilio");

const client = twilio(
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN"
);

async function makeCall(phone) {

  await client.calls.create({

    twiml: `
      <Response>
        <Say>
          Your child applied leave.
          Press 1 to approve.
          Press 2 to reject.
        </Say>
      </Response>
    `,

    to: phone,

    from: "+1234567890"

  });

}

module.exports = makeCall;