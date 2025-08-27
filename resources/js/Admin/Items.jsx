import BaseAdminto from "@Adminto/Base";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import TextareaFormGroup from "@Adminto/form/TextareaFormGroup";
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import Swal from "sweetalert2";
import ItemsRest from "../Actions/Admin/ItemsRest";
import Modal from "../Components/Adminto/Modal";
import Table from "../Components/Adminto/Table";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import QuillFormGroup from "../Components/Adminto/form/QuillFormGroup";
import SelectAPIFormGroup from "../Components/Adminto/form/SelectAPIFormGroup";
import SelectFormGroup from "../Components/Adminto/form/SelectFormGroup";
import DxButton from "../Components/dx/DxButton";
import CreateReactScript from "../Utils/CreateReactScript";
import Number2Currency from "../Utils/Number2Currency";
import ReactAppend from "../Utils/ReactAppend";
import SetSelectValue from "../Utils/SetSelectValue";
import ItemsGalleryRest from "../Actions/Admin/ItemsGalleryRest";
import DynamicField from "../Components/Adminto/form/DynamicField";
import ModalImportItem from "./Components/ModalImportItem";
import Fillable from "../Utils/Fillable";

const itemsRest = new ItemsRest();

const Items = ({ categories, brands, collections, stores }) => {
    //!FALTA EDIT AND DELETEDE GALERIA

    const [itemData, setItemData] = useState([]);

    const gridRef = useRef();
    const modalRef = useRef();

    // Form elements ref

    const idRef = useRef();
    const categoryRef = useRef();
    const collectionRef = useRef();
    const subcategoryRef = useRef();
    const brandRef = useRef();
    const nameRef = useRef();
    const colorRef = useRef();
    const sizeRef = useRef();
    const summaryRef = useRef();
    const priceRef = useRef();
    const discountRef = useRef();
    const tagsRef = useRef();
    const bannerRef = useRef();
    const imageRef = useRef();
    const textureRef = useRef();
    const descriptionRef = useRef();
    const skuRef = useRef();
    const pdfRef = useRef();
    // Nuevos campos

    const stockRef = useRef();
    const linkvideoRef = useRef();
    const storeRef = useRef();

    const featuresRef = useRef([]);
    const specificationsRef = useRef([]);
    const weightRef = useRef();

    const [isEditing, setIsEditing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedCollection, setSelectedCollection] = useState(null);
    const [selectedStore, setSelectedStore] = useState(null);
    const [currentPdf, setCurrentPdf] = useState("");
    /*ADD NEW LINES GALLERY */

    const [gallery, setGallery] = useState([]);
    const galleryRef = useRef();

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setGallery((prev) => [...prev, ...newImages]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        const newImages = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setGallery((prev) => [...prev, ...newImages]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const removeGalleryImage = (e, index) => {
        e.preventDefault();
        const image = gallery[index];
        if (image.id) {
            // Si la imagen tiene ID, significa que está guardada en la base de datos.
            setGallery((prev) =>
                prev.map((img, i) =>
                    i === index ? { ...img, toDelete: true } : img
                )
            );
        } else {
            // Si es una imagen nueva, simplemente la eliminamos.
            setGallery((prev) => prev.filter((_, i) => i !== index));
        }
    };

    // Funciones para drag & drop de reordenamiento
    const [draggedIndex, setDraggedIndex] = useState(null);
    
    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };
    
    const handleDragEnd = () => {
        setDraggedIndex(null);
    };
    
    const handleDragOverReorder = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };
    
    const handleDropReorder = (e, dropIndex) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === dropIndex) return;
        
        const newGallery = [...gallery];
        const draggedItem = newGallery[draggedIndex];
        
        // Remover el elemento arrastrado
        newGallery.splice(draggedIndex, 1);
        // Insertar en la nueva posición
        newGallery.splice(dropIndex, 0, draggedItem);
        
        setGallery(newGallery);
        setDraggedIndex(null);
    };

    /*************************/

    useEffect(() => {
        if (itemData && itemData.images) {
            const existingImages = itemData.images.map((img) => ({
                id: img.id, // ID de la imagen en la BD
                url: `/storage/images/item/${img.url}`, // Ruta de la imagen almacenada
            }));
            setGallery(existingImages);
        }
    }, [itemData]);

    const onModalOpen = (data) => {

        setItemData(data || null); // Guardamos los datos en el estado
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);
        setCurrentPdf(data?.pdf ? `/storage/images/item/${data.pdf}` : "");
        idRef.current.value = data?.id || "";
        $(categoryRef.current)
            .val(data?.category_id || null)
            .trigger("change");
        $(collectionRef.current)
            .val(data?.collection_id || null)
            .trigger("change");
        SetSelectValue(
            subcategoryRef.current,
            data?.subcategory?.id,
            data?.subcategory?.name
        );
        $(brandRef.current)
            .val(data?.brand_id || null)
            .trigger("change");

        console.log("data item:", data)
        $(storeRef.current)
            .val(data?.store_id && data.store_id !== "" ? data.store_id : "")
            .trigger("change");

        nameRef.current.value = data?.name || "";
        skuRef.current.value = data?.sku || "";
        colorRef.current.value = data?.color || "";
        sizeRef.current.value = data?.size || "";
        summaryRef.current.value = data?.summary || "";
        linkvideoRef.current.value = data?.linkvideo || "";
        priceRef.current.value = data?.price || 0;
        discountRef.current.value = data?.discount || 0;
        weightRef.current.value = data?.weight || 0;


        SetSelectValue(tagsRef.current, data?.tags ?? [], "id", "name");

        bannerRef.current.value = null;

        imageRef.current.value = null;



        bannerRef.image.src = data?.banner ? `/storage/images/item/${data.banner}` : '';

        imageRef.image.src = data?.image ? `/storage/images/item/${data.image}` : '';

        textureRef.image.src = data?.texture ? `/storage/images/item/${data.texture}` : '';

        setCurrentPdf(data?.pdf ? `/storage/images/item/${data?.pdf}` : "");

        descriptionRef.editor.root.innerHTML = data?.description ?? "";

        //TODO: Cargar las imágenes existentes de la galería

        // Cargar las imágenes de la galería
        if (data?.images) {
            const existingImages = data.images.map((img) => ({
                id: img.id, // ID de la imagen en la base de datos
                url: `/storage/images/item/${img.url}`, // Ruta de la imagen almacenada
            }));
            setGallery(existingImages);
        } else {
            setGallery([]); // Limpiar la galería si no hay imágenes
        }

        if (data?.specifications) {
            setSpecifications(data.specifications.map(spec => ({
                type: spec.type,
                title: spec.title,
                description: spec.description,
                image: spec.image || "",
            })));
        } else {
            setSpecifications([]);
        }

        // Nuevos campos
        setFeatures(data?.features?.map(f => typeof f === 'object' ? f : { feature: f }) || []);
        stockRef.current.value = data?.stock;

        // Reset delete flags using direct references - only when opening modal
        if (bannerRef.deleteRef) bannerRef.deleteRef.value = '';
        if (imageRef.deleteRef) imageRef.deleteRef.value = '';
        if (textureRef.deleteRef) textureRef.deleteRef.value = '';

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        // Limpia características vacías
        const cleanFeatures = features.filter(f => {
            if (typeof f === 'string') return f.trim() !== '';
            if (typeof f === 'object') return f.feature?.trim() !== '';
            return false;
        });

        // Limpia especificaciones vacías
        const cleanSpecs = specifications.filter(s =>
            (s.title && s.title.trim() !== '') ||
            (s.description && s.description.trim() !== '')
        );

        const request = {
            id: idRef.current.value || undefined,
            category_id: categoryRef.current.value,
            collection_id: collectionRef.current.value || null,
            subcategory_id: subcategoryRef.current.value,
            brand_id: brandRef.current.value,
            name: nameRef.current.value,
            sku: skuRef.current.value,
            color: colorRef.current.value,
            size: sizeRef.current.value,
            summary: summaryRef.current.value,
            price: priceRef.current.value,
            discount: discountRef.current.value,
            tags: $(tagsRef.current).val(),
            description: descriptionRef.current.value,
            stock: stockRef.current.value || 0,
            features: cleanFeatures,
            specifications: cleanSpecs,
            linkvideo: linkvideoRef.current.value,
            weight: weightRef.current.value || 0,
            store_id: storeRef.current.value && storeRef.current.value !== "" ? storeRef.current.value : null,
        };



        const formData = new FormData();

        for (const key in request) {
            if (key === 'features' || key === 'specifications') {
                formData.append(key, JSON.stringify(request[key]));
            } else if (key === 'tags') {
                // Asegurar que tags sea un array
                const tagsValue = request[key];
                if (Array.isArray(tagsValue)) {
                    tagsValue.forEach((tag, index) => {
                        formData.append(`tags[${index}]`, tag);
                    });
                } else if (tagsValue) {
                    // Si no es array pero tiene valor, convertir a array
                    formData.append('tags[0]', tagsValue);
                }
            } else {
                formData.append(key, request[key]);
            }
        }

        const image = imageRef.current.files[0];
        if (image) {
            formData.append("image", image);
        }
        const texture = textureRef.current.files[0];
        if (texture) {
            formData.append("texture", texture);
        }
        const banner = bannerRef.current.files[0];
        if (banner) {
            formData.append("banner", banner);
        }

        const pdf = pdfRef.current.files[0];

        if (pdf) {
            formData.append("pdf", pdf);
        }

        // Check for image deletion flags using React state
        console.log('Checking delete flags:');
        console.log('bannerRef.getDeleteFlag():', bannerRef.getDeleteFlag?.());
        console.log('imageRef.getDeleteFlag():', imageRef.getDeleteFlag?.());
        console.log('textureRef.getDeleteFlag():', textureRef.getDeleteFlag?.());

        if (bannerRef.getDeleteFlag && bannerRef.getDeleteFlag()) {
            formData.append('banner_delete', 'DELETE');
            console.log('Adding banner delete flag: DELETE');
        }

        if (imageRef.getDeleteFlag && imageRef.getDeleteFlag()) {
            formData.append('image_delete', 'DELETE');
            console.log('Adding image delete flag: DELETE');
        }

        if (textureRef.getDeleteFlag && textureRef.getDeleteFlag()) {
            formData.append('texture_delete', 'DELETE');
            console.log('Adding texture delete flag: DELETE');
        }

        //TODO: Preparar los datos de la galería

        // Galería - Separar imágenes nuevas y existentes
        let galleryIndex = 0;
        let galleryIdsIndex = 0;
        
        // Crear array con el orden de las imágenes (solo las no marcadas para eliminar)
        const galleryOrder = [];
        
        gallery.forEach((img, index) => {
            if (!img.toDelete) {
                if (img.file) {
                    formData.append(`gallery[${galleryIndex}]`, img.file); // Imágenes nuevas
                    galleryOrder.push({ type: 'new', index: galleryIndex });
                    galleryIndex++;
                } else {
                    formData.append(`gallery_ids[${galleryIdsIndex}]`, img.id); // IDs de imágenes existentes
                    galleryOrder.push({ type: 'existing', id: img.id, index: galleryIdsIndex });
                    galleryIdsIndex++;
                }
            }
        });
        
        // Enviar el orden de la galería al backend
        if (galleryOrder.length > 0) {
            formData.append('gallery_order', JSON.stringify(galleryOrder));
        }

        const deletedImages = gallery
            .filter((img) => img.toDelete)
            .map((img) => img.id); // Mantener como UUID strings
        if (deletedImages.length > 0) {
            deletedImages.forEach((id, index) => {
                formData.append(`deleted_images[${index}]`, id); // Enviar cada ID por separado
            });
        }

        // Debug: Log all FormData entries
        console.log('FormData contents:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        const result = await itemsRest.save(formData);
        if (!result) return;

        // Reset delete flags after successful save
        if (bannerRef.resetDeleteFlag) bannerRef.resetDeleteFlag();
        if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();
        if (textureRef.resetDeleteFlag) textureRef.resetDeleteFlag();

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
        setGallery([]);
    };

    const onVisibleChange = async ({ id, value }) => {
        const result = await itemsRest.boolean({ id, field: "visible", value });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onBooleanChange = async ({ id, field, value }) => {
        const result = await itemsRest.boolean({ id, field, value });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar item",
            text: "¿Estás seguro de eliminar este item?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await itemsRest.delete(id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };
    const [features, setFeatures] = useState([]); // Características
    const [specifications, setSpecifications] = useState([]); // Especificaciones

    // Opciones del campo "type"
    const typeOptions = ["Principal", "General"];
    const [showImportModal, setShowImportModal] = useState(false);
    const modalImportRef = useRef();
    const onModalImportOpen = () => {
        $(modalImportRef.current).modal("show");
    };
    return (
        <>
            <Table
                gridRef={gridRef}
                title="Items"
                rest={itemsRest}
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
                            text: "Agregar",
                            hint: "Agregar",
                            onClick: () => onModalOpen(),
                        },
                    });
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "upload",
                            text: "Importar Datos",
                            hint: "Importar Datos",
                            onClick: () => onModalImportOpen(),
                        },
                    });
                }}
                exportable={true}
                exportableName="Items"
                columns={[
                    {
                        dataField: "id",
                        caption: "ID",
                        visible: false,
                    },
                    Fillable.has('items', 'category_id') && {
                        dataField: "category.name",
                        caption: "Categoría",
                        width: "120px",
                        cellTemplate: (container, { data }) => {
                            container.html(
                                renderToString(
                                    <>
                                        <b className="d-block fst-italic text-muted">
                                            {data.collection?.name}
                                        </b>
                                        <b className="d-block">
                                            {data.category?.name}
                                        </b>
                                        <small className="text-muted">
                                            {data.subcategory?.name}
                                        </small>
                                    </>
                                )
                            );
                        },
                    },
                    Fillable.has('items', 'subcategory_id') && {
                        dataField: "subcategory.name",
                        caption: "Subcategoría",
                        visible: false,
                    },
                    Fillable.has('items', 'brand_id') && {
                        dataField: "brand.name",
                        caption: "Marca",
                        width: "120px",
                    },
                    {
                        dataField: "name",
                        caption: "Nombre",
                        minWidth: "300px",
                        cellTemplate: (container, { data }) => {

                            const truncateWords = (text, maxWords) => {
                                if (!text) return '';
                                const words = text.split(' ');
                                if (words.length > maxWords) {
                                    return words.slice(0, maxWords).join(' ') + '...';
                                }
                                return text;
                            };

                            const truncatedSummary = truncateWords(data.summary, 12);

                            container.html(
                                renderToString(
                                    <>
                                        <b>{data.name}</b>
                                        <br />
                                        <span>
                                            {truncatedSummary}
                                        </span>
                                    </>
                                )
                            );
                        },
                    },
                    {
                        dataField: "final_price",
                        caption: "Precio",
                        dataType: "number",
                        width: "75px",
                        cellTemplate: (container, { data }) => {
                            container.html(
                                renderToString(
                                    <>
                                        {data.discount > 0 && (
                                            <small
                                                className="d-block text-muted"
                                                style={{
                                                    textDecoration:
                                                        "line-through",
                                                }}
                                            >
                                                S/.{Number2Currency(data.price)}
                                            </small>
                                        )}
                                        <span>
                                            S/.
                                            {Number2Currency(
                                                data.discount > 0
                                                    ? data.discount
                                                    : data.price
                                            )}
                                        </span>
                                    </>
                                )
                            );
                        },
                    },
                    Fillable.has('items', 'weight') && {
                        dataField: "weight",
                        caption: "Peso",
                        dataType: "number",
                        width: "75px",
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
                                    src={`/storage/images/item/${data.image}`}
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
                    Fillable.has('items', 'is_new') && {
                        dataField: "is_new",
                        caption: "Nuevo",
                        dataType: "boolean",
                        width: "80px",
                        cellTemplate: (container, { data }) => {
                            const is_newValue = data.is_new === 1 || data.is_new === '1' || data.is_new === true;
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={is_newValue}
                                    onChange={(e) =>
                                        onBooleanChange({
                                            id: data.id,
                                            field: "is_new",
                                            value: e.target.checked ? 1 : 0,
                                        })
                                    }
                                />
                            );
                        },
                    },
                    Fillable.has('items', 'offering') && {
                        dataField: "offering",
                        caption: "En oferta",
                        dataType: "boolean",
                        width: "80px",
                        cellTemplate: (container, { data }) => {
                            const offeringValue = data.offering === 1 || data.offering === '1' || data.offering === true;
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={offeringValue}
                                    onChange={(e) =>
                                        onBooleanChange({
                                            id: data.id,
                                            field: "offering",
                                            value: e.target.checked ? 1 : 0,
                                        })
                                    }
                                />
                            );
                        },
                    },
                    Fillable.has('items', 'recommended') && {
                        dataField: "recommended",
                        caption: "Recomendado",
                        dataType: "boolean",
                        width: "80px",
                        cellTemplate: (container, { data }) => {
                            const recommendedValue = data.recommended === 1 || data.recommended === '1' || data.recommended === true;
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={recommendedValue}
                                    onChange={(e) =>
                                        onBooleanChange({
                                            id: data.id,
                                            field: "recommended",
                                            value: e.target.checked ? 1 : 0,
                                        })
                                    }
                                />
                            );
                        },
                    },
                    Fillable.has('items', 'featured') && {
                        dataField: "featured",
                        caption: "Destacado",
                        dataType: "boolean",
                        width: "80px",
                        cellTemplate: (container, { data }) => {
                            const featuredValue = data.featured === 1 || data.featured === '1' || data.featured === true;

                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={featuredValue}
                                    onChange={(e) =>
                                        onBooleanChange({
                                            id: data.id,
                                            field: "featured",
                                            value: e.target.checked ? 1 : 0,
                                        })
                                    }
                                />
                            );
                        },
                    },
                    Fillable.has('items', 'visible') && {
                        dataField: "visible",
                        caption: "Visible",
                        dataType: "boolean",
                        width: "80px",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={data.visible}
                                    onChange={(e) =>
                                        onVisibleChange({
                                            id: data.id,
                                            value: e.target.checked,
                                        })
                                    }
                                />
                            );
                        },
                    },
                    {
                        caption: "Acciones",
                        width: "100px",
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
                                    onClick: () => onDeleteClicked(data.id),
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
                title={isEditing ? "Editar item" : "Agregar item"}
                onSubmit={onModalSubmit}
                size="xl"
            >
                <div id="principal-container">
                    <input ref={idRef} type="hidden" />
                    
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
                        <li className="nav-item" role="presentation">
                            <button 
                                className="nav-link" 
                                id="pricing-tab" 
                                data-bs-toggle="pill" 
                                data-bs-target="#pricing" 
                                type="button" 
                                role="tab" 
                                aria-controls="pricing" 
                                aria-selected="false"
                                style={{
                                    borderRadius: '6px',
                                    fontWeight: '500',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <i className="fas fa-dollar-sign me-2"></i>
                                Precios y Stock
                            </button>
                        </li>
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
                        <li className="nav-item" role="presentation">
                            <button 
                                className="nav-link" 
                                id="features-tab" 
                                data-bs-toggle="pill" 
                                data-bs-target="#features" 
                                type="button" 
                                role="tab" 
                                aria-controls="features" 
                                aria-selected="false"
                                style={{
                                    borderRadius: '6px',
                                    fontWeight: '500',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <i className="fas fa-list-ul me-2"></i>
                                Características
                            </button>
                        </li>
                    </ul>

                    {/* Contenido de las Pestañas */}
                    <div className="tab-content">
                        {/* Pestaña: Información Básica */}
                        <div className="tab-pane fade show active" id="basic-info" role="tabpanel" aria-labelledby="basic-info-tab">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-header">
                                            <h6 className="mb-0"><i className="fas fa-tag me-2"></i>Identificación</h6>
                                        </div>
                                        <div className="card-body">
                                            <InputFormGroup
                                                eRef={skuRef}
                                                label="SKU"
                                                required
                                                hidden={!Fillable.has('items', 'sku')}
                                            />
                                            <InputFormGroup
                                                eRef={nameRef}
                                                label="Nombre del Producto"
                                                required
                                                hidden={!Fillable.has('items', 'name')}
                                            />
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <InputFormGroup
                                                        eRef={colorRef}
                                                        label="Color"
                                                        required
                                                        hidden={!Fillable.has('items', 'color')}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <InputFormGroup
                                                        eRef={sizeRef}
                                                        label="Talla"
                                                        required
                                                        hidden={!Fillable.has('items', 'size')}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <InputFormGroup
                                                        eRef={weightRef}
                                                        label="Peso"
                                                        
                                                        hidden={!Fillable.has('items', 'weight')}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="col-md-6">
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-header">
                                            <h6 className="mb-0"><i className="fas fa-sitemap me-2"></i>Categorización</h6>
                                        </div>
                                        <div className="card-body">
                                            <SelectFormGroup
                                                eRef={categoryRef}
                                                label="Categoría"
                                                required
                                                dropdownParent="#principal-container"
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                hidden={!Fillable.has('items', 'category_id')}
                                            >
                                                {categories.map((item, index) => (
                                                    <option key={index} value={item.id}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </SelectFormGroup>
                                            
                                            <SelectFormGroup
                                                eRef={collectionRef}
                                                label="Colección"
                                                dropdownParent="#principal-container"
                                                onChange={(e) => setSelectedCollection(e.target.value)}
                                                hidden={!Fillable.has('items', 'collection_id')}
                                            >
                                                {collections.map((item, index) => (
                                                    <option key={index} value={item.id}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </SelectFormGroup>
                                            
                                            <SelectAPIFormGroup
                                                eRef={subcategoryRef}
                                                label="Subcategoría"
                                                searchAPI="/api/admin/subcategories/paginate"
                                                searchBy="name"
                                                filter={["category_id", "=", selectedCategory]}
                                                dropdownParent="#principal-container"
                                                hidden={!Fillable.has('items', 'subcategory_id')}
                                            />
                                            
                                            <SelectFormGroup
                                                eRef={brandRef}
                                                label="Marca"
                                                dropdownParent="#principal-container"
                                                hidden={!Fillable.has('items', 'brand_id')}
                                            >
                                                {brands.map((item, index) => (
                                                    <option key={index} value={item.id}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </SelectFormGroup>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="col-12">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-header">
                                            <h6 className="mb-0"><i className="fas fa-align-left me-2"></i>Descripción</h6>
                                        </div>
                                        <div className="card-body">
                                            <TextareaFormGroup
                                                eRef={summaryRef}
                                                label="Resumen"
                                                rows={3}
                                                hidden={!Fillable.has('items', 'summary')}
                                            />
                                            
                                            <SelectFormGroup
                                                eRef={storeRef}
                                                label="Tienda"
                                                dropdownParent="#principal-container"
                                                onChange={(e) => setSelectedStore(e.target.value)}
                                                hidden={!Fillable.has('items', 'store_id')}
                                            >
                                                <option value="">Seleccionar tienda (opcional)</option>
                                                {stores.map((item, index) => (
                                                    <option key={index} value={item.id}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </SelectFormGroup>
                                            
                                            <SelectAPIFormGroup
                                                id="tags"
                                                eRef={tagsRef}
                                                searchAPI={"/api/admin/tags/paginate"}
                                                searchBy="name"
                                                label="Tags"
                                                dropdownParent="#principal-container"
                                                tags
                                                multiple
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pestaña: Precios y Stock */}
                        <div className="tab-pane fade" id="pricing" role="tabpanel" aria-labelledby="pricing-tab">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-header">
                                            <h6 className="mb-0"><i className="fas fa-dollar-sign me-2"></i>Precios</h6>
                                        </div>
                                        <div className="card-body">
                                            <InputFormGroup
                                                eRef={priceRef}
                                                label="Precio Regular"
                                                type="number"
                                                step="0.01"
                                                required
                                                hidden={!Fillable.has('items', 'price')}
                                            />
                                            <InputFormGroup
                                                eRef={discountRef}
                                                label="Precio con Descuento"
                                                type="number"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="col-md-6">
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-header">
                                            <h6 className="mb-0"><i className="fas fa-boxes me-2"></i>Inventario</h6>
                                        </div>
                                        <div className="card-body">
                                            <InputFormGroup
                                                label="Stock Disponible"
                                                eRef={stockRef}
                                                type="number"
                                                required
                                                hidden={!Fillable.has('items', 'stock')}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pestaña: Multimedia */}
                        <div className="tab-pane fade" id="multimedia" role="tabpanel" aria-labelledby="multimedia-tab">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-header">
                                            <h6 className="mb-0"><i className="fas fa-image me-2"></i>Imágenes Principales</h6>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <ImageFormGroup
                                                    eRef={bannerRef}
                                                    name="banner"
                                                    label="Banner"
                                                    aspect={2 / 1}
                                                    col="col-12"
                                                    hidden={!Fillable.has('items', 'banner')}
                                                />
                                                <ImageFormGroup
                                                    eRef={imageRef}
                                                    name="image"
                                                    label="Imagen Principal"
                                                    aspect={1}
                                                    col="col-md-6"
                                                    hidden={!Fillable.has('items', 'image')}
                                                />
                                                <ImageFormGroup
                                                    eRef={textureRef}
                                                    name="texture"
                                                    label="Textura"
                                                    aspect={1}
                                                    col="col-md-6"
                                                    hidden={!Fillable.has('items', 'texture')}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="col-md-6">
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-header">
                                            <h6 className="mb-0"><i className="fas fa-photo-video me-2"></i>Galería y Multimedia</h6>
                                        </div>
                                        <div className="card-body">
                                            {/* Galería de Imágenes */}
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold text-dark mb-3">
                                                    <i className="fas fa-images me-2 text-primary"></i>
                                                    Galería de Imágenes
                                                    {gallery.filter(img => !img.toDelete).length > 0 && (
                                                        <span className="badge bg-primary ms-2">
                                                            {gallery.filter(img => !img.toDelete).length}
                                                        </span>
                                                    )}
                                                </label>
                                                
                                                <input
                                                    id="input-item-gallery"
                                                    ref={galleryRef}
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    hidden
                                                    onChange={handleGalleryChange}
                                                />
                                                
                                                {/* Contenedor de la galería con grid responsive */}
                                                <div className="gallery-container" style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                                    gap: '16px',
                                                    padding: '16px',
                                                    backgroundColor: '#f8f9fa',
                                                    borderRadius: '12px',
                                                    border: '2px dashed #dee2e6',
                                                    minHeight: '160px'
                                                }}>
                                                    {/* Imágenes existentes con drag & drop */}
                                                    {gallery.filter(image => !image.toDelete).map((image, index) => {
                                                        const originalIndex = gallery.findIndex(img => img === image);
                                                        const displayIndex = index + 1;
                                                        return (
                                                            <div
                                                                key={originalIndex}
                                                                className="gallery-item position-relative"
                                                                draggable
                                                                onDragStart={(e) => handleDragStart(e, originalIndex)}
                                                                onDragEnd={handleDragEnd}
                                                                onDragOver={handleDragOverReorder}
                                                                onDrop={(e) => handleDropReorder(e, originalIndex)}
                                                                style={{
                                                                    aspectRatio: '1',
                                                                    borderRadius: '12px',
                                                                    overflow: 'hidden',
                                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                                    transition: 'all 0.3s ease',
                                                                    cursor: 'grab',
                                                                    transform: draggedIndex === originalIndex ? 'scale(1.05)' : 'scale(1)',
                                                                    opacity: draggedIndex === originalIndex ? 0.8 : 1,
                                                                    border: '3px solid transparent',
                                                                    background: 'white'
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    if (draggedIndex === null) {
                                                                        e.currentTarget.style.transform = 'scale(1.02)';
                                                                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
                                                                    }
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    if (draggedIndex === null) {
                                                                        e.currentTarget.style.transform = 'scale(1)';
                                                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                                                    }
                                                                }}
                                                            >
                                                                {/* Indicador de posición */}
                                                                <div className="position-absolute top-0 start-0 m-2">
                                                                    <span className="badge bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{
                                                                        width: '24px',
                                                                        height: '24px',
                                                                        fontSize: '11px',
                                                                        fontWeight: 'bold'
                                                                    }}>
                                                                        {displayIndex}
                                                                    </span>
                                                                </div>
                                                                
                                                                {/* Imagen */}
                                                                <img
                                                                    src={image.url}
                                                                    alt={`Imagen ${displayIndex}`}
                                                                    className="w-100 h-100"
                                                                    style={{
                                                                        objectFit: 'cover',
                                                                        pointerEvents: 'none'
                                                                    }}
                                                                />
                                                                
                                                                {/* Overlay con controles */}
                                                                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{
                                                                    background: 'rgba(0,0,0,0.7)',
                                                                    opacity: 0,
                                                                    transition: 'opacity 0.3s ease'
                                                                }} onMouseEnter={(e) => e.currentTarget.style.opacity = 1} onMouseLeave={(e) => e.currentTarget.style.opacity = 0}>
                                                                    <div className="d-flex gap-2">
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
                                                                            style={{ width: '32px', height: '32px' }}
                                                                            title="Mover imagen"
                                                                        >
                                                                            <i className="fas fa-arrows-alt text-dark"></i>
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-danger btn-sm rounded-circle d-flex align-items-center justify-content-center"
                                                                            style={{ width: '32px', height: '32px' }}
                                                                            onClick={(e) => removeGalleryImage(e, originalIndex)}
                                                                            title="Eliminar imagen"
                                                                        >
                                                                            <i className="fas fa-trash text-white"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                    
                                                    {/* Botón de agregar imagen mejorado */}
                                                    <div
                                                        className="gallery-add-button d-flex flex-column align-items-center justify-content-center"
                                                        style={{
                                                            aspectRatio: '1',
                                                            border: '3px dashed #71b6f9',
                                                            borderRadius: '12px',
                                                            backgroundColor: 'rgba(13, 110, 253, 0.05)',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.3s ease',
                                                            minHeight: '120px'
                                                        }}
                                                        onClick={() => galleryRef.current.click()}
                                                        onDrop={handleDrop}
                                                        onDragOver={handleDragOver}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.backgroundColor = 'rgba(13, 110, 253, 0.1)';
                                                            e.currentTarget.style.borderColor = '#0056b3';
                                                            e.currentTarget.style.transform = 'scale(1.02)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.backgroundColor = 'rgba(13, 110, 253, 0.05)';
                                                            e.currentTarget.style.borderColor = '#0d6efd';
                                                            e.currentTarget.style.transform = 'scale(1)';
                                                        }}
                                                    >
                                                        <div className="text-center">
                                                            <div className="mb-2 bg-primary" style={{
                                                                width: '48px',
                                                                height: '48px',
                                                               
                                                                borderRadius: '50%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                margin: '0 auto'
                                                            }}>
                                                                <i className="fas fa-plus text-white fa-lg"></i>
                                                            </div>
                                                            <p className="mb-0 text-primary fw-semibold" style={{ fontSize: '12px' }}>
                                                                Agregar Imagen
                                                            </p>
                                                            <small className="text-muted" style={{ fontSize: '10px' }}>
                                                                Arrastra o haz clic
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Mensaje cuando no hay imágenes */}
                                                {gallery.filter(img => !img.toDelete).length === 0 && (
                                                    <div className="text-center py-4 text-muted">
                                                        <i className="fas fa-images fa-3x mb-3 opacity-50"></i>
                                                        <p className="mb-1">No hay imágenes en la galería</p>
                                                        <small>Arrastra archivos aquí o haz clic en "Agregar Imagen"</small>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Video Link */}
                                            <InputFormGroup
                                                eRef={linkvideoRef}
                                                label="Link de Video"
                                                placeholder="https://youtube.com/watch?v=..."
                                                hidden={!Fillable.has('items', 'linkvideo')}
                                            />
                                            
                                            {/* PDF */}
                                            <div className="mb-3" hidden={!Fillable.has('items', 'pdf')}>
                                                <label className="form-label fw-bold">Archivo PDF</label>
                                                <input
                                                    ref={pdfRef}
                                                    type="file"
                                                    className="form-control"
                                                    accept=".pdf"
                                                />
                                                <small className="text-muted">Catálogo, manual o documento relacionado</small>
                                                
                                                {currentPdf && (
                                                    <div className="mt-2">
                                                        <a
                                                            href={currentPdf}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-sm btn-outline-primary"
                                                        >
                                                            <i className="fas fa-file-pdf me-1"></i> Ver PDF actual
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pestaña: Características */}
                        <div className="tab-pane fade" id="features" role="tabpanel" aria-labelledby="features-tab">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-header">
                                            <h6 className="mb-0"><i className="fas fa-list-ul me-2"></i>Características</h6>
                                        </div>
                                        <div className="card-body">
                                            <DynamicField
                                                ref={featuresRef}
                                                label="Lista de Características"
                                                structure=""
                                                value={features}
                                                onChange={setFeatures}
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="col-md-6">
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-header">
                                            <h6 className="mb-0"><i className="fas fa-cogs me-2"></i>Especificaciones</h6>
                                        </div>
                                        <div className="card-body">
                                            <DynamicField
                                                ref={specificationsRef}
                                                label="Especificaciones Técnicas"
                                                structure={{ type: "", title: "", description: "" }}
                                                value={specifications}
                                                onChange={setSpecifications}
                                                typeOptions={typeOptions}
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="col-12">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-header">
                                            <h6 className="mb-0"><i className="fas fa-edit me-2"></i>Descripción Detallada</h6>
                                        </div>
                                        <div className="card-body">
                                            <QuillFormGroup eRef={descriptionRef} label="Descripción Completa" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal modalRef={modalImportRef} title={"Importar Datos"} size="sm">
                <ModalImportItem gridRef={gridRef} modalRef={modalImportRef} />
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Items">
            <Items {...properties} />
        </BaseAdminto>
    );
});
