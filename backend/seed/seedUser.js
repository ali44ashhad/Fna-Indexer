import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import "dotenv/config";
import User from "../models/user.js";

const seedUser = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is not set in environment variables");
    }

    await mongoose.connect(uri);
    console.log("MongoDB connected");

    const email = "fnamarketingsolution@gmail.com";
    const password = "@Qbook2187";
    const name = "Jatin Jain";

    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) {
      console.log("User already exists with email:", email);
      await mongoose.disconnect();
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    console.log("User seeded successfully!");
    console.log("Email:", email);
    console.log("Name:", name);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding user:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedUser();
