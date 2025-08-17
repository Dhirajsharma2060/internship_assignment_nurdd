import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import websiteRoutes from "./routes/routes.js";
import prisma from "./models/db.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/websites", websiteRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "API is running " });
});

const PORT = process.env.PORT || 5000;

// Async server start for future extensibility
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to the database");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
