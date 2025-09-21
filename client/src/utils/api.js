// src/utils/api.js
const API_BASE_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:3001";

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    };

    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body);
    }

    try {
      console.log(`[API] ${config.method || "GET"} ${url}`);

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`[API] Error:`, error);
      throw error;
    }
  }

  // Crear un pago
  async createPayment(cartItems, total, currency = "PEN") {
    return this.request("/api/payments/create", {
      method: "POST",
      body: {
        cartItems,
        total,
        currency,
      },
    });
  }

  // Obtener estado de pago
  async getPaymentStatus(transactionId) {
    return this.request(`/api/payments/status/${transactionId}`);
  }

  // Obtener lista de bancos
  async getBanks() {
    return this.request("/api/payments/banks");
  }

  // Health check del backend
  async healthCheck() {
    return this.request("/health");
  }
}

export default new ApiClient();