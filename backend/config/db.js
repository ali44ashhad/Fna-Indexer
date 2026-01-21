import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error(
      "MONGO_URI is not set. Add it to your environment (and Vercel project env vars)."
    );
  }

  // Serverless-friendly: reuse existing connection if already connected
  if (mongoose.connection?.readyState === 1) return;

  await mongoose.connect(uri);
  console.log("MongoDB connected");
};

export default connectDB;
