import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

const TestimonialsMiBalon = ({ items = [], data }) => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [imageErrors, setImageErrors] = useState({});

    const testimonials = items.length > 0 ? items : [];

    useEffect(() => {
        if (testimonials.length > 1) {
            const timer = setInterval(() => {
                setCurrentTestimonial(
                    (prev) => (prev + 1) % testimonials.length,
                );
            }, data?.autoplay_delay || 6000);
            return () => clearInterval(timer);
        }
    }, [testimonials.length, data?.autoplay_delay, currentTestimonial]);

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentTestimonial(
            (prev) => (prev - 1 + testimonials.length) % testimonials.length,
        );
    };

    const renderStars = (rating) => {
        const numRating = parseInt(rating) || 5;
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-5 h-5 md:w-6 md:h-6 ${i < numRating ? "text-[#F9A826] fill-[#F9A826]" : "text-gray-200"}`}
            />
        ));
    };

    if (!testimonials || testimonials.length === 0) {
        return null;
    }

    const currentItem = testimonials[currentTestimonial];

    return (
        <section
            id={data?.element_id || null}
            className={`py-20 md:py-28 bg-[#F7F9FB] overflow-hidden ${data?.class_section || ""}`}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Header */}
                <div
                    className={`text-center mb-16 md:mb-24 ${data?.class_header || ""}`}
                >
                    <h2
                        className={`text-4xl md:text-7xl   font-title uppercase text-primary leading-tight mb-6 ${data?.class_title || ""}`}
                    >
                        <TextWithHighlight
                            text={
                                data?.title ||
                                "Lo que dicen *nuestros clientes*"
                            }
                            className="font-title"
                            color="bg-neutral-dark"
                        />
                    </h2>
                    {data?.subtitle && (
                        <p
                            className={`max-w-2xl mx-auto text-lg md:text-xl text-neutral-dark/60 font-medium ${data?.class_subtitle || ""}`}
                        >
                            {data.subtitle}
                        </p>
                    )}
                </div>

                {/* Slider */}
                <div className="relative max-w-5xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentTestimonial}
                            initial={{ opacity: 0, x: 50, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -50, scale: 0.95 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="relative"
                        >
                            <div
                                className={`bg-white rounded-[2rem] p-8 md:p-16 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 mt-12 md:mt-0 ${data?.class_testimonials_card || ""}`}
                            >
                                <Quote
                                    className={`absolute top-10 right-10 w-24 h-24 opacity-5 text-primary rotate-180 hidden md:block`}
                                />

                                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 relative z-10">
                                    {/* Profile Image (Top on mobile, Left on desktop) */}
                                    <div className="flex-shrink-0 -mt-20 md:mt-0 relative group">
                                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all opacity-50"></div>
                                        <img
                                            src={
                                                imageErrors[currentTestimonial]
                                                    ? "/api/cover/thumbnail/null"
                                                    : currentItem.image
                                                      ? `/storage/images/testimony/${currentItem.image}`
                                                      : "/api/cover/thumbnail/null"
                                            }
                                            alt={currentItem.name}
                                            className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-8 border-white shadow-xl relative z-10"
                                            onError={(e) => {
                                                setImageErrors((prev) => ({
                                                    ...prev,
                                                    [currentTestimonial]: true,
                                                }));
                                            }}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="flex gap-1 justify-center md:justify-start mb-6">
                                            {renderStars(currentItem.rating)}
                                        </div>

                                        <p
                                            className={`text-xl md:text-2xl lg:text-3xl font-title text-neutral-dark leading-snug mb-8 ${data?.class_testimonial_text || ""}`}
                                        >
                                            "
                                            {currentItem.description ||
                                                currentItem.content}
                                            "
                                        </p>

                                        <div className="flex items-center justify-center md:justify-start gap-4">
                                            <div className="w-12 h-1 bg-primary rounded-full hidden md:block"></div>
                                            <div>
                                                <h4
                                                    className={`text-xl font-bold tracking-widest uppercase text-neutral-dark ${data?.class_client_name || ""}`}
                                                >
                                                    {currentItem.name}
                                                </h4>
                                                {currentItem.role && (
                                                    <p
                                                        className={`text-sm font-bold tracking-widest text-neutral-dark/40 uppercase mt-1 ${data?.class_client_title || ""}`}
                                                    >
                                                        {currentItem.role}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    {testimonials.length > 1 && (
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-12 md:mt-8 px-4">
                            {/* Dots */}
                            <div className="flex space-x-3">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            setCurrentTestimonial(index)
                                        }
                                        className={`rounded-full transition-all duration-300 ${
                                            index === currentTestimonial
                                                ? `w-12 h-3 bg-primary`
                                                : `w-3 h-3 bg-gray-300 hover:bg-gray-400`
                                        }`}
                                        aria-label={`Ir al testimonio ${index + 1}`}
                                    />
                                ))}
                            </div>

                            {/* Arrows */}
                            <div className="flex gap-4">
                                <button
                                    onClick={prevTestimonial}
                                    className="w-14 h-14 rounded-full flex items-center justify-center bg-white border border-gray-100 shadow-sm text-neutral-dark hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95"
                                    aria-label="Testimonio anterior"
                                >
                                    <ChevronLeft className="w-6 h-6 stroke-[2]" />
                                </button>
                                <button
                                    onClick={nextTestimonial}
                                    className="w-14 h-14 rounded-full flex items-center justify-center bg-white border border-gray-100 shadow-sm text-neutral-dark hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95"
                                    aria-label="Siguiente testimonio"
                                >
                                    <ChevronRight className="w-6 h-6 stroke-[2]" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsMiBalon;
