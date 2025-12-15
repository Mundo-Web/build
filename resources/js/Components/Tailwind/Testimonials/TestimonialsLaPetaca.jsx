import React, { useState, useEffect } from 'react';

const TestimonialsLaPetaca = ({ data, items }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // No mostrar la sección si no hay items
    if (!items || items.length === 0) {
        return null;
    }

    const testimonials = items;
    const accentColor = data?.accentColor || '#78673A';

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 6000);

        return () => clearInterval(timer);
    }, [testimonials.length]);

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const getVisibleTestimonials = () => {
        const visible = [];
        for (let i = 0; i < 3; i++) {
            const index = (currentIndex + i) % testimonials.length;
            visible.push(testimonials[index]);
        }
        return visible;
    };

    return (
        <section className="py-20 px-4 bg-gradient-to-b from-[#281409] to-[#0a0604] relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div 
                        className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl"
                        style={{ backgroundColor: accentColor }}
                    ></div>
                    <div 
                        className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl"
                        style={{ backgroundColor: accentColor }}
                    ></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: accentColor }}>
                            {data?.title || 'Lo Que Dicen Nuestros Huéspedes'}
                        </h2>
                        <div className="w-24 h-1 mx-auto mb-6" style={{ backgroundColor: accentColor }}></div>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                            {data?.subtitle || 'Las experiencias de quienes nos visitaron hablan por sí solas'}
                        </p>
                    </div>

                    <div className="relative">
                        {/* Desktop View - 3 cards */}
                        <div className="hidden md:grid md:grid-cols-3 gap-8">
                            {getVisibleTestimonials().map((testimonial, index) => (
                                <div
                                    key={testimonial.id || index}
                                    className={`transition-all duration-500 ${
                                        index === 1 ? 'scale-105' : 'scale-95 opacity-70'
                                    }`}
                                >
                                    <div 
                                        className="bg-gradient-to-br from-[#281409]/80 to-[#281409]/40 p-8 rounded-2xl border transition-all duration-300 h-full"
                                        style={{ borderColor: `${accentColor}33` }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-quote w-12 h-12 text-[#78673A]/30 mb-6"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>

                                        {testimonial.rating && (
                                            <div className="flex items-center mb-4">
                                                {[...Array(Number(testimonial.rating) || 5)].map((_, i) => (
                                                    <svg key={i} className="w-5 h-5" style={{ fill: accentColor, color: accentColor }} viewBox="0 0 24 24">
                                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                    </svg>
                                                ))}
                                            </div>
                                        )}

                                        <p className="text-gray-300 mb-6 leading-relaxed italic">
                                            "{testimonial.testimonial || testimonial.text || testimonial.description}"
                                        </p>

                                        <div 
                                            className="flex items-center gap-4 pt-6 border-t"
                                            style={{ borderColor: `${accentColor}33` }}
                                        >
                                            {testimonial.image && (
                                                <img
                                                    src={`/storage/images/testimony/${testimonial.image}`}
                                                    alt={testimonial.name}
                                                    className="w-14 h-14 rounded-full object-cover border-2"
                                                    style={{ borderColor: accentColor }}
                                                    onError={(e) => e.target.style.display = 'none'}
                                                />
                                            )}
                                            <div>
                                                <h4 className="text-white font-semibold">{testimonial.name}</h4>
                                                {testimonial.location && (
                                                    <p className="text-gray-400 text-sm">{testimonial.location}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mobile View - 1 card */}
                        <div className="md:hidden">
                            {testimonials[currentIndex] && (
                                <div 
                                    className="bg-gradient-to-br from-[#281409]/80 to-[#281409]/40 p-8 rounded-2xl border"
                                    style={{ borderColor: `${accentColor}33` }}
                                >
                                    <svg className="w-12 h-12 mb-6 opacity-30" fill="none" stroke="currentColor" style={{ color: accentColor }} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>

                                    {testimonials[currentIndex].rating && (
                                        <div className="flex items-center mb-4">
                                            {[...Array(Number(testimonials[currentIndex].rating) || 5)].map((_, i) => (
                                                <svg key={i} className="w-5 h-5" style={{ fill: accentColor, color: accentColor }} viewBox="0 0 24 24">
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                </svg>
                                            ))}
                                        </div>
                                    )}

                                    <p className="text-gray-300 mb-6 leading-relaxed italic">
                                        "{testimonials[currentIndex].testimonial || testimonials[currentIndex].text || testimonials[currentIndex].description}"
                                    </p>

                                    <div 
                                        className="flex items-center gap-4 pt-6 border-t"
                                        style={{ borderColor: `${accentColor}33` }}
                                    >
                                        {testimonials[currentIndex].image && (
                                            <img
                                                src={`/storage/images/testimony/${testimonials[currentIndex].image}`}
                                                alt={testimonials[currentIndex].name}
                                                className="w-14 h-14 rounded-full object-cover border-2"
                                                style={{ borderColor: accentColor }}
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        )}
                                        <div>
                                            <h4 className="text-white font-semibold">{testimonials[currentIndex].name}</h4>
                                            {testimonials[currentIndex].location && (
                                                <p className="text-gray-400 text-sm">{testimonials[currentIndex].location}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Navigation buttons */}
                        <button
                            onClick={prevTestimonial}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 p-3 rounded-full text-white transition-all duration-300 hover:scale-110 z-20 hover:opacity-100 opacity-80"
                            style={{ backgroundColor: accentColor }}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <button
                            onClick={nextTestimonial}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 p-3 rounded-full text-white transition-all duration-300 hover:scale-110 z-20 hover:opacity-100 opacity-80"
                            style={{ backgroundColor: accentColor }}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Indicators */}
                    <div className="flex justify-center gap-2 mt-12">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`transition-all duration-300 rounded-full ${
                                    index === currentIndex
                                        ? 'w-8 h-3'
                                        : 'w-3 h-3 bg-white/30 hover:bg-white/50'
                                }`}
                                style={index === currentIndex ? { backgroundColor: accentColor } : {}}
                            />
                        ))}
                    </div>
                </div>
        </section>
    );
};

export default TestimonialsLaPetaca;
