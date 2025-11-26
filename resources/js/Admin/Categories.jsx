import BaseAdminto from "@Adminto/Base";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import TextareaFormGroup from "@Adminto/form/TextareaFormGroup";
import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import Swal from "sweetalert2";
import CategoriesRest from "../Actions/Admin/CategoriesRest";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import BannersJsonEditor from "../Components/Adminto/form/BannersJsonEditor";
import Modal from "../Components/Adminto/Modal";
import Table from "../Components/Adminto/Table";
import DxButton from "../Components/dx/DxButton";
import CreateReactScript, { hasRole } from "../Utils/CreateReactScript";
import ReactAppend from "../Utils/ReactAppend";
import Fillable from "../Utils/Fillable";
import BooleanLimit from "../Utils/BooleanLimit";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
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
        bannerRef.image.src = data?.banner ? `/storage/images/category/${data.banner}` : '';
        bannerRef.current.value = null;
        imageRef.image.src = data?.image ? `/storage/images/category/${data.image}` : '';
        imageRef.current.value = null;

        // Load banners JSON
        if (bannersJsonRef.current) {
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

        // Reset delete flags using React state - only when opening modal
        if (bannerRef.resetDeleteFlag) bannerRef.resetDeleteFlag();
        if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

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
        const file = imageRef.current.files[0];
        if (file) {
            formData.append("image", file);
        }
        const file2 = bannerRef.current.files[0];
        if (file2) {
            formData.append("banner", file2);
        }

        // Add banners JSON
        if (bannersJsonRef.current) {
            formData.append('banners', bannersJsonRef.current.getValue());
            
            // Add banner images
            const bannerImages = bannersJsonRef.current.getImageFiles();
            Object.keys(bannerImages).forEach(key => {
                formData.append(key, bannerImages[key]);
            });
        }

        // Check for image deletion flags using React state
        if (bannerRef.getDeleteFlag && bannerRef.getDeleteFlag()) {
            formData.append('banner_delete', 'DELETE');
        }

        if (imageRef.getDeleteFlag && imageRef.getDeleteFlag()) {
            formData.append('image_delete', 'DELETE');
        }

        for (let [key, value] of formData.entries()) {
        }

        const result = await categoriesRest.save(formData);
        if (!result) return;

        // Reset delete flags after successful save
        if (bannerRef.resetDeleteFlag) bannerRef.resetDeleteFlag();
        if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

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
                columns={[
                    {
                        dataField: "id",
                        caption: "ID",
                        visible: false,
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
            >
                <input ref={idRef} type="hidden" />
                <div className="row" id="categories-container">
                    <div className={!Fillable.has('categories', 'banner') && !Fillable.has('categories', 'image') ? 'hidden' : 'col-md-6'}>
                        <ImageFormGroup
                            eRef={bannerRef}
                            name="banner"
                            label="Banner"
                            col="col-12"
                            aspect={3 / 1}
                            hidden={!Fillable.has('categories', 'banner')}
                        />
                        <ImageFormGroup
                            eRef={imageRef}
                            name="image"
                            label="Imagen"
                            col="col-12"
                            aspect={16 / 9}
                            hidden={!Fillable.has('categories', 'image')}
                        />

                    </div>
                    <div className={!Fillable.has('categories', 'banner') && !Fillable.has('categories', 'image') ? 'col-md-12' : 'col-md-6'}>
                        <InputFormGroup
                            eRef={nameRef}
                            label="Categoría"
                            rows={2}
                            required
                        />
                        <InputFormGroup
                            eRef={aliasRef}
                            label="Alias (Nombre para mostrar)"
                            col="col-12"
                        />
                        <TextareaFormGroup
                            eRef={descriptionRef}
                            label="Descripción"
                            rows={3}
                        />
                    </div>
                    <div className="col-12 mt-3">
                        <BannersJsonEditor
                            ref={bannersJsonRef}
                            name="banners"
                            label="Banners del Catálogo"
                            initialValue={[]}
                            model="category"
                        />
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
