import BaseAdminto from "@Adminto/Base";
import InputFormGroup from "@Adminto/form/InputFormGroup";
import SelectFormGroup from "@Adminto/form/SelectFormGroup";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import TextareaFormGroup from "@Adminto/form/TextareaFormGroup";
import React, { useRef, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import Swal from "sweetalert2";
import SocialsRest from "../Actions/Admin/SocialsRest";
import Modal from "../Components/Adminto/Modal";
import Table from "../Components/Adminto/Table";
import DxButton from "../Components/dx/DxButton";
import CreateReactScript from "../Utils/CreateReactScript";
import ReactAppend from "../Utils/ReactAppend";
import {
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaLinkedin,
    FaYoutube,
    FaTiktok,
    FaWhatsapp,
    FaTelegram,
    FaDiscord,
    FaSnapchat,
    FaPinterest,
    FaReddit,
} from "react-icons/fa";

const socialsRest = new SocialsRest();

// Redes sociales predefinidas
const predefinedSocials = [
    {
        id: "facebook",
        name: "Facebook",
        icon: FaFacebook,
        iconRef: "fab fa-facebook",
    },
    {
        id: "instagram",
        name: "Instagram",
        icon: FaInstagram,
        iconRef: "fab fa-instagram",
    },
    {
        id: "twitter",
        name: "Twitter/X",
        icon: FaTwitter,
        iconRef: "fab fa-twitter",
    },
    {
        id: "linkedin",
        name: "LinkedIn",
        icon: FaLinkedin,
        iconRef: "fab fa-linkedin",
    },
    {
        id: "youtube",
        name: "YouTube",
        icon: FaYoutube,
        iconRef: "fab fa-youtube",
    },
    { id: "tiktok", name: "TikTok", icon: FaTiktok, iconRef: "fab fa-tiktok" },
    {
        id: "whatsapp",
        name: "WhatsApp",
        icon: FaWhatsapp,
        iconRef: "fab fa-whatsapp",
    },
    {
        id: "telegram",
        name: "Telegram",
        icon: FaTelegram,
        iconRef: "fab fa-telegram",
    },
    {
        id: "discord",
        name: "Discord",
        icon: FaDiscord,
        iconRef: "fab fa-discord",
    },
    {
        id: "snapchat",
        name: "Snapchat",
        icon: FaSnapchat,
        iconRef: "fab fa-snapchat",
    },
    {
        id: "pinterest",
        name: "Pinterest",
        icon: FaPinterest,
        iconRef: "fab fa-pinterest",
    },
    { id: "reddit", name: "Reddit", icon: FaReddit, iconRef: "fab fa-reddit" },
];

const Socials = ({}) => {
    const gridRef = useRef();
    const modalRef = useRef();

    // Form elements ref
    const idRef = useRef();
    const socialSelectRef = useRef();
    const nameRef = useRef();
    const linkRef = useRef();

    const [isEditing, setIsEditing] = useState(false);
    const [selectedSocial, setSelectedSocial] = useState(null);

    const handleSocialChange = (socialId) => {
        const social = predefinedSocials.find((s) => s.id === socialId);
        setSelectedSocial(social);
    };

    useEffect(() => {
        // Configurar el evento de cambio para Select2
        const setupSelect2Event = () => {
            if (socialSelectRef.current) {
                $(socialSelectRef.current).on("change", function () {
                    const value = $(this).val();
                    handleSocialChange(value);
                });
            }
        };

        // Configurar después de que el modal se abra
        $(modalRef.current).on("shown.bs.modal", setupSelect2Event);

        return () => {
            if (socialSelectRef.current) {
                $(socialSelectRef.current).off("change");
            }
            $(modalRef.current).off("shown.bs.modal", setupSelect2Event);
        };
    }, []);

    const onModalOpen = (data) => {
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        idRef.current.value = data?.id ?? "";
        nameRef.current.value = data?.name ?? "";
        linkRef.current.value = data?.link ?? "";

        // Buscar la red social por descripción o icon
        const social = predefinedSocials.find(
            (s) => s.name === data?.description || s.iconRef === data?.icon,
        );

        if (social) {
            setSelectedSocial(social);
            // Configurar el valor después de que el modal se muestre
            setTimeout(() => {
                $(socialSelectRef.current).val(social.id).trigger("change");
            }, 100);
        } else {
            setSelectedSocial(null);
            setTimeout(() => {
                $(socialSelectRef.current).val("").trigger("change");
            }, 100);
        }

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        if (!selectedSocial) {
            Swal.fire("Error", "Por favor selecciona una red social", "error");
            return;
        }

        const request = {
            id: idRef.current.value || undefined,
            icon: selectedSocial.iconRef,
            name: nameRef.current.value,
            description: selectedSocial.name,
            link: linkRef.current.value,
        };

        const result = await socialsRest.save(request);
        if (!result) return;

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
    };

    const onVisibleChange = async ({ id, value }) => {
        const result = await socialsRest.boolean({
            id,
            field: "visible",
            value,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
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
        const result = await socialsRest.delete(id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onReorder = async (e) => {
        const newOrderIndex = e.toIndex;
        try {
            const result = await socialsRest.reorder(
                e.itemData.id,
                newOrderIndex,
            );
            if (result) {
                await e.component.refresh();
            }
        } catch (error) {
            console.error("Error reordering social:", error);
        }
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Redes Sociales"
                rest={socialsRest}
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
                            text: "Nuevo registro",
                            hint: "Nuevo registro",
                            onClick: () => onModalOpen(),
                        },
                    });
                }}
                rowDragging={{
                    allowReordering: true,
                    onReorder: onReorder,
                    dropFeedbackMode: "push",
                }}
                sorting={{
                    mode: "single",
                }}
                columns={[
                    {
                        dataField: "id",
                        caption: "ID",
                        visible: false,
                    },
                    {
                        dataField: "order_index",
                        caption: "Orden",
                        visible: false,
                        sortOrder: "asc",
                        sortIndex: 0,
                    },
                    {
                        dataField: "name",
                        caption: "Usuario",
                    },
                    {
                        dataField: "description",
                        caption: "Red Social",
                        cellTemplate: (container, { data }) => {
                            const social = predefinedSocials.find(
                                (s) =>
                                    s.name === data.description ||
                                    s.iconRef === data.icon,
                            );

                            if (social) {
                                const IconComponent = social.icon;
                                container.html(
                                    renderToString(
                                        <span className="d-flex align-items-center">
                                            <IconComponent
                                                className="me-2"
                                                size={16}
                                            />
                                            {data.description}
                                        </span>,
                                    ),
                                );
                            } else {
                                container.html(
                                    renderToString(
                                        <>
                                            <i
                                                className={`fab ${data.icon} me-1`}
                                            ></i>
                                            {data.description}
                                        </>,
                                    ),
                                );
                            }
                        },
                    },
                    {
                        dataField: "link",
                        caption: "Link",
                    },
                    {
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
                                />,
                            );
                        },
                    },
                    {
                        caption: "Acciones",
                        cellTemplate: (container, { data }) => {
                            container.css("text-overflow", "unset");
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
                                    className: "btn btn-xs btn-soft-danger",
                                    title: "Eliminar",
                                    icon: "fa fa-trash",
                                    onClick: () => onDeleteClicked(data.id),
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
                title={isEditing ? "Editar red social" : "Agregar red social"}
                onSubmit={onModalSubmit}
                size="md"
            >
                <div className="row" id="socials-container">
                    <input ref={idRef} type="hidden" />

                    <div className="col-12 mb-3">
                        <label className="form-label">
                            Red Social <span className="text-danger">*</span>
                        </label>
                        <SelectFormGroup
                            eRef={socialSelectRef}
                            dropdownParent="#socials-container"
                            required
                        >
                            <option value="">Seleccionar red social...</option>
                            {predefinedSocials.map((social) => (
                                <option key={social.id} value={social.id}>
                                    {social.name}
                                </option>
                            ))}
                        </SelectFormGroup>
                    </div>

                    {selectedSocial && (
                        <div className="col-12 mb-3">
                            <div className="alert alert-info d-flex align-items-center">
                                <selectedSocial.icon
                                    className="me-2"
                                    size={20}
                                />
                                <span>
                                    Red social seleccionada:{" "}
                                    <strong>{selectedSocial.name}</strong>
                                </span>
                            </div>
                        </div>
                    )}

                    <InputFormGroup
                        eRef={nameRef}
                        label="Usuario/Nombre de cuenta"
                        col="col-12"
                        required
                    />
                    <TextareaFormGroup
                        eRef={linkRef}
                        label="Enlace (https://...)"
                        col="col-12"
                        rows={2}
                        required
                    />
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Redes Sociales">
            <Socials {...properties} />
        </BaseAdminto>,
    );
});
