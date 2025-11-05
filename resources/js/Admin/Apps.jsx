import BaseAdminto from "@Adminto/Base";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import TextareaFormGroup from "@Adminto/form/TextareaFormGroup";
import InputFormGroup from "@Adminto/form/InputFormGroup";
import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import Swal from "sweetalert2";
import AppsRest from "../Actions/Admin/AppsRest";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import Modal from "../Components/Adminto/Modal";
import Table from "../Components/Adminto/Table";
import DxButton from "../Components/dx/DxButton";
import CreateReactScript from "../Utils/CreateReactScript";
import ReactAppend from "../Utils/ReactAppend";

const appsRest = new AppsRest();

const Apps = () => {
    const gridRef = useRef();
    const modalRef = useRef();

    // Form elements ref
    const idRef = useRef();
    const nameRef = useRef();
    const storeRef = useRef();
    const linkRef = useRef();
    const logoRef = useRef();
    const imageRef = useRef();
    const downloadsRef = useRef();
    const downloadsUnitRef = useRef();
    const ratingRef = useRef();

    const [isEditing, setIsEditing] = useState(false);

    const onModalOpen = (data) => {
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        idRef.current.value = data?.id ?? "";
        nameRef.current.value = data?.name ?? "";
        storeRef.current.value = data?.store ?? "Google Play";
        linkRef.current.value = data?.link ?? "";
        downloadsRef.current.value = data?.downloads ?? "100";
        downloadsUnitRef.current.value = data?.downloads_unit ?? "K";
        ratingRef.current.value = data?.rating ?? "4.5";

        logoRef.image.src = data?.logo ? `/storage/images/app/${data.logo}` : '';
        logoRef.current.value = null;
        imageRef.image.src = data?.image ? `/storage/images/app/${data.image}` : '';
        imageRef.current.value = null;

        // Reset delete flags
        if (logoRef.resetDeleteFlag) logoRef.resetDeleteFlag();
        if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        const request = {
            id: idRef.current.value || undefined,
            name: nameRef.current.value,
            store: storeRef.current.value,
            link: linkRef.current.value,
            downloads: downloadsRef.current.value,
            downloads_unit: downloadsUnitRef.current.value,
            rating: ratingRef.current.value,
        };

        const formData = new FormData();
        for (const key in request) {
            formData.append(key, request[key]);
        }

        const logoFile = logoRef.current.files[0];
        if (logoFile) {
            formData.append("logo", logoFile);
        }

        const imageFile = imageRef.current.files[0];
        if (imageFile) {
            formData.append("image", imageFile);
        }

        // Check for image deletion flags
        if (logoRef.getDeleteFlag && logoRef.getDeleteFlag()) {
            formData.append('logo_delete', 'DELETE');
        }

        if (imageRef.getDeleteFlag && imageRef.getDeleteFlag()) {
            formData.append('image_delete', 'DELETE');
        }

        const result = await appsRest.save(formData);
        if (!result) return;

        // Reset delete flags after successful save
        if (logoRef.resetDeleteFlag) logoRef.resetDeleteFlag();
        if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
    };

    const onVisibleChange = async ({ id, value }) => {
        const result = await appsRest.boolean({
            id,
            field: "visible",
            value,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onDeleteClicked = async (row) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar registro",
            text: "¿Estás seguro de eliminar esta app?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await appsRest.delete(row.id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Apps Móviles"
                rest={appsRest}
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
                            text: "Nueva app",
                            hint: "Nueva app",
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
                        dataField: "logo",
                        caption: "Logo",
                        width: "80px",
                        allowFiltering: false,
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <img
                                    src={`/storage/images/app/${data.logo}`}
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        objectFit: "contain",
                                        borderRadius: "8px",
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
                        width: "25%",
                    },
                    {
                        dataField: "store",
                        caption: "Tienda",
                        width: "15%",
                    },
                    {
                        dataField: "downloads",
                        caption: "Descargas",
                        width: "12%",
                        cellTemplate: (container, { data }) => {
                            const formatted = `${data.downloads}${data.downloads_unit || ''}`;
                            ReactAppend(container, <span>{formatted}</span>);
                        },
                    },
                    {
                        dataField: "rating",
                        caption: "Rating",
                        width: "10%",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <div className="d-flex align-items-center">
                                    <span className="text-warning mr-1">★</span>
                                    <span>{data.rating}</span>
                                </div>
                            );
                        },
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
                                />
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
                                })
                            );
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-danger",
                                    title: "Eliminar",
                                    icon: "fa fa-trash",
                                    onClick: () => onDeleteClicked(data),
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
                title={isEditing ? "Editar app" : "Agregar app"}
                onSubmit={onModalSubmit}
            >
                <input ref={idRef} type="hidden" />
                <div className="row">
                    <div className="col-md-6">
                        <ImageFormGroup
                            eRef={logoRef}
                            name="logo"
                            label="Logo de la App"
                            col="col-12"
                            aspect={1}
                        />
                        <ImageFormGroup
                            eRef={imageRef}
                            name="image"
                            label="Screenshot de la Tienda"
                            col="col-12"
                            aspect={9 / 16}
                        />
                    </div>
                    <div className="col-md-6">
                        <InputFormGroup
                            eRef={nameRef}
                            label="Nombre de la App"
                            required
                        />
                        <div className="form-group">
                            <label>Tienda <span className="text-danger">*</span></label>
                            <select ref={storeRef} className="form-control" required>
                                <option value="Google Play">Google Play</option>
                                <option value="App Store">App Store</option>
                                <option value="Huawei AppGallery">Huawei AppGallery</option>
                                <option value="Amazon Appstore">Amazon Appstore</option>
                            </select>
                        </div>
                        <InputFormGroup
                            eRef={linkRef}
                            label="Link de la Tienda"
                            type="url"
                            placeholder="https://play.google.com/store/apps/details?id=..."
                            required
                        />
                        <div className="row">
                            <div className="col-md-8">
                                <InputFormGroup
                                    eRef={downloadsRef}
                                    label="Cantidad de Descargas"
                                    type="number"
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label>Unidad <span className="text-danger">*</span></label>
                                    <select ref={downloadsUnitRef} className="form-control" required>
                                        <option value="">Número exacto</option>
                                        <option value="K">K (Miles)</option>
                                        <option value="M">M (Millones)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <InputFormGroup
                            eRef={ratingRef}
                            label="Rating (0.0 - 5.0)"
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                            required
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Apps Móviles">
            <Apps {...properties} />
        </BaseAdminto>
    );
});
