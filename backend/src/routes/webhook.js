const express = require("express");
const router = express.Router();
const webhookController = require("../controllers/webhookController");

// Webhook de Khipu
router.post(
  "/khipu",
  webhookController.handleKhipuWebhook.bind(webhookController),
);

module.exports = router;