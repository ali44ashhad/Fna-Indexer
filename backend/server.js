import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ status: "Backend running 🚀" });
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
