import React from 'react';

const StrengthSimple = ({ items, data }) => {
    if (!items || items.length === 0) {
        return null;
    }

    const totalItems = items.length;
    const remainder = totalItems % 3;

    // Determinar cuántos items van en la primera fila
    let firstRowCount = totalItems;
    if (totalItems > 3) {
        firstRowCount = remainder === 0 ? 3 : 3;
    }

    const firstRow = items.slice(0, firstRowCount);
    const remainingItems = items.slice(firstRowCount);

    // Agrupar los items restantes en filas de máximo 3
    const rows = [];
    for (let i = 0; i < remainingItems.length; i += 3) {
        rows.push(remainingItems.slice(i, i + 3));
    }

    const renderCard = (item, index) => (
        <div
            key={item.id || index}
            className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-200 overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>

            <div className="relative">
                {item.image && (
                    <div 
                        className="p-5 max-w-max rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg overflow-hidden"
                        style={{
                            backgroundColor: item.bg_color==='transparent' ? 'var(--bg-primary)' : (item.bg_color || 'var(--bg-primary)')
                        }}
                    >
                        <img 
                            src={`/storage/images/strength/${item.image}`}
                            alt={item.name}
                            className="w-12 h-12 object-contain"
                            onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                        />
                    </div>
                )}

                <h3 className="text-2xl font-bold text-primary mb-4 group-hover:text-primary/80 transition-colors">
                    {item.name}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                    {item.description}
                </p>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </div>
    );

    return (
        <section id="strengthSimple" className="py-20 sm:py-24 bg-swhite relative overflow-hidden">
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 -translate-y-1/2 -ml-48"></div>
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 -translate-y-1/2 -mr-48"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-primary font-title mb-4">
                        {data?.title || '¿Por Qué Elegirnos?'}
                    </h2>
                    <p className="text-lg sm:text-xl text-neutral-dark max-w-3xl mx-auto">
                        {data?.subtitle || 'No solo vendemos material, entregamos soluciones completas para el éxito de tus proyectos'}
                    </p>
                </div>

                {/* Primera fila */}
                <div className={`grid gap-8 mb-8 ${
                    firstRow.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' : 
                    firstRow.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 
                    'md:grid-cols-2 lg:grid-cols-3'
                }`}>
                    {firstRow.map(renderCard)}
                </div>

                {/* Filas restantes */}
                {rows.map((row, rowIndex) => (
                    <div 
                        key={rowIndex}
                        className={`grid gap-8 mb-8 ${
                            row.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' : 
                            row.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 
                            'md:grid-cols-2 lg:grid-cols-3'
                        }`}
                    >
                        {row.map(renderCard)}
                    </div>
                ))}

                {/* Footer opcional */}
                {data?.footer_text && (
                    <div className="mt-16 text-center">
                        <div className="relative inline-block rounded-2xl overflow-hidden shadow-2xl">
                            {data?.footer_image && (
                                <div className="absolute inset-0">
                                    <img
                                        src={`/storage/images/system/${data.footer_image}`}
                                        alt="Professional work"
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

export default StrengthSimple;
