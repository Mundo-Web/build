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

const providersRest = new ProvidersRest();

const Providers = ({}) => {
    const gridRef = useRef();
    const modalRef = useRef();
    const inviteModalRef = useRef();

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

    const [isEditing, setIsEditing] = useState(false);

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
        <>
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
                                ReactAppend(container, <span>{location}</span>);
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
                                            {date.toLocaleDateString("es-ES")}
                                        </div>
                                        <small className="text-muted">
                                            {date.toLocaleTimeString("es-ES", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </small>
                                    </>,
                                ),
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
                                    <span className="badge badge-success">
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
                                    className: "btn btn-xs btn-soft-primary",
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
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Proveedores">
            <Providers {...properties} />
        </BaseAdminto>,
    );
});
