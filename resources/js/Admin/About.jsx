import BaseAdminto from "@Adminto/Base";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import TextareaFormGroup from "@Adminto/form/TextareaFormGroup";
import React, { useRef, useState, useCallback } from "react";
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
import Fillable from "../Utils/Fillable";

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

const About = ({ details: detailsDB, session, hasRootRole: backendRootRole }) => {
    const gridRef = useRef();
    const modalRef = useRef();

    // Función para verificar si el usuario tiene rol Root (igual que Generals.jsx)
    const hasRootRole = useCallback(() => {
        // Usar el valor del backend si está disponible, sino usar el método original
        if (typeof backendRootRole !== 'undefined') {
            return backendRootRole;
        }
        return session?.roles?.some(role => role.name === 'Root') || false;
    }, [backendRootRole, session]);

    // Form elements ref
    const idRef = useRef();
    const correlativeRef = useRef();
    const nameRef = useRef();
    const descriptionRef = useRef();
    const titleRef = useRef();
    const sloganRef = useRef();
    const linkRef = useRef();
    const imageRef = useRef();

    const [isEditing, setIsEditing] = useState(false);

    const onModalOpen = (data) => {
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        // Reset delete flag when opening modal
        if (imageRef.current && imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

        idRef.current.value = data?.id ?? "";
        
        // Correlativo con Select2
        if (correlativeRef.current) {
            $(correlativeRef.current).val(data?.correlative ?? "").trigger('change');
        }
        
        nameRef.current.value = data?.name ?? "";
        
        // Validar si description está disponible (Fillable)
        if (descriptionRef.current && Fillable.has('aboutuses', 'description')) {
            descriptionRef.editor.root.innerHTML = data?.description ?? "";
        }
        
        // Validar si title está disponible (Fillable)
        if (titleRef.current && Fillable.has('aboutuses', 'title')) {
            titleRef.current.value = data?.title ?? "";
        }
        
        // Validar si slogan está disponible (Fillable)
        if (sloganRef.current && Fillable.has('aboutuses', 'slogan')) {
            sloganRef.current.value = data?.slogan ?? "";
        }
        
        // Validar si link está disponible (Fillable)
        if (linkRef.current && Fillable.has('aboutuses', 'link')) {
            linkRef.current.value = data?.link ?? "";
        }
        
        // Validar si image está disponible (Fillable)
        if (imageRef.current && imageRef.image && Fillable.has('aboutuses', 'image')) {
            imageRef.image.src = data?.image ? `/storage/images/aboutus/${data.image}` : '';
            imageRef.current.value = null;
        }
        
        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        const request = {
            id: idRef.current.value || undefined,
            correlative: correlativeRef.current.value,
            name: nameRef.current.value,
        };

        // Agregar campos opcionales solo si están habilitados en Fillable
        if (Fillable.has('aboutuses', 'description')) {
            request.description = descriptionRef.current.value;
        }
        if (Fillable.has('aboutuses', 'title')) {
            request.title = titleRef.current.value;
        }
        if (Fillable.has('aboutuses', 'slogan')) {
            request.slogan = sloganRef.current.value;
        }
        if (Fillable.has('aboutuses', 'link')) {
            request.link = linkRef.current.value;
        }

        const formData = new FormData();
        for (const key in request) {
            formData.append(key, request[key]);
        }

        // Validar si image está disponible (Fillable)
        if (imageRef.current && Fillable.has('aboutuses', 'image')) {
            const image = imageRef.current.files[0];
            if (image) {
                formData.append("image", image);
            }

            // Check for image deletion flag
            if (imageRef.getDeleteFlag && imageRef.getDeleteFlag()) {
                formData.append('image_delete', 'DELETE');
            }
        }

        const result = await aboutusRest.save(formData);
        if (!result) return;

        // Reset delete flag after successful save
        if (imageRef.current && imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

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

    // Función para manejar el reordering remoto
    const onReorder = async (e) => {
        // e.toIndex es la nueva posición donde se quiere insertar el elemento
        const newOrderIndex = e.toIndex;
        
        try {
            const result = await aboutusRest.reorder(e.itemData.id, newOrderIndex);
            if (result) {
                await e.component.refresh();
            }
        } catch (error) {
            console.error('Error reordering about:', error);
        }
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
                rowDragging={{
                    allowReordering: true,
                    onReorder: onReorder,
                    dropFeedbackMode: 'push'
                }}
                sorting={{
                    mode: 'single'
                }}
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
                        dataField: "order_index",
                        caption: "Orden",
                        visible: false,
                        sortOrder: 'asc',
                        sortIndex: 0
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
                    Fillable.has('aboutuses', 'title') && {
                        dataField: "title",
                        caption: "Título",
                    },
                    Fillable.has('aboutuses', 'slogan') && {
                        dataField: "slogan",
                        caption: "Slogan",
                    },
                    Fillable.has('aboutuses', 'image') && {
                        dataField: "image",
                        caption: "Imagen",
                        width: "90px",
                        allowFiltering: false,
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
                            
                            // Mostrar botón de eliminar solo si tiene rol Root
                            if (hasRootRole()) {
                                container.append(
                                    DxButton({
                                        className: "btn btn-xs btn-soft-danger ml-1",
                                        title: "Eliminar",
                                        icon: "fa fa-trash",
                                        onClick: () => onDeleteClicked(data.id),
                                    })
                                );
                            }
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
                size="xl"
            >
                <input ref={idRef} type="hidden" />
                
                <div id="aboutuses-container">
                    {/* Sistema de Pestañas */}
                    <ul className="nav nav-pills nav-justified mb-4" role="tablist" style={{
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        padding: '4px',
                        border: '1px solid #e9ecef'
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
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <i className="fas fa-info-circle me-2"></i>
                                Información Básica
                            </button>
                        </li>
                        {(Fillable.has('aboutuses', 'title') || Fillable.has('aboutuses', 'slogan') || Fillable.has('aboutuses', 'description')) && (
                            <li className="nav-item" role="presentation">
                                <button 
                                    className="nav-link" 
                                    id="content-tab" 
                                    data-bs-toggle="pill" 
                                    data-bs-target="#content" 
                                    type="button" 
                                    role="tab" 
                                    aria-controls="content" 
                                    aria-selected="false"
                                    style={{
                                        borderRadius: '6px',
                                        fontWeight: '500',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <i className="fas fa-file-alt me-2"></i>
                                    Contenido
                                </button>
                            </li>
                        )}
                        {Fillable.has('aboutuses', 'image') && (
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
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <i className="fas fa-images me-2"></i>
                                    Multimedia
                                </button>
                            </li>
                        )}
                    </ul>

                    {/* Contenido de las Pestañas */}
                    <div className="tab-content">
                        {/* Pestaña: Información Básica */}
                        <div className="tab-pane fade show active" id="basic-info" role="tabpanel" aria-labelledby="basic-info-tab">
                            <div className="row g-3">
                                <div className="col-12">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-header bg-light">
                                            <h6 className="mb-0">
                                                <i className="fas fa-tag me-2 text-primary"></i>
                                                Identificación de la Sección
                                            </h6>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                {/* CORRELATIVO */}
                                                <div className="col-12">
                                                    {isLocal ? (
                                                        <SelectFormGroup
                                                            eRef={correlativeRef}
                                                            label="Tipo de Bloque (Correlativo)"
                                                            col="col-12"
                                                            required
                                                            dropdownParent="#aboutuses-container"
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
                                                            disabled
                                                            helpText="El correlativo no puede modificarse en producción"
                                                        />
                                                    )}
                                                </div>
                                                
                                                {/* NAME */}
                                                <div className="col-12">
                                                    <InputFormGroup
                                                        eRef={nameRef}
                                                        label="Nombre de la Sección"
                                                        col="col-12"
                                                        required
                                                        placeholder="Ej: SOBRE NOSOTROS, NUESTRA MISIÓN"
                                                        helpText="Nombre que aparecerá en el badge superior de la sección"
                                                    />
                                                </div>
                                                
                                                {/* LINK */}
                                                {Fillable.has('aboutuses', 'link') && (
                                                    <div className="col-12">
                                                        <InputFormGroup
                                                            eRef={linkRef}
                                                            label="Enlace (Opcional)"
                                                            col="col-12"
                                                            placeholder="https://ejemplo.com"
                                                            helpText="URL externa o interna relacionada con esta sección"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pestaña: Contenido */}
                        {(Fillable.has('aboutuses', 'title') || Fillable.has('aboutuses', 'slogan') || Fillable.has('aboutuses', 'description')) && (
                            <div className="tab-pane fade" id="content" role="tabpanel" aria-labelledby="content-tab">
                                <div className="row g-3">
                                    <div className="col-12">
                                        <div className="card border-0 shadow-sm">
                                            <div className="card-header bg-light">
                                                <h6 className="mb-0">
                                                    <i className="fas fa-file-alt me-2 text-success"></i>
                                                    Contenido de la Sección
                                                </h6>
                                            </div>
                                            <div className="card-body">
                                                <div className="row">
                                                    {/* TITLE */}
                                                    {Fillable.has('aboutuses', 'title') && (
                                                        <div className="col-12 mb-3">
                                                            <InputFormGroup
                                                                eRef={titleRef}
                                                                label="Título Principal"
                                                                col="col-12"
                                                                placeholder="Ej: Nuestra Historia"
                                                                helpText="Título grande que aparecerá en la sección"
                                                            />
                                                        </div>
                                                    )}
                                                    
                                                    {/* SLOGAN */}
                                                    {Fillable.has('aboutuses', 'slogan') && (
                                                        <div className="col-12 mb-3">
                                                            <InputFormGroup
                                                                eRef={sloganRef}
                                                                label="Slogan / Frase Decorativa"
                                                                col="col-12"
                                                                placeholder="Ej: Comprometidos con la excelencia"
                                                                helpText="Frase corta inspiradora que acompaña el contenido"
                                                            />
                                                        </div>
                                                    )}
                                                    
                                                    {/* DESCRIPTION */}
                                                    {Fillable.has('aboutuses', 'description') && (
                                                        <div className="col-12">
                                                            <QuillFormGroup 
                                                                eRef={descriptionRef} 
                                                                label="Descripción Detallada" 
                                                                helpText="Contenido principal de la sección (soporta formato HTML)"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pestaña: Multimedia */}
                        {Fillable.has('aboutuses', 'image') && (
                            <div className="tab-pane fade" id="multimedia" role="tabpanel" aria-labelledby="multimedia-tab">
                                <div className="row g-3">
                                    <div className="col-12">
                                        <div className="card border-0 shadow-sm">
                                            <div className="card-header bg-light">
                                                <h6 className="mb-0">
                                                    <i className="fas fa-images me-2 text-info"></i>
                                                    Imagen de la Sección
                                                </h6>
                                            </div>
                                            <div className="card-body">
                                                <ImageFormGroup
                                                    eRef={imageRef}
                                                    name="image"
                                                    label="Imagen Principal"
                                                    col="col-12"
                                                    aspect={16 / 9}
                                                />
                                                <small className="text-muted mt-2 d-block">
                                                    <i className="fas fa-info-circle me-1"></i>
                                                    Recomendado: 1600x900px (proporción 16:9) para mejor visualización
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
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
