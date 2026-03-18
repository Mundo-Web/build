import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import BaseAdminto from "@Adminto/Base";
import CreateReactScript from "../Utils/CreateReactScript";
import Table from "../Components/Adminto/Table";
import ReactAppend from "../Utils/ReactAppend";
import DxButton from "../Components/dx/DxButton";
import Swal from "sweetalert2";
import ProvidersRest from "../Actions/Admin/ProvidersRest";
import { renderToString } from "react-dom/server";
import Modal from "../Components/Adminto/Modal";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import SelectFormGroup from "../Components/Adminto/form/SelectFormGroup";

const providersRest = new ProvidersRest();

const Providers = ({ session }) => {
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
    const inviteEmailRef = useRef();
    const whatsappNumberRef = useRef();
    const whatsappMessageRef = useRef();

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
        
        const prefix = data?.phone_prefix ?? "+51";
        phonePrefixRef.current.value = prefix;
        $(phonePrefixRef.current).val(prefix).trigger("change");

        dniRef.current.value = data?.dni ?? data?.document_number ?? "";
        whatsappNumberRef.current.value = data?.whatsapp_number ?? "";
        whatsappMessageRef.current.value = data?.whatsapp_message ?? "";

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

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
            role: "Provider",
        };

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
        const result = await providersRest.boolean({
            id,
            field: "status",
            value,
        });
        if (!result) {
            $(gridRef.current).dxDataGrid("instance").refresh();
            return;
        }
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
              <div class="col-md-6">
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600;">Nombre Completo</label>
                  <input type="text" class="form-control" value="${data.name} ${data.lastname || ""}" readonly style="background-color: #f8f9fa;">
                </div>
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600;">Email</label>
                  <input type="email" class="form-control" value="${data.email || ""}" readonly style="background-color: #f8f9fa;">
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600;">Teléfono</label>
                  <input type="text" class="form-control" value="${data.phone || "No especificado"}" readonly style="background-color: #f8f9fa;">
                </div>
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600;">Documento</label>
                  <input type="text" class="form-control" value="${data.dni || data.document_number || "No especificado"}" readonly style="background-color: #f8f9fa;">
                </div>
              </div>
              <div class="col-12">
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600;">Fecha de Registro</label>
                  <input type="text" class="form-control" value="${formattedDate}" readonly style="background-color: #f8f9fa;">
                </div>
              </div>
            </div>
          </form>
        </div>
      `,
            width: "600px",
            confirmButtonText: "Cerrar",
            confirmButtonColor: "#6c757d",
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
                        dataField: "name",
                        caption: "Proveedor",
                        width: "30%",
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
                                </div>,
                            );
                        },
                    },
                    {
                        dataField: "phone",
                        caption: "Teléfono",
                    },
                    {
                        dataField: "dni",
                        caption: "Documento",
                        cellTemplate: (container, { data }) => {
                            container.text(
                                data.dni || data.document_number || "-",
                            );
                        },
                    },
                    {
                        dataField: "status",
                        caption: "Estado",
                        dataType: "boolean",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <span
                                    className={`badge bg-${data.status ? "success" : "danger"}`}
                                >
                                    {data.status ? "Activo" : "Inactivo"}
                                </span>,
                            );
                        },
                    },
                    {
                        caption: "Acciones",
                        cellTemplate: (container, { data }) => {
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-info",
                                    title: "Ver detalles",
                                    icon: "fa fa-eye",
                                    onClick: () => onViewDetails(data),
                                }),
                            );
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-primary",
                                    title: "Editar",
                                    icon: "fa fa-pen",
                                    onClick: () => onModalOpen(data),
                                }),
                            );
                            container.append(
                                DxButton({
                                    className: `btn btn-xs btn-soft-${data.status ? "danger" : "success"}`,
                                    title: data.status ? "Desactivar" : "Activar",
                                    icon: `fa fa-${data.status ? "times" : "check"}`,
                                    onClick: () =>
                                        onStatusChange({
                                            id: data.id,
                                            value: !data.status,
                                        }),
                                }),
                            );
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-danger",
                                    title: "Eliminar",
                                    icon: "fa fa-trash",
                                    onClick: () => onDeleteClicked(data.id),
                                }),
                            );
                        },
                    },
                ]}
            />

            <Modal
                modalRef={inviteModalRef}
                title="Invitar Proveedor"
                onSubmit={onInviteSubmit}
                size="sm"
            >
                <InputFormGroup
                    label="Correo Electrónico"
                    eRef={inviteEmailRef}
                    type="email"
                    required
                />
            </Modal>

            <Modal
                modalRef={modalRef}
                title={isEditing ? "Editar Proveedor" : "Nuevo Proveedor"}
                onSubmit={onModalSubmit}
                size="lg"
            >
                <div className="row" id="principal-container">
                    <input type="hidden" ref={idRef} />
                    <InputFormGroup
                        label="Nombre"
                        eRef={nameRef}
                        col="col-md-6"
                        required
                    />
                    <InputFormGroup
                        label="Apellidos"
                        eRef={lastnameRef}
                        col="col-md-6"
                    />
                    <InputFormGroup
                        label="Correo Electrónico"
                        eRef={emailRef}
                        type="email"
                        col="col-md-6"
                        required
                    />
                    <InputFormGroup
                        label="Documento (DNI/RUC)"
                        eRef={dniRef}
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
                        label="Teléfono"
                        eRef={phoneRef}
                        col="col-md-9"
                    />

                    <div className="col-12">
                        <hr />
                        <h6 className="mb-3 text-success">
                            <i className="mdi mdi-whatsapp"></i> Configuración
                            WhatsApp
                        </h6>
                    </div>

                    <InputFormGroup
                        label="Número WhatsApp"
                        eRef={whatsappNumberRef}
                        col="col-md-6"
                        placeholder="Si está vacío usará el principal"
                    />
                    <InputFormGroup
                        label="Mensaje predeterminado"
                        eRef={whatsappMessageRef}
                        col="col-md-6"
                    />

                    <div className="col-12">
                        <hr />
                        <h6>
                            {isEditing
                                ? "Cambiar contraseña (opcional)"
                                : "Contraseña"}
                        </h6>
                    </div>

                    <InputFormGroup
                        label="Contraseña"
                        eRef={passwordRef}
                        type="password"
                        col="col-md-6"
                        required={!isEditing}
                    />
                    <InputFormGroup
                        label="Confirmar Contraseña"
                        eRef={confirmPasswordRef}
                        type="password"
                        col="col-md-6"
                        required={!isEditing}
                    />
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Gestión de Proveedores">
            <Providers {...properties} />
        </BaseAdminto>,
    );
});

export default Providers;
