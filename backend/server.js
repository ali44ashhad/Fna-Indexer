import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// Allow ALL origins - any domain can access
const corsOptions = {
  origin: function (origin, callback) {
    // Allow all origins (including null for same-origin requests)
    callback(null, true);
  },
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
    console.error("Database connection error:", err);
    // Ensure CORS headers are set even on error
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(500).json({
      message: err?.message || "Database connection failed",
      error: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
});
 
app.use("/api/auth", authRoutes);
 
app.get("/", (req, res) => {
  res.json({ status: "Backend running 🚀" });
});

// Global error handler - must be after all routes
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  // Ensure CORS headers are set even on error
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Handle 404s
app.use((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(404).json({ message: "Route not found" });
});
 
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 5005;
  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
}

export default app;
