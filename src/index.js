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

// Trust proxy headers this is important for rate limiting in production
if (process.env.NODE_ENV === "production") {
  app.set('trust proxy', true);
}

app.use(cors());
app.use(express.json());

const docsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { error: "Too many docs requests, please try again later." },
});

// Routes
app.use("/api/websites", websiteRoutes);
app.use("/docs", docsLimiter, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
