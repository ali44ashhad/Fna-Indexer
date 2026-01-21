import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
 
const allowedOrigins = [
  "https://fna-indexer.vercel.app",
  "http://localhost:5173",
];
 
app.use(
  cors({
    origin: (origin, callback) => { 
      if (!origin) {
        return callback(null, true);
      }
 
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
 
      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false, // set true ONLY if using cookies
  })
);
 
app.options("*", cors());

 
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
