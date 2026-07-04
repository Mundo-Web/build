import BaseAdminto from '@Adminto/Base';
import SwitchFormGroup from '@Adminto/form/SwitchFormGroup';
import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import Swal from 'sweetalert2';

import Modal from '../Components/Adminto/Modal';
import Table from '../Components/Adminto/Table';
import InputFormGroup from '../Components/Adminto/form/InputFormGroup';
import SelectAPIFormGroup from '../Components/Adminto/form/SelectAPIFormGroup';
import DxButton from '../Components/dx/DxButton';
import CreateReactScript from '../Utils/CreateReactScript';
import ReactAppend from '../Utils/ReactAppend';
import Number2Currency, { CurrencySymbol } from '../Utils/Number2Currency';
import RelatedGroupsRest from '../Actions/Admin/RelatedGroupsRest';

const relatedGroupsRest = new RelatedGroupsRest();

const RelatedGroups = () => {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    const gridRef = useRef();
    const modalRef = useRef();
    const idRef = useRef();
    const nameRef = useRef();
    const itemsRef = useRef();

    // Handle product selection from Select2
    const handleProductChange = (event) => {
        const selectedData = $(event.target).select2('data');
        const newProducts = selectedData.map((item) => item.data).filter(Boolean);
        setSelectedProducts((prev) => {
            const existingIds = prev.map((p) => p.id);
            const unique = newProducts.filter((p) => !existingIds.includes(p.id));
            return [...prev, ...unique];
        });
    };

    const removeProduct = (productId) => {
        const updated = selectedProducts.filter((p) => p.id !== productId);
        setSelectedProducts(updated);
        if (itemsRef.current) {
            $(itemsRef.current).val(updated.map((p) => p.id.toString()));
        }
    };

    const onModalOpen = async (data) => {
        if (data?.id) {
            setIsEditing(true);
            const result = await relatedGroupsRest.get(data.id, ['allItems']);
            if (!result) return;

            const groupData = result.data || result;
            idRef.current.value = groupData.id || '';
            nameRef.current.value = groupData.name || '';

            const products = groupData.all_items || groupData.allItems || [];
            setSelectedProducts(products);

            setTimeout(() => {
                if (itemsRef.current) {
                    $(itemsRef.current).val(products.map((p) => p.id.toString()));
                }
            }, 100);
        } else {
            setIsEditing(false);
            idRef.current.value = '';
            nameRef.current.value = '';
            setSelectedProducts([]);
            if (itemsRef.current) $(itemsRef.current).val([]);
        }
        $(modalRef.current).modal('show');
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        if (selectedProducts.length < 2) {
            Swal.fire('Error', 'Debes seleccionar al menos 2 productos para el grupo.', 'error');
            return;
        }

        const groupId = idRef.current.value || undefined;
        const name = nameRef.current.value;

        // Save/update the group
        const result = await relatedGroupsRest.save({
            id: groupId,
            name,
            item_ids: selectedProducts.map((p) => p.id),
        });
        if (!result) return;

        $(gridRef.current).dxDataGrid('instance').refresh();
        $(modalRef.current).modal('hide');
        setSelectedProducts([]);
        if (itemsRef.current) $(itemsRef.current).val([]);
    };

    const onBooleanChange = async ({ id, field, value }) => {
        const result = await relatedGroupsRest.boolean({ id, field, value });
        if (!result) return;
        $(gridRef.current).dxDataGrid('instance').refresh();
    };

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: 'Eliminar grupo',
            text: '¿Estás seguro? Los productos NO se eliminarán, solo la agrupación.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });
        if (!isConfirmed) return;
        const result = await relatedGroupsRest.delete(id);
        if (!result) return;
        $(gridRef.current).dxDataGrid('instance').refresh();
    };

    return (<>
        <Table
            gridRef={gridRef}
            title='Grupos de Productos Relacionados'
            rest={relatedGroupsRest}
            toolBar={(container) => {
                container.unshift({
                    widget: 'dxButton', location: 'after',
                    options: {
                        icon: 'refresh',
                        hint: 'Refrescar tabla',
                        onClick: () => $(gridRef.current).dxDataGrid('instance').refresh(),
                    },
                });
                container.unshift({
                    widget: 'dxButton', location: 'after',
                    options: {
                        icon: 'plus',
                        text: 'Nuevo grupo',
                        hint: 'Nuevo grupo de relacionados',
                        onClick: () => onModalOpen(),
                    },
                });
            }}
            exportable={true}
            exportableName='GruposRelacionados'
            columns={[
                { dataField: 'id', caption: 'ID', visible: false },
                {
                    dataField: 'name',
                    caption: 'Nombre del Grupo',
                    cellTemplate: (container, { data }) => {
                        container.html(renderToString(<b>{data.name}</b>));
                    },
                },
                {
                    dataField: 'items',
                    caption: 'Productos',
                    allowFiltering: false,
                    allowSorting: false,
                    width: '70%',
                    cellTemplate: (container, { data }) => {
                        const items = data.items || [];
                        if (items.length === 0) {
                            container.html('<span class="text-muted" style="font-size: 13px">Sin productos</span>');
                        } else {
                            const maxToShow = 3;
                            const showing = items.slice(0, maxToShow).map(p => p.name).join(', ');
                            const extra = items.length > maxToShow ? ` (+${items.length - maxToShow})` : '';
                            container.html(`<span style="font-size: 13px">${showing}${extra}</span>`);
                        }
                    },
                },
                {
                    dataField: 'status',
                    caption: 'Activo',
                    dataType: 'boolean',
                    width: '90px',
                    cellTemplate: (container, { data }) => {
                        ReactAppend(container, <SwitchFormGroup
                            checked={data.status}
                            onChange={(e) => onBooleanChange({ id: data.id, field: 'status', value: e.target.checked })}
                        />);
                    },
                },
                {
                    caption: 'Acciones',
                    width: '110px',
                    cellTemplate: (container, { data }) => {
                        container.css('text-overflow', 'unset');
                        container.append(DxButton({
                            className: 'btn btn-xs btn-soft-primary',
                            title: 'Editar',
                            icon: 'fa fa-pen',
                            onClick: () => onModalOpen(data),
                        }));
                        container.append(DxButton({
                            className: 'btn btn-xs btn-soft-danger',
                            title: 'Eliminar',
                            icon: 'fa fa-trash',
                            onClick: () => onDeleteClicked(data.id),
                        }));
                    },
                    allowFiltering: false,
                    allowExporting: false,
                },
            ]}
        />

        <Modal modalRef={modalRef} title={isEditing ? 'Editar grupo de relacionados' : 'Nuevo grupo de relacionados'} onSubmit={onModalSubmit} size='lg'>
            <div className='row' id='related-group-container'>
                <input ref={idRef} type='hidden' />

                <div className='col-md-12 mb-3'>
                    <InputFormGroup eRef={nameRef} label='Nombre del Grupo' placeholder='Ej: Impresoras Epson Ecotank' required />
                </div>

                <div className='col-md-12 mb-3'>
                    <SelectAPIFormGroup
                        id='related-group-items'
                        eRef={itemsRef}
                        searchAPI='/api/admin/items/paginate'
                        searchBy='name'
                        label='Agregar Productos al Grupo'
                        dropdownParent='#related-group-container'
                        multiple
                        onChange={handleProductChange}
                    />
                    <small className='text-muted'>
                        <i className='mdi mdi-information-outline me-1'></i>
                        Busca y agrega los productos que pertenecen a este grupo. Cuando alguien vea el detalle de cualquiera de ellos, verá los demás como "relacionados".
                    </small>
                </div>

                {/* Lista de productos seleccionados */}
                <div className='col-12 mt-2'>
                    <h5 className='mb-3'>
                        <i className='mdi mdi-package-variant me-2'></i>
                        Productos del Grupo
                        <span className='badge bg-primary ms-2'>{selectedProducts.length}</span>
                    </h5>

                    {selectedProducts.length === 0 && (
                        <div className='alert alert-light text-center py-3'>
                            <i className='mdi mdi-basket-outline d-block mb-1' style={{ fontSize: '2rem', opacity: 0.4 }}></i>
                            <small className='text-muted'>Aún no hay productos en este grupo. Búscalos arriba.</small>
                        </div>
                    )}

                    <div className='row g-2'>
                        {selectedProducts.map((product) => (
                            <div key={product.id} className='col-md-6 col-lg-4'>
                                <div className='card border h-100 shadow-sm'>
                                    <div className='row g-0 align-items-center h-100'>
                                        <div className='col-3'>
                                            <img
                                                src={`/storage/images/item/${product?.image ?? 'undefined'}`}
                                                className='img-fluid rounded-start'
                                                style={{ height: '70px', objectFit: 'cover', width: '100%' }}
                                                alt={product.name}
                                                onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                                            />
                                        </div>
                                        <div className='col-9'>
                                            <div className='card-body p-2'>
                                                <p className='card-title small fw-bold mb-0 line-clamp-2'>{product?.name}</p>
                                                {product?.final_price && (
                                                    <p className='small text-primary mb-1'>
                                                        {CurrencySymbol()} {Number2Currency(product.final_price)}
                                                    </p>
                                                )}
                                                <button
                                                    type='button'
                                                    className='btn btn-xs btn-soft-danger'
                                                    onClick={() => removeProduct(product.id)}
                                                >
                                                    <i className='fa fa-times me-1'></i> Quitar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    </>);
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title='Grupos de Relacionados'>
            <RelatedGroups {...properties} />
        </BaseAdminto>
    );
});
