import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { GoogleMap, LoadScript, Marker, Autocomplete } from "@react-google-maps/api";

// Bibliotecas requeridas para Google Maps
const libraries = ["places"];

import StoresRest from "../Actions/Admin/StoresRest";
import CreateReactScript from "../Utils/CreateReactScript";
import BaseAdminto from "@Adminto/Base";
import Table from "../Components/Adminto/Table";
import Modal from "../Components/Adminto/Modal";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import TextareaFormGroup from "../Components/Adminto/form/TextareaFormGroup";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import SwitchFormGroup from "../Components/Adminto/form/SwitchFormGroup";
import SelectFormGroup from "../Components/Adminto/form/SelectFormGroup";
import DxButton from "../Components/dx/DxButton";
import Swal from "sweetalert2";
import Global from "../Utils/Global";
import Fillable from "../Utils/Fillable";
import ReactAppend from "../Utils/ReactAppend";

const storesRest = new StoresRest();

const Stores = ({ ubigeos = [] }) => {
    const gridRef = useRef();
    const modalRef = useRef();

    // Form elements ref
    const idRef = useRef();
    const nameRef = useRef();
    const addressRef = useRef();
    const phoneRef = useRef();
    const emailRef = useRef();
    const descriptionRef = useRef();
    const ubigeoRef = useRef();
    const latitudeRef = useRef();
    const longitudeRef = useRef();
    const imageRef = useRef();

    const business_hoursRef = useRef();
    const managerRef = useRef();
    const capacityRef = useRef();
    const typeRef = useRef();
    const linkRef = useRef();

    const [isEditing, setIsEditing] = useState(false);

    // Estados para el mapa de Google
    const [mapCenter, setMapCenter] = useState({
        lat: -12.046374,
        lng: -77.042793
    }); // Lima por defecto
    const [markerPosition, setMarkerPosition] = useState(null);

    // Estados para Google Places Autocomplete
    const [autocomplete, setAutocomplete] = useState(null);
    const [searchValue, setSearchValue] = useState("");

    // Estados para horarios de atención
    const [businessHours, setBusinessHours] = useState([
        { day: "Lunes", open: "09:00", close: "18:00", closed: false },
        { day: "Martes", open: "09:00", close: "18:00", closed: false },
        { day: "Miércoles", open: "09:00", close: "18:00", closed: false },
        { day: "Jueves", open: "09:00", close: "18:00", closed: false },
        { day: "Viernes", open: "09:00", close: "18:00", closed: false },
        { day: "Sábado", open: "09:00", close: "15:00", closed: false },
        { day: "Domingo", open: "09:00", close: "15:00", closed: true },
    ]);

    const onModalOpen = (data) => {
        console.log(data);
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        idRef.current.value = data?.id ?? "";
        nameRef.current.value = data?.name ?? "";
        addressRef.current.value = data?.address ?? "";
        phoneRef.current.value = data?.phone ?? "";
        emailRef.current.value = data?.email ?? "";
        descriptionRef.current.value = data?.description ?? "";
        latitudeRef.current.value = data?.latitude ?? "";
        longitudeRef.current.value = data?.longitude ?? "";
        managerRef.current.value = data?.manager ?? "";
        capacityRef.current.value = data?.capacity ?? "";
        linkRef.current.value = data?.link ?? "";

        // Reset delete flag when opening modal
        if (Fillable.has('stores', 'image')) {
            if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();
            // Limpiar el input de imagen
            if (imageRef.current) {
               imageRef.image.src = data?.image ? `/storage/images/store/${data.image}` : '';
            }
        }

        $(ubigeoRef.current)
            .val(data?.ubigeo ?? null)
            .trigger("change");

        // Verificar si ya existe una tienda principal al abrir el modal
        if (!data?.id) {
            // Si es una nueva tienda, verificar si ya existe una principal
            storesRest.paginate({
                filter: JSON.stringify({ type: 'tienda_principal' })
            }).then(response => {
                console.log('Verificando tiendas principales existentes:', response);
                const hasMainStore = response?.data && Array.isArray(response.data) && response.data.length > 0;
                const typeSelect = $(typeRef.current);

                // Si ya existe una tienda principal, deshabilitar esa opción
                if (hasMainStore) {
                    console.log('Se encontraron tiendas principales:', response.data);
                    typeSelect.find('option[value="tienda_principal"]').prop('disabled', true);
                } else {
                    console.log('No se encontraron tiendas principales');
                    typeSelect.find('option[value="tienda_principal"]').prop('disabled', false);
                }

                typeSelect.val(data?.type ?? "tienda").trigger("change");
            }).catch(error => {
                console.error('Error al verificar tiendas principales:', error);
            });
        } else {
            // Si es edición, verificar si hay otra tienda principal diferente a la actual
            storesRest.paginate({
                filter: JSON.stringify({ type: 'tienda_principal' })
            }).then(response => {
                console.log('Verificando tiendas principales para edición:', response);
                const typeSelect = $(typeRef.current);

                if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
                    // Verificar si hay otra tienda principal diferente a la actual
                    const otherMainStore = response.data.find(store => store.id !== data.id);

                    if (otherMainStore) {
                        console.log('Existe otra tienda principal:', otherMainStore);
                        // Si la tienda actual NO es principal, deshabilitar la opción
                        if (data.type !== 'tienda_principal') {
                            typeSelect.find('option[value="tienda_principal"]').prop('disabled', true);
                        } else {
                            typeSelect.find('option[value="tienda_principal"]').prop('disabled', false);
                        }
                    } else {
                        console.log('No existe otra tienda principal');
                        typeSelect.find('option[value="tienda_principal"]').prop('disabled', false);
                    }
                } else {
                    console.log('No hay tiendas principales');
                    typeSelect.find('option[value="tienda_principal"]').prop('disabled', false);
                }

                typeSelect.val(data?.type ?? "tienda").trigger("change");
            }).catch(error => {
                console.error('Error al verificar tiendas principales:', error);
                $(typeRef.current).val(data?.type ?? "tienda").trigger("change");
            });
        }


        // Cargar horarios de atención si existen
        if (data?.business_hours) {
            try {
                const hours = typeof data.business_hours === 'string'
                    ? JSON.parse(data.business_hours)
                    : data.business_hours;
                setBusinessHours(hours);
            } catch (e) {
                console.error("Error parsing business hours:", e);
            }
        } else {
            // Resetear a horarios por defecto
            setBusinessHours([
                { day: "Lunes", open: "09:00", close: "18:00", closed: false },
                { day: "Martes", open: "09:00", close: "18:00", closed: false },
                { day: "Miércoles", open: "09:00", close: "18:00", closed: false },
                { day: "Jueves", open: "09:00", close: "18:00", closed: false },
                { day: "Viernes", open: "09:00", close: "18:00", closed: false },
                { day: "Sábado", open: "09:00", close: "15:00", closed: false },
                { day: "Domingo", open: "09:00", close: "15:00", closed: true },
            ]);
        }

        // Configurar el mapa con las coordenadas existentes
        if (data?.latitude && data?.longitude) {
            const lat = parseFloat(data.latitude);
            const lng = parseFloat(data.longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
                const position = { lat, lng };
                setMapCenter(position);
                setMarkerPosition(position);
            }
        } else {
            // Resetear mapa a Lima por defecto
            const defaultPosition = { lat: -12.046374, lng: -77.042793 };
            setMapCenter(defaultPosition);
            setMarkerPosition(null);
        }

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        // Verificar si se está intentando crear o editar a tienda principal
        if (typeRef.current.value === 'tienda_principal') {
            try {
                const currentId = idRef.current.value; // ID del registro actual (si es edición)

                // Verificar si ya existe una tienda principal
                const response = await storesRest.paginate({
                    filter: JSON.stringify({ type: 'tienda_principal' })
                });
                console.log('Respuesta de validación tienda principal:', response);

                // Verificar si hay tiendas principales existentes
                if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
                    // Si es edición, verificar que no sea otra tienda diferente
                    if (currentId) {
                        const existingMainStore = response.data.find(store => store.id !== currentId);
                        if (existingMainStore) {
                            console.log('Ya existe otra tienda principal:', existingMainStore);
                            Swal.fire({
                                title: "Error",
                                text: "Ya existe una Tienda Principal. Solo puede haber una tienda de este tipo.",
                                icon: "error"
                            });
                            return;
                        }
                    } else {
                        // Si es creación nueva, no permitir
                        console.log('Tiendas principales encontradas:', response.data);
                        Swal.fire({
                            title: "Error",
                            text: "Ya existe una Tienda Principal. Solo puede haber una tienda de este tipo.",
                            icon: "error"
                        });
                        return;
                    }
                }
            } catch (error) {
                console.error('Error al verificar tienda principal:', error);
                Swal.fire({
                    title: "Error",
                    text: "Error al verificar si existe una tienda principal",
                    icon: "error"
                });
                return;
            }
        }

        // Validar y procesar coordenadas antes de enviar
        const latitudeValue = latitudeRef.current.value.trim();
        const longitudeValue = longitudeRef.current.value.trim();

        let latitude = null;
        let longitude = null;

        // Procesar latitud si existe
        if (latitudeValue) {
            latitude = parseFloat(latitudeValue);
            console.log("Latitud procesada:", latitude, "desde:", latitudeValue);

            // Validación de coordenadas para Perú
            if (latitude < -18.5 || latitude > -0.1) {
                Swal.fire({
                    title: "Error de validación",
                    text: "La latitud debe estar entre -18.5 y -0.1 para ubicaciones en Perú",
                    icon: "error"
                });
                return;
            }
            
            // Validar formato decimal (máximo 10 dígitos totales, 8 decimales)
            if (!isValidCoordinate(latitude, 10, 8)) {
                Swal.fire({
                    title: "Error de validación",
                    text: "La latitud excede el formato permitido (máximo 10 dígitos con 8 decimales)",
                    icon: "error"
                });
                return;
            }
            
            // Truncar a 8 decimales para cumplir con la BD
            latitude = Math.round(latitude * 100000000) / 100000000;
            console.log("Latitud truncada:", latitude);
        }
        
        // Procesar longitud si existe
        if (longitudeValue) {
            longitude = parseFloat(longitudeValue);
            console.log("Longitud procesada:", longitude, "desde:", longitudeValue);
            
            if (longitude < -81.5 || longitude > -68.5) {
                Swal.fire({
                    title: "Error de validación",
                    text: "La longitud debe estar entre -81.5 y -68.5 para ubicaciones en Perú",
                    icon: "error"
                });
                return;
            }
            
            // Validar formato decimal (máximo 11 dígitos totales, 8 decimales)
            if (!isValidCoordinate(longitude, 11, 8)) {
                Swal.fire({
                    title: "Error de validación",
                    text: "La longitud excede el formato permitido (máximo 11 dígitos con 8 decimales)",
                    icon: "error"
                });
                return;
            }

            // Truncar a 8 decimales para cumplir con la BD
            longitude = Math.round(longitude * 100000000) / 100000000;
            console.log("Longitud truncada:", longitude);
        }

        const selectedUbigeo = ubigeos.find(
            (x) => x.reniec == ubigeoRef.current.value
        );

        const formData = new FormData();
        
        // Debug: Verificar ID antes de enviarlo
        const idValue = idRef.current.value;
        console.log("DEBUG ID - Valor del ID a enviar:", idValue, "Tipo:", typeof idValue, "Vacío?:", !idValue);
        
        if (idRef.current.value) {
            formData.append("id", idRef.current.value);
            console.log("DEBUG ID - ID agregado al FormData:", idRef.current.value);
        } else {
            console.log("DEBUG ID - No se agrega ID al FormData (valor vacío)");
        }
        
        formData.append("name", nameRef.current.value);
        formData.append("address", addressRef.current.value);
        formData.append("phone", phoneRef.current.value);
        formData.append("email", emailRef.current.value);
        formData.append("description", descriptionRef.current.value);
        formData.append("ubigeo", ubigeoRef.current.value);
        formData.append("latitude", latitude !== null ? latitude.toString() : "");
        formData.append("longitude", longitude !== null ? longitude.toString() : "");
        formData.append("manager", managerRef.current.value);
        formData.append("capacity", capacityRef.current.value);
        formData.append("type", typeRef.current.value);
        formData.append("link", linkRef.current.value);
        formData.append("business_hours", JSON.stringify(businessHours));

        // Agregar imagen si existe y está habilitada
        if (Fillable.has('stores', 'image')) {
            if (imageRef.current && imageRef.current.files[0]) {
                formData.append("image", imageRef.current.files[0]);
            }
            // Check for image deletion flag
            if (imageRef.getDeleteFlag && imageRef.getDeleteFlag()) {
                formData.append('image_delete', 'DELETE');
            }
        }

        // Debug: Mostrar los datos que se van a enviar
        console.log("Datos a enviar:");
        console.log("- Latitud:", latitude);
        console.log("- Longitud:", longitude);
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        const result = await storesRest.save(formData);
        if (!result) return;

        // Reset delete flag after successful save
        if (Fillable.has('stores', 'image') && imageRef.resetDeleteFlag) {
            imageRef.resetDeleteFlag();
        }

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
    };

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar tienda",
            text: "¿Estás seguro de eliminar esta tienda?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;

        const result = await storesRest.delete(id);
        if (!result) return;

        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const updateBusinessHours = (index, field, value) => {
        const newHours = [...businessHours];
        newHours[index][field] = value;
        setBusinessHours(newHours);
    };

    // Función para manejar clics en el mapa
    const handleMapClick = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        console.log("Coordenadas seleccionadas:", { lat, lng });

        // Actualizar la posición del marcador
        setMarkerPosition({ lat, lng });

        // Actualizar los campos de latitud y longitud
        if (latitudeRef.current) {
            latitudeRef.current.value = lat.toFixed(8);
        }
        if (longitudeRef.current) {
            longitudeRef.current.value = lng.toFixed(8);
        }

        // Mostrar notificación
        Swal.fire({
            title: "Ubicación seleccionada",
            text: `Coordenadas: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: "top-end"
        });
    };

    // Función para cargar el autocomplete
    const onLoadAutocomplete = (autocompleteInstance) => {
        setAutocomplete(autocompleteInstance);
        
        // Asegurar que el dropdown del autocomplete tenga el z-index correcto sobre el modal
        setTimeout(() => {
            const pacContainers = document.querySelectorAll('.pac-container');
            pacContainers.forEach(container => {
                container.style.zIndex = '9999';
            });
        }, 100);
    };

    // Función cuando se selecciona un lugar del autocomplete
    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            
            if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                
                // Actualizar el centro del mapa y la posición del marcador
                setMapCenter({ lat, lng });
                setMarkerPosition({ lat, lng });
                
                // Actualizar los campos de latitud y longitud
                if (latitudeRef.current) {
                    latitudeRef.current.value = lat.toFixed(8);
                }
                if (longitudeRef.current) {
                    longitudeRef.current.value = lng.toFixed(8);
                }
                
                // Actualizar el valor del input de búsqueda
                setSearchValue(place.formatted_address || place.name || "");
                
                // Mostrar notificación
                Swal.fire({
                    title: "Ubicación encontrada",
                    text: place.formatted_address || place.name,
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                    toast: true,
                    position: "top-end"
                });
            }
        }
    };

    // Función para centrar el mapa en las coordenadas ingresadas manualmente
    const handleCoordinateChange = () => {
        const lat = parseFloat(latitudeRef.current?.value);
        const lng = parseFloat(longitudeRef.current?.value);

        if (!isNaN(lat) && !isNaN(lng)) {
            const newPosition = { lat, lng };
            setMapCenter(newPosition);
            setMarkerPosition(newPosition);
        }
    };

    // Función para validar formato de coordenadas según restricciones de base de datos
    const isValidCoordinate = (value, totalDigits, decimalPlaces) => {
        if (value === null || value === undefined || isNaN(value)) return false;

        const valueStr = Math.abs(value).toString();
        const parts = valueStr.split('.');
        const integerPart = parts[0];
        const decimalPart = parts[1] || '';

        console.log(`Validando coordenada: ${value}`);
        console.log(`Parte entera: ${integerPart} (${integerPart.length} dígitos)`);
        console.log(`Parte decimal: ${decimalPart} (${decimalPart.length} dígitos)`);
        console.log(`Total permitido: ${totalDigits}, decimales permitidos: ${decimalPlaces}`);

        // Para coordenadas geográficas, ser más flexible con los decimales
        // Truncar los decimales si exceden el límite permitido
        if (decimalPart.length > decimalPlaces) {
            console.log(`Advertencia: Truncando decimales de ${decimalPart.length} a ${decimalPlaces} dígitos`);
            // No retornar false, sino permitir el truncamiento automático
        }

        // Verificar que no exceda los dígitos enteros permitidos
        const maxIntegerDigits = totalDigits - decimalPlaces;
        if (integerPart.length > maxIntegerDigits) {
            console.log(`Error: Excede dígitos enteros permitidos (${integerPart.length} > ${maxIntegerDigits})`);
            return false;
        }

        console.log("Coordenada válida (se truncará automáticamente si es necesario)");
        return true;
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

       const onVisibleChange = async ({ id, value }) => {
        const result = await storesRest.boolean({
            id,
            field: "visible",
            value,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Tiendas / Sucursales"
                rest={storesRest}
                exportable={true}
                exportableName="stores"
                toolBar={(container) => {
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
                            text: "Nueva tienda",
                            hint: "Nueva tienda",
                            onClick: () => onModalOpen(),
                        },
                    });
                }}
                columns={[
                    {
                        dataField: "id",
                        caption: "ID",
                        visible: false,
                    },
                     Fillable.has('stores', 'image') && {
                        dataField: "image",
                        caption: "Imagen",
                        width: "90px",
                        allowFiltering: false,
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <img
                                    src={`/storage/images/store/${data.image}`}
                                    style={{
                                        width: "80px",
                                        height: "48px",
                                        objectFit: "cover",
                                        objectPosition: "center",
                                        borderRadius: "4px",
                                    }}
                                    onError={(e) =>
                                    (e.target.src =
                                        "/api/cover/thumbnail/null")
                                    }
                                />
                            );
                        },
                    },
                    {
                        dataField: "name",
                        caption: "Nombre",
                        width: "200px",
                    },
                    {
                        dataField: "type",
                        caption: "Tipo",
                        width: "100px",
                        cellTemplate: (container, { data }) => {
                            const typeLabels = {
                                'tienda_principal': 'Tienda Principal',
                                'tienda': 'Tienda',
                                'oficina': 'Oficina',
                                'almacen': 'Almacén',
                                'showroom': 'Showroom',
                                'otro': 'Otro'
                            };
                            const typeColors = {
                                'tienda_principal': 'danger',
                                'tienda': 'success',
                                'oficina': 'primary',
                                'almacen': 'warning',
                                'showroom': 'info',
                                'otro': 'secondary'
                            };
                            const label = typeLabels[data.type] || 'No especificado';
                            const color = typeColors[data.type] || 'secondary';
                            container.append(
                                `<span class="badge bg-${color}">${label}</span>`
                            );
                        },
                    },
                    {
                        dataField: "address",
                        caption: "Dirección",
                        width: "250px",
                    },
                    Fillable.has('stores', 'phone') && {
                        dataField: "phone",
                        caption: "Teléfono",
                        width: "120px",
                    },
                    Fillable.has('stores', 'email') && {
                        dataField: "email",
                        caption: "Email",
                        width: "180px",
                    },
                  
                    Fillable.has('stores', 'link') && {
                        dataField: "link",
                        caption: "Enlace",
                      
                        cellTemplate: (container, { data }) => {
                            if (data.link) {
                                container.html(
                                    `<a href="${data.link}" target="_blank" class="text-primary">
                                        ${data.link.length > 30 ? data.link.substring(0, 30) + '...' : data.link}
                                    </a>`
                                );
                            } else {
                                container.text('Sin enlace');
                            }
                        },
                    },   {
                        dataField: "visible",
                        caption: "Visible",
                        dataType: "boolean",
                        cellTemplate: (container, { data }) => {
                            $(container).empty();
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={data.visible == 1}
                                    onChange={() =>
                                        onVisibleChange({
                                            id: data.id,
                                            value: !data.visible,
                                        })
                                    }
                                />
                            );
                        },
                    },
                  
              
                    {
                        caption: "Acciones",
                        width: "100px",
                        cellTemplate: (container, { data }) => {
                            container.css("text-overflow", "unset");
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-primary me-1",
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
                ].filter(Boolean)}
            />

            <Modal
                modalRef={modalRef}
                title={isEditing ? "Editar Tienda" : "Agregar Tienda"}
                onSubmit={onModalSubmit}
                size="xl"
            >
                <input ref={idRef} type="hidden" />
                <div id="form-container">
                    {/* Navegación de Pestañas */}
                    <ul className="nav nav-pills mb-4" id="storeTabs" role="tablist" style={{
                        gap: '10px',
                        flexWrap: 'wrap',
                        backgroundColor: '#f8f9fa',
                        padding: '15px',
                        borderRadius: '8px'
                    }}>
                        <li className="nav-item" role="presentation">
                            <button 
                                className="nav-link active" 
                                id="basic-info-tab" 
                                data-bs-toggle="pill" 
                                data-bs-target="#basic-info" 
                                type="button" 
                                role="tab" 
                                aria-controls="basic-info" 
                                aria-selected="true"
                                style={{
                                    borderRadius: '6px',
                                    fontWeight: '500',
                                    transition: 'all 0.3s ease',
                                    padding: '10px 20px'
                                }}
                            >
                                <i className="fas fa-info-circle me-2"></i>
                                Información Básica
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button 
                                className="nav-link" 
                                id="location-tab" 
                                data-bs-toggle="pill" 
                                data-bs-target="#location" 
                                type="button" 
                                role="tab" 
                                aria-controls="location" 
                                aria-selected="false"
                                style={{
                                    borderRadius: '6px',
                                    fontWeight: '500',
                                    transition: 'all 0.3s ease',
                                    padding: '10px 20px'
                                }}
                            >
                                <i className="fas fa-map-marker-alt me-2"></i>
                                Ubicación
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button 
                                className="nav-link" 
                                id="contact-tab" 
                                data-bs-toggle="pill" 
                                data-bs-target="#contact" 
                                type="button" 
                                role="tab" 
                                aria-controls="contact" 
                                aria-selected="false"
                                style={{
                                    borderRadius: '6px',
                                    fontWeight: '500',
                                    transition: 'all 0.3s ease',
                                    padding: '10px 20px'
                                }}
                            >
                                <i className="fas fa-phone me-2"></i>
                                Contacto
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button 
                                className="nav-link" 
                                id="schedule-tab" 
                                data-bs-toggle="pill" 
                                data-bs-target="#schedule" 
                                type="button" 
                                role="tab" 
                                aria-controls="schedule" 
                                aria-selected="false"
                                style={{
                                    borderRadius: '6px',
                                    fontWeight: '500',
                                    transition: 'all 0.3s ease',
                                    padding: '10px 20px'
                                }}
                            >
                                <i className="fas fa-clock me-2"></i>
                                Horarios
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button 
                                className="nav-link" 
                                id="multimedia-tab" 
                                data-bs-toggle="pill" 
                                data-bs-target="#multimedia" 
                                type="button" 
                                role="tab" 
                                aria-controls="multimedia" 
                                aria-selected="false"
                                style={{
                                    borderRadius: '6px',
                                    fontWeight: '500',
                                    transition: 'all 0.3s ease',
                                    padding: '10px 20px'
                                }}
                            >
                                <i className="fas fa-images me-2"></i>
                                Multimedia
                            </button>
                        </li>
                    </ul>

                    {/* Contenido de las Pestañas */}
                    <div className="tab-content" style={{ padding: '20px 0' }}>
                        {/* Pestaña: Información Básica */}
                        <div className="tab-pane fade show active" id="basic-info" role="tabpanel" aria-labelledby="basic-info-tab">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <InputFormGroup
                                        eRef={nameRef}
                                        label="Nombre de la tienda"
                                        col="col-12"
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <SelectFormGroup
                                        eRef={typeRef}
                                        label="Tipo de establecimiento"
                                        col="col-12"
                                        required
                                        dropdownParent={'#form-container'}
                                    >
                                        <option value="tienda_principal">Tienda Principal</option>
                                        <option value="tienda">Tienda</option>
                                        <option value="oficina">Oficina</option>
                                        <option value="almacen">Almacén</option>
                                        <option value="showroom">Showroom</option>
                                        <option value="otro">Otro</option>
                                    </SelectFormGroup>
                                </div>
                                {Fillable.has('stores', 'manager') && (
                                    <div className="col-md-6">
                                        <InputFormGroup
                                            eRef={managerRef}
                                            label="Encargado"
                                            col="col-12"
                                        />
                                    </div>
                                )}
                                {Fillable.has('stores', 'capacity') && (
                                    <div className="col-md-6">
                                        <InputFormGroup
                                            eRef={capacityRef}
                                            label="Capacidad de atención (personas/día)"
                                            col="col-12"
                                            type="number"
                                            placeholder="Ej: 50"
                                        />
                                    </div>
                                )}
                                <div className="col-12">
                                    <InputFormGroup
                                        eRef={addressRef}
                                        label="Dirección completa"
                                        col="col-12"
                                        required
                                    />
                                </div>
                                <div className="col-12">
                                    <SelectFormGroup
                                        eRef={ubigeoRef}
                                        label="Distrito/Ubigeo"
                                        col="col-12"
                                        templateResult={ubigeoTemplate}
                                        templateSelection={ubigeoTemplate}
                                        dropdownParent="#form-container"
                                        required
                                    >
                                        {ubigeos.map((x, index) => (
                                            <option key={index} value={x.reniec}>
                                                {x.reniec} {x.distrito} {x.provincia} {x.departamento}
                                            </option>
                                        ))}
                                    </SelectFormGroup>
                                </div>
                            </div>
                        </div>

                        {/* Pestaña: Ubicación */}
                        <div className="tab-pane fade" id="location" role="tabpanel" aria-labelledby="location-tab">
                            <LoadScript
                                googleMapsApiKey={Global.GMAPS_API_KEY}
                                libraries={libraries}
                            >
                                <div className="row g-3">
                                    <div className="col-12">
                                        {/* Buscador de ubicación */}
                                        <div className="mb-3">
                                            <label className="form-label">
                                                <i className="fas fa-search me-2"></i>
                                                Buscar ubicación
                                            </label>
                                            <Autocomplete
                                                onLoad={onLoadAutocomplete}
                                                onPlaceChanged={onPlaceChanged}
                                                options={{
                                                    componentRestrictions: { country: 'pe' },
                                                    fields: ['formatted_address', 'geometry', 'name'],
                                                    strictBounds: false,
                                                }}
                                            >
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Busca la dirección o nombre del lugar..."
                                                    value={searchValue}
                                                    onChange={(e) => setSearchValue(e.target.value)}
                                                    style={{ position: 'relative', zIndex: 1 }}
                                                />
                                            </Autocomplete>
                                            <small className="form-text text-muted">
                                                Escribe el nombre o dirección de la tienda para centrar el mapa automáticamente.
                                            </small>
                                        </div>

                                        {/* Mapa de Google */}
                                        <div className="mb-3">
                                            <GoogleMap
                                                mapContainerStyle={{
                                                    width: "100%",
                                                    height: "400px",
                                                    borderRadius: "8px"
                                                }}
                                                center={mapCenter}
                                                zoom={15}
                                                onClick={handleMapClick}
                                                options={{
                                                    streetViewControl: true,
                                                    mapTypeControl: true,
                                                    fullscreenControl: true
                                                }}
                                            >
                                                {markerPosition && (
                                                    <Marker
                                                        position={markerPosition}
                                                        title="Ubicación de la tienda"
                                                    />
                                                )}
                                            </GoogleMap>
                                        </div>

                                        {/* Campos de coordenadas */}
                                        <div className="row mt-3">
                                            <div className="col-md-6">
                                                <InputFormGroup
                                                    eRef={latitudeRef}
                                                    label="Latitud"
                                                    col="col-12"
                                                    type="number"
                                                    step="0.00000001"
                                                    min="-18.5"
                                                    max="-0.1"
                                                    placeholder="Ej: -12.042626777544823"
                                                    onChange={handleCoordinateChange}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <InputFormGroup
                                                    eRef={longitudeRef}
                                                    label="Longitud"
                                                    col="col-12"
                                                    type="number"
                                                    step="0.00000001"
                                                    min="-81.5"
                                                    max="-68.5"
                                                    placeholder="Ej: -77.04753389161506"
                                                    onChange={handleCoordinateChange}
                                                />
                                            </div>
                                        </div>

                                        {/* Botones de acción rápida */}
                                        <div className="row mt-3">
                                            <div className="col-12">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => {
                                                        setMarkerPosition(null);
                                                        latitudeRef.current.value = "";
                                                        longitudeRef.current.value = "";
                                                    }}
                                                >
                                                    <i className="fas fa-eraser me-1"></i>
                                                    Limpiar Ubicación
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </LoadScript>
                        </div>

                        {/* Pestaña: Contacto */}
                        <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                            <div className="row g-3">
                                {Fillable.has('stores', 'phone') && (
                                    <div className="col-md-6">
                                        <InputFormGroup
                                            eRef={phoneRef}
                                            label="Teléfono"
                                            col="col-12"
                                            type="tel"
                                        />
                                    </div>
                                )}
                                {Fillable.has('stores', 'email') && (
                                    <div className="col-md-6">
                                        <InputFormGroup
                                            eRef={emailRef}
                                            label="Email"
                                            col="col-12"
                                            type="email"
                                        />
                                    </div>
                                )}
                                {Fillable.has('stores', 'link') && (
                                    <div className="col-12">
                                        <InputFormGroup
                                            eRef={linkRef}
                                            label="Enlace personalizado (opcional)"
                                            col="col-12"
                                            type="url"
                                            placeholder="https://ejemplo.com"
                                        />
                                        <small className="text-muted">
                                            Si se especifica, al hacer clic en la tienda redirigirá a este enlace en lugar del perfil de la tienda.
                                        </small>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pestaña: Horarios */}
                        <div className="tab-pane fade" id="schedule" role="tabpanel" aria-labelledby="schedule-tab">
                            {Fillable.has('stores', 'business_hours') && (
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label">Horarios de atención</label>
                                        <div className="table-responsive">
                                            <table className="table table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>Día</th>
                                                        <th>Apertura</th>
                                                        <th>Cierre</th>
                                                        <th>Cerrado</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {businessHours.map((schedule, index) => (
                                                        <tr key={index}>
                                                            <td className="align-middle">
                                                                <strong>{schedule.day}</strong>
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="time"
                                                                    className="form-control form-control-sm"
                                                                    value={schedule.open}
                                                                    onChange={(e) =>
                                                                        updateBusinessHours(index, "open", e.target.value)
                                                                    }
                                                                    disabled={schedule.closed}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="time"
                                                                    className="form-control form-control-sm"
                                                                    value={schedule.close}
                                                                    onChange={(e) =>
                                                                        updateBusinessHours(index, "close", e.target.value)
                                                                    }
                                                                    disabled={schedule.closed}
                                                                />
                                                            </td>
                                                            <td>
                                                                <div className="form-check">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        checked={schedule.closed}
                                                                        onChange={(e) =>
                                                                            updateBusinessHours(index, "closed", e.target.checked)
                                                                        }
                                                                    />
                                                                    <label className="form-check-label">
                                                                        Cerrado
                                                                    </label>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pestaña: Multimedia */}
                        <div className="tab-pane fade" id="multimedia" role="tabpanel" aria-labelledby="multimedia-tab">
                            <div className="row g-3">
                                {Fillable.has('stores', 'image') && (
                                    <div className="col-12">
                                        <ImageFormGroup
                                            eRef={imageRef}
                                            name="image"
                                            label="Imagen de la tienda"
                                            col="col-12"
                                            accept="image/*"
                                        />
                                    </div>
                                )}
                                {Fillable.has('stores', 'description') && (
                                    <div className="col-12">
                                        <TextareaFormGroup
                                            eRef={descriptionRef}
                                            label="Descripción"
                                            rows={3}
                                        />
                                    </div>
                                )}
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
        <BaseAdminto {...properties} title="Tiendas / Sucursales">
            <Stores {...properties} />
        </BaseAdminto>
    );
});

export default Stores;
