import BaseAdminto from "@Adminto/Base";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import TextareaFormGroup from "@Adminto/form/TextareaFormGroup";
import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import Swal from "sweetalert2";
import AboutusRest from "../Actions/Admin/AboutusRest";
import WebDetailsRest from "../Actions/Admin/WebDetailsRest";
import BasicEditing from "../Components/Adminto/Basic/BasicEditing";
import Modal from "../Components/Adminto/Modal";
import Table from "../Components/Adminto/Table";
import DxButton from "../Components/dx/DxButton";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import SelectFormGroup from "../Components/Adminto/form/SelectFormGroup";
import ArrayDetails2Object from "../Utils/ArrayDetails2Object";
import CreateReactScript from "../Utils/CreateReactScript";
import ReactAppend from "../Utils/ReactAppend";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import QuillFormGroup from "../Components/Adminto/form/QuillFormGroup";

const aboutusRest = new AboutusRest();
const webDetailsRest = new WebDetailsRest();

// Detectar si estamos en LOCAL
const isLocal = window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' || 
               window.location.hostname.includes('.local') ||
               window.location.hostname.includes('.test');

// Opciones de correlativo predefinidas
const CORRELATIVE_OPTIONS = [
    { value: 'section-hero', text: '🦸‍♂️ Hero Principal - Sección principal con título e imagen' },
    { value: 'section-mision', text: '🎯 Misión - Sección de misión de la empresa' },
    { value: 'section-vision', text: '🔭 Visión - Sección de visión de la empresa' },
    { value: 'section-valores', text: '⭐ Valores - Grid de valores empresariales' },
    { value: 'section-equipo', text: '👥 Nuestro Equipo - Presentación del equipo' },
    { value: 'section-historia', text: '📚 Nuestra Historia - Historia de la empresa' },
    { value: 'section-cta', text: '📞 Call to Action - Sección de contacto final' }
];

