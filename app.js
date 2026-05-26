import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
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
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In production, restrict to frontend URL
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
  }
});

app.set('io', io); // Make io accessible in controllers

io.on('connection', (socket) => {
  console.log('🔌 A user connected:', socket.id);
  
  // Join personal room for user-specific notifications (like assignment)
  socket.on('joinUserRoom', (userId) => {
    if (userId) {
      socket.join(`user_${userId}`);
      console.log(`👤 User joined their personal room: user_${userId}`);
    }
  });

  // Join task-specific room for comment updates
  socket.on('joinTaskRoom', (taskId) => {
    if (taskId) {
      socket.join(`task_${taskId}`);
      console.log(`📋 User joined task room: task_${taskId}`);
    }
  });

  socket.on('leaveTaskRoom', (taskId) => {
    if (taskId) {
      socket.leave(`task_${taskId}`);
      console.log(`📋 User left task room: task_${taskId}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});

// Set port from environment variables, fallback to 3000
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    return callback(null, true);
  },
  credentials: true
})); // Enable proper CORS
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "http://localhost:8000", "http://localhost:*"],
        fontSrc: ["'self'", "https://cdnjs.cloudflare.com"]
      }
    }
  })
); // Security middleware with CSP configuration for Swagger
app.use(express.json({ limit: '50mb' })); // Parse incoming JSON requests
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Parse URL-encoded bodies


// Import Swagger
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Social Media Scheduler API",
    version: "1.0.0",
    documentation: "/api-docs",
    endpoints: {
      auth: "/api/auth"
    }
  });
});

// Swagger Documentation with CDN assets for Vercel compatibility
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Social Media Scheduler API Documentation',
  swaggerOptions: {
    url: '/api-docs/swagger.json',
  },
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css',
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.min.js'
  ]
}));

// Serve swagger spec as JSON
app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/tasks", commentRoutes);
app.use("/api/notifications", notificationRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    status: "Error",
    message: "Route not found",
    availableRoutes: {
      documentation: "/api-docs",
      auth: "/api/auth",
      auth: "/api/auth"
    }
  });
});

// Function to start the server
const startServer = async () => {
  try {
    // Wait for database connection before starting the server
    await connectDB();
    console.log("✅ Database connected successfully");

    server.listen(port, () => {
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
