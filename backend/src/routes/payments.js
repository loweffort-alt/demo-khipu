const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Crear un nuevo pago
router.post("/create", paymentController.createPayment.bind(paymentController));

// Obtener estado de un pago
router.get(
  "/status/:transactionId",
  paymentController.getPaymentStatus.bind(paymentController),
);

// Obtener lista de bancos
router.get("/banks", paymentController.getBanks.bind(paymentController));

module.exports = router;