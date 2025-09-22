require("dotenv").config();
const express = require("express");

// Middleware
const corsMiddleware = require("./middleware/cors");
const errorHandler = require("./middleware/errorHandler");

// Routes
const paymentsRoutes = require("./routes/payments");
const webhookRoutes = require("./routes/webhook");

const app = express();
const PORT = process.env.PORT || 3001;

// Inicializar almacenamiento en memoria
global.pendingPayments = new Map();

// CORS (necesario para desarrollo local)
app.use(corsMiddleware);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple logging para desarrollo
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check simple
app.get("/health", (req, res) => {
  res.json({ status: "OK", environment: "development" });
});

// API routes
app.use("/api/payments", paymentsRoutes);
app.use("/webhook", webhookRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);

  // Validar configuración de Khipu
  if (!process.env.KHIPU_API_KEY || !process.env.KHIPU_RECEIVER_ID) {
    console.warn("⚠️  WARNING: Khipu credentials not configured");
  } else {
    console.log("✅ Khipu configuration loaded");
  }
});

module.exports = app;