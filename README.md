# 🛍️ Khipu E-commerce Demo

Demo de integración de Khipu con Astro.js y Node.js para pagos en línea adaptado para el mercado peruano. **Proyecto configurado exclusivamente para desarrollo local.**

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
KHIPU_SECRET=tu_clave_secreta_aqui
KHIPU_BASE_URL=https://payment-api.khipu.com
FRONTEND_URL=http://localhost:4321
BACKEND_URL=http://localhost:3001
PORT=3001
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
    "total": 100,
    "currency": "PEN"
  }'
```

## 📱 Flujo de Pago Implementado

1. ✅ Usuario agrega productos al carrito (localStorage)
2. ✅ Hace clic en "Pagar con Khipu"
3. ✅ Backend crea pago en Khipu (1 PEN fijo para desarrollo)
4. ✅ Usuario es redirigido a Khipu para completar pago
5. ✅ Usuario selecciona su banco y completa pago
6. 🔄 Khipu notifica via webhook (implementado)
7. ✅ Usuario vuelve a página de éxito/cancelación

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

- **Moneda**: PEN (Soles Peruanos)
- **Monto de desarrollo**: 1 PEN fijo (sin importar cantidad de productos)
- **Mercado objetivo**: Perú
- **Estado**: ✅ **FUNCIONANDO** - Integración Khipu completada

## 🛠️ Tecnologías

- **Frontend**: Astro 5.13.8 + TailwindCSS 4.1.13
- **Backend**: Node.js + Express
- **Pagos**: Khipu API
- **Storage**: localStorage (sin base de datos)

## 📁 Estructura del Proyecto

```
/
├── client/                 # Frontend Astro (Puerto 4321)
│   ├── src/components/     # ✅ Carrito, productos, botón Khipu
│   ├── src/pages/          # ✅ Index, éxito, cancelación
│   └── src/utils/          # ✅ Cliente API para backend
├── backend/                # Backend Node.js (Puerto 3001)
│   ├── src/controllers/    # ✅ Pagos y webhooks implementados
│   ├── src/services/       # ✅ Servicio Khipu configurado
│   ├── src/routes/         # ✅ API endpoints funcionando
│   ├── src/middleware/     # ✅ CORS configurado
│   └── .env               # Variables de entorno Khipu
├── CLAUDE.md              # Instrucciones para Claude
├── CONFIGURACION_KHIPU.md # Guía configuración Khipu
└── README.md              # Este archivo
```