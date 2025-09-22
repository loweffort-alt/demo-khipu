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
      // Convertir PEN a CLP si es necesario (Khipu principalmente soporta CLP)
      let amount = paymentData.amount;
      let currency = paymentData.currency || "PEN";

      // Si la moneda es PEN, convertir a CLP (tasa aproximada: 1 PEN = 130 CLP)
      if (currency === "PEN") {
        amount = Math.round(amount * 130); // Conversión aproximada PEN a CLP
        currency = "CLP";
        console.log(`[KHIPU] Convirtiendo de PEN ${paymentData.amount} a CLP ${amount}`);
      }

      const payload = {
        receiver_id: this.receiverId,
        subject: paymentData.subject,
        amount: amount,
        currency: currency
      };

      console.log('[KHIPU] Creating payment with minimal payload:', JSON.stringify(payload, null, 2));
      console.log('[KHIPU] API Key (first 10 chars):', this.apiKey.substring(0, 10) + '...');
      console.log('[KHIPU] Receiver ID:', this.receiverId);
      console.log('[KHIPU] Base URL:', this.baseUrl);

      const response = await this.client.post("/v3/payments", payload);
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
      const response = await this.client.get(`/v3/payments/${paymentId}`);
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
      const response = await this.client.get("/v3/banks");
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

    // Mensaje específico para error 403
    if (error.response?.status === 403) {
      console.error(`[KHIPU ERROR] 403 Forbidden: El API key no tiene privilegios suficientes.
      Soluciones:
      1. Verificar que el API key sea válido y esté activo
      2. Asegurarse de que la cuenta tenga permisos para crear pagos
      3. Contactar soporte de Khipu si el problema persiste`);
    }
  }
}

module.exports = new KhipuService();