const errorHandler = (err, req, res, next) => {
  console.error("[ERROR]", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
  });

  // Error de validación
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      details: err.message,
    });
  }

  // Error de Khipu API
  if (err.response && err.response.data) {
    return res.status(err.response.status || 500).json({
      success: false,
      error: "Payment Service Error",
      details: err.response.data.message || "Unknown error",
    });
  }

  // Error genérico
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
};

module.exports = errorHandler;