import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import BaseAdminto from "@Adminto/Base";
import CreateReactScript from "../Utils/CreateReactScript";
import Table from "../Components/Adminto/Table";
import DxButton from "../Components/dx/DxButton";
import ReactAppend from "../Utils/ReactAppend";
import Swal from "sweetalert2";
import SalesRest from "../Actions/Admin/SalesRest";
import Global from "../Utils/Global";
import Number2Currency from "../Utils/Number2Currency";
import Modal from "../Components/Adminto/Modal";
import Tippy from "@tippyjs/react";
import SaleStatusesRest from "../Actions/Admin/SaleStatusesRest";
import SaleExportRest from "../Actions/Admin/SaleExportRest";
import SalesConfigRest from "../Actions/Admin/SalesConfigRest";
import * as XLSX from 'xlsx';
import SelectFormGroup from "../Components/Adminto/form/SelectFormGroup";
import { renderToString } from "react-dom/server";

const salesRest = new SalesRest();
const saleStatusesRest = new SaleStatusesRest();
const saleExportRest = new SaleExportRest();
const salesConfigRest = new SalesConfigRest();

const Sales = ({ statuses = [], hasRootRole = false }) => {
    const gridRef = useRef();
    const notifyClientRef = useRef()
    const modalRef = useRef();

    const [saleLoaded, setSaleLoaded] = useState(null);
    const [saleStatuses, setSaleStatuses] = useState([]);
    const [statusLoading, setStatusLoading] = useState(false);

    // Agregar estilos personalizados para el select
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .select2-container--default .select2-results__option {
                padding: 4px !important;
                background: white !important;
            }
            .select2-container--default .select2-results__option--highlighted[aria-selected] {
                background-color: #f8f9fa !important;
            }
            .select2-container--default .select2-results__option:hover {
                background-color: #f8f9fa !important;
            }
            .select2-container--default .select2-selection--single {
                border: 1px solid #e3ebf0 !important;
            }
        `;
        document.head.appendChild(style);
        
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const onStatusChange = async (e, sale) => {
        console.log({sale, saleLoaded})
        const status = statuses.find((s) => s.id == e.target.value)
        if (status.reversible == 0) {
            const { isConfirmed } = await Swal.fire({
                title: "Cambiar estado",
                text: `¿Estas seguro de cambiar el estado a ${status.name}?\nEsta acción no se puede revertir`,
                icon: "warning",
                showCancelButton: true,
            })
            if (!isConfirmed) return;
        }

        setStatusLoading(true)
        const result = await salesRest.save({
            id: sale.id,
            status_id: status.id,
            notify_client: notifyClientRef.current.checked
        });
        setStatusLoading(false)
        if (!result) return;
        
        const newSale = await salesRest.get(sale.id);
        setSaleLoaded(newSale.data);
        
        // Cargar el historial de estados usando la nueva API
        const statusHistory = await saleStatusesRest.bySale(sale.id);
        if (statusHistory) {
            setSaleStatuses(statusHistory);
        } else {
            setSaleStatuses([]);
        }
        
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Anular pedido",
            text: "¿Estas seguro de anular este pedido?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, anular",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await salesRest.delete(id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onModalOpen = async (saleId) => {
        notifyClientRef.current.checked = true
        const newSale = await salesRest.get(saleId);
        setSaleLoaded(newSale.data);
        
        // Cargar el historial de estados usando la nueva API
        const statusHistory = await saleStatusesRest.bySale(saleId);
        if (statusHistory) {
            setSaleStatuses(statusHistory);
        } else {
            setSaleStatuses([]);
        }
        
        $(modalRef.current).modal("show");
    };

    const [exportFilters, setExportFilters] = useState({
        startDate: '',
        endDate: '',
        status: ''
    });
    const [showConfigModal, setShowConfigModal] = useState(false);
    const configModalRef = useRef();
    const [exportConfig, setExportConfig] = useState({});


    // Cargar configuración de exportación al montar el componente
    useEffect(() => {
        if (hasRootRole) {
            loadExportConfig();
        }
    }, [hasRootRole]);

    // Monitorear cambios en exportConfig
    useEffect(() => {
        // Configuración cargada
    }, [exportConfig]);

    const loadExportConfig = async () => {
        try {
            const result = await salesConfigRest.getExportConfig();
            
            if (result && result.data && result.data.success && result.data.config) {
                // Usar exactamente la configuración guardada, respetando los campos en false
                setExportConfig(result.data.config);
            } else {
                // Si no hay configuración guardada, usar configuración vacía
                // La lógica de exportación manejará este caso
                setExportConfig({});
            }
        } catch (error) {
            console.error('Error loading export config:', error);
            // En caso de error, usar configuración vacía
            setExportConfig({});
        }
    };

    const saveExportConfig = async () => {
        try {
            const result = await salesConfigRest.saveExportConfig(exportConfig);
            if (result && result.success) {
                $(configModalRef.current).modal('hide');
                Swal.fire({
                    title: 'Configuración guardada',
                    text: 'La configuración de exportación se ha guardado correctamente',
                    icon: 'success',
                    timer: 2000
                });
            }
        } catch (error) {
            console.error('Error saving export config:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo guardar la configuración',
                icon: 'error'
            });
        }
    };

    // Definir todos los campos exportables organizados por categorías
    const exportableFieldsCategories = {
        'Información Básica de la Venta': {
            'ID_PEDIDO': 'ID del Pedido',
            'FECHA': 'Fecha de Venta',
            'ESTADO': 'Estado de la Venta',
            'REFERENCIA': 'Referencia',
            'COMENTARIO': 'Comentarios',
            'UBIGEO': 'Código Ubigeo'
        },
        'Información del Cliente': {
            'CLIENTE_NOMBRES': 'Nombres del Cliente',
            'CLIENTE_EMAIL': 'Email del Cliente',
            'CLIENTE_TELEFONO': 'Teléfono del Cliente',
            'TIPO_DOCUMENTO': 'Tipo de Documento',
            'NUMERO_DOCUMENTO': 'Número de Documento',
            'RAZON_SOCIAL': 'Razón Social'
        },
        'Información de Facturación': {
            'TIPO_COMPROBANTE': 'Tipo de Comprobante',
            'METODO_PAGO': 'Método de Pago',
            'ID_TRANSACCION': 'ID de Transacción',
            'ESTADO_PAGO': 'Estado del Pago'
        },
        'Información de Entrega': {
            'TIPO_ENTREGA': 'Tipo de Entrega',
            'DIRECCION_ENTREGA': 'Dirección de Entrega',
            'TIENDA_RETIRO': 'Tienda de Retiro',
            'DIRECCION_TIENDA': 'Dirección de Tienda',
            'TELEFONO_TIENDA': 'Teléfono de Tienda',
            'HORARIO_TIENDA': 'Horario de Tienda'
        },
        'Información del Producto': {
            'PRODUCTO_NOMBRE': 'Nombre del Producto',
            'PRODUCTO_SKU': 'SKU del Producto',
            'PRODUCTO_PRECIO_UNITARIO': 'Precio Unitario',
            'PRODUCTO_CANTIDAD': 'Cantidad',
            'PRODUCTO_SUBTOTAL': 'Subtotal del Producto',
            'PRODUCTO_TIPO': 'Tipo de Producto',
            'PRODUCTO_COLORES': 'Colores del Producto'
        },
        'Información de Combos': {
            'PRODUCTO_COMBO_ORIGINAL': 'Producto Combo Original',
            'PRODUCTO_COMBO_PRECIO_ORIGINAL': 'Precio Original del Combo',
            'PRODUCTO_COMBO_DESCUENTO_APLICADO': 'Descuento Aplicado al Combo',
            'PRODUCTO_COMBO_ITEMS': 'Items del Combo'
        },
        'Totales y Costos de la Venta': {
            'VENTA_SUBTOTAL': 'Subtotal de la Venta',
            'VENTA_COSTO_ENVIO': 'Costo de Envío',
            'VENTA_SEGURO_IMPORTACION': 'Seguro de Importación',
            'VENTA_DERECHO_ARANCELARIO': 'Derecho Arancelario',
            'VENTA_FLETE_TOTAL': 'Flete Total',
            'VENTA_TOTAL_FINAL': 'Total Final'
        },
        'Descuentos y Promociones': {
            'VENTA_DESCUENTO_PAQUETE': 'Descuento por Paquete',
            'VENTA_DESCUENTO_RENOVACION': 'Descuento por Renovación',
            'VENTA_DESCUENTO_CUPON': 'Descuento por Cupón',
            'VENTA_CODIGO_CUPON': 'Código de Cupón',
            'VENTA_DESCUENTO_PROMOCION': 'Descuento por Promoción',
            'VENTA_PROMOCIONES_APLICADAS': 'Promociones Aplicadas'
        },
        'Indicadores de Fila': {
            'PRODUCTO_NUMERO': 'Número de Producto en la Venta',
            'TOTAL_PRODUCTOS_EN_VENTA': 'Total de Productos en Venta',
            'ES_PRIMER_PRODUCTO': 'Es Primer Producto',
            'ES_ULTIMO_PRODUCTO': 'Es Último Producto',
            'ES_COMBO_ITEM': 'Es Item de Combo',
            'COMBO_ITEM_NUMERO': 'Número de Item en Combo',
            'TOTAL_ITEMS_EN_COMBO': 'Total de Items en Combo'
        }
    };

    // Crear un objeto plano para compatibilidad con el código existente
    const exportableFields = {};
    Object.values(exportableFieldsCategories).forEach(category => {
        Object.assign(exportableFields, category);
    });

    const showExportModal = () => {
        Swal.fire({
            title: '<div style="display: flex; align-items: center; justify-content: center; gap: 12px; color: #2c3e50;"><i class="fas fa-file-excel" style="color: #1e7e34; font-size: 28px;"></i><span style="font-weight: 600;">Exportar Ventas a Excel</span></div>',
            html: `
                <div style="padding: 25px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);">
                    
                   
                    
                    <!-- Formulario de Fechas -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 25px;">
                        
                        <!-- Fecha Inicio -->
                        <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); border-left: 4px solid #28a745;">
                            <label style="display: block; margin-bottom: 12px; font-weight: 600; color: #495057; font-size: 14px;">
                                <i class="fas fa-play-circle" style="color: #28a745; margin-right: 8px;"></i>
                                Fecha de Inicio
                            </label>
                            <input 
                                type="date" 
                                id="startDate" 
                                style="
                                    width: 100%; 
                                    padding: 12px 16px; 
                                    border: 2px solid #e9ecef; 
                                    border-radius: 8px; 
                                    font-size: 14px; 
                                    transition: all 0.3s ease;
                                    background: #ffffff;
                                    color: #495057;
                                    font-family: inherit;
                                " 
                                onFocus="this.style.borderColor='#28a745'; this.style.boxShadow='0 0 0 3px rgba(40, 167, 69, 0.15)'; this.style.transform='translateY(-1px)'"
                                onBlur="this.style.borderColor='#e9ecef'; this.style.boxShadow='none'; this.style.transform='translateY(0)'"
                            >
                        </div>
                        
                        <!-- Fecha Fin -->
                        <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); border-left: 4px solid #dc3545;">
                            <label style="display: block; margin-bottom: 12px; font-weight: 600; color: #495057; font-size: 14px;">
                                <i class="fas fa-stop-circle" style="color: #dc3545; margin-right: 8px;"></i>
                                Fecha de Fin
                            </label>
                            <input 
                                type="date" 
                                id="endDate" 
                                style="
                                    width: 100%; 
                                    padding: 12px 16px; 
                                    border: 2px solid #e9ecef; 
                                    border-radius: 8px; 
                                    font-size: 14px; 
                                    transition: all 0.3s ease;
                                    background: #ffffff;
                                    color: #495057;
                                    font-family: inherit;
                                " 
                                onFocus="this.style.borderColor='#dc3545'; this.style.boxShadow='0 0 0 3px rgba(220, 53, 69, 0.15)'; this.style.transform='translateY(-1px)'"
                                onBlur="this.style.borderColor='#e9ecef'; this.style.boxShadow='none'; this.style.transform='translateY(0)'"
                            >
                        </div>
                    </div>
                    
                  
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: '<i class="fas fa-file-excel"></i> Exportar Excel',
            cancelButtonText: '<i class="fas fa-times"></i> Cancelar',
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#6c757d',
            width: '650px',
            preConfirm: () => {
                const startDate = document.getElementById('startDate').value;
                const endDate = document.getElementById('endDate').value;

                // Validación básica
                if (startDate && endDate && startDate > endDate) {
                    Swal.showValidationMessage('La fecha de inicio no puede ser mayor a la fecha fin');
                    return false;
                }

                return {
                    startDate,
                    endDate,
                    status: '' // Siempre vacío ya que no hay filtro de estado
                };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const filters = result.value;
                exportToExcel(filters);
            }
        });
    };

    const exportToExcel = async (filters = {}) => {
        try {
            // Recargar la configuración directamente para asegurar que tenemos la más reciente
        let currentConfig = exportConfig;
        if (Object.keys(currentConfig).length === 0) {
            try {
                const result = await salesConfigRest.getExportConfig();
                if (result && result.data && result.data.success && result.data.config) {
                    currentConfig = result.data.config;
                }
            } catch (error) {
                console.error('Error al recargar configuración:', error);
            }
        }
            
            // Mostrar indicador de carga
            Swal.fire({
                title: 'Exportando datos...',
                text: 'Por favor espere mientras se preparan los datos para exportación',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // Preparar parámetros para la consulta
            const params = new URLSearchParams();
            if (filters.startDate) params.append('start_date', filters.startDate);
            if (filters.endDate) params.append('end_date', filters.endDate);
            if (filters.status) params.append('status', filters.status);

            // Obtener datos completos desde el controlador especializado
            const url = `/api/admin/sales/export-data${params.toString() ? '?' + params.toString() : ''}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Error al obtener los datos');
            }

            const salesData = data.data;

            if (salesData.length === 0) {
                Swal.fire({
                    title: "Sin datos",
                    text: `No hay ventas para exportar con los filtros seleccionados.
                           ${filters.startDate ? `\nFecha inicio: ${filters.startDate}` : ''}
                           ${filters.endDate ? `\nFecha fin: ${filters.endDate}` : ''}
                           ${filters.status ? `\nEstado filtrado: ${saleStatuses.find(s => s.id == filters.status)?.name || 'Desconocido'}` : ''}`,
                    icon: "info"
                });
                return;
            }

            // Función para calcular precios proporcionales en combos
            const calculateProportionalPrices = (comboItems, comboFinalPrice, comboOriginalPrice) => {
                if (!comboItems || comboItems.length === 0) return [];
                
                // Calcular precio total original de todos los items
                const totalOriginalPrice = comboItems.reduce((sum, item) => {
                    const itemPrice = parseFloat(item.price) || 0;
                    const itemQuantity = parseInt(item.quantity) || 1;
                    return sum + (itemPrice * itemQuantity);
                }, 0);
                
                // Si no hay precio original, usar distribución equitativa
                if (totalOriginalPrice === 0) {
                    const pricePerItem = comboFinalPrice / comboItems.length;
                    return comboItems.map(item => ({
                        ...item,
                        proportional_price: pricePerItem / (parseInt(item.quantity) || 1)
                    }));
                }
                
                // Calcular factor de proporción basado en el descuento aplicado
                const proportionFactor = comboFinalPrice / totalOriginalPrice;
                
                return comboItems.map(item => {
                    const itemPrice = parseFloat(item.price) || 0;
                    const proportionalPrice = itemPrice * proportionFactor;
                    return {
                        ...item,
                        proportional_price: proportionalPrice
                    };
                });
            };

            // Función auxiliar para filtrar campos según configuración
            const filterFieldsByConfig = (rowData) => {
                const filteredData = {};
                
                // Mapeo directo: cada columna del Excel se mapea a su correspondiente clave en exportableFields
                const fieldMapping = {
                    // Información básica de la venta
                    'ID_PEDIDO': 'ID_PEDIDO',
                    'FECHA': 'FECHA',
                    'ESTADO': 'ESTADO',
                    'REFERENCIA': 'REFERENCIA',
                    'COMENTARIO': 'COMENTARIO',
                    'UBIGEO': 'UBIGEO',
                    
                    // Información del cliente
                    'CLIENTE_NOMBRES': 'CLIENTE_NOMBRES',
                    'CLIENTE_EMAIL': 'CLIENTE_EMAIL',
                    'CLIENTE_TELEFONO': 'CLIENTE_TELEFONO',
                    'TIPO_DOCUMENTO': 'TIPO_DOCUMENTO',
                    'NUMERO_DOCUMENTO': 'NUMERO_DOCUMENTO',
                    'RAZON_SOCIAL': 'RAZON_SOCIAL',
                    
                    // Información de facturación
                    'TIPO_COMPROBANTE': 'TIPO_COMPROBANTE',
                    'METODO_PAGO': 'METODO_PAGO',
                    'ID_TRANSACCION': 'ID_TRANSACCION',
                    'ESTADO_PAGO': 'ESTADO_PAGO',
                    
                    // Información de entrega
                    'TIPO_ENTREGA': 'TIPO_ENTREGA',
                    'DIRECCION_ENTREGA': 'DIRECCION_ENTREGA',
                    'TIENDA_RETIRO': 'TIENDA_RETIRO',
                    'DIRECCION_TIENDA': 'DIRECCION_TIENDA',
                    'TELEFONO_TIENDA': 'TELEFONO_TIENDA',
                    'HORARIO_TIENDA': 'HORARIO_TIENDA',
                    
                    // Información del producto
                    'PRODUCTO_NOMBRE': 'PRODUCTO_NOMBRE',
                    'PRODUCTO_SKU': 'PRODUCTO_SKU',
                    'PRODUCTO_PRECIO_UNITARIO': 'PRODUCTO_PRECIO_UNITARIO',
                    'PRODUCTO_CANTIDAD': 'PRODUCTO_CANTIDAD',
                    'PRODUCTO_SUBTOTAL': 'PRODUCTO_SUBTOTAL',
                    'PRODUCTO_TIPO': 'PRODUCTO_TIPO',
                    'PRODUCTO_COLORES': 'PRODUCTO_COLORES',
                    
                    // Información de combos
                    'PRODUCTO_COMBO_ORIGINAL': 'PRODUCTO_COMBO_ORIGINAL',
                    'PRODUCTO_COMBO_PRECIO_ORIGINAL': 'PRODUCTO_COMBO_PRECIO_ORIGINAL',
                    'PRODUCTO_COMBO_DESCUENTO_APLICADO': 'PRODUCTO_COMBO_DESCUENTO_APLICADO',
                    'PRODUCTO_COMBO_ITEMS': 'PRODUCTO_COMBO_ITEMS',
                    
                    // Totales y costos de la venta
                    'VENTA_SUBTOTAL': 'VENTA_SUBTOTAL',
                    'VENTA_COSTO_ENVIO': 'VENTA_COSTO_ENVIO',
                    'VENTA_SEGURO_IMPORTACION': 'VENTA_SEGURO_IMPORTACION',
                    'VENTA_DERECHO_ARANCELARIO': 'VENTA_DERECHO_ARANCELARIO',
                    'VENTA_FLETE_TOTAL': 'VENTA_FLETE_TOTAL',
                    'VENTA_TOTAL_FINAL': 'VENTA_TOTAL_FINAL',
                    
                    // Descuentos y promociones
                    'VENTA_DESCUENTO_PAQUETE': 'VENTA_DESCUENTO_PAQUETE',
                    'VENTA_DESCUENTO_RENOVACION': 'VENTA_DESCUENTO_RENOVACION',
                    'VENTA_DESCUENTO_CUPON': 'VENTA_DESCUENTO_CUPON',
                    'VENTA_CODIGO_CUPON': 'VENTA_CODIGO_CUPON',
                    'VENTA_DESCUENTO_PROMOCION': 'VENTA_DESCUENTO_PROMOCION',
                    'VENTA_PROMOCIONES_APLICADAS': 'VENTA_PROMOCIONES_APLICADAS',
                    
                    // Indicadores de fila
                    'PRODUCTO_NUMERO': 'PRODUCTO_NUMERO',
                    'TOTAL_PRODUCTOS_EN_VENTA': 'TOTAL_PRODUCTOS_EN_VENTA',
                    'ES_PRIMER_PRODUCTO': 'ES_PRIMER_PRODUCTO',
                    'ES_ULTIMO_PRODUCTO': 'ES_ULTIMO_PRODUCTO',
                    'ES_COMBO_ITEM': 'ES_COMBO_ITEM',
                    'COMBO_ITEM_NUMERO': 'COMBO_ITEM_NUMERO',
                    'TOTAL_ITEMS_EN_COMBO': 'TOTAL_ITEMS_EN_COMBO'
                };

                // Usar la configuración guardada directamente, respetando los campos en false
                const configToUse = currentConfig || {};
                
                Object.keys(rowData).forEach(key => {
                    const configKey = fieldMapping[key] || key;
                    // Solo incluir campos que estén explícitamente marcados como true en la configuración
                    if (configToUse[configKey] === true) {
                        filteredData[key] = rowData[key];
                    }
                });
                
                return filteredData;
            };

            // Formatear datos para Excel - Una fila por cada producto de cada venta
            const excelData = [];
            let globalProductIndex = 0;
            
            salesData.forEach(sale => {
                // Si la venta tiene productos, crear una fila por cada producto
                if (sale.details && sale.details.length > 0) {
                    sale.details.forEach((product, productIndex) => {
                        // Verificar si es un combo y tiene items para desglosar
                        if ((product.type === 'combo' || product.combo_id) && product.combo_data && product.combo_data.items && product.combo_data.items.length > 0) {
                            // Desglosar combo en productos individuales
                            const comboItems = calculateProportionalPrices(
                                product.combo_data.items,
                                parseFloat(product.price) * parseInt(product.quantity),
                                product.combo_data.original_price || product.price
                            );
                            
                            comboItems.forEach((comboItem, comboItemIndex) => {
                                globalProductIndex++;
                                const itemQuantity = (parseInt(comboItem.quantity) || 1) * parseInt(product.quantity);
                                const itemUnitPrice = parseFloat(comboItem.proportional_price) || 0;
                                const itemSubtotal = itemUnitPrice * itemQuantity;
                                
                                const rowData = {
                                    'ID_PEDIDO': sale.correlative_code,
                                    'FECHA': sale.created_at,
                                    'ESTADO': sale.status_name,
                                    'CLIENTE_NOMBRES': sale.fullname,
                                    'CLIENTE_EMAIL': sale.email,
                                    'CLIENTE_TELEFONO': sale.phone,
                                    'TIPO_DOCUMENTO': sale.document_type,
                                    'NUMERO_DOCUMENTO': sale.document,
                                    'RAZON_SOCIAL': sale.business_name,
                                    'TIPO_COMPROBANTE': sale.invoice_type,
                                    'METODO_PAGO': sale.payment_method,
                                    'ID_TRANSACCION': sale.culqi_charge_id,
                                    'ESTADO_PAGO': sale.payment_status,
                                    'TIPO_ENTREGA': sale.delivery_type,
                                    'DIRECCION_ENTREGA': sale.full_address,
                                    'TIENDA_RETIRO': sale.store_name,
                                    'DIRECCION_TIENDA': sale.store_address,
                                    'TELEFONO_TIENDA': sale.store_phone,
                                    'HORARIO_TIENDA': sale.store_schedule,
                                    'REFERENCIA': sale.reference,
                                    'COMENTARIO': sale.comment,
                                    'UBIGEO': sale.ubigeo,
                                    
                                    // DETALLES DEL PRODUCTO INDIVIDUAL (del combo desglosado)
                                    'PRODUCTO_NOMBRE': `${comboItem.name} (de combo: ${product.name})`,
                                    'PRODUCTO_SKU': comboItem.sku || '',
                                    'PRODUCTO_PRECIO_UNITARIO': itemUnitPrice.toFixed(2),
                                    'PRODUCTO_CANTIDAD': itemQuantity,
                                    'PRODUCTO_SUBTOTAL': itemSubtotal.toFixed(2),
                                    'PRODUCTO_TIPO': 'combo_item',
                                    'PRODUCTO_COLORES': comboItem.colors || '',
                                    'PRODUCTO_COMBO_ORIGINAL': product.name,
                                    'PRODUCTO_COMBO_PRECIO_ORIGINAL': product.price,
                                    'PRODUCTO_COMBO_DESCUENTO_APLICADO': ((parseFloat(product.combo_data.original_price || product.price) - parseFloat(product.price)) / parseFloat(product.combo_data.original_price || product.price) * 100).toFixed(2) + '%',
                                    
                                    // TOTALES DE LA VENTA (repetidos en cada fila para referencia)
                                    'VENTA_SUBTOTAL': sale.subtotal,
                                    'VENTA_COSTO_ENVIO': sale.delivery_cost,
                                    'VENTA_SEGURO_IMPORTACION': sale.seguro_importacion_total || 0,
                                    'VENTA_DERECHO_ARANCELARIO': sale.derecho_arancelario_total || 0,
                                    'VENTA_FLETE_TOTAL': sale.flete_total || 0,
                                    'VENTA_DESCUENTO_PAQUETE': sale.bundle_discount,
                                    'VENTA_DESCUENTO_RENOVACION': sale.renewal_discount,
                                    'VENTA_DESCUENTO_CUPON': sale.coupon_discount,
                                    'VENTA_CODIGO_CUPON': sale.coupon_code,
                                    'VENTA_DESCUENTO_PROMOCION': sale.promotion_discount,
                                    'VENTA_PROMOCIONES_APLICADAS': sale.applied_promotions,
                                    'VENTA_TOTAL_FINAL': sale.total_amount,
                                    
                                    // INDICADORES DE FILA
                                    'PRODUCTO_NUMERO': globalProductIndex,
                                    'TOTAL_PRODUCTOS_EN_VENTA': sale.details.length,
                                    'ES_PRIMER_PRODUCTO': globalProductIndex === 1 ? 'SI' : 'NO',
                                    'ES_COMBO_ITEM': 'SI',
                                    'COMBO_ITEM_NUMERO': comboItemIndex + 1,
                                    'TOTAL_ITEMS_EN_COMBO': comboItems.length
                                };
                                
                                // Agregar fila sin filtrar (se filtrará después)
                                excelData.push(rowData);
                            });
                        } else {
                            // Producto individual normal
                            globalProductIndex++;
                            const rowData = {
                                'ID_PEDIDO': sale.correlative_code,
                                'FECHA': sale.created_at,
                                'ESTADO': sale.status_name,
                                'CLIENTE_NOMBRES': sale.fullname,
                                'CLIENTE_EMAIL': sale.email,
                                'CLIENTE_TELEFONO': sale.phone,
                                'TIPO_DOCUMENTO': sale.document_type,
                                'NUMERO_DOCUMENTO': sale.document,
                                'RAZON_SOCIAL': sale.business_name,
                                'TIPO_COMPROBANTE': sale.invoice_type,
                                'METODO_PAGO': sale.payment_method,
                                'ID_TRANSACCION': sale.culqi_charge_id,
                                'ESTADO_PAGO': sale.payment_status,
                                'TIPO_ENTREGA': sale.delivery_type,
                                'DIRECCION_ENTREGA': sale.full_address,
                                'TIENDA_RETIRO': sale.store_name,
                                'DIRECCION_TIENDA': sale.store_address,
                                'TELEFONO_TIENDA': sale.store_phone,
                                'HORARIO_TIENDA': sale.store_schedule,
                                'REFERENCIA': sale.reference,
                                'COMENTARIO': sale.comment,
                                'UBIGEO': sale.ubigeo,
                                
                                // DETALLES DEL PRODUCTO INDIVIDUAL
                                'PRODUCTO_NOMBRE': product.name,
                                'PRODUCTO_SKU': product.sku || '',
                                'PRODUCTO_PRECIO_UNITARIO': product.price,
                                'PRODUCTO_CANTIDAD': product.quantity,
                                'PRODUCTO_SUBTOTAL': product.price * product.quantity,
                                'PRODUCTO_TIPO': product.type || 'individual',
                                'PRODUCTO_COLORES': product.colors || '',
                                'PRODUCTO_COMBO_ORIGINAL': '',
                                'PRODUCTO_COMBO_PRECIO_ORIGINAL': '',
                                'PRODUCTO_COMBO_DESCUENTO_APLICADO': '',
                                
                                // TOTALES DE LA VENTA (repetidos en cada fila para referencia)
                                'VENTA_SUBTOTAL': sale.subtotal,
                                'VENTA_COSTO_ENVIO': sale.delivery_cost,
                                'VENTA_SEGURO_IMPORTACION': sale.seguro_importacion_total || 0,
                                'VENTA_DERECHO_ARANCELARIO': sale.derecho_arancelario_total || 0,
                                'VENTA_FLETE_TOTAL': sale.flete_total || 0,
                                'VENTA_DESCUENTO_PAQUETE': sale.bundle_discount,
                                'VENTA_DESCUENTO_RENOVACION': sale.renewal_discount,
                                'VENTA_DESCUENTO_CUPON': sale.coupon_discount,
                                'VENTA_CODIGO_CUPON': sale.coupon_code,
                                'VENTA_DESCUENTO_PROMOCION': sale.promotion_discount,
                                'VENTA_PROMOCIONES_APLICADAS': sale.applied_promotions,
                                'VENTA_TOTAL_FINAL': sale.total_amount,
                                
                                // INDICADORES DE FILA
                                'PRODUCTO_NUMERO': globalProductIndex,
                                'TOTAL_PRODUCTOS_EN_VENTA': sale.details.length,
                                'ES_PRIMER_PRODUCTO': globalProductIndex === 1 ? 'SI' : 'NO',
                                'ES_COMBO_ITEM': 'NO',
                                'COMBO_ITEM_NUMERO': '',
                                'TOTAL_ITEMS_EN_COMBO': ''
                            };
                            
                            // Agregar fila sin filtrar (se filtrará después)
                            excelData.push(rowData);
                        }
                    });
                } else {
                    // Si no tiene productos, crear una fila con datos de la venta pero sin productos
                    const rowData = {
                        'ID_PEDIDO': sale.correlative_code,
                        'FECHA': sale.created_at,
                        'ESTADO': sale.status_name,
                        'CLIENTE_NOMBRES': sale.fullname,
                        'CLIENTE_EMAIL': sale.email,
                        'CLIENTE_TELEFONO': sale.phone,
                        'TIPO_DOCUMENTO': sale.document_type,
                        'NUMERO_DOCUMENTO': sale.document,
                        'RAZON_SOCIAL': sale.business_name,
                        'TIPO_COMPROBANTE': sale.invoice_type,
                        'METODO_PAGO': sale.payment_method,
                        'ID_TRANSACCION': sale.culqi_charge_id,
                        'ESTADO_PAGO': sale.payment_status,
                        'TIPO_ENTREGA': sale.delivery_type,
                        'DIRECCION_ENTREGA': sale.full_address,
                        'TIENDA_RETIRO': sale.store_name,
                        'DIRECCION_TIENDA': sale.store_address,
                        'TELEFONO_TIENDA': sale.store_phone,
                        'HORARIO_TIENDA': sale.store_schedule,
                        'REFERENCIA': sale.reference,
                        'COMENTARIO': sale.comment,
                        'UBIGEO': sale.ubigeo,
                        
                        // DETALLES DEL PRODUCTO INDIVIDUAL (vacíos)
                        'PRODUCTO_NOMBRE': 'SIN PRODUCTOS',
                        'PRODUCTO_PRECIO_UNITARIO': 0,
                        'PRODUCTO_CANTIDAD': 0,
                        'PRODUCTO_SUBTOTAL': 0,
                        'PRODUCTO_TIPO': '',
                        'PRODUCTO_COLORES': '',
                        'PRODUCTO_COMBO_ITEMS': '',
                        
                        // TOTALES DE LA VENTA
                        'VENTA_SUBTOTAL': sale.subtotal,
                        'VENTA_COSTO_ENVIO': sale.delivery_cost,
                        'VENTA_SEGURO_IMPORTACION': sale.seguro_importacion_total || 0,
                        'VENTA_DERECHO_ARANCELARIO': sale.derecho_arancelario_total || 0,
                        'VENTA_FLETE_TOTAL': sale.flete_total || 0,
                        'VENTA_DESCUENTO_PAQUETE': sale.bundle_discount,
                        'VENTA_DESCUENTO_RENOVACION': sale.renewal_discount,
                        'VENTA_DESCUENTO_CUPON': sale.coupon_discount,
                        'VENTA_CODIGO_CUPON': sale.coupon_code,
                        'VENTA_DESCUENTO_PROMOCION': sale.promotion_discount,
                        'VENTA_PROMOCIONES_APLICADAS': sale.applied_promotions,
                        'VENTA_TOTAL_FINAL': sale.total_amount,
                        
                        // INDICADORES DE FILA
                        'PRODUCTO_NUMERO': 0,
                        'TOTAL_PRODUCTOS_EN_VENTA': 0,
                        'ES_PRIMER_PRODUCTO': 'SI',
                        'ES_ULTIMO_PRODUCTO': 'SI'
                    };
                    
                    // Agregar fila sin filtrar (se filtrará después)
                    excelData.push(rowData);
                }
            });

            // Crear libro de Excel
            const workbook = XLSX.utils.book_new();
            
            // Obtener solo las columnas que están configuradas como true
            const enabledColumns = [];
            // Mapeo directo: cada columna del Excel se mapea a su correspondiente clave en exportableFields
            const fieldMapping = {
                // Información básica de la venta
                'ID_PEDIDO': 'ID_PEDIDO',
                'FECHA': 'FECHA',
                'ESTADO': 'ESTADO',
                'REFERENCIA': 'REFERENCIA',
                'COMENTARIO': 'COMENTARIO',
                'UBIGEO': 'UBIGEO',
                
                // Información del cliente
                'CLIENTE_NOMBRES': 'CLIENTE_NOMBRES',
                'CLIENTE_EMAIL': 'CLIENTE_EMAIL',
                'CLIENTE_TELEFONO': 'CLIENTE_TELEFONO',
                'TIPO_DOCUMENTO': 'TIPO_DOCUMENTO',
                'NUMERO_DOCUMENTO': 'NUMERO_DOCUMENTO',
                'RAZON_SOCIAL': 'RAZON_SOCIAL',
                
                // Información de facturación
                'TIPO_COMPROBANTE': 'TIPO_COMPROBANTE',
                'METODO_PAGO': 'METODO_PAGO',
                'ID_TRANSACCION': 'ID_TRANSACCION',
                'ESTADO_PAGO': 'ESTADO_PAGO',
                
                // Información de entrega
                'TIPO_ENTREGA': 'TIPO_ENTREGA',
                'DIRECCION_ENTREGA': 'DIRECCION_ENTREGA',
                'TIENDA_RETIRO': 'TIENDA_RETIRO',
                'DIRECCION_TIENDA': 'DIRECCION_TIENDA',
                'TELEFONO_TIENDA': 'TELEFONO_TIENDA',
                'HORARIO_TIENDA': 'HORARIO_TIENDA',
                
                // Información del producto
                'PRODUCTO_NOMBRE': 'PRODUCTO_NOMBRE',
                'PRODUCTO_SKU': 'PRODUCTO_SKU',
                'PRODUCTO_PRECIO_UNITARIO': 'PRODUCTO_PRECIO_UNITARIO',
                'PRODUCTO_CANTIDAD': 'PRODUCTO_CANTIDAD',
                'PRODUCTO_SUBTOTAL': 'PRODUCTO_SUBTOTAL',
                'PRODUCTO_TIPO': 'PRODUCTO_TIPO',
                'PRODUCTO_COLORES': 'PRODUCTO_COLORES',
                
                // Información de combos
                'PRODUCTO_COMBO_ORIGINAL': 'PRODUCTO_COMBO_ORIGINAL',
                'PRODUCTO_COMBO_PRECIO_ORIGINAL': 'PRODUCTO_COMBO_PRECIO_ORIGINAL',
                'PRODUCTO_COMBO_DESCUENTO_APLICADO': 'PRODUCTO_COMBO_DESCUENTO_APLICADO',
                'PRODUCTO_COMBO_ITEMS': 'PRODUCTO_COMBO_ITEMS',
                
                // Totales y costos de la venta
                'VENTA_SUBTOTAL': 'VENTA_SUBTOTAL',
                'VENTA_COSTO_ENVIO': 'VENTA_COSTO_ENVIO',
                'VENTA_SEGURO_IMPORTACION': 'VENTA_SEGURO_IMPORTACION',
                'VENTA_DERECHO_ARANCELARIO': 'VENTA_DERECHO_ARANCELARIO',
                'VENTA_FLETE_TOTAL': 'VENTA_FLETE_TOTAL',
                'VENTA_TOTAL_FINAL': 'VENTA_TOTAL_FINAL',
                
                // Descuentos y promociones
                'VENTA_DESCUENTO_PAQUETE': 'VENTA_DESCUENTO_PAQUETE',
                'VENTA_DESCUENTO_RENOVACION': 'VENTA_DESCUENTO_RENOVACION',
                'VENTA_DESCUENTO_CUPON': 'VENTA_DESCUENTO_CUPON',
                'VENTA_CODIGO_CUPON': 'VENTA_CODIGO_CUPON',
                'VENTA_DESCUENTO_PROMOCION': 'VENTA_DESCUENTO_PROMOCION',
                'VENTA_PROMOCIONES_APLICADAS': 'VENTA_PROMOCIONES_APLICADAS',
                
                // Indicadores de fila
                'PRODUCTO_NUMERO': 'PRODUCTO_NUMERO',
                'TOTAL_PRODUCTOS_EN_VENTA': 'TOTAL_PRODUCTOS_EN_VENTA',
                'ES_PRIMER_PRODUCTO': 'ES_PRIMER_PRODUCTO',
                'ES_ULTIMO_PRODUCTO': 'ES_ULTIMO_PRODUCTO',
                'ES_COMBO_ITEM': 'ES_COMBO_ITEM',
                'COMBO_ITEM_NUMERO': 'COMBO_ITEM_NUMERO',
                'TOTAL_ITEMS_EN_COMBO': 'TOTAL_ITEMS_EN_COMBO'
            };
            
            // Filtrar solo las columnas habilitadas
            // Usar la configuración recargada o la del estado
            const configToUse = currentConfig || {};
            
            // Verificar si hay al menos un campo habilitado en la configuración
            const hasEnabledFields = Object.values(configToUse).some(value => value === true);
            
            if (!hasEnabledFields) {
                Swal.fire({
                    title: 'Sin configuración de exportación',
                    text: 'No se ha configurado qué campos exportar o todos los campos están deshabilitados. Por favor, configure primero los campos de exportación desde el menú de configuración.',
                    icon: 'warning',
                    confirmButtonText: 'Entendido'
                });
                return;
            }
            
            Object.keys(fieldMapping).forEach(excelField => {
                const configField = fieldMapping[excelField];

                if (configToUse[configField] === true) {
                    enabledColumns.push(excelField);
                    console.log(`Added ${excelField} to enabled columns`);
                }
            });
            
            // Verificar si hay al menos una columna habilitada
            if (enabledColumns.length === 0) {
                Swal.fire({
                    title: 'Sin columnas para exportar',
                    text: 'No hay columnas habilitadas para la exportación. Por favor, habilite al menos una columna desde la configuración de exportación.',
                    icon: 'warning',
                    confirmButtonText: 'Entendido'
                });
                return;
            }
            
            console.log('Columnas habilitadas para exportar:', enabledColumns);
            
            // Crear datos filtrados solo con las columnas habilitadas
            const filteredExcelData = excelData.map(row => {
                const filteredRow = {};
                enabledColumns.forEach(column => {
                    if (row.hasOwnProperty(column)) {
                        filteredRow[column] = row[column];
                    }
                });
                return filteredRow;
            });
            
            const worksheet = XLSX.utils.json_to_sheet(filteredExcelData);

            // Configurar ancho de columnas solo para las columnas habilitadas
            const allColumnWidths = {
                'ID_PEDIDO': { wch: 15 },
                'FECHA': { wch: 18 },
                'ESTADO': { wch: 12 },
                'CLIENTE_NOMBRES': { wch: 25 },
                'CLIENTE_EMAIL': { wch: 30 },
                'CLIENTE_TELEFONO': { wch: 15 },
                'TIPO_DOCUMENTO': { wch: 15 },
                 'NUMERO_DOCUMENTO': { wch: 15 },
                 'RAZON_SOCIAL': { wch: 30 },
                 'TIPO_COMPROBANTE': { wch: 15 },
                 'METODO_PAGO': { wch: 15 },
                 'ID_TRANSACCION': { wch: 20 },
                 'ESTADO_PAGO': { wch: 15 },
                 'TIPO_ENTREGA': { wch: 15 },
                 'DIRECCION_ENTREGA': { wch: 50 },
                 'TIENDA_RETIRO': { wch: 25 },
                 'DIRECCION_TIENDA': { wch: 30 },
                 'TELEFONO_TIENDA': { wch: 15 },
                 'HORARIO_TIENDA': { wch: 20 },
                 'REFERENCIA': { wch: 20 },
                 'COMENTARIO': { wch: 30 },
                 'UBIGEO': { wch: 10 },
                 'PRODUCTO_NOMBRE': { wch: 50 },
                 'PRODUCTO_SKU': { wch: 15 },
                 'PRODUCTO_PRECIO_UNITARIO': { wch: 18 },
                 'PRODUCTO_CANTIDAD': { wch: 12 },
                 'PRODUCTO_SUBTOTAL': { wch: 18 },
                 'PRODUCTO_TIPO': { wch: 15 },
                 'PRODUCTO_COLORES': { wch: 20 },
                 'PRODUCTO_COMBO_ORIGINAL': { wch: 35 },
                 'PRODUCTO_COMBO_PRECIO_ORIGINAL': { wch: 18 },
                 'PRODUCTO_COMBO_DESCUENTO_APLICADO': { wch: 20 },
                 'VENTA_SUBTOTAL': { wch: 12 },
                 'VENTA_COSTO_ENVIO': { wch: 12 },
                 'VENTA_SEGURO_IMPORTACION': { wch: 16 },
                 'VENTA_DERECHO_ARANCELARIO': { wch: 18 },
                 'VENTA_FLETE_TOTAL': { wch: 12 },
                 'VENTA_DESCUENTO_PAQUETE': { wch: 15 },
                 'VENTA_DESCUENTO_RENOVACION': { wch: 18 },
                 'VENTA_DESCUENTO_CUPON': { wch: 15 },
                 'VENTA_CODIGO_CUPON': { wch: 15 },
                 'VENTA_DESCUENTO_PROMOCION': { wch: 18 },
                 'VENTA_PROMOCIONES_APLICADAS': { wch: 40 },
                 'VENTA_TOTAL_FINAL': { wch: 12 },
                 'PRODUCTO_NUMERO': { wch: 12 },
                 'TOTAL_PRODUCTOS_EN_VENTA': { wch: 18 },
                 'ES_PRIMER_PRODUCTO': { wch: 15 },
                 'ES_COMBO_ITEM': { wch: 12 },
                 'COMBO_ITEM_NUMERO': { wch: 15 },
                 'TOTAL_ITEMS_EN_COMBO': { wch: 18 }
             };
             
             // Aplicar solo los anchos de las columnas habilitadas
             const columnWidths = enabledColumns.map(column => allColumnWidths[column] || { wch: 15 });

            worksheet['!cols'] = columnWidths;
            
            // Aplicar estilos y formato al Excel
            const range = XLSX.utils.decode_range(worksheet['!ref']);
            
            // Estilos para encabezados
            for (let col = range.s.c; col <= range.e.c; col++) {
                const headerCell = XLSX.utils.encode_cell({ r: 0, c: col });
                if (!worksheet[headerCell]) continue;
                
                worksheet[headerCell].s = {
                    font: { bold: true, color: { rgb: "FFFFFF" } },
                    fill: { fgColor: { rgb: "2E86AB" } },
                    alignment: { horizontal: "center", vertical: "center" },
                    border: {
                        top: { style: "thin", color: { rgb: "000000" } },
                        bottom: { style: "thin", color: { rgb: "000000" } },
                        left: { style: "thin", color: { rgb: "000000" } },
                        right: { style: "thin", color: { rgb: "000000" } }
                    }
                };
            }
            
            // Estilos para filas de datos
            for (let row = 1; row <= range.e.r; row++) {
                for (let col = range.s.c; col <= range.e.c; col++) {
                    const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
                    if (!worksheet[cellAddress]) continue;
                    
                    // Determinar si es fila de combo item
                    const esComboItemCol = Object.keys(excelData[0] || {}).indexOf('ES_COMBO_ITEM');
                    const isComboItem = excelData[row - 1] && excelData[row - 1]['ES_COMBO_ITEM'] === 'SI';
                    
                    worksheet[cellAddress].s = {
                        font: { 
                            color: { rgb: isComboItem ? "0066CC" : "000000" },
                            italic: isComboItem
                        },
                        fill: { 
                            fgColor: { 
                                rgb: row % 2 === 0 
                                    ? (isComboItem ? "E3F2FD" : "F8F9FA") 
                                    : (isComboItem ? "BBDEFB" : "FFFFFF")
                            }
                        },
                        alignment: { 
                            horizontal: col >= 23 && col <= 25 ? "right" : "left", // Columnas de precios alineadas a la derecha
                            vertical: "center"
                        },
                        border: {
                            top: { style: "thin", color: { rgb: "E0E0E0" } },
                            bottom: { style: "thin", color: { rgb: "E0E0E0" } },
                            left: { style: "thin", color: { rgb: "E0E0E0" } },
                            right: { style: "thin", color: { rgb: "E0E0E0" } }
                        }
                    };
                    
                    // Formato especial para columnas de precios
                    const priceColumns = ['PRODUCTO_PRECIO_UNITARIO', 'PRODUCTO_SUBTOTAL', 'VENTA_SUBTOTAL', 'VENTA_TOTAL_FINAL'];
                    const columnName = Object.keys(excelData[0] || {})[col];
                    if (priceColumns.includes(columnName)) {
                        worksheet[cellAddress].z = '"S/" #,##0.00';
                    }
                }
            }
            
            // Configurar altura de filas
            worksheet['!rows'] = [];
            worksheet['!rows'][0] = { hpt: 25 }; // Altura del encabezado
            for (let i = 1; i <= range.e.r; i++) {
                worksheet['!rows'][i] = { hpt: 20 }; // Altura de filas de datos
            }
            
            // Agregar hoja al libro
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Ventas_Facturacion');

            // Generar nombre del archivo con información de filtros
            let filename = 'ventas_facturacion';
            if (filters.startDate || filters.endDate) {
                filename += '_' + (filters.startDate || 'inicio') + '_al_' + (filters.endDate || 'fin');
            }
            if (filters.status) {
                const statusName = saleStatuses.find(s => s.id == filters.status)?.name || 'estado';
                filename += '_' + statusName.toLowerCase().replace(/\s+/g, '_');
            }
            filename += '_' + moment().format('YYYY-MM-DD_HH-mm') + '.xlsx';

            // Descargar archivo
            XLSX.writeFile(workbook, filename);

            // Mostrar mensaje de éxito con estadísticas detalladas
            let filterInfo = '';
            if (filters.startDate) filterInfo += `\n📅 Desde: ${filters.startDate}`;
            if (filters.endDate) filterInfo += `\n📅 Hasta: ${filters.endDate}`;
            if (filters.status) {
                const statusName = saleStatuses.find(s => s.id == filters.status)?.name;
                filterInfo += `\n📊 Estado: ${statusName}`;
            }

            // Calcular estadísticas
            const totalSales = salesData.length;
            const totalProductRows = excelData.length;

            Swal.fire({
                title: '<div style="display: flex; align-items: center; justify-content: center; gap: 12px; color: #155724;"><i class="fas fa-check-circle" style="color: #28a745; font-size: 28px;"></i><span style="font-weight: 600;">¡Exportación Exitosa!</span></div>',
                html: `
                    <div style="
                        background: linear-gradient(135deg, #d4edda 0%, #f8f9fa 100%);
                        border-radius: 16px;
                        padding: 25px;
                        margin: 20px 0;
                        border-left: 5px solid #28a745;
                        box-shadow: 0 4px 15px rgba(40, 167, 69, 0.15);
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    ">
                        <!-- Estadísticas principales -->
                        <div style="
                            display: grid; 
                            grid-template-columns: 1fr 1fr 1fr; 
                            gap: 15px; 
                            margin-bottom: 20px;
                        ">
                            <!-- Ventas exportadas -->
                            <div style="
                                background: white;
                                padding: 18px;
                                border-radius: 12px;
                                text-align: center;
                                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                                border-top: 3px solid #17a2b8;
                            ">
                                <div style="color: #17a2b8; font-size: 20px; margin-bottom: 8px;">
                                    <i class="fas fa-shopping-cart"></i>
                                </div>
                                <div style="font-size: 24px; font-weight: bold; color: #2c3e50; margin-bottom: 4px;">
                                    ${totalSales}
                                </div>
                                <div style="font-size: 12px; color: #6c757d; font-weight: 500;">
                                    Ventas
                                </div>
                            </div>
                            
                            <!-- Filas de productos -->
                            <div style="
                                background: white;
                                padding: 18px;
                                border-radius: 12px;
                                text-align: center;
                                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                                border-top: 3px solid #ffc107;
                            ">
                                <div style="color: #ffc107; font-size: 20px; margin-bottom: 8px;">
                                    <i class="fas fa-list"></i>
                                </div>
                                <div style="font-size: 24px; font-weight: bold; color: #2c3e50; margin-bottom: 4px;">
                                    ${totalProductRows}
                                </div>
                                <div style="font-size: 12px; color: #6c757d; font-weight: 500;">
                                    Filas de Productos
                                </div>
                            </div>
                            
                            <!-- Archivo generado -->
                            <div style="
                                background: white;
                                padding: 18px;
                                border-radius: 12px;
                                text-align: center;
                                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                                border-top: 3px solid #28a745;
                            ">
                                <div style="color: #28a745; font-size: 20px; margin-bottom: 8px;">
                                    <i class="fas fa-file-excel"></i>
                                </div>
                                <div style="font-size: 10px; font-weight: bold; color: #2c3e50; margin-bottom: 4px; word-break: break-all;">
                                    ${filename}
                                </div>
                                <div style="font-size: 12px; color: #6c757d; font-weight: 500;">
                                    Excel Detallado
                                </div>
                            </div>
                        </div>
                        
                        <!-- Información del formato -->
                        <div style="
                            background: white;
                            padding: 18px;
                            border-radius: 12px;
                            border-left: 4px solid #007bff;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                            margin-bottom: 15px;
                        ">
                            <div style="
                                display: flex; 
                                align-items: center; 
                                margin-bottom: 12px;
                                color: #0056b3;
                                font-weight: 600;
                                font-size: 15px;
                            ">
                                <i class="fas fa-info-circle" style="margin-right: 10px; color: #007bff;"></i>
                                Formato de Exportación
                            </div>
                            <div style="
                                font-size: 14px; 
                                color: #495057; 
                                line-height: 1.6;
                                background: #e3f2fd;
                                padding: 12px;
                                border-radius: 8px;
                                border: 1px solid #bbdefb;
                            ">
                                <strong>📋 Cada producto tiene su propia fila</strong><br/>
                                Perfecto para importar en software de facturación<br/>
                                <small class="text-muted">
                                    • Datos de venta repetidos por cada producto<br/>
                                    • Información detallada de cada item<br/>
                                    • Columnas de control para identificar productos
                                </small>
                            </div>
                        </div>
                        
                        ${filterInfo ? `
                        <!-- Información de filtros -->
                        <div style="
                            background: white;
                            padding: 18px;
                            border-radius: 12px;
                            border-left: 4px solid #ffc107;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                        ">
                            <div style="
                                display: flex; 
                                align-items: center; 
                                margin-bottom: 12px;
                                color: #856404;
                                font-weight: 600;
                                font-size: 15px;
                            ">
                                <i class="fas fa-filter" style="margin-right: 10px; color: #ffc107;"></i>
                                Filtros Aplicados
                            </div>
                            <div style="
                                font-size: 14px; 
                                color: #495057; 
                                line-height: 1.6;
                                background: #fff8e1;
                                padding: 12px;
                                border-radius: 8px;
                                border: 1px solid #ffeaa7;
                            ">
                                ${filterInfo.replace(/\n/g, '<br/>')}
                            </div>
                        </div>
                        ` : ''}
                        
                        <!-- Mensaje de confirmación -->
                        <div style="
                            text-align: center;
                            margin-top: 20px;
                            padding: 15px;
                            background: rgba(40, 167, 69, 0.1);
                            border-radius: 10px;
                            border: 1px solid rgba(40, 167, 69, 0.2);
                        ">
                            <div style="color: #155724; font-size: 15px; font-weight: 500;">
                                <i class="fas fa-download" style="margin-right: 8px;"></i>
                                Archivo con formato detallado listo para facturación
                            </div>
                        </div>
                    </div>
                `,
                icon: "success",
                confirmButtonText: '<i class="fas fa-thumbs-up"></i> ¡Perfecto!',
                confirmButtonColor: '#28a745',
                timer: 10000,
                timerProgressBar: true,
                width: '750px'
            });

        } catch (error) {
            console.error('Error al exportar:', error);
            Swal.fire({
                title: "Error en la exportación",
                text: error.message || "No se pudo exportar los datos. Intente nuevamente.",
                icon: "error"
            });
        }
    };

    useEffect(() => {
        if (!saleLoaded) return
        saleStatusesRest.bySale(saleLoaded.id).then((data) => {
          if (data) setSaleStatuses(data)
          else setSaleStatuses([])
        })
    }, [saleLoaded]);

    const statusTemplate = (e) => {
        const data = $(e.element).data('status')
        if (!e.id) return
        
        const baseColor = data?.color || "#333";
        const element = $(renderToString(
            <span 
                title={data?.description || ''}
                className="d-flex align-items-center"
                style={{
                    color: baseColor,
                    padding: "4px 8px",
                    fontSize: "14px",
                    fontWeight: "500"
                }}
            >
                <i 
                    className={`${data?.icon || 'mdi mdi-circle'} me-2`}
                    style={{ 
                        color: baseColor,
                        fontSize: "12px"
                    }}
                ></i>
                {e.text}
            </span>
        ));
        
        return element;
    }

    const subtotalReal = saleLoaded?.details?.reduce((sum, detail) => sum + (detail.price * detail.quantity), 0) || 0;
    const totalAmount = subtotalReal + Number(saleLoaded?.delivery || 0) + 
        Number(saleLoaded?.seguro_importacion_total || 0) + 
        Number(saleLoaded?.derecho_arancelario_total || 0) + 
        Number(saleLoaded?.flete_total || 0) - 
        Number(saleLoaded?.promotion_discount || 0) - 
        Number(saleLoaded?.coupon_discount || 0) - 
        Number(saleLoaded?.bundle_discount || 0) - 
        Number(saleLoaded?.renewal_discount || 0);

    return (
        <>

            <Table
                gridRef={gridRef}
                title="Pedidos"
                rest={salesRest}
                toolBar={(container) => {
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "exportxlsx",
                            text: "Exportar para Facturación",
                            hint: "Exportar datos completos para facturador",
                            onClick: showExportModal,
                            type: "normal",
                            stylingMode: "outlined"
                        },
                    });
                    if (hasRootRole) {
                        container.unshift({
                            widget: "dxButton",
                            location: "after",
                            options: {
                                icon: "preferences",
                                text: "Configurar Exportación",
                                hint: "Configurar campos de exportación Excel",
                                onClick: async () => {
                                    await loadExportConfig();
                                    $(configModalRef.current).modal('show');
                                },
                                type: "normal",
                                stylingMode: "outlined"
                            },
                        });
                    }
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "refresh",
                            hint: "Refrescar tabla",
                            onClick: () =>
                                $(gridRef.current)
                                    .dxDataGrid("instance")
                                    .refresh(),
                        },
                    });
                }}
                columns={[
                    {
                        dataField: "id",
                        caption: "ID",
                        visible: false,
                    },
                    {
                        dataField: "name",
                        caption: "Orden",
                        width: "250px",
                        cellTemplate: (container, { data }) => {
                            container.css("cursor", "pointer");
                            container.on("click", () => {
                                onModalOpen(data.id);
                            });
                            ReactAppend(
                                container,
                                <p className="mb-0" style={{ width: "100%" }}>
                                    <b className="d-block">
                                        {data.name} {data.lastname}
                                    </b>
                                    <small
                                        className="text-nowrap text-muted"
                                        style={{
                                            overflow: "hidden",
                                            display: "-webkit-box",
                                            WebkitBoxOrient: "vertical",
                                            WebkitLineClamp: 2,
                                            fontFamily: "monospace",
                                        }}
                                    >
                                        #{Global.APP_CORRELATIVE}-{data.code}
                                    </small>
                                </p>
                            );
                        },
                    },
                    {
                        dataField: "created_at",
                        caption: "Fecha",
                        dataType: "date",
                        sortOrder: "desc",
                        cellTemplate: (container, { data }) => {
                            // container.text(moment(data.created_at).fromNow())
                            container.text(moment(data.created_at).subtract(5, 'hours').format("LLL"));
                        },
                    },
                    {
                        dataField: "status.name",
                        caption: "Estado",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <span
                                    className="badge rounded-pill"
                                    style={{
                                        backgroundColor: data.status.color
                                            ? `${data.status.color}2e`
                                            : "#3333332e",
                                        color: data.status.color ?? "#333",
                                    }}
                                >
                                    {data.status.name}
                                </span>
                            );
                        },
                    },
              
                    {
                        dataField: "amount",
                        caption: "Total",
                        dataType: "number",
                        cellTemplate: (container, { data }) => {
                           
                            container.text(`S/. ${Number2Currency(data?.amount)}`);
                        },
                    },
                    {
                        caption: "Acciones",
                        cellTemplate: (container, { data }) => {
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-light",
                                    title: "Ver pedido",
                                    icon: "fa fa-eye",
                                    onClick: () => onModalOpen(data.id),
                                })
                            );
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-danger",
                                    title: "Anular pedido",
                                    icon: "fa fa-trash",
                                    onClick: () => onDeleteClicked(data.id),
                                })
                            );
                        },
                        allowFiltering: false,
                        allowExporting: false,
                    },
                ]}
            />
            <Modal
                modalRef={modalRef}
                title={`Detalles del pedido #${Global.APP_CORRELATIVE}-${saleLoaded?.code}`}
                size="xl"
                bodyStyle={{
                    backgroundColor: "#ebeff2",
                }}
                hideButtonSubmit
            >
                <div className="row">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header p-2">
                                <h5 className="card-title mb-0">
                                    Detalles de Venta
                                </h5>
                            </div>
                            <div className="card-body p-2">
                                <table className="table table-borderless table-sm mb-0">
                                    <tbody>
                                        {saleLoaded?.payment_method && (
                                            <tr>
                                                <th>Método de pago:</th>
                                                <td>{saleLoaded?.payment_method}</td>
                                            </tr>
                                        )}
                                        {saleLoaded?.culqi_charge_id && (
                                            <tr>
                                                <th>ID de transacción:</th>
                                                <td>{saleLoaded?.culqi_charge_id}</td>
                                            </tr>
                                        )}
                                        <tr>
                                            <th>Nombres:</th>
                                            <td>{saleLoaded?.fullname}</td>
                                        </tr>
                                        <tr>
                                            <th>Email:</th>
                                            <td>{saleLoaded?.email}</td>
                                        </tr>
                                        <tr>
                                            <th>Teléfono:</th>
                                            <td>{saleLoaded?.phone}</td>
                                        </tr>
                                        {(saleLoaded?.document_type || saleLoaded?.documentType) && (
                                            <tr>
                                                <th>Tipo de documento:</th>
                                                <td>{saleLoaded?.document_type || saleLoaded?.documentType}</td>
                                            </tr>
                                        )}
                                        {saleLoaded?.document && (
                                            <tr>
                                                <th>Número de documento:</th>
                                                <td>{saleLoaded?.document}</td>
                                            </tr>
                                        )}
                                        
                                        {saleLoaded?.delivery_type && (
                                            <tr>
                                                <th>Tipo de entrega:</th>
                                                <td>
                                                    <span className="badge bg-info">
                                                        {saleLoaded?.delivery_type === 'store_pickup' ? 'Retiro en Tienda' : 
                                                         saleLoaded?.delivery_type === 'free' ? 'Envío Gratis' : 
                                                         saleLoaded?.delivery_type === 'express' ? 'Envío Express' : 
                                                         saleLoaded?.delivery_type === 'standard' ? 'Envío Estándar' :
                                                         saleLoaded?.delivery_type === 'agency' ? 'Entrega en Agencia' : 
                                                         saleLoaded?.delivery_type}
                                                    </span>
                                                </td>
                                            </tr>
                                        )}

                                        {saleLoaded?.delivery_type === 'store_pickup' && saleLoaded?.store && (
                                            <tr>
                                                <th>Tienda para retiro:</th>
                                                <td>
                                                    <strong>{saleLoaded?.store?.name}</strong>
                                                    <small className="text-muted d-block">
                                                        {saleLoaded?.store?.address}
                                                        {saleLoaded?.store?.district && (
                                                            <>, {saleLoaded?.store?.district}</>
                                                        )}
                                                        {saleLoaded?.store?.province && (
                                                            <>, {saleLoaded?.store?.province}</>
                                                        )}
                                                    </small>
                                                    {saleLoaded?.store?.phone && (
                                                        <small className="text-info d-block">
                                                            📞 {saleLoaded?.store?.phone}
                                                        </small>
                                                    )}
                                                    {saleLoaded?.store?.schedule && (
                                                        <small className="text-success d-block">
                                                            🕒 {saleLoaded?.store?.schedule}
                                                        </small>
                                                    )}
                                                </td>
                                            </tr>
                                        )}

                                        {saleLoaded?.delivery_type && saleLoaded?.delivery_type !== 'store_pickup' && (
                                            <tr>
                                                <th>Dirección de entrega:</th>
                                                <td>
                                                    {saleLoaded?.address}{" "}
                                                    {saleLoaded?.number}
                                                    <small className="text-muted d-block">
                                                        {saleLoaded?.district},{" "}
                                                        {saleLoaded?.province},{" "}
                                                        {saleLoaded?.department}
                                                        , {saleLoaded?.country}{" "}
                                                        {saleLoaded?.zip_code && (
                                                            <>
                                                                -{" "}
                                                                {
                                                                    saleLoaded?.zip_code
                                                                }
                                                            </>
                                                        )}
                                                    </small>
                                                </td>
                                            </tr>
                                        )}

                                        {saleLoaded?.reference && (
                                            <tr>
                                                <th>Referencia:</th>
                                                <td>{saleLoaded?.reference}</td>
                                            </tr>
                                        )}

                                        {saleLoaded?.comment && (
                                            <tr>
                                                <th>Comentario:</th>
                                                <td>{saleLoaded?.comment}</td>
                                            </tr>
                                        )}

                                        {saleLoaded?.coupon_code && (
                                            <tr>
                                                <th>Cupón aplicado:</th>
                                                <td>
                                                    <span className="badge bg-success">
                                                        {saleLoaded?.coupon_code}
                                                    </span>
                                                    <small className="text-success d-block">
                                                        Descuento: S/ {Number2Currency(saleLoaded?.coupon_discount || 0)}
                                                    </small>
                                                </td>
                                            </tr>
                                        )}

                                        {/* Mostrar descuentos automáticos si existen */}
                                        {(saleLoaded?.applied_promotions || saleLoaded?.promotion_discount > 0) && (
                                            <tr>
                                                <th>Promociones automáticas:</th>
                                                <td>
                                                    {saleLoaded?.applied_promotions && (() => {
                                                        try {
                                                            const promotions = typeof saleLoaded.applied_promotions === 'string' 
                                                                ? JSON.parse(saleLoaded.applied_promotions) 
                                                                : saleLoaded.applied_promotions;
                                                            
                                                            if (Array.isArray(promotions) && promotions.length > 0) {
                                                                return promotions.map((promo, index) => (
                                                                    <div key={index} className="mb-2">
                                                                        <span className="badge bg-primary me-2">
                                                                            {promo.rule_name || promo.name || 'Promoción automática'}
                                                                        </span>
                                                                        <small className="text-primary d-block">
                                                                            {promo.description || 'Descuento por promoción especial'}
                                                                        </small>
                                                                        <small className="text-success d-block">
                                                                            Descuento: S/ {Number2Currency(promo.discount_amount || promo.amount || 0)}
                                                                        </small>
                                                                        {promo.free_items && promo.free_items.length > 0 && (
                                                                            <small className="text-info d-block">
                                                                                Productos gratis: {promo.free_items.map(item => item.name || item.item_name).join(', ')}
                                                                            </small>
                                                                        )}
                                                                    </div>
                                                                ));
                                                            }
                                                        } catch (e) {
                                                            console.error('Error parsing applied_promotions:', e);
                                                            return null;
                                                        }
                                                    })()}
                                                    
                                                    {saleLoaded?.promotion_discount > 0 && (
                                                        <div className="mt-2 pt-2 border-top">
                                                            <strong className="text-primary">
                                                                Total descuentos automáticos: S/ {Number2Currency(saleLoaded?.promotion_discount || 0)}
                                                            </strong>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        )}

                                        {saleLoaded?.invoiceType && (
                                            <tr>
                                                <th>{saleLoaded?.invoiceType}:</th>
                                                <td>{saleLoaded?.documentType} - {saleLoaded?.document} <br></br> {saleLoaded?.document && (saleLoaded?.businessName)}</td>
                                            </tr>
                                        )}

                                        {saleLoaded?.payment_proof && (
                                            <tr>
                                                <th>Comprobante de pago:</th>
                                                <td>
                                                    <Tippy
                                                        content="Ver comprobante de pago"
                                                        placement="top"
                                                    >
                                                        <a
                                                            href={`/storage/images/sale/${saleLoaded?.payment_proof}`}
                                                            target="_blank"
                                                        >
                                                            <img
                                                                src={`/storage/images/sale/${saleLoaded?.payment_proof}`}
                                                                alt="Comprobante de pago"
                                                                className="img-thumbnail"
                                                                style={{
                                                                    maxWidth:
                                                                        "150px",
                                                                    cursor: "pointer",
                                                                }}
                                                            />
                                                        </a>
                                                    </Tippy>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header p-2">
                                <h5 className="card-title mb-0">Artículos</h5>
                            </div>
                            <div className="card-body p-2 table-responsive">
                                <table className="table table-striped table-bordered table-sm table-hover mb-0">
                                    <thead>
                                        <tr>
                                            <th className="w-20">Imagen</th>
                                            <th>Nombre</th>
                                            <th>Precio</th>
                                            <th>Cantidad</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {saleLoaded?.details?.map(
                                            (detail, index) => {
                                                const quantity =
                                                    (detail.quantity * 100) /
                                                    100;
                                                const totalPrice =
                                                    detail.price *
                                                    detail.quantity;
                                                return (
                                                    <tr key={index}>
                                                        <td className="max-w-20 p-0">
                                                            {detail.image ? (
                                                                <img
                                                                    className="object-scale-down mx-auto block"
                                                                    src={detail?.type === "combo" ? `/storage/images/combo/${detail.image}` : `/storage/images/item/${detail.image}`}
                                                                    alt={detail.name}
                                                                    style={{
                                                                        height: '5rem',
                                                                        width: '5rem',
                                                                        objectFit: 'scale-down',
                                                                    }}
                                                                />
                                                            ) : null}
                                                        </td>
                                                        <td>
                                                            <div>
                                                                <strong>{detail.name}</strong>{detail.colors ? ' - ' + detail.colors : ''}
                                                                
                                                                {/* Verificar si es combo por diferentes campos */}
                                                                {(detail.type === 'combo' || detail.combo_id) && (
                                                                    <div className="mt-1">
                                                                        <small className="text-muted d-block">
                                                                            <span className="badge bg-info me-1">COMBO</span>
                                                                            Contiene:
                                                                        </small>
                                                                        
                                                                        {/* Verificar diferentes estructuras de combo_data */}
                                                                        {detail.combo_data && detail.combo_data.items && detail.combo_data.items.length > 0 ? (
                                                                            <small className="text-muted">
                                                                                {detail.combo_data.items.map((item, idx) => (
                                                                                    <span key={idx}>
                                                                                        {item.quantity || 1}x {item.name}
                                                                                        {idx < detail.combo_data.items.length - 1 ? ', ' : ''}
                                                                                    </span>
                                                                                ))}
                                                                            </small>
                                                                        ) : (
                                                                            <small className="text-muted text-warning">
                                                                                📋 Información de combo no disponible
                                                                            </small>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td align="right">
                                                            <span className="text-nowrap">
                                                                S/{" "}
                                                                {Number2Currency(
                                                                    detail.price
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td align="center">
                                                            {quantity}
                                                        </td>
                                                        <td align="right">
                                                            <span className="text-nowrap">
                                                                S/{" "}
                                                                {Number2Currency(
                                                                    totalPrice
                                                                )}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header p-2">
                                <h5 className="card-title mb-0">Resumen</h5>
                            </div>
                            <div className="card-body p-2">
                                <div className="d-flex justify-content-between">
                                    <b>Subtotal:</b>
                                    <span>
                                        S/{" "}
                                        {Number2Currency(
                                            saleLoaded?.details?.reduce((sum, detail) => sum + (detail.price * detail.quantity), 0) || 0
                                        )}
                                    </span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <b>Envío:</b>
                                    <span>
                                        S/{" "}
                                        {Number2Currency(saleLoaded?.delivery)}
                                    </span>
                                </div>
                                
                                {/* Mostrar costos de importación si existen */}
                                {(saleLoaded?.seguro_importacion_total > 0 || saleLoaded?.derecho_arancelario_total > 0 || saleLoaded?.flete_total > 0) && (
                                    <>
                                        {saleLoaded?.seguro_importacion_total > 0 && (
                                            <div className="d-flex justify-content-between text-info">
                                                <b>Seguro de Importación:</b>
                                                <span>
                                                    S/{" "}
                                                    {Number2Currency(saleLoaded?.seguro_importacion_total)}
                                                </span>
                                            </div>
                                        )}
                                        
                                        {saleLoaded?.derecho_arancelario_total > 0 && (
                                            <div className="d-flex justify-content-between text-info">
                                                <b>Derecho Arancelario:</b>
                                                <span>
                                                    S/{" "}
                                                    {Number2Currency(saleLoaded?.derecho_arancelario_total)}
                                                </span>
                                            </div>
                                        )}
                                        
                                        {saleLoaded?.flete_total > 0 && (
                                            <div className="d-flex justify-content-between text-info">
                                                <b>Flete:</b>
                                                <span>
                                                    S/{" "}
                                                    {Number2Currency(saleLoaded?.flete_total)}
                                                </span>
                                            </div>
                                        )}
                                    </>
                                )}
                                
                                {/* Mostrar descuentos automáticos en el resumen */}
                                {saleLoaded?.promotion_discount > 0 && (
                                    <div className="d-flex justify-content-between text-primary">
                                        <b>Descuentos automáticos:</b>
                                        <span>
                                            - S/{" "}
                                            {Number2Currency(saleLoaded?.promotion_discount)}
                                        </span>
                                    </div>
                                )}
                                
                                {saleLoaded?.coupon_discount > 0 && (
                                    <div className="d-flex justify-content-between text-success">
                                        <b>Descuento por cupón:</b>
                                        <span>
                                            - S/{" "}
                                            {Number2Currency(saleLoaded?.coupon_discount)}
                                        </span>
                                    </div>
                                )}
                                
                                {/* Mostrar otros descuentos si existen */}
                                {saleLoaded?.bundle_discount > 0 && (
                                    <div className="d-flex justify-content-between text-info">
                                        <b>Descuento por paquete:</b>
                                        <span>
                                            - S/{" "}
                                            {Number2Currency(saleLoaded?.bundle_discount)}
                                        </span>
                                    </div>
                                )}
                                
                                {saleLoaded?.renewal_discount > 0 && (
                                    <div className="d-flex justify-content-between text-warning">
                                        <b>Descuento por renovación:</b>
                                        <span>
                                            - S/{" "}
                                            {Number2Currency(saleLoaded?.renewal_discount)}
                                        </span>
                                    </div>
                                )}
                                
                                <hr className="my-2" />
                                <div className="d-flex justify-content-between">
                                    <b>Total:</b>
                                    <span>
                                        <strong>
                                            S/ {Number2Currency(totalAmount)}
                                        </strong>
                                    </span>
                                </div>
                                
                                {/* Mostrar desglose de cómo se calculó el total */}
                                <small className="text-muted mt-2 d-block">
                                    <strong>Cálculo:</strong> 
                                    {Number2Currency(subtotalReal)} (subtotal)
                                    + {Number2Currency(saleLoaded?.delivery)} (envío)
                                    {saleLoaded?.seguro_importacion_total > 0 && ` + ${Number2Currency(saleLoaded?.seguro_importacion_total)} (seguro)`}
                                    {saleLoaded?.derecho_arancelario_total > 0 && ` + ${Number2Currency(saleLoaded?.derecho_arancelario_total)} (derecho arancelario)`}
                                    {saleLoaded?.flete_total > 0 && ` + ${Number2Currency(saleLoaded?.flete_total)} (flete)`}
                                    {saleLoaded?.promotion_discount > 0 && ` - ${Number2Currency(saleLoaded?.promotion_discount)} (promociones)`}
                                    {saleLoaded?.coupon_discount > 0 && ` - ${Number2Currency(saleLoaded?.coupon_discount)} (cupón)`}
                                    {saleLoaded?.bundle_discount > 0 && ` - ${Number2Currency(saleLoaded?.bundle_discount)} (paquete)`}
                                    {saleLoaded?.renewal_discount > 0 && ` - ${Number2Currency(saleLoaded?.renewal_discount)} (renovación)`}
                                    = S/ {Number2Currency(totalAmount)}
                                </small>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header p-2">
                                <h5 className="card-title mb-0">Estado</h5>
                            </div>
                            <div className="card-body p-2 position-relative" id="statusSelectContainer">
                                {statusLoading && (
                                    <div className="position-absolute d-flex align-items-center justify-content-center" style={{
                                        top: 0, left: 0, right: 0, bottom: 0,
                                        zIndex: 1,
                                        backgroundColor: 'rgba(255, 255, 255, 0.125)',
                                        backdropFilter: 'blur(2px)',
                                        cursor: 'not-allowed'
                                    }}>
                                        <div className="spinner-border spinner-border-sm" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                )}
                                <div>
                                <SelectFormGroup label='Estado actual' dropdownParent='#statusSelectContainer' minimumResultsForSearch={-1} templateResult={statusTemplate} templateSelection={statusTemplate} onChange={(e) => onStatusChange(e, saleLoaded)} value={saleLoaded?.status_id} changeWith={[saleLoaded]} disabled={statusLoading || saleLoaded?.status?.reversible == 0}>
                                    {statuses.map((status, index) => {
                                        return (
                                            <option key={index} value={status.id} data-status={JSON.stringify(status)}>
                                                {status.name}
                                            </option>
                                        );
                                    })}
                                </SelectFormGroup>
                                </div>
                                {/* <div className="mb-2">
                                    <label
                                        htmlFor="statusSelect"
                                        className="form-label"
                                    >
                                        Estado Actual
                                    </label>
                                    <select
                                        className="form-select"
                                        id="statusSelect"
                                        value={saleLoaded?.status_id}
                                        onChange={onStatusChange}
                                        disabled={saleLoaded?.status?.reversible == 0}
                                    >
                                        {statuses.map((status, index) => {
                                            return (
                                                <option value={status.id}>
                                                    {status.name}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div> */}
                                <div className="form-check" style={{
                                    cursor: saleLoaded?.status?.reversible == 0 ? 'not-allowed' : 'pointer'
                                }}>
                                    <input
                                        ref={notifyClientRef}
                                        className="form-check-input"
                                        type="checkbox"
                                        id="notifyClient"
                                        defaultChecked
                                        disabled={saleLoaded?.status?.reversible == 0}
                                        style={{
                                            cursor: saleLoaded?.status?.reversible == 0 ? 'not-allowed' : 'pointer'
                                        }}
                                    />
                                    <label className="form-check-label" htmlFor="notifyClient" style={{
                                        cursor: saleLoaded?.status?.reversible == 0 ? 'not-allowed' : 'pointer'
                                    }}>
                                        Notificar al cliente
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header p-2">
                                <h5 className="card-title mb-0">
                                    Cambios de Estado
                                </h5>
                            </div>
                            <div className="card-body p-2 d-flex flex-column gap-1">
                                {saleStatuses?.map((ss, index) => {
                                    // Buscar el color del estado desde la lista de estados disponibles
                                    const statusData = statuses.find(s => s.id === ss.status_id || s.name === ss.name);
                                    const statusColor = statusData?.color || ss.color || "#333";
                                    
                                    return (
                                        <article
                                            key={index}
                                            className="border py-1 px-2 ms-3"
                                            style={{
                                                position: "relative",
                                                borderRadius:
                                                    "16px 4px 4px 16px",
                                                backgroundColor: statusColor
                                                    ? `${statusColor}2e`
                                                    : "#3333332e",
                                            }}
                                        >
                                            <i
                                                className={`${ss.icon || statusData?.icon || 'mdi mdi-circle'} left-2`}
                                                style={{
                                                    color: statusColor,
                                                    position: "absolute",
                                                    left: "-25px",
                                                    top: "50%",
                                                    transform:
                                                        "translateY(-50%)",
                                                }}
                                            ></i>
                                            <b
                                                style={{
                                                    color: statusColor,
                                                }}
                                            >
                                                {ss?.name}
                                            </b>
                                            <small className="d-block text-truncate">
                                                {ss?.user_name}{" "}
                                                {ss?.user_lastname}
                                            </small>
                                            <small className="d-block text-muted">
                                                {moment(ss.created_at).format(
                                                    "YYYY-MM-DD HH:mm"
                                                )}
                                            </small>
                                        </article>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Modal de Configuración de Exportación */}
            <Modal
                modalRef={configModalRef}
                title="Configurar Campos de Exportación"
                size="lg"
                hideFooter={true}
            >
                <div className="row">
                    <div className="col-12">
                        <p className="text-muted mb-4">
                            Selecciona los campos que deseas incluir en la exportación de Excel. Los campos están organizados por categorías para facilitar su selección:
                        </p>
                        
                        {Object.entries(exportableFieldsCategories).map(([categoryName, fields]) => (
                            <div key={categoryName} className="mb-4">
                                <div className="card border-0 shadow-sm">
                                    <div className="card-header bg-light py-2">
                                        <h6 className="mb-0 text-primary fw-bold">
                                            <i className="mdi mdi-folder-outline me-2"></i>
                                            {categoryName}
                                        </h6>
                                    </div>
                                    <div className="card-body py-3">
                                        <div className="row">
                                            {Object.entries(fields).map(([key, label]) => (
                                                <div key={key} className="col-md-6 col-lg-4 mb-2">
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={`field_${key}`}
                                                            checked={exportConfig[key] === true}
                                                            onChange={(e) => {
                                                                setExportConfig(prev => ({
                                                                    ...prev,
                                                                    [key]: e.target.checked
                                                                }));
                                                            }}
                                                        />
                                                        <label className="form-check-label" htmlFor={`field_${key}`}>
                                                            <small className="text-dark">{label}</small>
                                                        </label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="mt-4 d-flex justify-content-between">
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-outline-primary me-2"
                                    onClick={() => {
                                        const allSelected = {};
                                        Object.values(exportableFieldsCategories).forEach(category => {
                                            Object.keys(category).forEach(key => {
                                                allSelected[key] = true;
                                            });
                                        });
                                        setExportConfig(allSelected);
                                    }}
                                >
                                    <i className="mdi mdi-check-all me-1"></i>
                                    Seleccionar Todo
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => {
                                        const allDeselected = {};
                                        Object.values(exportableFieldsCategories).forEach(category => {
                                            Object.keys(category).forEach(key => {
                                                allDeselected[key] = false;
                                            });
                                        });
                                        setExportConfig(allDeselected);
                                    }}
                                >
                                    <i className="mdi mdi-close-box-multiple me-1"></i>
                                    Deseleccionar Todo
                                </button>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-secondary me-2"
                                    onClick={() => $(configModalRef.current).modal('hide')}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={async () => {
                                        try {
                                            await saveExportConfig();
                                            Swal.fire({
                                                title: 'Configuración Guardada',
                                                text: 'La configuración de exportación se ha guardado correctamente.',
                                                icon: 'success',
                                                timer: 2000,
                                                showConfirmButton: false
                                            });
                                            $(configModalRef.current).modal('hide');
                                        } catch (error) {
                                            Swal.fire({
                                                title: 'Error',
                                                text: 'No se pudo guardar la configuración. Inténtalo de nuevo.',
                                                icon: 'error'
                                            });
                                        }
                                    }}
                                >
                                    Guardar Configuración
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Pedidos">
            <Sales {...properties} />
        </BaseAdminto>
    );
});
