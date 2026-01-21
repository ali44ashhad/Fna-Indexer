import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
 
const allowedOrigins = [
  // Deployed frontend (Origin header never includes a trailing slash)
  "https://fna-indexer.vercel.app",
  // Local Vite dev
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, server-to-server, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Reject disallowed origins (no CORS headers will be returned)
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false, // set true ONLY if using cookies
};
 
app.use(cors(corsOptions));
 
// IMPORTANT: preflight must use the same options, otherwise it may omit headers
app.options("*", cors(corsOptions));

 
app.use(express.json());

 
connectDB();
 
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
