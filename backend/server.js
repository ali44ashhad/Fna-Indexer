import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

const allowedOrigins = ["https://fna-indexer.vercel.app"];

connectDB();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl) or from our frontend
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ status: "Backend running 🚀" });
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
