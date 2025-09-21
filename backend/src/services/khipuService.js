const axios = require("axios");

class KhipuService {
  constructor() {
    this.apiKey = process.env.KHIPU_API_KEY;
    this.receiverId = process.env.KHIPU_RECEIVER_ID;
    this.baseUrl = process.env.KHIPU_BASE_URL;

    if (!this.apiKey || !this.receiverId) {
      throw new Error("Khipu credentials are required");
    }

    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
      },
      timeout: 10000,
    });

    // Interceptor para logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(
          `[KHIPU] Request: ${config.method?.toUpperCase()} ${config.url}`,
        );
        return config;
      },
      (error) => {
        console.error("[KHIPU] Request error:", error.message);
        return Promise.reject(error);
      },
    );

    this.client.interceptors.response.use(
      (response) => {
        console.log(
          `[KHIPU] Response: ${response.status} - ${response.config.url}`,
        );
        return response;
      },
      (error) => {
        console.error(
          "[KHIPU] Response error:",
          error.response?.data || error.message,
        );
        return Promise.reject(error);
      },
    );
  }

  /**
   * Crear un pago en Khipu
   */
  async createPayment(paymentData) {
    try {
      const payload = {
        subject: paymentData.subject,
        amount: paymentData.amount,
        currency: paymentData.currency || "CLP",
        transaction_id: paymentData.transactionId,
        return_url: paymentData.returnUrl,
        cancel_url: paymentData.cancelUrl,
        notify_url: paymentData.notifyUrl,
        expires_date: paymentData.expiresDate || this.getDefaultExpiration(),
      };

      const response = await this.client.post("/payments", payload);
      return response.data;
    } catch (error) {
      this.handleError(error, "createPayment");
      throw new Error("Failed to create Khipu payment");
    }
  }

  /**
   * Obtener información de un pago
   */
  async getPayment(paymentId) {
    try {
      const response = await this.client.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, "getPayment");
      throw new Error("Failed to get payment information");
    }
  }

  /**
   * Obtener lista de bancos disponibles
   */
  async getBanks() {
    try {
      const response = await this.client.get("/banks");
      return response.data;
    } catch (error) {
      this.handleError(error, "getBanks");
      throw new Error("Failed to get banks list");
    }
  }

  /**
   * Generar fecha de expiración por defecto (24 horas)
   */
  getDefaultExpiration() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString();
  }

  /**
   * Manejo centralizado de errores
   */
  handleError(error, operation) {
    const errorInfo = {
      operation,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    };

    console.error(`[KHIPU ERROR] ${operation}:`, errorInfo);
  }
}

module.exports = new KhipuService();