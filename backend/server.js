import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// Allow ALL origins - koi bhi domain access kar sakta hai
const corsOptions = {
  origin: "*", // Explicitly allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// IMPORTANT: preflight must use the same options
app.options("*", cors(corsOptions));

 
app.use(express.json());

// Connect lazily (serverless-safe). If env is missing, return clear 500.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({
      message: err?.message || "Database connection failed",
    });
  }
});
 
app.use("/api/auth", authRoutes);
 
app.get("/", (req, res) => {
  res.json({ status: "Backend running 🚀" });
});
 
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 5005;
  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
}

export default app;