const About = ({ details: detailsDB }) => {
    const gridRef = useRef();
    const modalRef = useRef();

    // Form elements ref
    const idRef = useRef();
    const correlativeRef = useRef();
    const nameRef = useRef();
    const descriptionRef = useRef();
    const titleRef = useRef();
    const linkRef = useRef();
    const imageRef = useRef();

    const [isEditing, setIsEditing] = useState(false);

    const onModalOpen = (data) => {
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        // Reset delete flag when opening modal
        if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

        idRef.current.value = data?.id ?? "";
        correlativeRef.current.value = data?.correlative ?? "";
        nameRef.current.value = data?.name ?? "";
        descriptionRef.editor.root.innerHTML = data?.description ?? "";
        titleRef.current.value = data?.title ?? "";
        linkRef.current.value = data?.link ?? "";
        imageRef.current.value = null;
        imageRef.image.src = data?.image ? `/storage/images/aboutus/${data.image}` : '';
        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        const request = {
            id: idRef.current.value || undefined,
            correlative: correlativeRef.current.value,
            name: nameRef.current.value,
            description: descriptionRef.current.value,
            title: titleRef.current.value,
            link: linkRef.current.value,
        };

        const formData = new FormData();
        for (const key in request) {
            formData.append(key, request[key]);
        }

        const image = imageRef.current.files[0];
        if (image) {
            formData.append("image", image);
        }

        // Check for image deletion flag
        if (imageRef.getDeleteFlag && imageRef.getDeleteFlag()) {
            formData.append('image_delete', 'DELETE');
        }

        const result = await aboutusRest.save(formData);
        if (!result) return;

        // Reset delete flag after successful save
        if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
    };

    const onStatusChange = async ({ id, status }) => {
        const result = await aboutusRest.status({ id, status });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onVisibleChange = async ({ id, value }) => {
        const result = await aboutusRest.boolean({
            id,
            field: "visible",
            value,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar recurso",
            text: "¿Estas seguro de eliminar este about?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await aboutusRest.delete(id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const [details, setDetails] = useState(ArrayDetails2Object(detailsDB));
    const [videoEditing, setVideoEditing] = useState(false);

    const onVideoChange = async (e) => {
        const result = webDetailsRest.save({
            page: "about",
            name: "video",
            description: e.target.value,
        });
        if (!result) return;
        setDetails((old) => ({ ...old, [`about.video`]: e.target.value }));
        setVideoEditing(false);
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title={
                    <>
                        <BasicEditing correlative="about" details={detailsDB} />
                        {videoEditing ? (
                            <input
                                className="form-control form-control-sm mb-1"
                                defaultValue={details?.[`about.video`]}
                                onBlur={onVideoChange}
                                autoFocus
                            />
                        ) : (
                            <smal
                                className="header-title mt-1"
                                onClick={() => setVideoEditing(true)}
                            >
                                {details?.[`about.video`] || "Sin video"}
                            </smal>
                        )}
                    </>
                }
                rest={aboutusRest}
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
                    
                    // BOTÓN AGREGAR: Solo habilitado en LOCAL
                    if (isLocal) {
                        container.unshift({
                            widget: 'dxButton', 
                            location: 'after',
                            options: {
                                icon: 'plus',
                                text: 'Nuevo About',
                                hint: 'Agregar nuevo about',
                                onClick: () => onModalOpen()
                            }
                        });
                    }
                }}
                columns={[
                    {
                        dataField: "id",
                        caption: "ID",
                        visible: false,
                    },
                    {
                        dataField: "correlative",
                        caption: "Correlativo",
                        width: 150,
                    },
                    {
                        dataField: "name",
                        caption: "Sección",
                    },
                    {
                        dataField: "title",
                        caption: "Título",
                    },
                    {
                        dataField: "image",
                        caption: "Imagen",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <img
                                    src={`/storage/images/aboutus/${data.image}`}
                                    style={{
                                        width: "80px",
                                        height: "80px",
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
                                            //value: !data.visible,
                                            value: data.visible == 1? 0 : 1,
                                        })
                                    }
                                />
                            );
                        },
                    },

                    {
                        caption: "Acciones",
                        cellTemplate: (container, { data }) => {
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-primary",
                                    title: "Editar",
                                    icon: "fa fa-pen",
                                    onClick: () => onModalOpen(data),
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
                title={isEditing ? "Editar about" : "Agregar about"}
                onSubmit={onModalSubmit}
                size="md"
            >
                <div className="row" id="aboutuses-container">
                    <input ref={idRef} type="hidden" />
                    
                    {/* CORRELATIVO: Select en LOCAL, Input disabled en PRODUCCIÓN */}
                    {isLocal ? (
                        <SelectFormGroup
                            eRef={correlativeRef}
                            label="Tipo de Bloque (Correlativo)"
                            col="col-12"
                            required
                            dropdownParent={"#aboutuses-container"}
                            helpText="Selecciona el tipo de bloque que quieres crear"
                        >
                            <option value="">Selecciona un bloque</option>
                            {CORRELATIVE_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.text}
                                </option>
                            ))}
                        </SelectFormGroup>
                    ) : (
                        <InputFormGroup
                            eRef={correlativeRef}
                            label="Correlativo"
                            col="col-12"
                            required
                        />
                    )}
                    
                    <InputFormGroup
                        eRef={nameRef}
                        label="Sección"
                        col="col-12"
                        required
                    />
                    
                    <InputFormGroup
                        eRef={titleRef}
                        label="Título"
                        col="col-12"
                    />
                    
                    <InputFormGroup
                        eRef={linkRef}
                        label="Link"
                        col="col-12"
                    />
                    
                    <QuillFormGroup eRef={descriptionRef} label="Descripción" />
                    
                    <ImageFormGroup
                        eRef={imageRef}
                        name="image"
                        label="Imagen"
                        col="col-12"
                        rows={3}
                    />
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Nosotros">
            <About {...properties} />
        </BaseAdminto>
    );
});
