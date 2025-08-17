import swaggerJSDoc from "swagger-jsdoc";
import dotenv from "dotenv";
const dotenvResult = dotenv.config();

if (dotenvResult.error) {
  console.error("dotenv failed to load:", dotenvResult.error);
} else {
  console.log("dotenv loaded successfully");
}

const serverUrl = process.env.API_BASE_URL || "http://localhost:5000";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Website Analysis API",
      version: "1.0.0",
      description: "API for scraping and managing website metadata",
    },
    servers: [
      {
        url: serverUrl,
      },
    ],
  },
  apis: ["./src/routes/routes.js", "./src/controllers/websiteController.js"], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;