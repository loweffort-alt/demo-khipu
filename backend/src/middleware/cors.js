const cors = require("cors");

// CORS simple para desarrollo local
const corsOptions = {
  origin: "http://localhost:4321",
  credentials: true
};

module.exports = cors(corsOptions);