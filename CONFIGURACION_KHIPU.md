# Configuración de Khipu para Desarrollo Local (Peru)

⚠️ **IMPORTANTE:** Esta configuración es exclusivamente para desarrollo local.

## Error 403: API Key sin privilegios

Si recibes un error 403, significa que tu API key no tiene los privilegios necesarios para crear pagos.

### Pasos para solucionarlo:

1. **Obtener credenciales válidas:**
   - Inicia sesión en tu cuenta de Khipu
   - Ve a "Configuración" > "API Keys"
   - Asegúrate de tener una API key activa con permisos de "Crear pagos"

2. **Configurar variables de entorno:**
   ```bash
   cd backend
   cp .env.example .env
   ```

3. **Editar el archivo `.env` con tus credenciales reales:**
   ```env
   # Khipu Credentials (REEMPLAZAR CON TUS CREDENCIALES REALES)
   KHIPU_API_KEY=tu_api_key_real_aqui
   KHIPU_RECEIVER_ID=tu_receiver_id_real_aqui
   ```

### Verificar credenciales:

Puedes probar si tus credenciales funcionan con este comando curl:

```bash
curl -X POST https://payment-api.khipu.com/v3/payments \
  -H "Content-Type: application/json" \
  -H "x-api-key: TU_API_KEY" \
  -d '{
    "receiver_id": "TU_RECEIVER_ID",
    "subject": "Test payment",
    "amount": 1000,
    "currency": "CLP"
  }'
```

### Configuración para Desarrollo Local:

- **Puertos:** Frontend: 4321, Backend: 3001
- **CORS:** Configurado automáticamente para localhost
- **Ambiente:** Solo desarrollo - sin rate limiting ni helmet
- **Moneda:** PEN → CLP (1 PEN = 130 CLP aprox.)
- **Storage:** localStorage únicamente

### Si el problema persiste:

1. Contacta soporte de Khipu
2. Verifica que tu cuenta esté activa y verificada
3. Asegúrate de estar usando el ambiente correcto (desarrollo/producción)

### Para Peru específicamente:

Khipu está enfocado principalmente en Chile. Para Peru podrías considerar:
- Usar Khipu con conversión de moneda (como está implementado)
- Evaluar otros procesadores de pago locales peruanos
- Contactar Khipu para consultar sobre expansión a Peru