import BaseAdminto from "@Adminto/Base";
import TextareaFormGroup from "@Adminto/form/TextareaFormGroup";
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import Swal from "sweetalert2";
import BannersRest from "../Actions/Admin/BannersRest";
import SystemRest from "../Actions/Admin/SystemRest";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import SwitchFormGroup from "../Components/Adminto/form/SwitchFormGroup";
import SelectFormGroup from "../Components/Adminto/form/SelectFormGroup";
import Modal from "../Components/Adminto/Modal";
import Table from "../Components/Adminto/Table";
import DxButton from "../Components/dx/DxButton";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import CreateReactScript from "../Utils/CreateReactScript";
import ReactAppend from "../Utils/ReactAppend";
import SortByAfterField from "../Utils/SortByAfterField";

const bannersRest = new BannersRest();
const systemRest = new SystemRest();

const Banners = ({ pages, systems: systemsFromProps = [] }) => {
    const gridRef = useRef();
    const modalRef = useRef();

    // Form elements ref
    const idRef = useRef();
    const nameRef = useRef();
    const descriptionRef = useRef();
    const backgroundRef = useRef();
    const imageRef = useRef();
    const buttonTextRef = useRef();
    const buttonLinkRef = useRef();
    const absoluteRef = useRef();
    const pageIdRef = useRef();
    const afterComponentRef = useRef();
    const bannerTypeRef = useRef();

    const [isEditing, setIsEditing] = useState(false);
    const [systems, setSystems] = useState(systemsFromProps);
    const [availableComponents, setAvailableComponents] = useState([]);
    const [selectedPageId, setSelectedPageId] = useState("");

    // Tipos de banners disponibles - basados en components.json
    const bannerTypes = [
        { id: 'BannerSimple', name: 'Banner Simple', icon: 'mdi mdi-image-size-select-large' },
        { id: 'BannerAd', name: 'Banner Ad', icon: 'mdi mdi-google-ads' },
        { id: 'BannerFullWidth', name: 'Banner Full Width', icon: 'mdi mdi-view-carousel' },
        { id: 'BannerFlex', name: 'Banner Flex', icon: 'mdi mdi-view-split-vertical' },
        { id: 'BannerPublicitario', name: 'Banner Publicitario', icon: 'mdi mdi-bullhorn' },
        { id: 'BannerPublicitarioPaani', name: 'Banner Publicitario Paani', icon: 'mdi mdi-bullhorn-variant' },
        { id: 'BannerPostSuscriptionPaani', name: 'Banner Post Suscripción Paani', icon: 'mdi mdi-email-newsletter' },
        { id: 'BannerStatic', name: 'Banner Static', icon: 'mdi mdi-image-frame' },
        { id: 'BannerStaticSecond', name: 'Banner Static Second', icon: 'mdi mdi-image-multiple' },
        { id: 'BannerSimpleSF', name: 'Banner Simple SF', icon: 'mdi mdi-image-outline' },
        { id: 'BannerSimpleD2', name: 'Banner Simple D2', icon: 'mdi mdi-image' },
        { id: 'BannerBananaLab', name: 'Banner Banana Lab', icon: 'mdi mdi-fruit-grapes' },
        { id: 'BannerCTAMakita', name: 'Banner CTA Makita', icon: 'mdi mdi-call-to-action' },
        { id: 'BannerContactMakita', name: 'Banner Contact Makita', icon: 'mdi mdi-contact-mail' },
        { id: 'BannerPidelo', name: 'Banner Pidelo', icon: 'mdi mdi-shopping' },
        { id: 'BannerMultivet', name: 'Banner Multivet', icon: 'mdi mdi-medical-bag' },
        { id: 'BannerPublicitarioKatya', name: 'Banner Publicitario Katya', icon: 'mdi mdi-account-star' },
        { id: 'BannerBlogSectionKatya', name: 'Banner Blog Section Katya', icon: 'mdi mdi-post' }
    ];

    // EXACTAMENTE como System.jsx - usar los datos que ya tenemos
    const loadPageComponents = (pageId) => {
        // System.jsx línea 263: SortByAfterField(systems).filter(x => x.page_id == null)
        // System.jsx línea 306: SortByAfterField(systems).filter(x => x.page_id == page.id)
        
        // Filtrar primero y luego ordenar con SortByAfterField como hace System.jsx
        const filteredSystems = systems.filter(s => 
            s.page_id === (pageId || null)
        );
        
        // ORDENAR igual que System.jsx para que el select muestre en orden correcto
        const orderedComponents = SortByAfterField(filteredSystems);
        
      /*  console.log('📋 Loading page components (como System.jsx):', {
            pageId: pageId || 'Base Template',
            totalComponents: filteredSystems.length,
            orderedComponents: orderedComponents.map(c => ({ 
                id: c.id, 
                name: c.name, 
                component: c.component,
                after_component: c.after_component 
            }))
        });*/
        
        setAvailableComponents(orderedComponents);
    };

    useEffect(() => {
        loadPageComponents();
    }, []);

    useEffect(() => {
        loadPageComponents(selectedPageId);
    }, [selectedPageId, systems]); // Agregar systems como dependencia

    const onModalOpen = (banner) => {
        if (banner?.id) setIsEditing(true);
        else setIsEditing(false);

        const bannerData = banner?.data || {};

        idRef.current.value = banner?.id ?? "";
        nameRef.current.value = bannerData.name ?? "";
        descriptionRef.current.value = bannerData.description ?? "";
        
        // Establecer imágenes siguiendo el patrón de Categories.jsx
        backgroundRef.image.src = bannerData.background ? `/storage/images/system/${bannerData.background}` : '';
        backgroundRef.current.value = null;
        imageRef.image.src = bannerData.image ? `/storage/images/system/${bannerData.image}` : '';
        imageRef.current.value = null;

        // Reset delete flags using the same pattern as Categories.jsx
        if (backgroundRef.resetDeleteFlag) backgroundRef.resetDeleteFlag();
        if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

        buttonTextRef.current.value = bannerData.button_text ?? "";
        buttonLinkRef.current.value = bannerData.button_link ?? "";

        if (absoluteRef.current) {
            absoluteRef.current.checked = bannerData.contenedor === 'absoluto';
        }

        // Nuevos campos
        $(pageIdRef.current).val(banner?.page_id || '').trigger('change');
        const editingPageId = banner?.page_id || '';
        setSelectedPageId(editingPageId);
        
        // CRÍTICO: Cargar componentes primero, luego establecer after_component
        loadPageComponents(editingPageId);
        
        // Esperar un momento para que se carguen los componentes y luego setear el valor
        setTimeout(() => {
            const afterValue = banner?.after_component || '';
           // console.log('🔧 Editando banner - after_component:', afterValue);
            $(afterComponentRef.current).val(afterValue).trigger('change');
        }, 100);
        
        $(bannerTypeRef.current).val(bannerData.type || 'BannerSimple').trigger('change');

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        const bannerId = idRef.current.value;
        const pageId = $(pageIdRef.current).val();
        const afterComponent = $(afterComponentRef.current).val() || null;
        const bannerType = $(bannerTypeRef.current).val();

        // Preparar los datos del sistema - EXACTAMENTE como System.jsx
        const systemData = {
            name: `Banner - ${nameRef.current.value}`,
            component: 'banner',
            value: bannerType,
            page_id: pageId || null,
            after_component: afterComponent,
            visible: true
        };

        // Si está editando, incluir el ID
        if (bannerId) {
            systemData.id = bannerId;
        }

        // 1. PRIMERO guardar el sistema (como hace System.jsx)
        const systemResult = await systemRest.save(systemData);
        if (!systemResult) return;

       

        // 2. SEGUNDO guardar los datos del banner
        const request = {
            id: systemResult.id,
            name: nameRef.current.value,
            description: descriptionRef.current.value,
            button_text: buttonTextRef.current.value,
            button_link: buttonLinkRef.current.value,
            contenedor: absoluteRef.current?.checked ? 'absoluto' : 'relativo',
            type: bannerType
        };

        const formData = new FormData();
        for (const key in request) {
            formData.append(key, request[key]);
        }

        const background = backgroundRef.current.files[0];
        if (background) {
            formData.append("background", background);
        }
        const image = imageRef.current.files[0];
        if (image) {
            formData.append("image", image);
        }

        // Check for image deletion flags using the same pattern as Categories.jsx
        if (backgroundRef.getDeleteFlag && backgroundRef.getDeleteFlag()) {
            formData.append('background_delete', 'DELETE');
        }
        if (imageRef.getDeleteFlag && imageRef.getDeleteFlag()) {
            formData.append('image_delete', 'DELETE');
        }

        const bannerResult = await bannersRest.save(formData);
        if (!bannerResult) return;

        // Reset delete flags after successful save
        if (backgroundRef.resetDeleteFlag) backgroundRef.resetDeleteFlag();
        if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();


        // 3. TERCERO - CALCULAR Y ACTUALIZAR EL ORDEN DE TODOS LOS COMPONENTES AFECTADOS
        // Esto es CRÍTICO - System.jsx hace esto automáticamente con drag & drop
        
        const targetPageId = systemResult.page_id;
        const newBannerId = systemResult.id;
        const newAfterComponent = systemResult.after_component;
        
        // Obtener todos los sistemas de la página actual
        const currentPageSystems = systems.filter(s => s.page_id === targetPageId);
        
        // Si el banner se está insertando en una posición específica, necesitamos reordenar
        if (newAfterComponent || (!isEditing && newAfterComponent === null)) {
       
            
            // Crear una lista simulada como si fuera el resultado del drag & drop
            let reorderedSystems = [...currentPageSystems];
            
            // Remover el banner actual si está editando
            if (isEditing) {
                reorderedSystems = reorderedSystems.filter(s => s.id !== newBannerId);
            }
            
            // Insertar el banner en la nueva posición
            const newBannerTemp = { ...systemResult, data: bannerResult.data };
            
            if (newAfterComponent === null) {
                // Insertar al inicio
                reorderedSystems.unshift(newBannerTemp);
            } else {
                // Insertar después del componente especificado
                const afterIndex = reorderedSystems.findIndex(s => s.id == newAfterComponent); // Usar == para comparar int y string
                if (afterIndex !== -1) {
                    reorderedSystems.splice(afterIndex + 1, 0, newBannerTemp);
                } else {
                    reorderedSystems.push(newBannerTemp);
                }
            }
            
            // Calcular los nuevos after_component para todos
            const updates = {};
            reorderedSystems.forEach((system, index) => {
                const newAfter = index === 0 ? null : reorderedSystems[index - 1].id;
                if (system.after_component !== newAfter) {
                    updates[system.id] = newAfter;
                }
            });
            
            
            // Enviar las actualizaciones al backend como hace System.jsx
            if (Object.keys(updates).length > 0) {
                const orderResult = await systemRest.updateOrder(updates);
                if (!orderResult) {
                    return;
                }
            }
        }

        // 4. CUARTO - Actualizar el estado final con todos los cambios
        const finalSystem = {
            ...systemResult,
            data: bannerResult.data
        };

        setSystems(old => {
            const exists = old.some(x => x.id === finalSystem.id);
          
            
            let newSystems;
            if (exists) {
                newSystems = old.map(x => x.id === finalSystem.id ? finalSystem : x);
            } else {
                newSystems = [...old, finalSystem];
            }
            
            return newSystems;
        });

        $(modalRef.current).modal("hide");
        
        
        // FORZAR RECARGA para que System.jsx vea los cambios
        // Esto es temporal hasta encontrar por qué no se refleja automáticamente
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };



    const onPageChange = (e) => {
        const pageId = $(e.target).val();
        setSelectedPageId(pageId);
        
        // Clear the after component selection safely
        setTimeout(() => {
            $(afterComponentRef.current).val('').trigger('change');
        }, 100);
    };

    const onVisibleChange = async ({ id, value }) => {
        const result = await bannersRest.boolean({
            id,
            field: "visible",
            value,
        });
        if (!result) return;
        
        // Actualizar el estado local en lugar de refrescar desde el backend
        setSystems(old => old.map(system => 
            system.id === id ? { ...system, visible: value } : system
        ));
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
        
        const result = await bannersRest.delete(id);
        if (!result) return;
        
        // Actualizar el estado local inmediatamente como en System.jsx
        setSystems(old => old.filter(x => x.id != id));
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Banners"
                rest={bannersRest}
                // USAR EL BACKEND DIRECTAMENTE - SIN SORTING PERSONALIZADO
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
                        widget: 'dxButton', 
                        location: 'after',
                        options: {
                            icon: 'plus',
                            text: 'Nuevo banner',
                            hint: 'Nuevo banner',
                            onClick: () => onModalOpen()
                        }
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
                        caption: "Información",
                        cellTemplate: (container, { data }) => {
                            const page = pages.find(
                                (x) => x.id == data?.page_id
                            );
                            const bannerType = bannerTypes.find(
                                (type) => type.id === data?.data?.type
                            );
                            container.html(
                                renderToString(
                                    <>
                                        <div className="d-flex align-items-center">
                                            <i className={`${bannerType?.icon || 'mdi mdi-image'} me-2`}></i>
                                            <div>
                                                <b className="d-block">{data?.name}</b>
                                                <small className="text-muted d-block">
                                                    Tipo: {bannerType?.name || 'Banner Simple'}
                                                </small>
                                                <small className="text-muted">
                                                    Página: {page?.name || 'Base Template'}
                                                </small>
                                            </div>
                                        </div>
                                    </>
                                )
                            );
                        },
                    },
                    {
                        dataField: "after_component",
                        caption: "Después de",
                        cellTemplate: (container, { data }) => {
                            if (!data.after_component) {
                                container.text("Al inicio");
                                return;
                            }
                            
                            // Buscar el componente al que hace referencia
                            const afterComponent = systems.find(s => s.id === data.after_component);
                            container.text(afterComponent ? afterComponent.name : "Componente eliminado");
                        },
                    },
                    {
                        dataField: "background",
                        caption: "Fondo",
                        width: "90px",
                        allowFiltering: false,
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <img
                                    src={`/storage/images/system/${data?.data?.background}`}
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
                        dataField: "image",
                        caption: "Imagen",
                        width: "90px",
                        allowFiltering: false,
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <img
                                    src={`/storage/images/system/${data?.data?.image}`}
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
                title={isEditing ? "Editar banner" : "Agregar banner"}
                onSubmit={onModalSubmit}
                size="lg"
            >
                <input ref={idRef} type="hidden" />
                
                <div className="row" id="banner-container">
                    <div className="col-12">
                        <div className="row">
                            <div className="col-md-6">
                                <SelectFormGroup 
                                    eRef={bannerTypeRef} 
                                    label="Tipo de Banner"
                                    dropdownParent={"#banner-container"}
                                >
                                    {bannerTypes.map(type => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </SelectFormGroup>
                            </div>
                            <div className="col-md-6">
                                <SelectFormGroup 
                                    eRef={pageIdRef} 
                                    label="Página"
                                    onChange={onPageChange}
                                    dropdownParent={"#banner-container"}
                                >
                                    <option value="">Base Template</option>
                                    {pages.filter(page => page.menuable).map(page => (
                                        <option key={page.id} value={page.id}>
                                            {page.name}
                                        </option>
                                    ))}
                                </SelectFormGroup>
                            </div>
                        </div>

                        <SelectFormGroup 
                            eRef={afterComponentRef} 
                            label="Posición (después de)"
                            dropdownParent="#banner-container"
                            changeWith={[selectedPageId]} // Use changeWith instead of key
                        >
                            <option value="">Al inicio</option>
                            {availableComponents.map(component => (
                                <option key={component.id} value={component.id}>
                                    {component.name}
                                </option>
                            ))}
                        </SelectFormGroup>

                        <ImageFormGroup 
                            eRef={backgroundRef} 
                            name="background" 
                            label="Fondo"
                        />
                        
                        <div className="row">
                            <div className="col-sm-6">
                                <ImageFormGroup
                                    eRef={imageRef}
                                    name="image"
                                    label="Imagen"
                                    aspect={1}
                                />
                            </div>
                            <div className="col-sm-6">
                                <TextareaFormGroup
                                    eRef={nameRef}
                                    label="Titulo"
                                    rows={2}
                                />
                                <TextareaFormGroup
                                    eRef={descriptionRef}
                                    label="Descripción"
                                    rows={2}
                                />
                                <InputFormGroup
                                    eRef={buttonTextRef}
                                    label="Texto botón"
                                />
                            </div>
                        </div>
                        
                        <InputFormGroup 
                            eRef={buttonLinkRef} 
                            label="URL botón"
                        />
                        
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Posición</label>
                            <div className="col-sm-9">
                                <div className="custom-control custom-switch">
                                    <input 
                                        type="checkbox" 
                                        className="custom-control-input" 
                                        id="absoluteSwitch"
                                        ref={absoluteRef}
                                    />
                                    <label className="custom-control-label" htmlFor="absoluteSwitch">
                                        Imagen absoluta
                                    </label>
                                </div>
                                <small className="form-text text-muted">
                                    Marca esta opción para posicionamiento absoluto de la imagen
                                </small>
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
        <BaseAdminto {...properties} title="Banners">
            <Banners {...properties} />
        </BaseAdminto>
    );
});
