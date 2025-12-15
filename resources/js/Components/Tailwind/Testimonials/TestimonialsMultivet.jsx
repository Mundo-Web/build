import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

const TestimonialsMultivet = ({ items = [], data }) => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [imageErrors, setImageErrors] = useState({});

    // Si no hay testimonios, usar datos de fallback o no mostrar nada
    const testimonials = items.length > 0 ? items : [];

    // Función para resaltar texto con asteriscos
    const highlightText = (desc) => {
        if (!desc) return '';
        const parts = desc.split(/(\*[^*]+\*)/g);
        return parts.map((part, i) =>
            part.startsWith("*") && part.endsWith("*") ? (
                <span key={i} className={`font-bold ${data?.highlight_color || 'text-brand-gold'}`}>
                    {part.slice(1, -1)}
                </span>
            ) : (
                <span key={i}>{part}</span>
            )
        );
    };

    useEffect(() => {
        if (testimonials.length > 1) {
            const timer = setInterval(() => {
                setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
            }, data?.autoplay_delay || 5000);
            return () => clearInterval(timer);
        }
    }, [testimonials.length, data?.autoplay_delay]);

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const renderStars = (rating) => {
        const numRating = parseInt(rating) || 5;
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-6 h-6 ${i < numRating ? (data?.star_color || 'customtext-accent fill-current') : 'text-gray-300'}`}
            />
        ));
    };

    // Si no hay testimonios, mostrar placeholder
    if (!testimonials || testimonials.length === 0) {
        return null;
    }

    const currentItem = testimonials[currentTestimonial];


    return (
        <section className={`py-16 ${data?.section_background || 'bg-primary'} text-white ${data?.class_section || ''}`}>
            <div className="max-w-7xl mx-auto px-primary">
                {/* Header */}
                <div className={`text-center mb-12 ${data?.class_header || ''}`}>
                    <h2 className={`text-3xl font-title md:text-5xl font-bold mb-4 font-montserrat ${data?.title_color || 'text-white'} ${data?.class_title || ''}`}>
                        {data?.title || 'Lo que dicen nuestros clientes'}
                    </h2>
                    <p className={`max-w-2xl mx-auto text-lg  ${data?.subtitle_color || 'text-gray-300'} ${data?.class_subtitle || ''}`}>
                        {data?.subtitle || 'Veterinarios y productores de todo el país confían en Multivet'}
                    </p>
                </div>

                {/* Testimonial slider - Diseño original */}
                <div className="relative max-w-4xl mx-auto">
                    <div className={`rounded-2xl p-8 md:p-12 relative overflow-hidden ${data?.testimonials_background || 'bg-white'} ${data?.testimonials_text_color || 'text-gray-800'} ${data?.class_testimonials_card || ''}`}>
                        {/* Quote icon */}
                        <Quote className={`absolute top-6 right-6 w-12 h-12 opacity-20 ${data?.quote_color || 'customtext-accent'}`} />

                        <div className="flex flex-col md:flex-row items-center gap-8">
                            {/* Testimonial content */}
                            <div className="flex-1">
                                <div className="flex gap-1 items-center mb-4">
                                    {renderStars(currentItem.rating)}
                                </div>
                                <p className={`text-lg md:text-xl leading-relaxed mb-6 ${data?.testimonial_color || 'customtext-neutral-light'} ${data?.class_testimonial_text || ''}`}>
                                    &quot;{highlightText(currentItem.description || currentItem.content)}&quot;
                                </p>
                                <div>
                                    <h4 className={`text-xl font-bold font-montserrat ${data?.client_name_color || 'customtext-primary'} ${data?.class_client_name || ''}`}>
                                        {currentItem.name}
                                    </h4>
                                    {currentItem.title && (
                                        <p className={`${data?.client_title_color || 'customtext-neutral-light'} ${data?.class_client_title || ''}`}>
                                            {currentItem.title}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Profile image */}
                            <div className="flex-shrink-0">
                                <img
                                    src={
                                        imageErrors[currentTestimonial]
                                            ? "/api/cover/thumbnail/null"
                                            : currentItem.image
                                                ? `/storage/images/testimony/${currentItem.image}`
                                                : "/api/cover/thumbnail/null"
                                    }
                                    alt={currentItem.name}
                                    className={`w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 ${data?.avatar_border || 'border-accent'}`}
                                    onError={(e) => {
                                        console.log('Image failed to load:', currentItem.image);
                                        setImageErrors(prev => ({
                                            ...prev,
                                            [currentTestimonial]: true
                                        }));
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Navigation buttons - Solo si hay más de un testimonio */}
                    {testimonials.length > 1 && (
                        <>
                            <button
                                onClick={prevTestimonial}
                                className={`hidden lg:flex absolute -left-16 top-1/2 transform -translate-y-1/2 p-3 rounded-full transition-colors shadow-lg ${data?.nav_button_bg || 'bg-accent hover:bg-secondary'} ${data?.nav_button_color || 'text-primary-800'}`}
                                aria-label="Testimonio anterior"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextTestimonial}
                                className={`hidden lg:flex absolute -right-16 top-1/2 transform -translate-y-1/2 p-3 rounded-full transition-colors shadow-lg ${data?.nav_button_bg || 'bg-accent hover:bg-secondary'} ${data?.nav_button_color || 'text-primary-800'}`}
                                aria-label="Siguiente testimonio"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    {/* Dots indicator */}
                    {testimonials.length > 1 && (
                        <div className="flex justify-center space-x-2 mt-8">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentTestimonial(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentTestimonial
                                        ? `${data?.active_dot || 'bg-accent'} scale-125`
                                        : `${data?.inactive_dot || 'bg-gray-400 hover:bg-gray-300'}`
                                        }`}
                                    aria-label={`Ir al testimonio ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>


            </div>
        </section>
    );
};

export default TestimonialsMultivet;