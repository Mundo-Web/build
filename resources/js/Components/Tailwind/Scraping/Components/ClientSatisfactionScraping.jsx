




import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";


const ClientSatisfactionScraping = ({ items, data }) => {
    items = [
        {
            id: 1,
            name: "Mascota feliz",
            location: "Lima - Perú",
            image: "https://s3-alpha-sig.figma.com/img/4c84/1402/d6958e8cc296f50d142fd18aea8eeb6e?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=jdGcNeJlvFve9OAA17ZdvG3SU0uAycjz9vOaMy5Vd38jQ614-5f5VH5axxBrizROAEUGZeSFiyME320hHwWE3ZmQ8b7R1AdaSCsbwp7EGAo3oXIbzUWLCLHOz5mETxLYRGg86F-XCjxeCz4PRdYSavTe~~fZmgQZDffw48-LfPo3CURF~PSDwnABQAOZY-PThmak2T43s9vmq1hQrZ3EtmUtmpWvwY4uXG80irGWaRA7-muiYi-M5M2weXjKgTHAVsJv~26hvTePi1ApFt9B0uNoVBgTEPmaQdJxHbAqlkWg1SBYXl-e0nv6ZZMSR6e4B8~50makxxpBSsvTMPEq3w__",
            content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."
        },
        {
            id: 2,
            name: "Mascota feliz",
            location: "Lima - Perú",
            image: "https://s3-alpha-sig.figma.com/img/4c84/1402/d6958e8cc296f50d142fd18aea8eeb6e?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=jdGcNeJlvFve9OAA17ZdvG3SU0uAycjz9vOaMy5Vd38jQ614-5f5VH5axxBrizROAEUGZeSFiyME320hHwWE3ZmQ8b7R1AdaSCsbwp7EGAo3oXIbzUWLCLHOz5mETxLYRGg86F-XCjxeCz4PRdYSavTe~~fZmgQZDffw48-LfPo3CURF~PSDwnABQAOZY-PThmak2T43s9vmq1hQrZ3EtmUtmpWvwY4uXG80irGWaRA7-muiYi-M5M2weXjKgTHAVsJv~26hvTePi1ApFt9B0uNoVBgTEPmaQdJxHbAqlkWg1SBYXl-e0nv6ZZMSR6e4B8~50makxxpBSsvTMPEq3w__",
            content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."
        },
        {
            id: 3,
            name: "Mascota feliz",
            location: "Lima - Perú",
            image: "https://s3-alpha-sig.figma.com/img/4c84/1402/d6958e8cc296f50d142fd18aea8eeb6e?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=jdGcNeJlvFve9OAA17ZdvG3SU0uAycjz9vOaMy5Vd38jQ614-5f5VH5axxBrizROAEUGZeSFiyME320hHwWE3ZmQ8b7R1AdaSCsbwp7EGAo3oXIbzUWLCLHOz5mETxLYRGg86F-XCjxeCz4PRdYSavTe~~fZmgQZDffw48-LfPo3CURF~PSDwnABQAOZY-PThmak2T43s9vmq1hQrZ3EtmUtmpWvwY4uXG80irGWaRA7-muiYi-M5M2weXjKgTHAVsJv~26hvTePi1ApFt9B0uNoVBgTEPmaQdJxHbAqlkWg1SBYXl-e0nv6ZZMSR6e4B8~50makxxpBSsvTMPEq3w__",
            content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."
        }
        // Puedes agregar más testimonios aquí
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const [slidesPerView, setSlidesPerView] = useState(2); // Default en desktop

    // Detectar el tamaño de la pantalla para ajustar slidesPerView
    useEffect(() => {
        const updateSlidesPerView = () => {
            const width = window.innerWidth;
            if (width < 640) setSlidesPerView(1); // Móvil
            else if (width < 1024) setSlidesPerView(2); // Tablet
            else setSlidesPerView(2); // Desktop
        };
        updateSlidesPerView();
        window.addEventListener("resize", updateSlidesPerView);
        return () => window.removeEventListener("resize", updateSlidesPerView);
    }, []);

    // Calcular el máximo número de desplazamientos permitidos
    const maxSlide = useMemo(() => {
        return Math.max(0, Math.ceil(items.length / slidesPerView) - 1);
    }, [items.length, slidesPerView]);

    // Función para avanzar al siguiente slide
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev < maxSlide ? prev + 1 : prev));
    };

    // Función para retroceder al slide anterior
    const prevSlide = () => {
        setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
    };



    return (
        <section className="py-20 font-paragraph bg-secondary">
            <div className="w-full px-primary mx-auto">
                <h1 className="text-[40px]  font-bold text-center mb-4">Clientes satisfechos</h1>
                <p className="text-center customtext-neutral-light mb-8 max-w-3xl mx-auto">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu fermentum justo, ac fermentum nulla. Sed sed scelerisque urna, vitae ultrices libero. Pellentesque vehicula et urna in venenatis.
                </p>
                <div className="relative">
                    {/* Botón de retroceso */}
                    <button

                        onClick={prevSlide}
                        disabled={currentSlide === 0}
                        className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-lg shadow-lg transition-all duration-300 bg-primary  disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Categoría anterior"
                    >
                        <ChevronLeft width={"1rem"} />
                    </button>

                    {/* Contenedor de categorías */}
                    <div className="overflow-hidden py-4 max-w-5xl mx-auto">
                        <div
                            className="flex gap-4 transition-transform duration-300 ease-in-out"
                            style={{
                                transform: `translateX(-${currentSlide * (100 / slidesPerView)}%)`,
                            }}
                        >
                            {items.map((testimonial) => (
                                <div
                                    key={testimonial.id}
                                    className="group  w-full min-w-[200px] sm:w-1/2 lg:w-1/2 flex-shrink-0 group-hover:shadow-xl"
                                >
                                    <div className="bg-white rounded-xl p-6 w-11/12 ">
                                        <div className="flex  items-center  mb-4">
                                            <img src={testimonial.image} alt="Testimonial Image" className="w-12 h-12 object-cover rounded-full mr-4" />
                                            <div>
                                                <h2 className="text-2xl font-bold">{testimonial.name}</h2>
                                                <p className="text-xs">{testimonial.location}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm customtext-neutral-light">{testimonial.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Botón de avance */}
                    <button

                        onClick={nextSlide}
                        disabled={currentSlide >= maxSlide}
                        className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8  flex items-center justify-center rounded-lg shadow-lg transition-all duration-300 bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Categoría siguiente"
                    >
                        <ChevronRight width={"1rem"} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ClientSatisfactionScraping;