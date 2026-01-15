import React from 'react';
import { FileText, Download } from 'lucide-react';

const SpecificationSimple = ({ data, items }) => {
    if (!items || items.length === 0) {
        return null;
    }

    // Agrupar items por nombre de producto
    const groupedProducts = React.useMemo(() => {
        const groups = {};
        items.forEach(item => {
            const productName = item.name?.trim() || 'Sin nombre';
            if (!groups[productName]) {
                groups[productName] = {
                    name: productName,
                    description: item.description,
                    image: item.image,
                    variants: []
                };
            }
            groups[productName].variants.push(item);
        });
        return Object.values(groups);
    }, [items]);

    return (
        <section id='specificationSimple' className="py-20 sm:py-24 bg-white relative overflow-hidden">
         
            <div className="2xl:max-w-7xl mx-auto  px-primary 2xl:px-0 relative">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-primary font-title mb-4">
                        {data?.title || 'Especificaciones Técnicas'}
                    </h2>
                    <p className="text-lg sm:text-xl text-neutral-light max-w-3xl mx-auto">
                        {data?.subtitle || 'Información detallada para que tomes la mejor decisión en tu proyecto'}
                    </p>
                </div>

                {/* Tablas agrupadas por producto */}
                <div className="space-y-12">
                    {groupedProducts.map((product, productIndex) => {
                        // Obtener atributos únicos de todas las variantes de este producto
                        const attributeNames = [];
                        const attrSet = new Set();
                        product.variants.forEach(variant => {
                            if (variant.attributes && variant.attributes.length > 0) {
                                variant.attributes.forEach(attr => {
                                    const name = attr.name || attr.slug;
                                    if (!attrSet.has(name)) {
                                        attrSet.add(name);
                                        attributeNames.push(name);
                                    }
                                });
                            }
                        });

                        // Verificar si tiene aplicaciones
                        const hasApplications = product.variants.some(variant => 
                            variant.applications && variant.applications.length > 0
                        );

                        // Si no tiene atributos ni aplicaciones, no mostrar nada
                        if (attributeNames.length === 0 && !hasApplications) {
                            return null;
                        }

                        return (
                            <div key={productIndex} className="bg-white">
                                {/* Header del producto - Solo nombre */}
                                <div className="text-primary py-4">
                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold">{product.name}</h3>
                                </div>

                                {/* Vista mobile: Cards */}
                                <div className="block sm:hidden space-y-4 my-4">
                                    {product.variants.map((variant, variantIndex) => {
                                        // Crear mapa de atributos de la variante
                                        const attributeMap = {};
                                        if (variant.attributes && variant.attributes.length > 0) {
                                            variant.attributes.forEach(attr => {
                                                const name = attr.name || attr.slug;
                                                const value = attr.pivot?.value || attr.value || '-';
                                                const unit = attr.unit || '';
                                                attributeMap[name] = `${value}${unit ? ' ' + unit : ''}`;
                                            });
                                        }

                                        // Obtener aplicaciones
                                        const applications = variant.applications || [];
                                        const applicationsText = applications.length > 0
                                            ? applications.map(app => app.name).join(', ')
                                            : '-';

                                        return (
                                            <div key={variant.id || variantIndex} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                                                <div className="space-y-3">
                                                    {attributeNames.map((attrName, attrIndex) => (
                                                        <div key={attrIndex} className="flex justify-between items-start border-b border-gray-100 pb-2 last:border-0">
                                                            <span className="font-semibold text-primary text-sm">{attrName}:</span>
                                                            <span className="text-neutral-dark text-sm text-right ml-2">{attributeMap[attrName] || '-'}</span>
                                                        </div>
                                                    ))}
                                                    {hasApplications && (
                                                        <div className="flex justify-between items-start border-b border-gray-100 pb-2 last:border-0">
                                                            <span className="font-semibold text-primary text-sm">Aplicaciones:</span>
                                                            <span className="text-neutral-dark text-sm text-right ml-2">{applicationsText}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Vista desktop: Tabla */}
                                <div className="hidden sm:block my-4">
                                    <div className="rounded-lg sm:rounded-2xl shadow-md overflow-hidden">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-primary text-white">
                                                    {attributeNames.map((attrName, index) => (
                                                        <th key={index} className="px-6 text-base md:text-lg py-4 text-left font-semibold">
                                                            {attrName}
                                                        </th>
                                                    ))}
                                                    {hasApplications && (
                                                        <th className="px-6 py-4 text-left text-base md:text-lg font-semibold">Aplicaciones</th>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {product.variants.map((variant, variantIndex) => {
                                                    // Crear mapa de atributos de la variante
                                                    const attributeMap = {};
                                                    if (variant.attributes && variant.attributes.length > 0) {
                                                        variant.attributes.forEach(attr => {
                                                            const name = attr.name || attr.slug;
                                                            const value = attr.pivot?.value || attr.value || '-';
                                                            const unit = attr.unit || '';
                                                            attributeMap[name] = `${value}${unit ? ' ' + unit : ''}`;
                                                        });
                                                    }

                                                    // Obtener aplicaciones
                                                    const applications = variant.applications || [];
                                                    const applicationsText = applications.length > 0
                                                        ? applications.map(app => app.name).join(', ')
                                                        : '-';

                                                    return (
                                                        <tr
                                                            key={variant.id || variantIndex}
                                                            className={`${
                                                                variantIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                                            } hover:bg-sections-color transition-colors`}
                                                        >
                                                            {attributeNames.map((attrName, attrIndex) => (
                                                                <td key={attrIndex} className="px-6 py-4 text-neutral-dark text-base">
                                                                    {attributeMap[attrName] || '-'}
                                                                </td>
                                                            ))}
                                                            {hasApplications && (
                                                                <td className="px-6 py-4 text-neutral-dark text-base">
                                                                    {applicationsText}
                                                                </td>
                                                            )}
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer opcional */}
                {data?.footer_text && (
                    <div className="mt-16 text-center">
                        <div className="relative inline-block rounded-2xl overflow-hidden shadow-2xl">
                            {data?.footer_image && (
                                <div className="absolute inset-0">
                                    <img
                                        src={`/storage/images/system/${data.footer_image}`}
                                        alt="Especificaciones"
                                        className="w-full h-full object-cover"
                                        onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                                    />
                                    <div className="absolute inset-0 bg-primary/95"></div>
                                </div>
                            )}
                            <div className="relative p-8 sm:p-12 text-white">
                                <p className="text-2xl sm:text-3xl font-bold mb-2">
                                    {data.footer_text}
                                </p>
                                {data?.footer_subtitle && (
                                    <p className="text-lg sm:text-xl opacity-90">
                                        {data.footer_subtitle}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default SpecificationSimple;
