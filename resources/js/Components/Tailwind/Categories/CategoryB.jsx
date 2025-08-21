

import { useState } from "react"
const CategoryB = () => {
    const [currentSlide, setCurrentSlide] = useState(0)

    const products = [
        {
            id: 1,
            name: "Greg Norman - Polo de golf con logo de tiburón",
            brand: "Motorola",
            price: 199.99,
            originalPrice: 199.99,
            discount: 20,
            image: "path-to-product-image.jpg",
        },
        // Add more products...
    ]

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % Math.ceil(products.length / 4))
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + Math.ceil(products.length / 4)) % Math.ceil(products.length / 4))
    }

    return (
        <section className="py-12">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">Productos destacados</h2>
                    <a
                        href="#"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600"
                    >
                        Ver todos
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>

                <div className="relative">
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                        aria-label="Previous products"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div className="overflow-hidden mx-12">
                        <div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-transform duration-300 ease-in-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {products.map((product) => (
                                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <div className="relative">
                                        {product.discount > 0 && (
                                            <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm">
                                                -{product.discount}%
                                            </span>
                                        )}
                                        <img
                                            src={product.image || "/placeholder.svg"}
                                            alt={product.name}
                                            className="w-full h-48 object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <p className="text-sm text-gray-500">{product.brand}</p>
                                        <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-lg font-bold">S/ {product.price.toFixed(2)}</span>
                                            {product.discount > 0 && (
                                                <span className="text-sm text-gray-500 line-through">
                                                    S/ {product.originalPrice.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                        aria-label="Next products"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    )
}

export default CategoryB;