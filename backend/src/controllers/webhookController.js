const crypto = require("crypto");

class WebhookController {
  /**
   * Manejar notificaciones de Khipu
   */
  async handleKhipuWebhook(req, res) {
    try {
      console.log("[WEBHOOK] Received notification from Khipu");

      const signature = req.headers["x-khipu-signature"];
      const payload = req.body;

      // Verificar firma si está configurada (recomendado para producción)
      if (process.env.WEBHOOK_SECRET && signature) {
        const isValid = this.verifySignature(
          JSON.stringify(payload),
          signature,
          process.env.WEBHOOK_SECRET,
        );

        if (!isValid) {
          console.error("[WEBHOOK] Invalid signature");
          return res.status(401).json({ error: "Invalid signature" });
        }
      }

      // Extraer datos del webhook
      const {
        payment_id,
        transaction_id,
        amount,
        currency,
        status,
        subject,
        payer_name,
        payer_email,
      } = payload;

      console.log(`[WEBHOOK] Payment notification: ${payment_id} - ${status}`);

      // Buscar pago en memoria
      global.pendingPayments = global.pendingPayments || new Map();
      const payment = global.pendingPayments.get(transaction_id);

      if (payment) {
        // Actualizar estado del pago
        payment.status = "confirmed";
        payment.confirmedAt = new Date().toISOString();
        payment.khipuStatus = status;
        payment.payerInfo = {
          name: payer_name,
          email: payer_email,
        };

        console.log(
          `[WEBHOOK] Updated payment status for transaction ${transaction_id}`,
        );

        // Aquí podrías agregar lógica adicional como:
        // - Enviar emails de confirmación
        // - Actualizar inventario
        // - Integrar con sistemas externos
      } else {
        console.warn(
          `[WEBHOOK] Payment not found for transaction ${transaction_id}`,
        );
      }

      // Responder con éxito (requerido por Khipu)
      res.status(200).json({
        received: true,
        transaction_id: transaction_id,
      });
    } catch (error) {
      console.error("[WEBHOOK] Processing error:", error);
      res.status(500).json({
        error: "Webhook processing failed",
      });
    }
  }

  /**
   * Verificar firma del webhook
   */
  verifySignature(payload, signature, secret) {
    try {
      // Parsear signature header
      const parts = signature.split(",");
      const timestamp = parts.find((p) => p.startsWith("t=")).replace("t=", "");
      const hash = parts.find((p) => p.startsWith("s=")).replace("s=", "");

      // Crear string para verificar
      const signedPayload = timestamp + payload;

      // Calcular hash esperado
      const expectedHash = crypto
        .createHmac("sha256", secret)
        .update(signedPayload, "utf8")
        .digest("base64");

      return hash === expectedHash;
    } catch (error) {
      console.error("[WEBHOOK] Signature verification error:", error);
      return false;
    }
  }
}

module.exports = new WebhookController();