import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/connectDB.js";

// Get the directory name using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env
dotenv.config();

// Initialize express app
const app = express();

// Set port from environment variables, fallback to 3000
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "http://localhost:8000", "http://localhost:*"]
      }
    }
  })
); // Security middleware with CSP configuration for Swagger
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies

// Additional CORS headers
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, content-type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// Import Swagger
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';

// Import routes
import agencyRoutes from "./routes/agencyRoutes.js";
import physicianRoutes from "./routes/physicianRoutes.js";
import orderStatesRoutes from "./routes/orderStateRoutes.js";
import orderTypesRoutes from "./routes/orderTypeRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Ordina API",
    version: "1.0.0",
    documentation: "/api-docs",
    endpoints: {
      agencies: "/api/agencies",
      physicians: "/api/physicians",
      orderStates: "/api/order-states",
      orderTypes: "/api/order-types",
      inventory: "/api/inventory"
    }
  });
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Ordina API Documentation'
}));

// API Routes
app.use("/api/agencies", agencyRoutes);
app.use("/api/physicians", physicianRoutes);
app.use("/api/order-states", orderStatesRoutes);
app.use("/api/order-types", orderTypesRoutes);
app.use("/api/inventory", inventoryRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    status: "Error",
    message: "Route not found",
    availableRoutes: {
      documentation: "/api-docs",
      agencies: "/api/agencies",
      physicians: "/api/physicians",
      orderStates: "/api/order-states",
      orderTypes: "/api/order-types",
      inventory: "/api/inventory"
    }
  });
});

// Function to start the server
const startServer = async () => {
  try {
    // Wait for database connection before starting the server
    await connectDB();
    console.log("✅ Database connected successfully");

    app.listen(port, () => {
      console.log(`✅ Server is running on port ${port}`);
      console.log(`📚 Swagger API Documentation available at: http://localhost:${port}/api-docs`);
      console.log(`🚀 API Base URL: http://localhost:${port}/api`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1); // Exit with failure
  }
};

// Start the server
startServer();
