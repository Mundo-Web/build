import BaseAdminto from "@Adminto/Base";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import TextareaFormGroup from "@Adminto/form/TextareaFormGroup";
import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import Swal from "sweetalert2";
import CategoriesRest from "../Actions/Admin/CategoriesRest";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import BannersJsonEditor from "../Components/Adminto/form/BannersJsonEditor";
import SelectAPIFormGroup from "../Components/Adminto/form/SelectAPIFormGroup";
import Modal from "../Components/Adminto/Modal";
import Table from "../Components/Adminto/Table";
import DxButton from "../Components/dx/DxButton";
import CreateReactScript, { hasRole } from "../Utils/CreateReactScript";
import ReactAppend from "../Utils/ReactAppend";
import Fillable from "../Utils/Fillable";
import BooleanLimit from "../Utils/BooleanLimit";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import SetSelectValue from "../Utils/SetSelectValue";
const categoriesRest = new CategoriesRest();

const Categories = () => {
    const gridRef = useRef();
    const modalRef = useRef();
    const modelKey = "categories";

    // Form elements ref
    const idRef = useRef();
    const nameRef = useRef();
    const aliasRef = useRef();
    const descriptionRef = useRef();
    const bannerRef = useRef();
    const imageRef = useRef();
    const bannersJsonRef = useRef();
    const storesRef = useRef();

    const [isEditing, setIsEditing] = useState(false);

    const onModalOpen = (data) => {
        console.log('=== onModalOpen called ===');
        console.log('Full data object:', data);
        console.log('data.banners specifically:', data?.banners);
        console.log('typeof data.banners:', typeof data?.banners);

        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        idRef.current.value = data?.id ?? "";
        nameRef.current.value = data?.name ?? "";
        aliasRef.current.value = data?.alias ?? "";
        descriptionRef.current.value = data?.description ?? "";
        
        // Validar si banner está disponible (Fillable)
        if (bannerRef.current && bannerRef.image) {
            bannerRef.image.src = data?.banner ? `/storage/images/category/${data.banner}` : '';
            bannerRef.current.value = null;
            if (bannerRef.resetDeleteFlag) bannerRef.resetDeleteFlag();
        }
        
        // Validar si image está disponible (Fillable)
        if (imageRef.current && imageRef.image) {
            imageRef.image.src = data?.image ? `/storage/images/category/${data.image}` : '';
            imageRef.current.value = null;
            if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();
        }

        // Load banners JSON (solo si está habilitado en Fillable)
        if (bannersJsonRef.current && Fillable.has('categories', 'banners')) {
            let banners = data?.banners || [];
            console.log('Categories.onModalOpen - data.banners:', data?.banners);
            console.log('Categories.onModalOpen - banners type:', typeof banners);
            // If banners is a string, parse it
            if (typeof banners === 'string') {
                try {
                    banners = JSON.parse(banners);
                } catch (e) {
                    console.error('Error parsing banners JSON:', e);
                    banners = [];
                }
            }
            console.log('Categories.onModalOpen - calling setValue with:', banners);
            bannersJsonRef.current.setValue(banners);

            // Load images AFTER setValue - wait for refs to be ready
            const tryLoadImages = (attempt = 1) => {
                console.log(`Attempt ${attempt} to load banner images...`);
                const imageRefs = bannersJsonRef.current.getImageRefs();
                console.log('imageRefs:', imageRefs);

                let allLoaded = true;
                banners.forEach((banner, index) => {
                    if (banner.image) {
                        const imgRef = imageRefs[index];
                        console.log(`Banner ${index} - Full ref:`, imgRef);
                        console.log(`Banner ${index} - imgRef.image:`, imgRef?.image);
                        console.log(`Banner ${index} - All properties:`, Object.keys(imgRef || {}));

                        if (imgRef?.image) {
                            imgRef.image.src = `/storage/images/category/${banner.image}`;
                            console.log(`✓ Loaded image for banner ${index}:`, banner.image);
                        } else {
                            allLoaded = false;
                            console.log(`✗ Ref not ready for banner ${index}`);
                        }
                    }
                });

                // Retry if not all loaded and less than 5 attempts
                if (!allLoaded && attempt < 5) {
                    setTimeout(() => tryLoadImages(attempt + 1), 300);
                }
            };

            setTimeout(() => tryLoadImages(), 500);
        }

        // Load stores (solo si está habilitado en Fillable)
        if (storesRef.current && Fillable.has('categories', 'stores')) {
            SetSelectValue(storesRef.current, data?.stores ?? [], "id", "name");
        }

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        const request = {
            id: idRef.current.value || undefined,
            name: nameRef.current.value,
            alias: aliasRef.current.value,
            description: descriptionRef.current.value,
        };

        const formData = new FormData();
        for (const key in request) {
            formData.append(key, request[key]);
        }
        
        // Validar si image está disponible (Fillable)
        if (imageRef.current && Fillable.has('categories', 'image')) {
            const file = imageRef.current.files[0];
            if (file) {
                formData.append("image", file);
            }
            // Check for image deletion flag
            if (imageRef.getDeleteFlag && imageRef.getDeleteFlag()) {
                formData.append('image_delete', 'DELETE');
            }
        }
        
        // Validar si banner está disponible (Fillable)
        if (bannerRef.current && Fillable.has('categories', 'banner')) {
            const file2 = bannerRef.current.files[0];
            if (file2) {
                formData.append("banner", file2);
            }
            // Check for banner deletion flag
            if (bannerRef.getDeleteFlag && bannerRef.getDeleteFlag()) {
                formData.append('banner_delete', 'DELETE');
            }
        }

        // Add banners JSON (solo si está habilitado en Fillable)
        if (bannersJsonRef.current && Fillable.has('categories', 'banners')) {
            formData.append('banners', bannersJsonRef.current.getValue());

            // Add banner images
            const bannerImages = bannersJsonRef.current.getImageFiles();
            Object.keys(bannerImages).forEach(key => {
                formData.append(key, bannerImages[key]);
            });
        }

        // Add stores array (solo si está habilitado en Fillable)
        if (storesRef.current && Fillable.has('categories', 'stores')) {
            const storesValue = $(storesRef.current).val();
            if (storesValue && storesValue.length > 0) {
                formData.append('stores', JSON.stringify(storesValue));
            } else {
                formData.append('stores', JSON.stringify([]));
            }
        }

        for (let [key, value] of formData.entries()) {
        }

        const result = await categoriesRest.save(formData);
        if (!result) return;

        // Reset delete flags after successful save
        if (bannerRef.current && bannerRef.resetDeleteFlag) bannerRef.resetDeleteFlag();
        if (imageRef.current && imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
    };

    const onFeaturedChange = async ({ id, value, previous }) => {
        if (value && BooleanLimit.shouldBlock(modelKey, "featured", previous)) {
            const limitInfo = BooleanLimit.get(modelKey, "featured");
            const message =
                limitInfo?.message ??
                "Se alcanzó el límite de categorías destacadas.";

            let text = message;
            if (limitInfo) {
                text += ` Actualmente hay ${limitInfo.active ?? 0} de ${limitInfo.max ?? 0} categorías activas.`;
                if (hasRole("Root") && limitInfo.general_key) {
                    text += ` Puedes ajustar el límite en Generales usando la clave ${limitInfo.general_key}.`;
                }
            }
            Swal.fire({
                icon: "warning",
                title: "Límite alcanzado",
                text,
            });
            return;
        }

        const result = await categoriesRest.boolean({
            id,
            field: "featured",
            value,
        });
        if (!result) return;

        if (BooleanLimit.has(modelKey, "featured")) {
            if (typeof result === "object" && result?.limit) {
                BooleanLimit.updateFromServer(modelKey, result);
            } else {
                BooleanLimit.applyChange(modelKey, "featured", {
                    previous,
                    next: value,
                });
            }
        }

        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onVisibleChange = async ({ id, value }) => {
        const result = await categoriesRest.boolean({
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
            text: "¿Estas seguro de eliminar este registro?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await categoriesRest.delete(row.id);
        if (!result) return;
        if (BooleanLimit.has(modelKey, "featured") && row.featured) {
            BooleanLimit.applyChange(modelKey, "featured", {
                previous: true,
                next: false,
            });
        }
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    // Función para manejar el reordering remoto
    const onReorder = async (e) => {
        // e.toIndex es la nueva posición donde se quiere insertar el elemento
        const newOrderIndex = e.toIndex;

        try {
            const result = await categoriesRest.reorder(e.itemData.id, newOrderIndex);
            if (result) {
                await e.component.refresh();
            }
        } catch (error) {
            console.error('Error reordering category:', error);
        }
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Categorías"
                rest={categoriesRest}
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
                    dropFeedbackMode: 'push'
                }}
                sorting={{
                    mode: 'single'
                }}
                columns={[
                    {
                        dataField: "id",
                        caption: "ID",
                        visible: false,
                    },
                    {
                        dataField: 'order_index',
                        caption: 'Orden',
                        visible: false,
                        sortOrder: 'asc',
                        sortIndex: 0
                    },
                    {
                        dataField: "name",
                        caption: "Categoría",
                        width: "30%",
                    },
                    {
                        dataField: "description",
                        caption: "Descripción",
                        width: "50%",
                    },
                    Fillable.has('categories', 'image') && {
                        dataField: "image",
                        caption: "Imagen",
                        width: "90px",
                        allowFiltering: false,
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <img
                                    src={`/storage/images/category/${data.image}`}
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
                    Fillable.has('categories', 'banner') && {
                        dataField: "banner",
                        caption: "Banner",
                        width: "90px",
                        allowFiltering: false,
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <img
                                    src={`/storage/images/category/${data.banner}`}
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
                        dataField: "featured",
                        caption: "Destacado",
                        dataType: "boolean",
                        cellTemplate: (container, { data }) => {
                            $(container).empty();
                            const isFeatured = data.featured == 1;
                            const hasLimit = BooleanLimit.has(modelKey, "featured");
                            const isBlocked = hasLimit && BooleanLimit.shouldBlock(modelKey, "featured", isFeatured);
                            const limitMessage = isBlocked
                                ? BooleanLimit.getMessage(modelKey, "featured")
                                : null;

                            if (limitMessage) {
                                $(container).attr("title", limitMessage);
                            } else {
                                $(container).removeAttr("title");
                            }

                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={isFeatured}
                                    disabled={isBlocked}
                                    onChange={() =>
                                        onFeaturedChange({
                                            id: data.id,
                                            value: !isFeatured,
                                            previous: isFeatured,
                                        })
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
                title={isEditing ? "Editar categoría" : "Agregar categoría"}
                onSubmit={onModalSubmit}
                size="xl"
            >
                <input ref={idRef} type="hidden" />
                
                <div id="categories-container">
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
                        {(Fillable.has('categories', 'banner') || Fillable.has('categories', 'image')) && (
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
                        {Fillable.has('categories', 'banners') && (
                            <li className="nav-item" role="presentation">
                                <button 
                                    className="nav-link" 
                                    id="banners-tab" 
                                    data-bs-toggle="pill" 
                                    data-bs-target="#banners" 
                                    type="button" 
                                    role="tab" 
                                    aria-controls="banners" 
                                    aria-selected="false"
                                    style={{
                                        borderRadius: '6px',
                                        fontWeight: '500',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <i className="fas fa-panorama me-2"></i>
                                    Banners del Catálogo
                                </button>
                            </li>
                        )}
                        {Fillable.has('categories', 'stores') && (
                            <li className="nav-item" role="presentation">
                                <button 
                                    className="nav-link" 
                                    id="stores-tab" 
                                    data-bs-toggle="pill" 
                                    data-bs-target="#stores" 
                                    type="button" 
                                    role="tab" 
                                    aria-controls="stores" 
                                    aria-selected="false"
                                    style={{
                                        borderRadius: '6px',
                                        fontWeight: '500',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <i className="fas fa-store me-2"></i>
                                    Ubicaciones
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
                                                Identificación
                                            </h6>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <InputFormGroup
                                                        eRef={nameRef}
                                                        label="Nombre de la Categoría"
                                                        placeholder="Ej: Electrónica"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <InputFormGroup
                                                        eRef={aliasRef}
                                                        label="Alias (Nombre para mostrar)"
                                                        placeholder="Ej: Tecnología y Electrónica"
                                                    />
                                                </div>
                                                <div className="col-12">
                                                    <TextareaFormGroup
                                                        eRef={descriptionRef}
                                                        label="Descripción"
                                                        rows={4}
                                                        placeholder="Descripción detallada de la categoría..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pestaña: Multimedia */}
                        {(Fillable.has('categories', 'banner') || Fillable.has('categories', 'image')) && (
                            <div className="tab-pane fade" id="multimedia" role="tabpanel" aria-labelledby="multimedia-tab">
                                <div className="row g-3">
                                    <div className="col-12">
                                        <div className="card border-0 shadow-sm">
                                            <div className="card-header bg-light">
                                                <h6 className="mb-0">
                                                    <i className="fas fa-images me-2 text-success"></i>
                                                    Imágenes Principales
                                                </h6>
                                            </div>
                                            <div className="card-body">
                                                <div className="row g-3">
                                                    {Fillable.has('categories', 'banner') && (
                                                        <div className="col-md-6">
                                                            <ImageFormGroup
                                                                eRef={bannerRef}
                                                                name="banner"
                                                                label="Banner Principal"
                                                                col="col-12"
                                                                aspect={16 / 9}
                                                            />
                                                            <small className="text-muted">
                                                                <i className="fas fa-info-circle me-1"></i>
                                                              Recomendado: 1600x900px (proporción 16:9)
                                                            </small>
                                                        </div>
                                                    )}
                                                    {Fillable.has('categories', 'image') && (
                                                        <div className="col-md-6">
                                                            <ImageFormGroup
                                                                eRef={imageRef}
                                                                name="image"
                                                                label="Imagen de Portada"
                                                                col="col-12"
                                                                aspect={16 / 9}
                                                            />
                                                            <small className="text-muted">
                                                                <i className="fas fa-info-circle me-1"></i>
                                                                Recomendado: 1600x900px (proporción 16:9)
                                                            </small>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pestaña: Banners del Catálogo */}
                        {Fillable.has('categories', 'banners') && (
                            <div className="tab-pane fade" id="banners" role="tabpanel" aria-labelledby="banners-tab">
                                <div className="row g-3">
                                    <div className="col-12">
                                        <div className="card border-0 shadow-sm">
                                            <div className="card-header bg-light">
                                                <h6 className="mb-0">
                                                    <i className="fas fa-panorama me-2 text-info"></i>
                                                    Banners Personalizados del Catálogo
                                                </h6>
                                            </div>
                                            <div className="card-body">
                                                <BannersJsonEditor
                                                    ref={bannersJsonRef}
                                                    name="banners"
                                                    label="Banners del Catálogo"
                                                    initialValue={[]}
                                                    model="category"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pestaña: Ubicaciones (Stores) */}
                        {Fillable.has('categories', 'stores') && (
                            <div className="tab-pane fade" id="stores" role="tabpanel" aria-labelledby="stores-tab">
                                <div className="row g-3">
                                    <div className="col-12">
                                        <div className="card border-0 shadow-sm">
                                            <div className="card-header bg-light">
                                                <h6 className="mb-0">
                                                    <i className="fas fa-store me-2 text-warning"></i>
                                                    Ubicaciones y Tiendas
                                                </h6>
                                            </div>
                                            <div className="card-body">
                                                <SelectAPIFormGroup
                                                    id="stores"
                                                    eRef={storesRef}
                                                    searchAPI="/api/admin/stores/paginate"
                                                    searchBy="name"
                                                    label="Ubicaciones (Tiendas)"
                                                    dropdownParent="#categories-container"
                                                    tags
                                                    multiple
                                                />
                                                <small className="text-muted mt-2 d-block">
                                                    <i className="fas fa-info-circle me-1"></i>
                                                    Selecciona las tiendas donde esta categoría estará disponible
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
        <BaseAdminto {...properties} title="Categorías">
            <Categories {...properties} />
        </BaseAdminto>
    );
});
