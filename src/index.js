import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import websiteRoutes from "./routes/routes.js";
import prisma from "./models/db.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

dotenv.config();

const app = express();

// Trust proxy headers (important for correct IP detection behind proxies like Render, Heroku, etc.)
app.set('trust proxy', true);

// Global rate limiter (e.g., 100 requests per 15 minutes per IP)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: "Too many requests, please try again later." },
});

app.use(globalLimiter);

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/websites", websiteRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
