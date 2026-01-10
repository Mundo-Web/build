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
            className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/20"
        >
            <div className="flex items-start gap-4 mb-6">
                {item.image && (
                    <div 
                        className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg overflow-hidden"
                        style={{
                            backgroundColor: item.bg_color==='transparent' ? 'var(--bg-primary)' : (item.bg_color || 'var(--bg-primary)')
                        }}
                    >
                        <img 
                            src={`/storage/images/strength/${item.image}`}
                            alt={item.name}
                            className="w-8 h-8 object-contain"
                            onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                        />
                    </div>
                )}
            </div>

            <h3 className="text-xl font-bold text-primary mb-3">
                {item.name}
            </h3>

            <p className="text-gray-600 leading-relaxed">
                {item.description}
            </p>
        </div>
    );

    return (
        <section className="py-20 sm:py-24 bg-sections-color">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-7xl font-title font-bold text-primary mb-4">
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
                    <div className="mt-16 relative overflow-hidden rounded-3xl">
                        <div className="absolute inset-0 bg-primary"></div>
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-10"></div>

                        <div className="relative p-8 sm:p-12 text-white text-center">
                            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                                {data.footer_text}
                            </h3>
                            {data?.footer_subtitle && (
                                <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">
                                    {data.footer_subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default StrengthSimple;
