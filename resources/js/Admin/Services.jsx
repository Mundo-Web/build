import BaseAdminto from "@Adminto/Base";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import TextareaFormGroup from "@Adminto/form/TextareaFormGroup";
import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import Swal from "sweetalert2";
import ServicesRest from "../Actions/Admin/ServicesRest";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import Modal from "../Components/Adminto/Modal";
import Table from "../Components/Adminto/Table";
import DxButton from "../Components/dx/DxButton";
import CreateReactScript from "../Utils/CreateReactScript";
import ReactAppend from "../Utils/ReactAppend";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import SelectFormGroup from "../Components/Adminto/form/SelectFormGroup";

const servicesRest = new ServicesRest();

const Services = ({ service_categories = [], service_sub_categories = [] }) => {
    const gridRef = useRef();
    const modalRef = useRef();

    // Form elements ref
    const idRef = useRef();
    const categoryRef = useRef();
    const subcategoryRef = useRef();
    const nameRef = useRef();
    const descriptionRef = useRef();
    const pathRef = useRef();
    const imageRef = useRef();
    const backgroundImageRef = useRef();
    const slugRef = useRef();

    // Hero content refs
    const heroTitleRef = useRef();
    const heroSubtitleRef = useRef();
    const heroDescriptionRef = useRef();
    const heroCtaTextRef = useRef();
    const heroBackgroundImageRef = useRef();

    // Partners section refs
    const partnersEnabledRef = useRef();
    const partnersTitleRef = useRef();
    const partnersSubtitleRef = useRef();

    // Requirements section refs
    const requirementsEnabledRef = useRef();
    const requirementsTitleRef = useRef();
    const requirementsSubtitleRef = useRef();

    // CTA content refs
    const ctaTitleRef = useRef();
    const ctaSubtitleRef = useRef();
    const ctaButtonTextRef = useRef();

    const [isEditing, setIsEditing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [activeTab, setActiveTab] = useState('basic');

    // JSON Content States
    const [steps, setSteps] = useState([{ image: '', title: '', description: '', color: '#3b82f6' }]);
    const [benefits, setBenefits] = useState([{ image: '', title: '', description: '', color: '#3b82f6' }]);
    const [features, setFeatures] = useState([{ image: '', title: '', description: '' }]);

    // Functions for managing Steps
    const addStep = () => {
        setSteps([...steps, { image: '', title: '', description: '', color: '#3b82f6' }]);
    };

    const removeStep = (index) => {
        setSteps(steps.filter((_, i) => i !== index));
    };

    const updateStep = (index, field, value) => {
        const newSteps = [...steps];
        newSteps[index][field] = value;
        setSteps(newSteps);
    };

    // Functions for managing Benefits
    const addBenefit = () => {
        setBenefits([...benefits, { image: '', title: '', description: '', color: '#3b82f6' }]);
    };

    const removeBenefit = (index) => {
        setBenefits(benefits.filter((_, i) => i !== index));
    };

    const updateBenefit = (index, field, value) => {
        const newBenefits = [...benefits];
        newBenefits[index][field] = value;
        setBenefits(newBenefits);
    };

    // Functions for managing Features
    const addFeature = () => {
        setFeatures([...features, { image: '', title: '', description: '' }]);
    };

    const removeFeature = (index) => {
        setFeatures(features.filter((_, i) => i !== index));
    };

    const updateFeature = (index, field, value) => {
        const newFeatures = [...features];
        newFeatures[index][field] = value;
        setFeatures(newFeatures);
    };

    const onModalOpen = (data) => {
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        setActiveTab('basic');
        idRef.current.value = data?.id ?? "";
        
        nameRef.current.value = data?.name ?? "";
        descriptionRef.current.value = data?.description ?? "";
        pathRef.current.value = data?.path ?? "";
        if (slugRef.current) slugRef.current.value = data?.slug ?? "";
        
        imageRef.image.src = data?.image ? `/storage/images/service/${data.image}` : '';
        imageRef.current.value = null;
        
        backgroundImageRef.image.src = data?.background_image ? `/storage/images/service/${data.background_image}` : '';
        backgroundImageRef.current.value = null;

        // Load Hero content
        if (heroTitleRef.current) heroTitleRef.current.value = data?.hero_content?.title ?? '';
        if (heroSubtitleRef.current) heroSubtitleRef.current.value = data?.hero_content?.subtitle ?? '';
        if (heroDescriptionRef.current) heroDescriptionRef.current.value = data?.hero_content?.description ?? '';
        if (heroCtaTextRef.current) heroCtaTextRef.current.value = data?.hero_content?.cta_text ?? '';
        if (heroBackgroundImageRef.current) heroBackgroundImageRef.current.value = data?.hero_content?.background_image ?? '';

        // Load Partners section
        if (partnersEnabledRef.current) partnersEnabledRef.current.checked = data?.partners_section?.enabled ?? false;
        if (partnersTitleRef.current) partnersTitleRef.current.value = data?.partners_section?.title ?? '';
        if (partnersSubtitleRef.current) partnersSubtitleRef.current.value = data?.partners_section?.subtitle ?? '';

        // Load Requirements section
        if (requirementsEnabledRef.current) requirementsEnabledRef.current.checked = data?.requirements_section?.enabled ?? false;
        if (requirementsTitleRef.current) requirementsTitleRef.current.value = data?.requirements_section?.title ?? '';
        if (requirementsSubtitleRef.current) requirementsSubtitleRef.current.value = data?.requirements_section?.subtitle ?? '';

        // Load CTA content
        if (ctaTitleRef.current) ctaTitleRef.current.value = data?.cta_content?.title ?? '';
        if (ctaSubtitleRef.current) ctaSubtitleRef.current.value = data?.cta_content?.subtitle ?? '';
        if (ctaButtonTextRef.current) ctaButtonTextRef.current.value = data?.cta_content?.button_text ?? '';

        // Load dynamic content - ensure arrays con estructura de imágenes
        const parseJsonArray = (data, field, defaultValue) => {
            if (!data || !data[field]) return defaultValue;
            if (Array.isArray(data[field])) return data[field];
            try {
                return JSON.parse(data[field]);
            } catch (e) {
                console.error(`Error parsing ${field}:`, e);
                return defaultValue;
            }
        };

        // Load JSON content arrays
        setSteps(parseJsonArray(data, 'steps_content', [{ image: '', title: '', description: '', color: '#3b82f6' }]));
        setBenefits(parseJsonArray(data, 'benefits_content', [{ image: '', title: '', description: '', color: '#3b82f6' }]));
        setFeatures(parseJsonArray(data, 'features_content', [{ image: '', title: '', description: '' }]));

        // Reset delete flags
        if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();
        if (backgroundImageRef.resetDeleteFlag) backgroundImageRef.resetDeleteFlag();

        // Cargar categoría y subcategoría usando jQuery como Items.jsx
        $(categoryRef.current)
            .val(data?.service_category_id || null)
            .trigger("change");
        
        if (data?.service_category_id) {
            setSelectedCategory(Number(data.service_category_id));
        }
        
        $(subcategoryRef.current)
            .val(data?.service_subcategory_id || null)
            .trigger("change");

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        const request = {
            id: idRef.current.value || undefined,
            name: nameRef.current.value,
            description: descriptionRef.current.value,
        };

        // Solo agregar categoría si tiene valor
        const categoryValue = categoryRef.current.value;
        if (categoryValue && categoryValue !== '' && categoryValue !== 'null') {
            request.service_category_id = categoryValue;
        }

        // Solo agregar subcategoría si tiene valor
        const subcategoryValue = subcategoryRef.current.value;
        if (subcategoryValue && subcategoryValue !== '' && subcategoryValue !== 'null') {
            request.service_subcategory_id = subcategoryValue;
        }

        // Solo agregar path si tiene valor
        const pathValue = pathRef.current.value;
        if (pathValue && pathValue.trim() !== '') {
            request.path = pathValue;
        } else if (isEditing) {
            // Si estamos editando y el campo está vacío, enviar null para limpiar
            request.path = null;
        }

        // Solo agregar slug si tiene valor
        const slugValue = slugRef.current?.value;
        if (slugValue && slugValue.trim() !== '') {
            request.slug = slugValue;
        } else if (isEditing) {
            // Si estamos editando y el campo está vacío, enviar null para limpiar
            request.slug = null;
        }

        const formData = new FormData();
        for (const key in request) {
            if (request[key] !== undefined) {
                // Enviar null como cadena vacía para limpiar campos en edición
                formData.append(key, request[key] === null ? '' : request[key]);
            }
        }
        
        const imageFile = imageRef.current.files[0];
        if (imageFile) {
            formData.append("image", imageFile);
        }
        
        const backgroundImageFile = backgroundImageRef.current.files[0];
        if (backgroundImageFile) {
            formData.append("background_image", backgroundImageFile);
        }

        // Add JSON content fields
        const contentFields = {
            hero_content: {
                title: heroTitleRef.current?.value || '',
                subtitle: heroSubtitleRef.current?.value || '',
                description: heroDescriptionRef.current?.value || '',
                cta_text: heroCtaTextRef.current?.value || '',
                background_image: heroBackgroundImageRef.current?.value || ''
            },
            steps_content: steps,
            benefits_content: benefits,
            features_content: features,
            partners_section: {
                enabled: partnersEnabledRef.current?.checked || false,
                title: partnersTitleRef.current?.value || '',
                subtitle: partnersSubtitleRef.current?.value || ''
            },
            requirements_section: {
                enabled: requirementsEnabledRef.current?.checked || false,
                title: requirementsTitleRef.current?.value || '',
                subtitle: requirementsSubtitleRef.current?.value || ''
            },
            cta_content: {
                title: ctaTitleRef.current?.value || '',
                subtitle: ctaSubtitleRef.current?.value || '',
                button_text: ctaButtonTextRef.current?.value || ''
            }
        };

        Object.entries(contentFields).forEach(([key, value]) => {
            formData.append(key, JSON.stringify(value));
        });

        // Check for image deletion flags
        if (imageRef.getDeleteFlag && imageRef.getDeleteFlag()) {
            formData.append('image_delete', 'DELETE');
        }
        
        if (backgroundImageRef.getDeleteFlag && backgroundImageRef.getDeleteFlag()) {
            formData.append('background_image_delete', 'DELETE');
        }

        const result = await servicesRest.save(formData);
        if (!result) return;

        // Reset delete flags after successful save
        if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();
        if (backgroundImageRef.resetDeleteFlag) backgroundImageRef.resetDeleteFlag();

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
    };

    const onVisibleChange = async ({ id, value }) => {
        const result = await servicesRest.boolean({
            id,
            field: "visible",
            value,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onStatusChange = async ({ id, value }) => {
        const result = await servicesRest.boolean({
            id,
            field: "status",
            value,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onDeleteClicked = async (row) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar registro",
            text: "¿Estas seguro de eliminar este registro?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await servicesRest.delete(row.id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Servicios"
                rest={servicesRest}
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
                columns={[
                    {
                        dataField: "id",
                        caption: "ID",
                        visible: false,
                    },
                    {
                        dataField: "category.name",
                        caption: "Categoría",
                        width: "120px",
                        cellTemplate: (container, { data }) => {
                            container.html(
                                renderToString(
                                    <>
                                        <b className="d-block">
                                            {data.category?.name || 'Sin categoría'}
                                        </b>
                                        <small className="text-muted">
                                            {data.subcategory?.name || 'Sin subcategoría'}
                                        </small>
                                    </>
                                )
                            );
                        },
                    },
                    {
                        dataField: "name",
                        caption: "Servicio",
                        width: "25%",
                    },
                    {
                        dataField: "description",
                        caption: "Descripción",
                        width: "35%",
                    },
                    {
                        dataField: "image",
                        caption: "Imagen",
                        width: "90px",
                        allowFiltering: false,
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <img
                                    src={`/storage/images/service/${data.image}`}
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
                        dataField: "status",
                        caption: "Estado",
                        dataType: "boolean",
                        cellTemplate: (container, { data }) => {
                            $(container).empty();
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={data.status == 1}
                                    onChange={() =>
                                        onStatusChange({
                                            id: data.id,
                                            value: !data.status,
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
                title={isEditing ? "Editar servicio" : "Agregar servicio"}
                onSubmit={onModalSubmit}
                size="xl"
            >
                <input ref={idRef} type="hidden" />
                
                {/* Navigation Tabs */}
                <ul className="nav nav-tabs nav-justified mb-4" role="tablist">
                    <li className="nav-item">
                        <button
                            type="button"
                            onClick={() => setActiveTab('basic')}
                            className={`nav-link ${activeTab === 'basic' ? 'active' : ''}`}
                        >
                            <i className="fa fa-info-circle me-1"></i>
                            Información Básica
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            type="button"
                            onClick={() => setActiveTab('hero')}
                            className={`nav-link ${activeTab === 'hero' ? 'active' : ''}`}
                        >
                            <i className="fa fa-image me-1"></i>
                            Sección Hero
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            type="button"
                            onClick={() => setActiveTab('content')}
                            className={`nav-link ${activeTab === 'content' ? 'active' : ''}`}
                        >
                            <i className="fa fa-list me-1"></i>
                            Contenido Dinámico
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            type="button"
                            onClick={() => setActiveTab('sections')}
                            className={`nav-link ${activeTab === 'sections' ? 'active' : ''}`}
                        >
                            <i className="fa fa-cogs me-1"></i>
                            Secciones
                        </button>
                    </li>
                </ul>

                <div className="tab-content" id="services-modal-container">
                    {/* Basic Info Tab */}
                    <div className="row" style={{ display: activeTab === 'basic' ? 'flex' : 'none' }}>
                        <div className="col-md-6">
                                <ImageFormGroup
                                    eRef={imageRef}
                                    name="image"
                                    label="Imagen del Servicio"
                                    col="col-12"
                                    aspect={1}
                                />
                                <ImageFormGroup
                                    eRef={backgroundImageRef}
                                    name="background_image"
                                    label="Imagen de Fondo"
                                    col="col-12"
                                    aspect={16 / 9}
                                />
                            </div>
                            <div className="col-md-6">
                                <SelectFormGroup
                                    eRef={categoryRef}
                                    label="Categoría"
                                    dropdownParent="#services-modal-container"
                                    onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                                >
                                    {service_categories.map((item, index) => (
                                        <option key={index} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </SelectFormGroup>
                                <SelectFormGroup
                                    eRef={subcategoryRef}
                                    label="Subcategoría"
                                    dropdownParent="#services-modal-container"
                                >
                                    {service_sub_categories
                                        .filter(sub => !selectedCategory || sub.service_category_id === selectedCategory)
                                        .map((item, index) => (
                                            <option key={index} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                </SelectFormGroup>
                                <InputFormGroup
                                    eRef={nameRef}
                                    label="Nombre del Servicio"
                                    required
                                />
                                <InputFormGroup
                                    eRef={slugRef}
                                    label="Slug (URL)"
                                    placeholder="casillero-virtual"
                                />
                                <InputFormGroup
                                    eRef={pathRef}
                                    label="Ruta (Path)"
                                    placeholder="/casillero-virtual"
                                />
                                <TextareaFormGroup
                                    eRef={descriptionRef}
                                    label="Descripción"
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Hero Section Tab */}
                    <div className="row" style={{ display: activeTab === 'hero' ? 'block' : 'none' }}>
                        <div className="col-12">
                                <div className="alert alert-info">
                                    <i className="fa fa-info-circle me-2"></i>
                                    Configura el contenido de la sección principal (Hero) de tu servicio.
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <InputFormGroup 
                                            eRef={heroTitleRef} 
                                            label="Título Principal" 
                                            placeholder="ej: Una forma Divertida de Importar"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <InputFormGroup 
                                            eRef={heroSubtitleRef} 
                                            label="Subtítulo" 
                                            placeholder="ej: Rápido | Seguro | Eficiente"
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <TextareaFormGroup 
                                            eRef={heroDescriptionRef} 
                                            label="Descripción" 
                                            rows={3}
                                            placeholder="ej: ¡Crea tu casillero AHORA mismo!"
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <InputFormGroup 
                                            eRef={heroCtaTextRef} 
                                            label="Texto del Botón CTA" 
                                            placeholder="ej: Abrir mi casillero"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <InputFormGroup 
                                            eRef={heroBackgroundImageRef} 
                                            label="Imagen de Fondo Hero" 
                                            placeholder="ej: hero-bg.jpg"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                    {/* Dynamic Content Tab */}
                    <div className="row" style={{ display: activeTab === 'content' ? 'block' : 'none' }}>
                        <div className="col-12">
                            <div className="alert alert-info mb-3">
                                <i className="fa fa-info-circle me-2"></i>
                                Configura los pasos del proceso, beneficios y características destacadas de tu servicio.
                            </div>

                            {/* Steps Section */}
                            <div className="card mb-3">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h6 className="mb-0">
                                        <i className="fa fa-shoe-prints me-2"></i>
                                        Pasos del Proceso
                                    </h6>
                                    <button 
                                        type="button" 
                                        className="btn btn-sm btn-primary"
                                        onClick={addStep}
                                    >
                                        <i className="fa fa-plus me-1"></i> Agregar Paso
                                    </button>
                                </div>
                                <div className="card-body">
                                    {steps.map((step, index) => (
                                        <div key={index} className="border rounded p-3 mb-3">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h6 className="mb-0">Paso {index + 1}</h6>
                                                <button 
                                                    type="button"
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => removeStep(index)}
                                                    disabled={steps.length === 1}
                                                >
                                                    <i className="fa fa-trash"></i>
                                                </button>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label className="form-label">Icono del Paso</label>
                                                    <div className="mb-2">
                                                        {step.image && (
                                                            <img 
                                                                src={step.image.startsWith('http') ? step.image : `/storage/images/service/${step.image}`}
                                                                alt="Preview"
                                                                className="img-thumbnail"
                                                                style={{ maxHeight: '80px', objectFit: 'cover' }}
                                                            />
                                                        )}
                                                    </div>
                                                    <input 
                                                        type="file"
                                                        className="form-control"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                // Aquí deberías subir la imagen al servidor
                                                                // Por ahora usaremos una URL temporal
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => {
                                                                    updateStep(index, 'image', reader.result);
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label">Color del Paso</label>
                                                    <input 
                                                        type="color"
                                                        className="form-control form-control-color w-100"
                                                        value={step.color || '#3b82f6'}
                                                        onChange={(e) => updateStep(index, 'color', e.target.value)}
                                                        title="Selecciona el color"
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Título</label>
                                                    <input 
                                                        type="text"
                                                        className="form-control"
                                                        value={step.title}
                                                        onChange={(e) => updateStep(index, 'title', e.target.value)}
                                                        placeholder="Título del paso"
                                                    />
                                                </div>
                                                <div className="col-12 mt-2">
                                                    <label className="form-label">Descripción</label>
                                                    <textarea 
                                                        className="form-control"
                                                        rows="2"
                                                        value={step.description}
                                                        onChange={(e) => updateStep(index, 'description', e.target.value)}
                                                        placeholder="Descripción del paso"
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Benefits Section */}
                            <div className="card mb-3">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h6 className="mb-0">
                                        <i className="fa fa-gift me-2"></i>
                                        Beneficios del Servicio
                                    </h6>
                                    <button 
                                        type="button" 
                                        className="btn btn-sm btn-primary"
                                        onClick={addBenefit}
                                    >
                                        <i className="fa fa-plus me-1"></i> Agregar Beneficio
                                    </button>
                                </div>
                                <div className="card-body">
                                    {benefits.map((benefit, index) => (
                                        <div key={index} className="border rounded p-3 mb-3">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h6 className="mb-0">Beneficio {index + 1}</h6>
                                                <button 
                                                    type="button"
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => removeBenefit(index)}
                                                    disabled={benefits.length === 1}
                                                >
                                                    <i className="fa fa-trash"></i>
                                                </button>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label className="form-label">Icono del Beneficio</label>
                                                    <div className="mb-2">
                                                        {benefit.image && (
                                                            <img 
                                                                src={benefit.image.startsWith('http') ? benefit.image : `/storage/images/service/${benefit.image}`}
                                                                alt="Preview"
                                                                className="img-thumbnail"
                                                                style={{ maxHeight: '80px', objectFit: 'cover' }}
                                                            />
                                                        )}
                                                    </div>
                                                    <input 
                                                        type="file"
                                                        className="form-control"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => {
                                                                    updateBenefit(index, 'image', reader.result);
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label">Color del Beneficio</label>
                                                    <input 
                                                        type="color"
                                                        className="form-control form-control-color w-100"
                                                        value={benefit.color || '#3b82f6'}
                                                        onChange={(e) => updateBenefit(index, 'color', e.target.value)}
                                                        title="Selecciona el color"
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Título</label>
                                                    <input 
                                                        type="text"
                                                        className="form-control"
                                                        value={benefit.title}
                                                        onChange={(e) => updateBenefit(index, 'title', e.target.value)}
                                                        placeholder="Título del beneficio"
                                                    />
                                                </div>
                                                <div className="col-12 mt-2">
                                                    <label className="form-label">Descripción</label>
                                                    <textarea 
                                                        className="form-control"
                                                        rows="2"
                                                        value={benefit.description}
                                                        onChange={(e) => updateBenefit(index, 'description', e.target.value)}
                                                        placeholder="Descripción del beneficio"
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Features Section */}
                            <div className="card mb-3">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h6 className="mb-0">
                                        <i className="fa fa-star me-2"></i>
                                        Características Destacadas
                                    </h6>
                                    <button 
                                        type="button" 
                                        className="btn btn-sm btn-primary"
                                        onClick={addFeature}
                                    >
                                        <i className="fa fa-plus me-1"></i> Agregar Característica
                                    </button>
                                </div>
                                <div className="card-body">
                                    {features.map((feature, index) => (
                                        <div key={index} className="border rounded p-3 mb-3">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h6 className="mb-0">Característica {index + 1}</h6>
                                                <button 
                                                    type="button"
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => removeFeature(index)}
                                                    disabled={features.length === 1}
                                                >
                                                    <i className="fa fa-trash"></i>
                                                </button>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <label className="form-label">Icono de la Característica</label>
                                                    <div className="mb-2">
                                                        {feature.image && (
                                                            <img 
                                                                src={feature.image.startsWith('http') ? feature.image : `/storage/images/service/${feature.image}`}
                                                                alt="Preview"
                                                                className="img-thumbnail"
                                                                style={{ maxHeight: '80px', objectFit: 'cover' }}
                                                            />
                                                        )}
                                                    </div>
                                                    <input 
                                                        type="file"
                                                        className="form-control"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => {
                                                                    updateFeature(index, 'image', reader.result);
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label">Título</label>
                                                    <input 
                                                        type="text"
                                                        className="form-control"
                                                        value={feature.title}
                                                        onChange={(e) => updateFeature(index, 'title', e.target.value)}
                                                        placeholder="Título de la característica"
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label">Descripción</label>
                                                    <input 
                                                        type="text"
                                                        className="form-control"
                                                        value={feature.description}
                                                        onChange={(e) => updateFeature(index, 'description', e.target.value)}
                                                        placeholder="Descripción de la característica"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sections Tab */}
                    <div className="row" style={{ display: activeTab === 'sections' ? 'block' : 'none' }}>
                        <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header">
                                        <h6 className="mb-0">Sección Partners</h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="alert alert-warning small">
                                            <i className="fa fa-handshake me-1"></i>
                                            Si está habilitada, mostrará la sección "¿Dónde comprar?" con los partners disponibles.
                                        </div>
                                        <div className="form-check mb-3">
                                            <input 
                                                ref={partnersEnabledRef}
                                                className="form-check-input" 
                                                type="checkbox" 
                                                id="partnersEnabled"
                                            />
                                            <label className="form-check-label" htmlFor="partnersEnabled">
                                                Habilitar sección de Partners
                                            </label>
                                        </div>
                                        <InputFormGroup 
                                            eRef={partnersTitleRef} 
                                            label="Título" 
                                            placeholder="¿Dónde comprar con este servicio?"
                                        />
                                        <TextareaFormGroup 
                                            eRef={partnersSubtitleRef} 
                                            label="Subtítulo" 
                                            rows={2}
                                            placeholder="Compra en las mejores tiendas..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header">
                                        <h6 className="mb-0">Sección Requisitos</h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="alert alert-warning small">
                                            <i className="fa fa-list me-1"></i>
                                            Para servicios que requieran mostrar requisitos específicos.
                                        </div>
                                        <div className="form-check mb-3">
                                            <input 
                                                ref={requirementsEnabledRef}
                                                className="form-check-input" 
                                                type="checkbox" 
                                                id="requirementsEnabled"
                                            />
                                            <label className="form-check-label" htmlFor="requirementsEnabled">
                                                Habilitar sección de Requisitos
                                            </label>
                                        </div>
                                        <InputFormGroup 
                                            eRef={requirementsTitleRef} 
                                            label="Título" 
                                            placeholder="Requisitos del servicio"
                                        />
                                        <TextareaFormGroup 
                                            eRef={requirementsSubtitleRef} 
                                            label="Subtítulo" 
                                            rows={2}
                                            placeholder="Información sobre los requisitos..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 mt-3">
                                <div className="card">
                                    <div className="card-header">
                                        <h6 className="mb-0">Call to Action</h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <InputFormGroup 
                                                    eRef={ctaTitleRef} 
                                                    label="Título CTA" 
                                                    placeholder="¿Listo para comenzar?"
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <InputFormGroup 
                                                    eRef={ctaSubtitleRef} 
                                                    label="Subtítulo CTA" 
                                                    placeholder="Únete a miles de usuarios..."
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <InputFormGroup 
                                                    eRef={ctaButtonTextRef} 
                                                    label="Texto del Botón" 
                                                    placeholder="Comenzar ahora"
                                                />
                                            </div>
                                        </div>
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
        <BaseAdminto {...properties} title="Servicios">
            <Services {...properties} />
        </BaseAdminto>
    );
});
