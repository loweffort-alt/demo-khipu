# 🛍️ Khipu E-commerce Demo

Demo de integración de Khipu con Astro.js y Node.js para pagos en línea en el mercado peruano.

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js >= 18
- Cuenta de desarrollo en Khipu

### Configuración

1. **Clonar y configurar backend:**

```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales de Khipu
```

2. **Configurar frontend:**

```bash
cd client
npm install
```

3. **Iniciar servicios:**

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

## 📋 Configuración de Khipu

### Crear cuenta de desarrollo:

1. Ir a https://khipu.com/user/register
2. Activar "modo desarrollador" en tu perfil
3. Crear "cuenta de cobro de desarrollador"
4. Obtener credenciales en "Para integrar Khipu a tu sitio web"

### Variables requeridas:

```bash
# backend/.env
KHIPU_API_KEY=tu_clave_api_desarrollo_aqui
KHIPU_RECEIVER_ID=tu_id_cobrador_desarrollo_aqui
```

## 🧪 Testing

```bash
# Test backend API
curl -s http://localhost:3001/health

# Test payment creation
curl -X POST http://localhost:3001/api/payments/create \
  -H "Content-Type: application/json" \
  -d '{
    "cartItems": [{"id": 1, "title": "Test Product", "price": 100, "quantity": 1}],
    "total": 1,
    "currency": "PEN"
  }'
```

## 📱 Flujo de Pago

1. Usuario agrega productos al carrito
2. Hace clic en "Pagar con Khipu"
3. Backend crea pago en Khipu (1 PEN fijo para testing)
4. Usuario es redirigido a Khipu
5. Completa pago en banco de prueba
6. Khipu notifica via webhook
7. Usuario vuelve a página de éxito

## 🏗️ Arquitectura

```
Frontend (Astro + Client) → Backend (Node/Express) → Khipu API
                     ↖          ↙
                      Webhook Notifications
```

## 📝 API Endpoints

- `POST /api/payments/create` - Crear pago
- `GET /api/payments/status/:id` - Estado de pago
- `GET /api/payments/banks` - Lista de bancos
- `POST /webhook/khipu` - Webhook de Khipu
- `GET /health` - Health check

## 🇵🇪 Configuración para Perú

- **Moneda**: PEN (Nuevos Soles Peruanos)
- **Monto de testing**: 1 PEN fijo
- **Mercado objetivo**: Perú

## 🛠️ Tecnologías

- **Frontend**: Astro 5.13.8 + TailwindCSS 4.1.13
- **Backend**: Node.js + Express
- **Pagos**: Khipu API
- **Storage**: localStorage (sin base de datos)

## 📁 Estructura del Proyecto

```
/
├── client/                 # Frontend Astro application
│   ├── src/components/     # Componentes del carrito y productos
│   ├── src/pages/          # Páginas (index, éxito, cancelación)
│   └── src/utils/          # Cliente API
├── backend/                # Backend Node.js
│   ├── src/controllers/    # Controladores de pago y webhook
│   ├── src/services/       # Servicio de Khipu
│   ├── src/routes/         # Rutas de API
│   └── src/middleware/     # CORS y manejo de errores
└── README.md              # Este archivo
```