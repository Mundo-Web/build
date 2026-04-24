Especificación de Alcance Funcional - Sistema de Ventas

Este documento detalla los requerimientos técnicos y funcionales para la implementación de las nuevas características de impuestos (IGV y Percepción) y gestión de embalaje en las plataformas Frontend y Backend.

1. Alcance Funcional – FRONTEND

🛒 Selector de IGV por Producto

Gestión de Catálogo: Incorporación de una nueva columna tipo checkbox en el panel de gestión de productos para activar/desactivar la aplicación del IGV ($18\%$).

Identificación Visual: Actualización de la interfaz administrativa para distinguir rápidamente productos afectos y exonerados.

Lógica de Carrito: Adaptación de la interfaz del carrito para reflejar el cálculo de IGV basado únicamente en los ítems seleccionados.

Resumen Dinámico: Visualización clara en el resumen del pedido del monto total de IGV calculado en tiempo real.

⚖️ Impuesto de Percepción (2%)

Interfaz de Checkout: Actualización del carrito y proceso de pago para mostrar el desglose del impuesto de percepción.

Detalle de Concepto: Visualización explícita del cargo adicional bajo el concepto "Percepción (2%)".

Validaciones Visuales: Alertas o indicadores visuales cuando el carrito contiene productos sujetos a este impuesto (ej. harinas, bebidas).

Consolidación de Totales: Inclusión del monto en el resumen final antes de la confirmación de compra.

🛍️ Opción de Compra de Bolsas o Embalaje

Sección de Checkout: Nueva sección para que el cliente elija agregar bolsas o embalaje.

Catálogo de Empaques: Presentación de opciones con detalles de tamaño, tipo y costo.

Actualización Síncrona: Recálculo inmediato del total del pedido al modificar cantidades de embalaje.

2. Alcance Funcional – BACKEND

⚙️ Lógica de IGV por Producto

Esquema de Base de Datos: Nuevo campo booleano (is_taxable o similar) en la tabla de productos.

Motor de Cálculo: Modificación de la lógica del servidor para iterar sobre los productos del carrito y aplicar el factor $1.18$ solo donde corresponda.

APIs de Transacción: Actualización de los endpoints de /cart y /checkout para retornar el desglose de impuestos consistente.

📉 Impuesto de Percepción

Reglas de Negocio:

Identificación de categorías sujetas: Harinas y Bebidas.

Umbral de Aplicación: Implementación de la regla de cálculo del $2\%$ solo cuando el monto de los productos aplicables supere los S/ 100.

Integración de Totales: Inserción del cálculo en el motor de precios global.

Persistencia y Auditoría: Registro del impuesto en la tabla de órdenes para fines de facturación y reportes contables.

📦 Gestión de Bolsas o Embalaje

Estructura Configurable: Creación de tablas para gestionar tipos de bolsas, precios y stock.

Endpoints de Consulta: Desarrollo de APIs para proveer al frontend las opciones vigentes de embalaje.

Cálculo Compuesto: Lógica para sumar el costo de bolsas al total, considerando que el costo de la bolsa también está afecto a IGV.

Registro de Orden: Almacenamiento detallado del embalaje seleccionado dentro del objeto de la orden final.

📅 Roadmap de Implementación

[ ] Sprint 1: Actualización de base de datos y panel administrativo (Checkboxes de IGV).

[ ] Sprint 2: Motor de cálculo Backend (IGV + Percepción) y APIs.

[ ] Sprint 3: Interfaz de Carrito y Checkout (Visualización de impuestos).

[ ] Sprint 4: Módulo de Bolsas/Embalaje y Pruebas Integrales.

Documento generado para el equipo de desarrollo y QA.
