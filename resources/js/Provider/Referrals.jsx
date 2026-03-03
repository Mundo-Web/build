import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import BaseAdminto from "@Adminto/Base";
import CreateReactScript from "../Utils/CreateReactScript";
import Table from "../Components/Adminto/Table";
import ReactAppend from "../Utils/ReactAppend";
import DxButton from "../Components/dx/DxButton";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import Swal from "sweetalert2";
import ProvidersRest from "../Actions/Admin/ProvidersRest";
import { renderToString } from "react-dom/server";
import Modal from "../Components/Adminto/Modal";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import SelectFormGroup from "../Components/Adminto/form/SelectFormGroup";
import ItemsRest from "../Actions/Admin/ItemsRest";
import ProviderTreeCard from "../Components/Adminto/ProviderTreeCard";

const providersRest = new ProvidersRest();
const itemsRest = new ItemsRest();

const Providers = ({}) => {
    const gridRef = useRef();
    const modalRef = useRef();
    const inviteModalRef = useRef();
    const vaultModalRef = useRef();
    const vaultItemRef = useRef();
    const vaultQuantityRef = useRef();

    // Form elements ref
    const idRef = useRef();
    const nameRef = useRef();
    const lastnameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const phoneRef = useRef();
    const phonePrefixRef = useRef();
    const dniRef = useRef();
    const roleRef = useRef();
    const inviteEmailRef = useRef();
    const whatsappNumberRef = useRef();
    const whatsappMessageRef = useRef();

    const [isEditing, setIsEditing] = useState(false);
    const [viewMode, setViewMode] = useState("table"); // 'table' or 'tree'
    const [vaultData, setVaultData] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [allItems, setAllItems] = useState([]);

    const onModalOpen = (data) => {
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        idRef.current.value = data?.id ?? "";
        nameRef.current.value = data?.name ?? "";
        lastnameRef.current.value = data?.lastname ?? "";
        emailRef.current.value = data?.email ?? "";
        passwordRef.current.value = "";
        confirmPasswordRef.current.value = "";
        phoneRef.current.value = data?.phone ?? "";

        // Set value and trigger Select2 change
        const prefix = data?.phone_prefix ?? "+51";
        phonePrefixRef.current.value = prefix;
        $(phonePrefixRef.current).val(prefix).trigger("change");

        dniRef.current.value = data?.dni ?? data?.document_number ?? "";
        whatsappNumberRef.current.value = data?.whatsapp_number ?? "";
        whatsappMessageRef.current.value = data?.whatsapp_message ?? "";

        // Always force Provider role
        if (roleRef.current) roleRef.current.value = "Provider";

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords if creating new user or if password fields are filled
        if (!isEditing || passwordRef.current.value) {
            if (
                passwordRef.current.value !== confirmPasswordRef.current.value
            ) {
                Swal.fire({
                    title: "Error",
                    text: "Las contraseñas no coinciden",
                    icon: "error",
                });
                return;
            }
            if (passwordRef.current.value.length < 6) {
                Swal.fire({
                    title: "Error",
                    text: "La contraseña debe tener al menos 6 caracteres",
                    icon: "error",
                });
                return;
            }
        }

        const request = {
            id: idRef.current.value || undefined,
            name: nameRef.current.value,
            lastname: lastnameRef.current.value,
            email: emailRef.current.value,
            phone: phoneRef.current.value,
            phone_prefix: phonePrefixRef.current.value,
            dni: dniRef.current.value,
            whatsapp_number: whatsappNumberRef.current.value,
            whatsapp_message: whatsappMessageRef.current.value,
            role: "Provider", // Force Provider Role
        };

        // Only add password if it's provided
        if (passwordRef.current.value) {
            request.password = passwordRef.current.value;
        }

        const result = await providersRest.save(request);
        if (!result) return;

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
    };

    const onInviteModalOpen = () => {
        inviteEmailRef.current.value = "";
        $(inviteModalRef.current).modal("show");
    };

    const onInviteSubmit = async (e) => {
        e.preventDefault();
        const email = inviteEmailRef.current.value;

        const result = await providersRest.invite({ email });
        if (!result) return;

        Swal.fire({
            title: "Éxito",
            text: "Se ha enviado la invitación correctamente",
            icon: "success",
        });
        $(inviteModalRef.current).modal("hide");
    };

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar proveedor",
            text: "¿Estás seguro de eliminar este proveedor?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await providersRest.delete(id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onStatusChange = async ({ id, value }) => {
        const { isConfirmed } = await Swal.fire({
            title: value ? "Activar proveedor" : "Desactivar proveedor",
            text: `¿Estás seguro de ${value ? "activar" : "desactivar"} este proveedor?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) {
            // Revert the switch
            $(gridRef.current).dxDataGrid("instance").refresh();
            return;
        }

        const result = await providersRest.boolean({
            id,
            field: "status",
            value,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onVaultOpen = async (data) => {
        setSelectedProvider(data);
        const result = await providersRest.getVault(data.id);
        if (result) setVaultData(result.data);

        if (allItems.length === 0) {
            const itemsRes = await itemsRest.paginate({
                requireTotalCount: false,
                take: 1000,
            });
            if (itemsRes) setAllItems(itemsRes.data);
        }

        $(vaultModalRef.current).modal("show");
    };

    const onVaultSubmit = async (e) => {
        e.preventDefault();
        const request = {
            user_id: selectedProvider.id,
            item_id: vaultItemRef.current.value,
            quantity: vaultQuantityRef.current.value,
        };

        const result = await providersRest.updateVault(request);
        if (result) {
            const updatedVault = await providersRest.getVault(
                selectedProvider.id,
            );
            if (updatedVault) setVaultData(updatedVault.data);
            vaultQuantityRef.current.value = "";
            $(vaultItemRef.current).val(null).trigger("change");
        }
    };

    const onDeleteVaultItem = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "¿Eliminar de la bóveda?",
            text: "Se eliminará este artículo de la bóveda del proveedor.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
        });
        if (!isConfirmed) return;

        const result = await providersRest.deleteVaultItem(id);
        if (result) {
            const updatedVault = await providersRest.getVault(
                selectedProvider.id,
            );
            if (updatedVault) setVaultData(updatedVault.data);
        }
    };

    const onViewDetails = (data) => {
        const createdDate = new Date(data.created_at);
        const formattedDate =
            createdDate.toLocaleDateString("es-ES") +
            " " +
            createdDate.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
            });

        Swal.fire({
            title: "Detalles del Proveedor",
            html: `
        <div style="text-align: left; max-width: 100%;">
          <form style="padding: 20px 0;">
            <div class="row">
              
              <!-- Columna Izquierda -->
              <div class="col-md-6">
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Nombre Completo</label>
                  <input type="text" class="form-control" value="${data.name} ${data.lastname || ""}" readonly style="background-color: #f8f9fa;">
                </div>
                
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Email</label>
                  <input type="email" class="form-control" value="${data.email || ""}" readonly style="background-color: #f8f9fa;" placeholder="No especificado">
                </div>
                
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Teléfono</label>
                  <input type="text" class="form-control" value="${data.phone ? (data.phone_prefix || "+51") + " " + data.phone : ""}" readonly style="background-color: #f8f9fa;" placeholder="No especificado">
                </div>
                
                 <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Código de Referido (UUID)</label>
                  <input type="text" class="form-control" value="${data.uuid || ""}" readonly style="background-color: #f8f9fa;" placeholder="No generado">
                </div>

                 <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Referido por</label>
                  <input type="text" class="form-control" value="${data.referred_by && typeof data.referred_by === "object" ? `${data.referred_by.name || ""} ${data.referred_by.lastname || ""}`.trim() || data.referred_by.email : "—"}" readonly style="background-color: #f8f9fa;" placeholder="Sin referido">
                </div>

                ${
                    data.alternate_phone
                        ? `
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Teléfono Alternativo</label>
                  <input type="text" class="form-control" value="${data.alternate_phone}" readonly style="background-color: #f8f9fa;">
                </div>
                `
                        : ""
                }
                
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Tipo de Documento</label>
                  <input type="text" class="form-control" value="${data.document_type || ""}" readonly style="background-color: #f8f9fa;" placeholder="No especificado">
                </div>
              </div>
              
              <!-- Columna Derecha -->
              <div class="col-md-6">
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Número de Documento</label>
                  <input type="text" class="form-control" value="${data.document_number || ""}" readonly style="background-color: #f8f9fa;" placeholder="No especificado">
                </div>
                
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Dirección</label>
                  <input type="text" class="form-control" value="${data.address || ""}" readonly style="background-color: #f8f9fa;" placeholder="No especificada">
                </div>
                
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Distrito</label>
                  <input type="text" class="form-control" value="${data.district || ""}" readonly style="background-color: #f8f9fa;" placeholder="No especificado">
                </div>
                
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Provincia</label>
                  <input type="text" class="form-control" value="${data.province || ""}" readonly style="background-color: #f8f9fa;" placeholder="No especificado">
                </div>
                
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Departamento</label>
                  <input type="text" class="form-control" value="${data.department || ""}" readonly style="background-color: #f8f9fa;" placeholder="No especificado">
                </div>
              </div>
              
              <!-- Fila completa para campos adicionales -->
              <div class="col-12">
                ${
                    data.reference
                        ? `
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Referencia</label>
                  <textarea class="form-control" readonly style="background-color: #f8f9fa; resize: none;" rows="2">${data.reference}</textarea>
                </div>
                `
                        : ""
                }
                
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group mb-3">
                      <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Número de WhatsApp</label>
                      <input type="text" class="form-control" value="${data.whatsapp_number || "Usa el número principal"}" readonly style="background-color: #f8f9fa;">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group mb-3">
                      <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Mensaje de WhatsApp</label>
                      <input type="text" class="form-control" value="${data.whatsapp_message || "Mensaje por defecto"}" readonly style="background-color: #f8f9fa;">
                    </div>
                  </div>
                </div>

                <div class="row mt-2">
                  <div class="col-12">
                    <h6 class="text-primary mb-3" style="border-bottom: 1px solid #eee; padding-bottom: 10px; font-weight: 700;">
                      <i class="fas fa-rocket me-2"></i> Progreso de Carrera
                    </h6>
                  </div>
                  <div class="col-md-4">
                    <div class="card bg-light border-0 mb-3">
                      <div class="card-body p-2 text-center">
                        <small class="text-muted d-block">Rango Actual</small>
                        <span class="badge w-100 mt-1" style="background-color: ${data.rank?.color || "#6c757d"}; font-size: 0.85rem;">
                          ${data.rank?.name || "Sin Rango"}
                        </span>
                      </div>
                    </div>
                  </div>
                   <div class="col-md-4">
                    <div class="card bg-light border-0 mb-3">
                      <div class="card-body p-2 text-center">
                        <small class="text-muted d-block">Prendas Personales</small>
                        <span class="fw-bold fs-5 text-dark">${Math.round(data.total_items || 0)}</span>
                      </div>
                    </div>
                  </div>
                   <div class="col-md-4">
                    <div class="card bg-light border-0 mb-3">
                      <div class="card-body p-2 text-center">
                        <small class="text-muted d-block">Prendas Grupales</small>
                        <span class="fw-bold fs-5 text-dark">${Math.round(data.group_items || 0)}</span>
                      </div>
                    </div>
                  </div>
                   <div class="col-md-6">
                    <div class="card bg-light border-0 mb-3">
                      <div class="card-body p-2 text-center">
                        <small class="text-muted d-block">Volumen Personal</small>
                        <span class="fw-bold fs-5 text-dark">S/ ${parseFloat(data.total_points || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="card bg-light border-0 mb-3">
                      <div class="card-body p-2 text-center">
                        <small class="text-muted d-block">Volumen Grupal</small>
                        <span class="fw-bold fs-5 text-dark">S/ ${parseFloat(data.group_points || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group mb-3">
                      <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Estado</label>
                      <input type="text" class="form-control ${data.status == 1 ? "border-success" : "border-danger"}" 
                             value="${data.status == 1 ? "Activo" : "Inactivo"}" readonly 
                             style="background-color: ${data.status == 1 ? "#d4edda" : "#f8d7da"}; 
                                    color: ${data.status == 1 ? "#155724" : "#721c24"}; 
                                    font-weight: 600;">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group mb-3">
                      <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Fecha de Registro</label>
                      <input type="text" class="form-control" value="${formattedDate}" readonly style="background-color: #f8f9fa;">
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </form>
        </div>
      `,
            width: "800px",
            showConfirmButton: true,
            confirmButtonText: "Cerrar",
            confirmButtonColor: "#6c757d",
            allowOutsideClick: true,
            allowEscapeKey: true,
            customClass: {
                popup: "client-details-modal",
            },
            didOpen: () => {
                // Agregar estilos CSS para el modal
                const style = document.createElement("style");
                style.innerHTML = `
          .client-details-modal {
            border-radius: 8px !important;
          }
          .client-details-modal .swal2-title {
            color: #495057 !important;
            font-size: 1.5rem !important;
            font-weight: 600 !important;
            margin-bottom: 10px !important;
          }
          .client-details-modal .swal2-html-container {
            margin: 0 !important;
            padding: 0 20px 20px 20px !important;
          }
          .client-details-modal .form-control:read-only {
            cursor: default !important;
          }
          .client-details-modal .form-label {
            font-size: 0.9rem !important;
          }
        `;
                document.head.appendChild(style);
            },
        });
    };

    return (
        <div className="container-fluid">
            <div className="row mb-3">
                <div className="col-12">
                    <div className="card shadow-sm border-0">
                        <div className="card-body py-2 d-flex justify-content-between align-items-center">
                            <h4 className="header-title mb-0">
                                <i className="fe-users me-2"></i>
                                {viewMode === "table"
                                    ? "Lista de Proveedores"
                                    : "Organigrama de Proveedores"}
                            </h4>
                            <div className="d-flex gap-2">
                                <button
                                    className={`btn btn-sm ${viewMode === "table" ? "btn-primary" : "btn-outline-primary"}`}
                                    onClick={() => setViewMode("table")}
                                >
                                    <i className="fe-list me-1"></i> Vista Tabla
                                </button>
                                <button
                                    className={`btn btn-sm ${viewMode === "tree" ? "btn-success" : "btn-outline-success"}`}
                                    onClick={() => setViewMode("tree")}
                                >
                                    <i className="fe-sitemap me-1"></i> Vista
                                    Organigrama
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {viewMode === "table" ? (
                <Table
                    gridRef={gridRef}
                    title="Proveedores"
                    rest={providersRest}
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
                                icon: "email",
                                text: "Invitar proveedor",
                                type: "default",
                                stylingMode: "contained",
                                hint: "Enviar invitación por correo",
                                onClick: () => onInviteModalOpen(),
                            },
                        });
                        container.unshift({
                            widget: "dxButton",
                            location: "after",
                            options: {
                                icon: "plus",
                                text: "Nuevo proveedor",
                                hint: "Crear nuevo proveedor",
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
                        {
                            dataField: "name",
                            caption: "Proveedor",
                            width: "25%",
                            cellTemplate: (container, { data }) => {
                                ReactAppend(
                                    container,
                                    <div>
                                        <strong>
                                            {data.name} {data.lastname || ""}
                                        </strong>
                                        <br />
                                        <small className="text-muted">
                                            {data.email}
                                        </small>
                                        <br />
                                        <span
                                            className="badge badge-soft-primary"
                                            style={{ fontSize: "10px" }}
                                        >
                                            {data.uuid}
                                        </span>
                                    </div>,
                                );
                            },
                        },
                        {
                            dataField: "phone",
                            caption: "Teléfono",
                            cellTemplate: (container, { data }) => {
                                if (data.phone) {
                                    ReactAppend(
                                        container,
                                        <span>
                                            {data.phone_prefix || "+51"}{" "}
                                            {data.phone}
                                        </span>,
                                    );
                                } else {
                                    ReactAppend(
                                        container,
                                        <span className="text-muted">
                                            - Sin teléfono -
                                        </span>,
                                    );
                                }
                            },
                        },
                        {
                            dataField: "document_number",
                            caption: "Documento",
                            cellTemplate: (container, { data }) => {
                                if (data.document_number) {
                                    ReactAppend(
                                        container,
                                        <div>
                                            <span>
                                                {data.document_type || "DOC"}:{" "}
                                                {data.document_number}
                                            </span>
                                        </div>,
                                    );
                                } else {
                                    ReactAppend(
                                        container,
                                        <span className="text-muted">
                                            - Sin documento -
                                        </span>,
                                    );
                                }
                            },
                        },
                        {
                            dataField: "city",
                            caption: "Ubicación",
                            cellTemplate: (container, { data }) => {
                                const location = [data.city, data.department]
                                    .filter(Boolean)
                                    .join(", ");
                                if (location) {
                                    ReactAppend(
                                        container,
                                        <span>{location}</span>,
                                    );
                                } else {
                                    ReactAppend(
                                        container,
                                        <span className="text-muted">
                                            - Sin ubicación -
                                        </span>,
                                    );
                                }
                            },
                        },
                        {
                            dataField: "created_at",
                            caption: "Registro",
                            dataType: "date",
                            cellTemplate: (container, { data }) => {
                                const date = new Date(data.created_at);
                                container.html(
                                    renderToString(
                                        <>
                                            <div>
                                                {date.toLocaleDateString(
                                                    "es-ES",
                                                )}
                                            </div>
                                            <small className="text-muted">
                                                {date.toLocaleTimeString(
                                                    "es-ES",
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    },
                                                )}
                                            </small>
                                        </>,
                                    ),
                                );
                            },
                        },
                        {
                            dataField: "referred_by",
                            caption: "Referido por",
                            width: "15%",
                            cellTemplate: (container, { data }) => {
                                const ref = data.referred_by;
                                if (ref && typeof ref === "object") {
                                    const name =
                                        `${ref.name || ""} ${ref.lastname || ""}`.trim();
                                    ReactAppend(
                                        container,
                                        <div>
                                            <span className="badge badge-soft-success">
                                                <i className="fas fa-user-tag me-1"></i>
                                                {name || ref.email}
                                            </span>
                                            <br />
                                            <small
                                                className="text-muted"
                                                style={{ fontSize: "10px" }}
                                            >
                                                {ref.uuid
                                                    ? ref.uuid.substring(0, 8) +
                                                      "..."
                                                    : ""}
                                            </small>
                                        </div>,
                                    );
                                } else {
                                    ReactAppend(
                                        container,
                                        <span className="text-muted">—</span>,
                                    );
                                }
                            },
                        },
                        {
                            dataField: "rank.name",
                            caption: "Rango",
                            width: 120,
                            cellTemplate: (container, { data }) => {
                                if (data.rank) {
                                    ReactAppend(
                                        container,
                                        <span
                                            className="badge px-2 py-1"
                                            style={{
                                                backgroundColor:
                                                    data.rank?.color ||
                                                    "#6c757d",
                                                color: "#fff",
                                            }}
                                        >
                                            <i className="fas fa-medal me-1"></i>
                                            {data.rank.name}
                                        </span>,
                                    );
                                } else {
                                    ReactAppend(
                                        container,
                                        <span className="badge badge-soft-secondary px-2 py-1">
                                            Sin Rango
                                        </span>,
                                    );
                                }
                            },
                        },
                        {
                            dataField: "total_points",
                            caption: "Puntos",
                            width: 100,
                            cellTemplate: (container, { data }) => {
                                ReactAppend(
                                    container,
                                    <div className="text-center font-monospace">
                                        {Math.round(data.total_points || 0)}
                                    </div>,
                                );
                            },
                        },
                        {
                            dataField: "status",
                            caption: "Estado",
                            dataType: "boolean",
                            width: "120px",
                            cellTemplate: (container, { data }) => {
                                if (data.status == 1) {
                                    ReactAppend(
                                        container,
                                        <span className="badge badge-success badge-pill bg-primary">
                                            Activo
                                        </span>,
                                    );
                                } else {
                                    ReactAppend(
                                        container,
                                        <span className="badge badge-secondary">
                                            Archivado
                                        </span>,
                                    );
                                }
                            },
                        },
                        {
                            caption: "Acciones",
                            cellTemplate: (container, { data }) => {
                                container.css("text-overflow", "unset");

                                // Botón de Detalles
                                container.append(
                                    DxButton({
                                        className: "btn btn-xs btn-soft-info",
                                        title: "Ver detalles",
                                        icon: "fa fa-eye",
                                        onClick: () => onViewDetails(data),
                                    }),
                                );

                                // Botón de Bóveda (Inventario de Premios)
                                container.append(
                                    DxButton({
                                        className:
                                            "btn btn-xs btn-soft-success",
                                        title: "Bóveda de Inventario",
                                        icon: "fa fa-vault",
                                        onClick: () => onVaultOpen(data),
                                    }),
                                );

                                // Botón de Activar (Restaurar) - Solo si está archivado
                                if (data.status != 1) {
                                    container.append(
                                        DxButton({
                                            className:
                                                "btn btn-xs btn-soft-success",
                                            title: "Restaurar (Activar)",
                                            icon: "fa fa-check",
                                            onClick: () =>
                                                onStatusChange({
                                                    id: data.id,
                                                    value: true,
                                                }), // Reactivar
                                        }),
                                    );
                                }

                                // Botón de Editar
                                container.append(
                                    DxButton({
                                        className:
                                            "btn btn-xs btn-soft-primary",
                                        title: "Editar",
                                        icon: "fa fa-pen",
                                        onClick: () => onModalOpen(data),
                                    }),
                                );

                                // Botón de Eliminar / Archivar
                                container.append(
                                    DxButton({
                                        className: `btn btn-xs ${data.status == 1 ? "btn-soft-warning" : "btn-soft-danger"}`,
                                        title:
                                            data.status == 1
                                                ? "Archivar"
                                                : "Eliminar permanentemente",
                                        icon:
                                            data.status == 1
                                                ? "fa fa-archive"
                                                : "fa fa-trash",
                                        onClick: async () => {
                                            if (data.status == 1) {
                                                // Lógica de Archivar
                                                const { isConfirmed } =
                                                    await Swal.fire({
                                                        title: "¿Archivar Proveedor?",
                                                        text: "El proveedor se desactivará y pasará a estado 'Archivado'.",
                                                        icon: "warning",
                                                        showCancelButton: true,
                                                        confirmButtonText:
                                                            "Sí, archivar",
                                                        cancelButtonText:
                                                            "Cancelar",
                                                    });
                                                if (isConfirmed)
                                                    onStatusChange({
                                                        id: data.id,
                                                        value: false,
                                                    });
                                            } else {
                                                // Lógica de Eliminar (Hard Delete)
                                                onDeleteClicked(data.id);
                                            }
                                        },
                                    }),
                                );
                            },
                            allowFiltering: false,
                            allowExporting: false,
                        },
                    ]}
                />
            ) : (
                <ProviderTreeCard isProviderView={true} />
            )}

            <Modal
                modalRef={modalRef}
                title={isEditing ? "Editar proveedor" : "Crear nuevo proveedor"}
                onSubmit={onModalSubmit}
                size="lg"
            >
                <div className="row" id="principal-container">
                    <input ref={idRef} type="hidden" />

                    <InputFormGroup
                        eRef={nameRef}
                        label="Nombres"
                        col="col-md-6"
                        required
                    />
                    <InputFormGroup
                        eRef={lastnameRef}
                        label="Apellidos"
                        col="col-md-6"
                        required
                    />
                    <InputFormGroup
                        eRef={emailRef}
                        label="Correo electrónico"
                        type="email"
                        col="col-md-6"
                        required
                    />
                    <InputFormGroup
                        eRef={dniRef}
                        label="DNI / Documento"
                        col="col-md-6"
                    />

                    <div className="col-md-3">
                        <SelectFormGroup
                            eRef={phonePrefixRef}
                            label="Prefijo"
                            required
                            dropdownParent="#principal-container"
                        >
                            <option value="+51">+51 (Perú)</option>
                            <option value="+1">+1 (EE.UU.)</option>
                            <option value="+34">+34 (España)</option>
                            <option value="+52">+52 (México)</option>
                            <option value="+57">+57 (Colombia)</option>
                        </SelectFormGroup>
                    </div>
                    <InputFormGroup
                        eRef={phoneRef}
                        label="Teléfono"
                        type="tel"
                        col="col-md-9"
                    />

                    <div className="col-12">
                        <hr />
                        <h6 className="mb-3 text-success">
                            <i className="mdi mdi-whatsapp"></i> Configuración
                            WhatsApp Flotante
                        </h6>
                    </div>

                    <InputFormGroup
                        eRef={whatsappNumberRef}
                        label="Número exclusivo WhatsApp (519... / opcional)"
                        type="tel"
                        col="col-md-6"
                        placeholder="Si está vacío usará el principal"
                    />
                    <InputFormGroup
                        eRef={whatsappMessageRef}
                        label="Mensaje predeterminado"
                        col="col-md-6"
                        placeholder="Ej: ¡Hola! vengo de tu enlace..."
                    />

                    {/* Campo oculto para asegurar que se cree como Provider */}
                    <input type="hidden" ref={roleRef} value="Provider" />

                    <div className="col-12">
                        <hr />
                        <h6>
                            {isEditing
                                ? "Cambiar contraseña (opcional)"
                                : "Contraseña"}
                        </h6>
                    </div>

                    <InputFormGroup
                        eRef={passwordRef}
                        label={isEditing ? "Nueva contraseña" : "Contraseña"}
                        type="password"
                        col="col-md-6"
                        required={!isEditing}
                        placeholder={
                            isEditing
                                ? "Dejar vacío para mantener la actual"
                                : ""
                        }
                    />
                    <InputFormGroup
                        eRef={confirmPasswordRef}
                        label="Confirmar contraseña"
                        type="password"
                        col="col-md-6"
                        required={!isEditing}
                    />
                </div>
            </Modal>

            <Modal
                modalRef={inviteModalRef}
                title="Invitar proveedor"
                onSubmit={onInviteSubmit}
            >
                <div className="row">
                    <div className="col-12 mb-4">
                        <p className="text-muted">
                            Ingresa el correo electrónico de la persona que
                            deseas invitar. Recibirá un enlace único para
                            completar su registro como proveedor.
                        </p>
                    </div>
                    <InputFormGroup
                        eRef={inviteEmailRef}
                        label="Correo electrónico"
                        type="email"
                        col="col-12"
                        required
                    />
                </div>
            </Modal>

            <Modal
                modalRef={vaultModalRef}
                title={`Bóveda de ${selectedProvider?.name || "Proveedor"}`}
                hideSave
                size="lg"
            >
                <div>
                    <form
                        className="card card-body bg-light mb-4"
                        onSubmit={onVaultSubmit}
                    >
                        <div className="row align-items-end">
                            <div
                                className="col-md-7"
                                id="vault-select-container"
                            >
                                <SelectFormGroup
                                    eRef={vaultItemRef}
                                    label="Seleccionar Producto"
                                    dropdownParent="#vault-select-container"
                                    required
                                >
                                    <option value="">-- Seleccionar --</option>
                                    {allItems.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}{" "}
                                            {item.sku ? `(${item.sku})` : ""} -
                                            Stock: {item.stock}
                                        </option>
                                    ))}
                                </SelectFormGroup>
                            </div>
                            <div className="col-md-3">
                                <InputFormGroup
                                    eRef={vaultQuantityRef}
                                    label="Cantidad"
                                    type="number"
                                    required
                                />
                            </div>
                            <div className="col-md-2">
                                <button
                                    className="btn btn-primary w-100"
                                    type="submit"
                                >
                                    <i className="fa fa-plus me-1"></i> Añadir
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="table-responsive">
                        <table className="table table-sm table-centered mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Producto</th>
                                    <th className="text-center">
                                        Cant. en Bóveda
                                    </th>
                                    <th className="text-end">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vaultData.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="3"
                                            className="text-center py-3 text-muted"
                                        >
                                            No hay ítems en la bóveda
                                        </td>
                                    </tr>
                                ) : (
                                    vaultData.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                <strong>
                                                    {item.item?.name}
                                                </strong>
                                                <br />
                                                <small className="text-muted">
                                                    {item.item?.sku}
                                                </small>
                                            </td>
                                            <td className="text-center">
                                                <span className="badge badge-soft-primary px-2 py-1">
                                                    {item.quantity}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <button
                                                    className="btn btn-xs btn-outline-danger"
                                                    onClick={() =>
                                                        onDeleteVaultItem(
                                                            item.id,
                                                        )
                                                    }
                                                >
                                                    <i className="fa fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Mis Referidos">
            <Providers {...properties} />
        </BaseAdminto>,
    );
});
