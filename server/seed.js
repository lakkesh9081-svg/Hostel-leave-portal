const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

dotenv.config();

const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hostelportal";
const User = require("./models/User");

const DEFAULT_PASSWORD = "Password123!";
const DEFAULT_USERS = [
  { name: "Student", email: "student@example.com", role: "student", phone: "+15550000001" },
  { name: "Parent", email: "parent@example.com", role: "parent", phone: "+15550000002" },
  { name: "Tutor", email: "tutor@example.com", role: "tutor", phone: "+15550000003" },
  { name: "HOD", email: "hod@example.com", role: "hod", phone: "+15550000004" },
  { name: "Warden", email: "warden@example.com", role: "warden", phone: "+15550000005" },
  { name: "Admin", email: "admin@example.com", role: "admin", phone: "+15550000006" }
];

async function seed() {
  try {
    await mongoose.connect(mongoUri);

    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    for (const userData of DEFAULT_USERS) {
      const normalizedEmail = userData.email.toLowerCase().trim();
      const existing = await User.findOne({ email: normalizedEmail });

      if (existing) {
        existing.name = userData.name;
        existing.role = userData.role;
        existing.phone = userData.phone;
        existing.password = hashedPassword;
        await existing.save();
        console.log(`Updated user: ${normalizedEmail} (${userData.role})`);
      } else {
        await User.create({
          name: userData.name,
          email: normalizedEmail,
          password: hashedPassword,
          role: userData.role,
          phone: userData.phone
        });
        console.log(`Seeded user: ${normalizedEmail} (${userData.role})`);
      }
    }

    await mongoose.disconnect();
    console.log("Seeding complete. Use password:", DEFAULT_PASSWORD);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
