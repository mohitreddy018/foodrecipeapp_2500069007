
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./auth/User");

async function createAdmin() {
  try {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error(
        "Set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env"
      );
    }

    if (ADMIN_PASSWORD.length < 12) {
      throw new Error("Choose an admin password of at least 12 characters.");
    }

    await mongoose.connect(process.env.MONGO_URI);

    const email = ADMIN_EMAIL.trim().toLowerCase();
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          name: ADMIN_NAME.trim(),
          email,
          password: hashedPassword,
          role: "admin"
        }
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );

    console.log("Admin account is ready!");
    console.log("Name:", user.name);
    console.log("Email:", user.email);
    console.log("Role:", user.role);
    console.log("Password stored securely as a hash.");
  } catch (error) {
    console.error("Could not create admin:", error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

createAdmin();
