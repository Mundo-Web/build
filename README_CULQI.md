# 🛠️ Configuración e Integración de Culqi

Este documento describe el funcionamiento y la configuración de la pasarela **Culqi** en la tienda, incluyendo variables de entorno (`.env`), opciones administrativas y el webhook para pagos offline (Yape, PagoEfectivo, Banca Móvil, Agentes, Billeteras).

---

## 1. Variables de Entorno (`.env`)

Asegúrate de definir estas variables en tu archivo `.env` en la raíz del proyecto:

```env
# Claves API de Culqi (Pruebas o Producción)
CULQI_PUBLIC_KEY=pk_live_xxxxxxxxxxxxxxxx
CULQI_PRIVATE_KEY=sk_live_xxxxxxxxxxxxxxxx

# Identificadores de encriptación (opcional si usas llaves RSA)
CULQI_RSA_ID=
CULQI_RSA_PUBLIC_KEY=

# Correlativo único para los números de orden (ej: #TIENDA-CHK-XXXX)
APP_CORRELATIVE=TIENDA
```

* **`CULQI_PUBLIC_KEY`**: Clave pública usada en el frontend. Si inicia con `pk_live_`, el checkout cambiará automáticamente a modo de producción.
* **`CULQI_PRIVATE_KEY`**: Clave secreta para validación de cargos y webhooks en el backend.
* **`APP_CORRELATIVE`**: Prefijo que se antepone a los números de orden para evitar colisiones entre bases de datos o tiendas en el mismo panel de Culqi.

---

## 2. Configuración en el Admin (Ajustes Generales)

En la sección **Ajustes Generales** del panel administrativo se pueden activar/desactivar de manera individual los distintos canales de pago de Culqi:

* **Tarjeta**: Pagos tradicionales con tarjetas de débito/crédito.
* **Yape**: Pagos rápidos usando código QR o número telefónico.
* **Banca Móvil**: Pago mediante la banca online de cualquier banco peruano.
* **Agentes / Bodegas**: Generación de un código CIP para pagar en efectivo en agentes autorizados.
* **Billeteras**: Pagos rápidos a través de Plin u otras billeteras.

Estos interruptores guardan su estado en la base de datos bajo las siguientes claves:
* `checkout_culqi_enable_card`
* `checkout_culqi_enable_yape`
* `checkout_culqi_enable_banking`
* `checkout_culqi_enable_agent`
* `checkout_culqi_enable_wallet`

---

## 3. Configuración del Webhook en CulqiPanel

Para que las órdenes offline actualicen de manera asíncrona la venta a **Pagado**, debes registrar el webhook:

1. Inicia sesión en **[panel.culqi.com](https://panel.culqi.com)**.
2. Ve a la sección **Desarrollo** → **Webhooks** en el menú izquierdo.
3. Haz clic en **+ Añadir Webhook**.
4. Configura los siguientes campos:
   * **URL de destino**: `https://tudominio.com/api/culqi/webhook`
   * **Evento a escuchar**: Selecciona únicamente **`order.status.changed`**.
5. Haz clic en **Guardar**.

> [!NOTE]
> Para pruebas en desarrollo local (`localhost`), utiliza **ngrok** para exponer tu servidor y generar una URL pública temporal para registrarla en el panel de Culqi:
> `ngrok http 80` (o el puerto de tu servidor local).

---

## 4. Flujo de Estados del Webhook

El webhook llamará a la URL de destino cada vez que la orden cambie de estado. El backend lee el parámetro `data.state` y actualiza la venta local:

| Valor de `state` | Significado | Estado Resultante en Tienda | Acción Backend |
|---|---|---|---|
| `pending` | Código CIP / QR generado. El cliente aún no paga. | **Pendiente** | Conserva el stock reservado. |
| `paid` | El pago fue completado con éxito. | **Pagado** ✅ | Cambia estado a Pagado y envía notificaciones por WhatsApp e Email. |
| `expired` | El tiempo de expiración (24h/30m) venció sin recibir el pago. | **Cancelado / Expirado** ❌ | Cancela la orden y libera el stock al inventario. |

---

## 5. Monitoreo y Verificación

Puedes monitorizar la llegada de webhooks en tiempo real filtrando los logs de Laravel:

```bash
tail -f storage/logs/laravel.log | grep -E "Culqi|webhook|processOrder"
```
