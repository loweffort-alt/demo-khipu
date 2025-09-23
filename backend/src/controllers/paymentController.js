const khipuService = require("../services/khipuService");
const { v4: uuidv4 } = require("uuid");

class PaymentController {
  /**
   * Crear un nuevo pago
   */
  async createPayment(req, res) {
    try {
      const { cartItems, total, currency = "CLP" } = req.body;

      // Validar datos de entrada
      if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).json({
          success: false,
          error: "Cart items are required",
        });
      }

      if (!total || total <= 0) {
        return res.status(400).json({
          success: false,
          error: "Valid total amount is required",
        });
      }

      // Generar ID único para la transacción
      const transactionId = uuidv4();

      // Crear resumen de productos para el subject
      const itemsCount = cartItems.length;
      const subject = `Compra de ${itemsCount} producto${itemsCount > 1 ? "s" : ""} - ID: ${transactionId.slice(0, 8)}`;

      // MODO DESARROLLO: Siempre usar 1 sol
      const developmentAmount = 1.00;
      console.log(`[PAYMENT] Development mode: Using fixed amount ${developmentAmount} PEN instead of ${total}`);

      // Configurar datos del pago
      const paymentData = {
        subject: subject,
        amount: developmentAmount,
        currency: "PEN",
        transactionId: transactionId,
        returnUrl: `${process.env.FRONTEND_URL}/payment/success?transaction_id=${transactionId}`,
        cancelUrl: `${process.env.FRONTEND_URL}/payment/cancelled?transaction_id=${transactionId}`,
        notifyUrl: `${process.env.BACKEND_URL}/webhook/khipu`,
      };

      // Crear pago en Khipu
      const khipuPayment = await khipuService.createPayment(paymentData);

      // Guardar información del pago en memoria (localStorage del servidor simulado)
      // En un caso real, esto iría a una base de datos
      global.pendingPayments = global.pendingPayments || new Map();
      global.pendingPayments.set(transactionId, {
        transactionId,
        cartItems,
        total,
        currency,
        khipuPaymentId: khipuPayment.payment_id,
        status: "pending",
        createdAt: new Date().toISOString(),
      });

      console.log(`[PAYMENT] Created payment for transaction ${transactionId}`);

      res.json({
        success: true,
        data: {
          transaction_id: transactionId,
          payment_id: khipuPayment.payment_id,
          payment_url: khipuPayment.payment_url,
          amount: developmentAmount,
          currency: "PEN",
          expires_date: khipuPayment.expires_date,
        },
      });
    } catch (error) {
      console.error("[PAYMENT] Creation error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create payment",
      });
    }
  }

  /**
   * Obtener estado de un pago
   */
  async getPaymentStatus(req, res) {
    try {
      const { transactionId } = req.params;

      if (!transactionId) {
        return res.status(400).json({
          success: false,
          error: "Transaction ID is required",
        });
      }

      // Buscar pago en memoria
      global.pendingPayments = global.pendingPayments || new Map();
      const payment = global.pendingPayments.get(transactionId);

      if (!payment) {
        return res.status(404).json({
          success: false,
          error: "Payment not found",
        });
      }

      // Si el pago sigue pendiente, verificar con Khipu
      if (payment.status === "pending" && payment.khipuPaymentId) {
        try {
          const khipuPayment = await khipuService.getPayment(
            payment.khipuPaymentId,
          );

          // Actualizar estado basado en respuesta de Khipu
          if (khipuPayment.status === "done") {
            payment.status = "confirmed";
            payment.confirmedAt = new Date().toISOString();
          }
        } catch (error) {
          console.error("[PAYMENT] Status check error:", error);
          // No fallar la respuesta por esto
        }
      }

      res.json({
        success: true,
        data: {
          transaction_id: transactionId,
          status: payment.status,
          total: payment.total,
          currency: payment.currency,
          created_at: payment.createdAt,
          confirmed_at: payment.confirmedAt || null,
        },
      });
    } catch (error) {
      console.error("[PAYMENT] Status check error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get payment status",
      });
    }
  }

  /**
   * Obtener lista de bancos
   */
  async getBanks(req, res) {
    try {
      const banks = await khipuService.getBanks();

      res.json({
        success: true,
        data: banks,
      });
    } catch (error) {
      console.error("[BANKS] Get error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get banks list",
      });
    }
  }
}

module.exports = new PaymentController();