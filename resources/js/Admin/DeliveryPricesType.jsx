import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";

import DeliveryPricesRest from "@Rest/Admin/DeliveryPricesRest";
import TypesDeliveryRest from "@Rest/Admin/TypesDeliveryRest";
import StoresRest from "../Actions/Admin/StoresRest";
import CreateReactScript from "@Utils/CreateReactScript";
import Swal from "sweetalert2";
import BaseAdminto from "../Components/Adminto/Base";
import DxButton from "../Components/Adminto/Dx/DxButton";
import Modal from "../Components/Adminto/Modal";
import Table from "../Components/Adminto/Table";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import SelectFormGroup from "../Components/Adminto/form/SelectFormGroup";
import SwitchFormGroup from "../Components/Adminto/form/SwitchFormGroup";
import Number2Currency, { CurrencySymbol } from "../Utils/Number2Currency";

const deliverypricesRest = new DeliveryPricesRest();
const deliverypricesTypeRest = new TypesDeliveryRest();
const storesRest = new StoresRest();

const DeliveryPricesType = ({ ubigeo = [] }) => {
    const gridRef = useRef();
    const gridTypeRef = useRef();
    const modalRef = useRef();
    const modalTypeRef = useRef();
    const modalTypeFormRef = useRef();
    // Form elements ref
    const idRef = useRef();
    const ubigeoRef = useRef();
    const priceRef = useRef();
    const is_freeRef = useRef();
    const is_expressRef = useRef();
    const is_agencyRef = useRef();
    const is_store_pickupRef = useRef();
    const express_priceRef = useRef();
    const agency_priceRef = useRef();
    const agency_payment_on_deliveryRef = useRef();
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingType, setIsEditingType] = useState(false);
    const [inHome, setInHome] = useState(false);
    
    // Estados para habilitar cada opción de delivery
    const [enableStandard, setEnableStandard] = useState(false);
    const [enableExpress, setEnableExpress] = useState(false);
    const [enableFree, setEnableFree] = useState(false);
    const [enableAgency, setEnableAgency] = useState(false);
    const [agencyPaymentOnDelivery, setAgencyPaymentOnDelivery] = useState(false);
    const [agencyPriceValue, setAgencyPriceValue] = useState('0.00');
    const [enableStorePickup, setEnableStorePickup] = useState(false);
    
    const [stores, setStores] = useState([]);
    const [availableStores, setAvailableStores] = useState([]);
    const [selectedStores, setSelectedStores] = useState([]); // Tiendas seleccionadas específicamente

    // No necesitamos cargar cache de tiendas para la tabla

    // No necesitamos cargar cache de tiendas para la tabla

    const onModalOpen = (data) => {
        console.log(data);
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        // Limpiar tiendas seleccionadas al abrir el modal
        setSelectedStores([]);

        idRef.current.value = data?.id ?? "";
        $(ubigeoRef.current)
            .val(data?.ubigeo ?? null)
            .trigger("change");

        // Determinar qué opciones están habilitadas basándose en los valores
        const hasStandardPrice = data?.price && parseFloat(data.price) > 0;
        const hasExpressPrice = data?.express_price && parseFloat(data.express_price) > 0;
        const hasAgencyPrice = data?.agency_price && parseFloat(data.agency_price) > 0;
        
        setEnableStandard(hasStandardPrice || !data?.id); // Por defecto activado si es nuevo
        setEnableExpress(hasExpressPrice);
        setEnableFree(data?.is_free ?? false);
        setEnableAgency(data?.is_agency ?? false);
        setAgencyPaymentOnDelivery(data?.agency_payment_on_delivery ?? false);
        setEnableStorePickup(data?.is_store_pickup ?? false);

        // Actualizar el estado del precio de agencia para la visualización
        const agencyPrice = data?.agency_payment_on_delivery ? '0.00' : (data?.agency_price ? parseFloat(data.agency_price).toFixed(2) : '0.00');
        setAgencyPriceValue(agencyPrice);

        // Cargar tiendas si retiro en tienda está activo
        if (data?.is_store_pickup) {
            loadAvailableStores();
            if (data?.selected_stores && Array.isArray(data.selected_stores)) {
                setSelectedStores(data.selected_stores);
            }
        }

        $(modalRef.current).modal("show");

        // Setear valores en los refs DESPUÉS de que los campos sean visibles
        setTimeout(() => {
            if (is_freeRef.current) is_freeRef.current.checked = data?.is_free ?? false;
            if (is_expressRef.current) is_expressRef.current.checked = data?.is_express ?? false;
            if (is_agencyRef.current) is_agencyRef.current.checked = data?.is_agency ?? false;
            if (is_store_pickupRef.current) is_store_pickupRef.current.checked = data?.is_store_pickup ?? false;

            if (priceRef.current) priceRef.current.value = data?.price ?? '';
            if (express_priceRef.current) express_priceRef.current.value = data?.express_price ?? '';
            if (agency_priceRef.current) agency_priceRef.current.value = data?.agency_payment_on_delivery ? '' : (data?.agency_price ?? '');
        }, 100);
    };

    // Función para cargar todas las tiendas disponibles
    const loadAvailableStores = async () => {
        try {
            // Cargar todas las tiendas activas desde el endpoint correcto
            const result = await storesRest.paginate({
                page: 1,
                per_page: 100, // Cargar hasta 100 tiendas
                filters: JSON.stringify([
                    {
                        field: "status",
                        operator: "=",
                        value: 1
                    }
                ])
            });

            console.log('Cargando todas las tiendas disponibles:', result);

            if (result && result.data && Array.isArray(result.data)) {
                setAvailableStores(result.data);
            } else {
                setAvailableStores([]);
            }
        } catch (error) {
            console.error("Error loading stores:", error);
            setAvailableStores([]);
        }
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        const selected = ubigeo.find(
            (x) => x.reniec == ubigeoRef.current.value
        );
        const request = {
            id: idRef.current.value || undefined,
            name: `${selected.distrito}, ${selected.provincia} - ${selected.departamento}`.toTitleCase(),
            price: enableStandard ? (priceRef.current.value || 0) : 0,
            is_free: enableFree,
            is_express: enableExpress,
            is_agency: enableAgency,
            is_store_pickup: enableStorePickup,
            express_price: enableExpress ? (express_priceRef.current.value || 0) : 0,
            agency_price: enableAgency && !agencyPaymentOnDelivery ? (agency_priceRef.current.value || 0) : 0,
            agency_payment_on_delivery: enableAgency ? agencyPaymentOnDelivery : false,
            ubigeo: ubigeoRef.current.value,
            selected_stores: enableStorePickup ?
                (selectedStores.length > 0 ? selectedStores : null) :
                null
        };

        console.log('Datos a enviar:', request);

        const result = await deliverypricesRest.save(request);
        if (!result) return;

        // Limpiar tiendas seleccionadas después de guardar
        setSelectedStores([]);

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
    };

    const idTypeRef = useRef();
    const nameTypeRef = useRef();
    const descriptionTypeRef = useRef();
    const [characteristics, setCharacteristics] = useState([{ value: "" }]);

    // Manejo de características
    const addCharacteristic = () => {
        setCharacteristics([...characteristics, { value: "" }]);
    };

    const updateCharacteristic = (index, value) => {
        const newCharacteristics = [...characteristics];
        newCharacteristics[index].value = value;
        setCharacteristics(newCharacteristics);
    };

    const removeCharacteristic = (index) => {
        if (characteristics.length <= 1) return;
        const newCharacteristics = characteristics.filter(
            (_, i) => i !== index
        );
        setCharacteristics(newCharacteristics);
    };
    const onModalType = () => {
        $(modalTypeRef.current).modal("show");
    };

    const onModalTypeOpen = (data) => {
        if (data?.id) setIsEditingType(true);
        else setIsEditingType(false);
        idTypeRef.current.value = data?.id ?? "";

        nameTypeRef.current.value = data?.name ?? "";
        descriptionTypeRef.current.value = data?.description ?? "";

        // Cargar características existentes
        if (data?.characteristics && data.characteristics.length > 0) {
            setCharacteristics(
                data.characteristics.map((item) => ({ value: item }))
            );
        } else {
            setCharacteristics([{ value: "" }]);
        }

        $(modalTypeFormRef.current).modal("show");
    };

    const onModalTypeSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", nameTypeRef.current.value);
        formData.append("description", descriptionTypeRef.current.value);
        // Si estamos editando, agregar el ID
        if (isEditingType) {
            formData.append("id", idTypeRef.current.value);
        }

        // Agregar características (filtrar vacías)
        const nonEmptyCharacteristics = characteristics
            .map((c) => c.value.trim())
            .filter((c) => c.length > 0);
        formData.append(
            "characteristics",
            JSON.stringify(nonEmptyCharacteristics)
        );

        // Enviar al backend
        const result = await deliverypricesTypeRest.save(formData);
        if (!result) return;

        // Limpiar y cerrar
        $(gridTypeRef.current).dxDataGrid("instance").refresh();
        $(modalTypeFormRef.current).modal("hide");

        setCharacteristics([{ value: "" }]);
    };
    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar registro",
            text: "¿Estas seguro de eliminar este registro?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await deliverypricesRest.delete(id);
        if (!result) return;

        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const ubigeoTemplate = (e) => {
        return $(
            renderToString(
                <span>
                    <span className="d-block w-100 text-truncate">
                        {e.text.replace(e.id, "")}
                    </span>
                    <small className="d-block">Ubigeo: {e.id}</small>
                </span>
            )
        );
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        e.target.value = null;

        const formData = new FormData();
        formData.append("excel", file);

        const result = await deliverypricesRest.upload(formData);

        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    return (
        <>
            <input
                id="file-input"
                type="file"
                accept=".xlsx, .xls"
                style={{ display: "none" }}
                onChange={handleFileUpload}
            />
            <Table
                gridRef={gridRef}
                title="Costos de envío"
                rest={deliverypricesRest}
                exportable={true}
                exportableName="delivery.prices"
                toolBar={(container) => {
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "upload",
                            hint: "Cargar archivo Excel",
                            onClick: () =>
                                document.getElementById("file-input").click(),
                        },
                    });
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

                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "plus",
                            text: "Nuevo registro",
                            hint: "Nuevo registro",
                            onClick: () => onModalOpen(),
                        },
                    });
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "refresh",
                            text: "Actualizar datos de Delivery",
                            hint: "Actualizar datos de Delivery",
                            onClick: () => onModalType(),
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
                        dataField: "ubigeo",
                        caption: "Ubigeo (RENIEC)",
                        width: "150px",
                    },
                    {
                        dataField: "name",
                        caption: "Envío a",
                 
                        allowExporting: false,
                        calculateCellValue: (data) => {
                            // Buscar el ubigeo en el array para obtener el formato correcto
                            if (data.data && data.data.distrito) {
                                return `${data.data.distrito}, ${data.data.provincia} - ${data.data.departamento}`;
                            }
                            // Si no hay data, mostrar el name guardado
                            return data.name;
                        },
                    },
                    {
                        dataField: "active_options_search",
                        dataType: "string",
                        caption: "Tipos de delivery",
                        width: "250px",
                        allowFiltering: true,
                        calculateCellValue: (data) => {
                            const options = [];
                            
                            // Delivery Estándar
                            if (data.price && parseFloat(data.price) > 0 && !data.is_free) {
                                options.push('Estándar');
                            }
                            
                            // Delivery Express
                            if (data.is_express || (data.express_price && parseFloat(data.express_price) > 0)) {
                                options.push('Express');
                            }
                            
                            // Delivery Gratis
                            if (data.is_free) {
                                options.push('Gratis');
                            }
                            
                            // Recojo en Agencia
                            if (data.is_agency) {
                                options.push('Agencia');
                            }
                            
                            // Retiro en Tienda
                            if (data.is_store_pickup) {
                                options.push('Tienda');
                            }
                            
                            return options.join(', ');
                        },
                        cellTemplate: (container, { data }) => {
                            const badges = [];
                            
                            // Delivery Estándar
                            if (data.price && parseFloat(data.price) > 0 && !data.is_free) {
                                badges.push(
                                    <span key="standard" className="badge bg-primary me-1 mb-1">
                                        <i className="fas fa-truck me-1"></i>
                                        Estándar
                                    </span>
                                );
                            }
                            
                            // Delivery Express
                            if (data.is_express || (data.express_price && parseFloat(data.express_price) > 0)) {
                                badges.push(
                                    <span key="express" className="badge bg-warning text-dark me-1 mb-1">
                                        <i className="fas fa-bolt me-1"></i>
                                        Express
                                    </span>
                                );
                            }
                            
                            // Delivery Gratis
                            if (data.is_free) {
                                badges.push(
                                    <span key="free" className="badge bg-success me-1 mb-1">
                                        <i className="fas fa-gift me-1"></i>
                                        Gratis
                                    </span>
                                );
                            }
                            
                            // Recojo en Agencia
                            if (data.is_agency) {
                                badges.push(
                                    <span key="agency" className="badge bg-info me-1 mb-1">
                                        <i className="fas fa-building me-1"></i>
                                        Agencia {data.agency_payment_on_delivery ? '(Pago Destino)' : ''}
                                    </span>
                                );
                            }
                            
                            // Retiro en Tienda
                            if (data.is_store_pickup) {
                                badges.push(
                                    <span key="store" className="badge bg-primary me-1 mb-1">
                                        <i className="fas fa-store me-1"></i>
                                        Tienda
                                    </span>
                                );
                            }
                            
                            if (badges.length === 0) {
                                container.html(
                                    renderToString(
                                        <span className="text-muted font-italic">
                                            <i className="fas fa-times-circle me-1"></i>
                                            Sin opciones
                                        </span>
                                    )
                                );
                            } else {
                                container.html(
                                    renderToString(
                                        <div className="d-flex flex-wrap">
                                            {badges}
                                        </div>
                                    )
                                );
                            }
                        },
                    },
                    {
                        dataField: "price",
                        caption: "Precios",
                        dataType: "number",
                        width: "200px",
                        cellTemplate: (container, { data }) => {
                            const prices = [];
                            
                            // Precio Estándar
                            if (data.price && parseFloat(data.price) > 0) {
                                prices.push(
                                    <div key="standard" className="mb-1">
                                        <span className="badge bg-primary me-1">Est.</span>
                                        <strong>{CurrencySymbol()} {Number2Currency(data.price)}</strong>
                                    </div>
                                );
                            }
                            
                            // Precio Express
                            if (data.express_price && parseFloat(data.express_price) > 0) {
                                prices.push(
                                    <div key="express" className="mb-1">
                                        <span className="badge bg-warning text-dark me-1">Exp.</span>
                                        <strong>{CurrencySymbol()} {Number2Currency(data.express_price)}</strong>
                                    </div>
                                );
                            }
                            
                            // Precio Agencia
                            if (data.is_agency) {
                                if (data.agency_payment_on_delivery) {
                                    prices.push(
                                        <div key="agency" className="mb-1">
                                            <span className="badge bg-info me-1">Age.</span>
                                            <strong className="text-info">Pago en Destino</strong>
                                        </div>
                                    );
                                } else if (data.agency_price) {
                                    prices.push(
                                        <div key="agency" className="mb-1">
                                            <span className="badge bg-info me-1">Age.</span>
                                            <strong>{CurrencySymbol()} {Number2Currency(data.agency_price)}</strong>
                                        </div>
                                    );
                                }
                            }
                            
                            // Delivery Gratis
                            if (data.is_free) {
                                prices.push(
                                    <div key="free" className="mb-1">
                                        <span className="badge bg-success me-1">Free</span>
                                        <strong className="text-success">GRATIS*</strong>
                                    </div>
                                );
                            }
                            
                            // Retiro en Tienda
                            if (data.is_store_pickup) {
                                prices.push(
                                    <div key="store" className="mb-1">
                                        <span className="badge bg-primary me-1">Tienda</span>
                                        <strong className="text-success">GRATIS</strong>
                                    </div>
                                );
                            }
                            
                            if (prices.length === 0) {
                                container.html(
                                    renderToString(
                                        <span className="text-muted font-italic">
                                            - Sin precios -
                                        </span>
                                    )
                                );
                            } else {
                                container.html(
                                    renderToString(
                                        <div className="d-flex flex-column">
                                            {prices}
                                            {data.is_free && (
                                                <small className="text-muted">* Condicional</small>
                                            )}
                                        </div>
                                    )
                                );
                            }
                        },
                    },
                    {
                        dataField: "selected_stores",
                        caption: "Tiendas",
                        width: "200px",
                        cellTemplate: (container, { data }) => {
                            if (data.is_store_pickup || data.is_free) {
                                if (data.selected_stores && Array.isArray(data.selected_stores) && data.selected_stores.length > 0) {
                                    // Solo mostrar número de tiendas específicas
                                    container.html(
                                        renderToString(
                                            <div>
                                                <span className="badge bg-primary">
                                                    {data.selected_stores.length} tienda{data.selected_stores.length > 1 ? 's' : ''} específica{data.selected_stores.length > 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        )
                                    );
                                } else {
                                    // Todas las tiendas
                                    container.html(
                                        renderToString(
                                            <span className="badge bg-success">
                                                Todas las tiendas
                                            </span>
                                        )
                                    );
                                }
                            } else {
                                // No aplica
                                container.html(
                                    renderToString(
                                        <span className="text-muted font-italic">
                                            No aplica
                                        </span>
                                    )
                                );
                            }
                        },
                        allowFiltering: false,
                        allowExporting: false,
                    },
                    {
                        caption: "Acciones",
                        width: "100px",
                        cellTemplate: (container, { data }) => {
                            container.css("text-overflow", "unset");
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-primary",
                                    title: "Editar",
                                    icon: "fa fa-pen",
                                    onClick: () => onModalOpen(data),
                                })
                            );
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-danger",
                                    title: "Eliminar",
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
                title={
                    isEditing
                        ? "Editar Costo de envío"
                        : "Agregar Costo de envío"
                }
                onSubmit={onModalSubmit}
                size="lg"
            >
                <input ref={idRef} type="hidden" />
                <div id="form-container" className="row">
                    <SelectFormGroup
                        eRef={ubigeoRef}
                        label="Distrito/Ubigeo"
                        templateResult={ubigeoTemplate}
                        templateSelection={ubigeoTemplate}
                        dropdownParent="#form-container"
                        required
                    >
                        {ubigeo.map((x, index) => (
                            <option key={index} value={x.reniec}>
                                {x.reniec} {x.distrito} {x.provincia}{" "}
                                {x.departamento}
                            </option>
                        ))}
                    </SelectFormGroup>

                    {/* Alert informativo mejorado */}
                    <div className="col-12 mb-4">
                        <div className="alert alert-primary border-0 shadow-sm" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white'}}>
                            <div className="d-flex align-items-start">
                                <div className="flex-shrink-0">
                                    <i className="fas fa-info-circle fa-2x me-3 opacity-75"></i>
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="alert-heading mb-2">
                                        <i className="fas fa-truck me-2"></i>
                                        ¿Cómo configurar las opciones de delivery?
                                    </h5>
                                    <p className="mb-2">Selecciona <strong>UNA O VARIAS</strong> opciones de envío para esta ubicación. Los clientes verán todas las opciones activas en el checkout y podrán elegir la que más les convenga.</p>
                                    <hr className="my-2" style={{borderColor: 'rgba(255,255,255,0.3)'}} />
                                    <div className="small">
                                        <strong>💡 Ejemplo:</strong> Puedes activar "Delivery Estándar" + "Delivery Express" + "Retiro en Tienda" al mismo tiempo.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Estándar */}
                    <div className="col-md-6 mb-3">
                        <div className={`card h-100 border-2 ${enableStandard ? 'border-primary shadow-sm' : 'border-light'}`}>
                            <div className="card-body">
                                <div className="d-flex align-items-start mb-3">
                                    <div className="form-check flex-grow-1">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            id="enableStandard"
                                            checked={enableStandard}
                                            onChange={(e) => setEnableStandard(e.target.checked)}
                                            style={{width: '1.2em', height: '1.2em'}}
                                        />
                                        <label className="form-check-label fw-bold ms-2" htmlFor="enableStandard" style={{fontSize: '1.1rem'}}>
                                            <i className="fas fa-truck text-primary me-2"></i>
                                            Delivery Estándar
                                        </label>
                                    </div>
                                    {enableStandard && (
                                        <span className="badge bg-primary">Activo</span>
                                    )}
                                </div>
                                <p className="text-muted small mb-3">
                                    <i className="fas fa-clock me-1"></i> Entrega en 3-5 días hábiles<br/>
                                    <i className="fas fa-box me-1"></i> Opción más común para envíos regulares
                                </p>
                                {enableStandard && (
                                    <div className="mt-3 pt-3 border-top">
                                        <InputFormGroup
                                            eRef={priceRef}
                                            label={<span><i className="fas fa-money-bill-wave me-1"></i> Costo de envío (S/)</span>}
                                            col="col-12"
                                            type="number"
                                            step={0.01}
                                            placeholder="Ej: 15.00"
                                            required
                                        />
                                        <div className="alert alert-light border mb-0">
                                            <small className="text-muted d-block mb-1">
                                                <strong>💡 Sugerencia:</strong>
                                            </small>
                                            <small className="text-muted">Este es el precio estándar que pagarán los clientes por envío regular.</small>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Delivery Express */}
                    <div className="col-md-6 mb-3">
                        <div className={`card h-100 border-2 ${enableExpress ? 'border-warning shadow-sm' : 'border-light'}`}>
                            <div className="card-body">
                                <div className="d-flex align-items-start mb-3">
                                    <div className="form-check flex-grow-1">
                                        <input 
                                            ref={is_expressRef}
                                            className="form-check-input" 
                                            type="checkbox" 
                                            id="enableExpress"
                                            checked={enableExpress}
                                            onChange={(e) => setEnableExpress(e.target.checked)}
                                            style={{width: '1.2em', height: '1.2em'}}
                                        />
                                        <label className="form-check-label fw-bold ms-2" htmlFor="enableExpress" style={{fontSize: '1.1rem'}}>
                                            <i className="fas fa-bolt text-warning me-2"></i>
                                            Delivery Express
                                        </label>
                                    </div>
                                    {enableExpress && (
                                        <span className="badge bg-warning text-dark">⚡ Rápido</span>
                                    )}
                                </div>
                                <p className="text-muted small mb-3">
                                    <i className="fas fa-shipping-fast me-1"></i> Entrega en 24-48 horas<br/>
                                    <i className="fas fa-star me-1"></i> Envío prioritario con costo adicional
                                </p>
                                {enableExpress && (
                                    <div className="mt-3 pt-3 border-top">
                                        <InputFormGroup
                                            eRef={express_priceRef}
                                            label={<span><i className="fas fa-money-bill-wave me-1"></i> Costo express (S/)</span>}
                                            col="col-12"
                                            type="number"
                                            step={0.01}
                                            placeholder="Ej: 25.00"
                                            required
                                        />
                                        <div className="alert alert-warning border mb-0">
                                            <small className="text-dark d-block mb-1">
                                                <strong>⚡ Importante:</strong>
                                            </small>
                                            <small className="text-dark">Precio premium por entrega rápida. Generalmente mayor que el estándar.</small>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Delivery Gratis */}
                    <div className="col-md-6 mb-3">
                        <div className={`card h-100 border-2 ${enableFree ? 'border-success shadow-sm' : 'border-light'}`}>
                            <div className="card-body">
                                <div className="d-flex align-items-start mb-3">
                                    <div className="form-check flex-grow-1">
                                        <input 
                                            ref={is_freeRef}
                                            className="form-check-input" 
                                            type="checkbox" 
                                            id="enableFree"
                                            checked={enableFree}
                                            onChange={(e) => setEnableFree(e.target.checked)}
                                            style={{width: '1.2em', height: '1.2em'}}
                                        />
                                        <label className="form-check-label fw-bold ms-2" htmlFor="enableFree" style={{fontSize: '1.1rem'}}>
                                            <i className="fas fa-gift text-success me-2"></i>
                                            Delivery Gratis
                                        </label>
                                    </div>
                                    {enableFree && (
                                        <span className="badge bg-success">🎁 Gratis</span>
                                    )}
                                </div>
                                <p className="text-muted small mb-3">
                                    <i className="fas fa-check-circle me-1"></i> Condicional (monto mínimo)<br/>
                                    <i className="fas fa-heart me-1"></i> Incentiva compras mayores
                                </p>
                                {enableFree && (
                                    <div className="alert alert-success border-0 mb-0 mt-3">
                                        <div className="d-flex align-items-start">
                                            <i className="fas fa-info-circle me-2 mt-1"></i>
                                            <div>
                                                <strong className="d-block mb-1">¿Cómo funciona?</strong>
                                                <small>
                                                    El envío será <strong>GRATIS</strong> cuando el cliente alcance el monto mínimo de compra configurado en el sistema.
                                                </small>
                                                <hr className="my-2" />
                                                <small className="text-muted">
                                                    <i className="fas fa-cog me-1"></i> Configura el monto mínimo en: <strong>Configuraciones → General</strong>
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recojo en Agencia */}
                    <div className="col-md-6 mb-3">
                        <div className={`card h-100 border-2 ${enableAgency ? 'border-info shadow-sm' : 'border-light'}`}>
                            <div className="card-body">
                                <div className="d-flex align-items-start mb-3">
                                    <div className="form-check flex-grow-1">
                                        <input 
                                            ref={is_agencyRef}
                                            className="form-check-input" 
                                            type="checkbox" 
                                            id="enableAgency"
                                            checked={enableAgency}
                                            onChange={(e) => setEnableAgency(e.target.checked)}
                                            style={{width: '1.2em', height: '1.2em'}}
                                        />
                                        <label className="form-check-label fw-bold ms-2" htmlFor="enableAgency" style={{fontSize: '1.1rem'}}>
                                            <i className="fas fa-building text-info me-2"></i>
                                            Recojo en Agencia
                                        </label>
                                    </div>
                                    {enableAgency && (
                                        <span className="badge bg-info">📦 Agencia</span>
                                    )}
                                </div>
                                <p className="text-muted small mb-3">
                                    <i className="fas fa-map-marker-alt me-1"></i> Olva, Shalom, Cruz del Sur, etc.<br/>
                                    <i className="fas fa-hand-holding-usd me-1"></i> Dos modalidades disponibles
                                </p>
                                {enableAgency && (
                                    <div className="mt-3 pt-3 border-top">
                                        {/* Selector de tipo de pago */}
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">
                                                <i className="fas fa-money-check-alt me-1"></i>
                                                Tipo de cobro:
                                            </label>
                                            <div className="btn-group w-100" role="group">
                                                <input 
                                                    type="radio" 
                                                    className="btn-check" 
                                                    name="agencyPaymentType" 
                                                    id="agencyFixedPrice"
                                                    checked={!agencyPaymentOnDelivery}
                                                    onChange={() => setAgencyPaymentOnDelivery(false)}
                                                />
                                                <label className="btn btn-outline-primary" htmlFor="agencyFixedPrice">
                                                    <i className="fas fa-dollar-sign me-1"></i>
                                                    Nosotros cobramos
                                                </label>

                                                <input 
                                                    type="radio" 
                                                    className="btn-check" 
                                                    name="agencyPaymentType" 
                                                    id="agencyPaymentOnDelivery"
                                                    checked={agencyPaymentOnDelivery}
                                                    onChange={() => setAgencyPaymentOnDelivery(true)}
                                                />
                                                <label className="btn btn-outline-info" htmlFor="agencyPaymentOnDelivery">
                                                    <i className="fas fa-hand-holding-usd me-1"></i>
                                                    Pago en Destino
                                                </label>
                                            </div>
                                        </div>

                                        {/* Precio fijo (nosotros cobramos) */}
                                        {!agencyPaymentOnDelivery && (
                                            <div className="animate__animated animate__fadeIn">
                                                <InputFormGroup
                                                    eRef={agency_priceRef}
                                                    label={<span><i className="fas fa-money-bill-wave me-1"></i> Precio que cobramos (S/)</span>}
                                                    col="col-12"
                                                    type="number"
                                                    step={0.01}
                                                    placeholder="Ej: 10.00"
                                                    onChange={(e) => setAgencyPriceValue(e.target.value || '0.00')}
                                                    required
                                                />
                                                <div className="alert alert-primary border-0 mb-0">
                                                    <div className="d-flex align-items-start">
                                                        <i className="fas fa-info-circle me-2 mt-1"></i>
                                                        <div>
                                                            <strong className="d-block mb-1">Nosotros cobramos el envío</strong>
                                                            <small>
                                                                El cliente paga <strong>S/ {agencyPriceValue}</strong> en el checkout.
                                                                Con esta opción, el cliente <strong>ya NO paga nada adicional</strong> al recoger en la agencia.
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Pago en destino (cliente paga contra entrega) */}
                                        {agencyPaymentOnDelivery && (
                                            <div className="animate__animated animate__fadeIn">
                                                <div className="alert alert-info border-0 mb-0">
                                                    <div className="d-flex align-items-start">
                                                        <i className="fas fa-hand-holding-usd fa-2x me-3 mt-1"></i>
                                                        <div>
                                                            <strong className="d-block mb-2">Cliente paga contra entrega</strong>
                                                            <ul className="mb-0 ps-3">
                                                                <li className="mb-1">
                                                                    <strong>Nosotros NO cobramos</strong> por el envío
                                                                </li>
                                                                <li className="mb-1">
                                                                    El cliente paga directamente a la <strong>agencia de transporte</strong> al recoger
                                                                </li>
                                                                <li>
                                                                    Ideal para agencias como: <span className="badge bg-info ms-1">Olva</span> <span className="badge bg-info">Shalom</span> <span className="badge bg-info">Cruz del Sur</span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Retiro en Tienda */}
                    <div className="col-12 mb-3">
                        <div className={`card border-2 ${enableStorePickup ? 'border-primary shadow-sm' : 'border-light'}`}>
                            <div className="card-body">
                                <div className="d-flex align-items-start mb-3">
                                    <div className="form-check flex-grow-1">
                                        <input 
                                            ref={is_store_pickupRef}
                                            className="form-check-input" 
                                            type="checkbox" 
                                            id="enableStorePickup"
                                            checked={enableStorePickup}
                                            onChange={(e) => {
                                                setEnableStorePickup(e.target.checked);
                                                if (e.target.checked) {
                                                    loadAvailableStores();
                                                } else {
                                                    setSelectedStores([]);
                                                }
                                            }}
                                            style={{width: '1.2em', height: '1.2em'}}
                                        />
                                        <label className="form-check-label fw-bold ms-2" htmlFor="enableStorePickup" style={{fontSize: '1.1rem'}}>
                                            <i className="fas fa-store text-primary me-2"></i>
                                            Retiro en Tienda
                                        </label>
                                    </div>
                                    {enableStorePickup && (
                                        <span className="badge bg-primary">🏪 Sin costo</span>
                                    )}
                                </div>
                                <p className="text-muted small mb-3">
                                    <i className="fas fa-map-marked-alt me-1"></i> Cliente recoge en tienda física<br/>
                                    <i className="fas fa-dollar-sign me-1"></i> <strong className="text-success">Totalmente GRATIS</strong> (sin costo de envío)
                                </p>
                                {enableStorePickup && (
                                    <div className="alert alert-primary border-0 mb-0 mt-3">
                                        <div className="d-flex align-items-start">
                                            <i className="fas fa-check-circle me-2 mt-1"></i>
                                            <div>
                                                <strong className="d-block mb-1">Beneficio para el cliente</strong>
                                                <small>
                                                    El cliente ahorra el costo de envío recogiendo su pedido directamente en tu tienda.
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mostrar tiendas disponibles cuando se selecciona retiro en tienda */}
                    {enableStorePickup && (
                        <div className="col-12 mb-3">
                            <div className="card border-0 bg-light">
                                <div className="card-header bg-primary text-white">
                                    <h6 className="mb-0">
                                        <i className="fas fa-store-alt me-2"></i>
                                        Selecciona las tiendas disponibles
                                    </h6>
                                </div>
                                <div className="card-body">
                                    {availableStores.length > 0 ? (
                                        <div>
                                            <div className="alert alert-info border-0 mb-3">
                                                <div className="d-flex align-items-start">
                                                    <i className="fas fa-lightbulb fa-lg me-2 mt-1"></i>
                                                    <div>
                                                        <strong className="d-block mb-2">¿Cómo funciona?</strong>
                                                        <ul className="mb-0 ps-3">
                                                            <li className="mb-1">
                                                                <strong>Sin selección:</strong> Retiro disponible en <span className="badge bg-success">TODAS las tiendas</span>
                                                            </li>
                                                            <li>
                                                                <strong>Con selección:</strong> Retiro solo en <span className="badge bg-primary">tiendas marcadas</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                    <div className="row">
                                        {availableStores.map((store) => (
                                            <div key={store.id} className="col-md-6 mb-3">
                                                <div className={`card border ${selectedStores.includes(store.id) ? 'border-primary bg-light' : ''}`}>
                                                    <div className="card-body p-3">
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id={`store_${store.id}`}
                                                                checked={selectedStores.includes(store.id)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setSelectedStores([...selectedStores, store.id]);
                                                                    } else {
                                                                        setSelectedStores(selectedStores.filter(id => id !== store.id));
                                                                    }
                                                                }}
                                                            />
                                                            <label className="form-check-label w-100" htmlFor={`store_${store.id}`}>
                                                                <div className="d-flex">
                                                                    <div className="flex-shrink-0">

                                                                        <img
                                                                            src={`/storage/images/stores/${store.image}`}
                                                                            alt={store.name}
                                                                            className="rounded"
                                                                            style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                                                            onError={(e) =>
                                                                            (e.target.src =
                                                                                "/api/cover/thumbnail/null")
                                                                            }
                                                                        />

                                                                    </div>
                                                                    <div className="flex-grow-1 ms-3">
                                                                        <h6 className="mb-1">{store.name}</h6>
                                                                        <small className="text-muted d-block">{store.address}</small>
                                                                        {store.phone && (
                                                                            <small className="text-muted d-block">📞 {store.phone}</small>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-shrink-0">
                                                                        <span className={`badge ${store.status ? 'bg-success' : 'bg-danger'}`}>
                                                                            {store.status ? 'Activa' : 'Inactiva'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                            <div className="mt-3 pt-3 border-top">
                                                <div className="d-flex align-items-center justify-content-between bg-white p-3 rounded border">
                                                    <div>
                                                        <strong className="text-primary">
                                                            <i className="fas fa-check-circle me-1"></i>
                                                            Tiendas seleccionadas:
                                                        </strong>
                                                    </div>
                                                    <div>
                                                        {selectedStores.length === 0 ? (
                                                            <span className="badge bg-success fs-6">
                                                                <i className="fas fa-store me-1"></i>
                                                                Todas ({availableStores.length})
                                                            </span>
                                                        ) : (
                                                            <span className="badge bg-primary fs-6">
                                                                <i className="fas fa-map-marker-alt me-1"></i>
                                                                {selectedStores.length} de {availableStores.length}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="alert alert-warning border-0 mb-0">
                                            <div className="d-flex align-items-center">
                                                <i className="fas fa-exclamation-triangle fa-2x me-3"></i>
                                                <div>
                                                    <strong className="d-block mb-1">No hay tiendas disponibles</strong>
                                                    <small>No se encontraron tiendas activas en esta ubicación.</small>
                                                    <div className="mt-2">
                                                        <a href="/admin/stores" target="_blank" className="btn btn-sm btn-warning">
                                                            <i className="fas fa-plus me-1"></i>
                                                            Administrar tiendas
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>

            <Modal
                modalRef={modalTypeRef}
                title={"Tipos de Delivery"}
                size="lg"
            >
                <Table
                    gridRef={gridTypeRef}
                    title="Tipos de Delivery"
                    rest={deliverypricesTypeRest}
                    toolBar={(container) => {
                        container.unshift({
                            widget: "dxButton",
                            location: "after",
                            options: {
                                icon: "refresh",
                                hint: "Refrescar tabla",
                                onClick: () =>
                                    $(gridTypeRef.current)
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
                            caption: "Nombre",
                            width: "150px",
                            allowExporting: false,
                        },
                        {
                            dataField: "description",
                            caption: "Descripción",
                            width: "300px",
                            cellTemplate: (container, { data }) => {
                                container.html(
                                    data.description ||
                                    '<i class="text-muted">- Sin descripción -</i>'
                                );
                            },
                        },
                        {
                            dataField: "characteristics",
                            caption: "Caracteristicas",
                            width: "200px",
                            cellTemplate: (container, { data }) => {
                                if (data.characteristics) {
                                    data.characteristics.forEach((char) => {
                                        container.css("text-overflow", "unset");
                                        container.append(
                                            renderToString(
                                                <li className="d-flex gap-2">
                                                    <i className="text-muted font-italic d-block">
                                                        - {char}
                                                    </i>
                                                </li>
                                            )
                                        );
                                    });
                                } else {
                                    ('<i class="text-muted">- Sin caracteristicas -</i>');
                                }
                            },
                        },
                        {
                            caption: "Acciones",
                            width: "50px",
                            cellTemplate: (container, { data }) => {
                                container.css("text-overflow", "unset");
                                container.append(
                                    DxButton({
                                        className:
                                            "btn btn-xs btn-soft-primary",
                                        title: "Editar",
                                        icon: "fa fa-pen",
                                        onClick: () => onModalTypeOpen(data),
                                    })
                                );
                            },
                            allowFiltering: false,
                            allowExporting: false,
                        },
                    ]}
                />
            </Modal>

            <Modal
                modalRef={modalTypeFormRef}
                title={
                    isEditing
                        ? "Editar tipo de Delivery"
                        : "Agregar tipo de Delivery"
                }
                onSubmit={onModalTypeSubmit}
                size="sm"
            >
                <input ref={idTypeRef} type="hidden" />
                <div id="form-container" className="row">
                    <div className="col-12">
                        <InputFormGroup
                            eRef={nameTypeRef}
                            label="Nombre"
                            col="col-12"
                            type="string"

                        />
                        <InputFormGroup
                            eRef={descriptionTypeRef}
                            label="descripcion"
                            col="col-12"
                            type="string"
                            required
                        />
                    </div>
                    <div className="col-12">
                        <div className="mb-3">
                            <label className="form-label">
                                Características
                            </label>
                            {characteristics.map((char, index) => (
                                <div key={index} className="input-group mb-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ej: Egresada de la Universidad Nacional Federico Villarreal."
                                        value={char.value}
                                        onChange={(e) =>
                                            updateCharacteristic(
                                                index,
                                                e.target.value
                                            )
                                        }
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={() =>
                                            removeCharacteristic(index)
                                        }
                                        disabled={characteristics.length <= 1}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={addCharacteristic}
                            >
                                <i className="fas fa-plus me-1"></i> Agregar
                                característica
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Costos de envio">
            <DeliveryPricesType {...properties} />
        </BaseAdminto>
    );
});
