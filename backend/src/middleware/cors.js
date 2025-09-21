const cors = require("cors");

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:4321",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-khipu-signature"],
  credentials: true,
};

module.exports = cors(corsOptions);