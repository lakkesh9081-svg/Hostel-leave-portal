const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const ROLES = ["student", "parent", "tutor", "hod", "warden"];

const DEFAULTS = {
  student: { email: "student@example.com", password: "Password123!", phone: "+15550000001" },
  parent: { email: "parent@example.com", password: "Password123!", phone: "+15550000002" },
  tutor: { email: "tutor@example.com", password: "Password123!", phone: "+15550000003" },
  hod: { email: "hod@example.com", password: "Password123!", phone: "+15550000004" },
  warden: { email: "warden@example.com", password: "Password123!", phone: "+15550000005" }
};

async function seed() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("Missing MONGO_URI in environment (.env)");
  }

  if (!process.env.JWT_SECRET) {
    // Not required for seeding, but helps you know env is incomplete.
    console.warn("Warning: missing JWT_SECRET (not required for seeding users)");
  }

  await mongoose.connect(mongoUri);

  for (const role of ROLES) {
    const { email, password } = DEFAULTS[role];

    const existing = await User.findOne({ email });
    if (existing) {
      // Update role if needed
      if (existing.role !== role) {
        existing.role = role;
        await existing.save();
        console.log(`Updated role for ${email} -> ${role}`);
      } else {
        console.log(`User exists: ${email} (${role})`);
      }
      continue;
    }

    const hash = await bcrypt.hash(password, 10);
    await User.create({
      name: role.charAt(0).toUpperCase() + role.slice(1),
      email,
      password: hash,
      role
    });

    console.log(`Seeded: ${email} (${role})`);
  }

  await mongoose.disconnect();
}

seed()
  .then(() => {
    console.log("Seeding complete");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });

