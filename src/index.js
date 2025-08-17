import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import websiteRoutes from "./routes/routes.js";
import prisma from "./models/db.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import docsLimiter from "./routes/routes.js"

dotenv.config();

const app = express();

// Trust proxy headers (important for correct IP detection behind proxies like Render, Heroku, etc.)
app.set('trust proxy', true);


app.use(cors());
app.use(express.json());

// Routes
app.use("/api/websites", websiteRoutes);
app.use("/docs", docsLimiter,swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "API is running " });
});

// Health check with database connectivity
app.get("/healthz", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log(`[HEALTHZ] ${new Date().toISOString()} - OK`);
    res.json({ status: "ok", db: "up" });
  } catch (err) {
    console.error(`[HEALTHZ] ${new Date().toISOString()} - DB DOWN:`, err.message);
    res.status(500).json({ status: "error", db: "down" });
  }
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
