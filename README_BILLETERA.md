# 🏦 Sistema de Billetera Virtual y Comisiones - Rainstar Store

Este documento explica detalladamente cómo funciona el sistema financiero para los vendedores y administradores.

## 1. Conceptos Fundamentales

### Saldo Disponible vs. Saldo en Proceso
- **Saldo Disponible**: Es el dinero líquido que el vendedor ya puede retirar. Incluye bonos de rango aprobados y comisiones de ventas que ya han sido **Entregadas**.
- **Comisiones en Proceso**: Son ganancias de ventas que han sido pagadas por el cliente pero que aún no han llegado al estado final de "Entregado". Estas comisiones son visibles pero no se pueden retirar para proteger a la empresa de devoluciones o cancelaciones de último minuto.

### ¿Qué sucede cuando solicito un retiro?
Cuando un vendedor solicita un retiro:
1. El monto solicitado se resta de su **Saldo Disponible**.
2. Se crea un registro en la tabla de `withdrawals` con estado **Pendiente**.
3. El vendedor puede ver este movimiento en su historial como un "Retiro" de color rojo.
4. **Impacto en el Rango**: Solicitar un retiro **NO AFECTA EL RANGO**. El rango se calcula en base al volumen total de ventas (prendas o puntos) acumulados históricamente o mensualmente. El retiro es simplemente una transferencia de efectivo de la plataforma a la cuenta del vendedor.

## 2. Ciclo de Vida de una Comisión

1. **Venta Generada**: El vendedor realiza una venta.
2. **Venta Pagada**: El cliente paga. El "Cerebro Financiero" genera las comisiones para el vendedor y su línea ascendente en estado **Pendiente**.
3. **Venta Entregada**: Cuando el administrador marca la venta como "Entregado", las comisiones pasan automáticamente a estado **Aprobado**. En este momento, el dinero se suma al **Saldo Disponible** del vendedor.
4. **Bono de Rango**: Cuando un vendedor sube de nivel, el bono se crea directamente como **Aprobado**, permitiendo el retiro inmediato de ese premio.

## 3. Proceso de Retiro para Administradores

1. El Admin recibe la notificación en el panel de **Solicitudes de Retiro**.
2. El Admin revisa los "Datos de Cobro" que el vendedor tenía configurados al momento de la solicitud (para evitar problemas si el vendedor cambia su cuenta después de pedir el dinero).
3. El Admin realiza la transferencia bancaria o el envío por Yape/Plin.
4. El Admin carga la foto del comprobante y marca la solicitud como **Completada**.
5. El vendedor recibe la confirmación y puede ver su comprobante en el sistema.

## 4. Requisitos para el Retiro
- **Monto Mínimo**: S/ 50.00.
- **Datos Bancarios**: El vendedor debe haber configurado su Banco, Número de Cuenta y/o Yape en su perfil antes de solicitar.

---
*Rainstar Store - Gestión Financiera Inteligente*
