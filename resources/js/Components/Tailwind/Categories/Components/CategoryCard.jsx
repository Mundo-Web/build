export default function CategoryCard({
    flex = false,
    category,
    featured = false,
}) {
    return (
        <section
            className={`group font-paragraph text-white  w-full ${
                featured ? "h-[300px] lg:h-[500px]" : "h-[238px]"
            }`}
        >
            <a
                href={`/catalogo?category=${category.slug}`}
                className={` ${flex && "flex gap-4 h-full"}`}
            >
                <div
                    className={`relative  w-full h-full overflow-hidden rounded-3xl ${
                        flex && "   h-full"
                    } `}
                >
                    <img
                        src={`/storage/images/category/${category?.image}`}
                        onError={(e) =>
                            (e.target.src = "/api/cover/thumbnail/null")
                        }
                        alt={category?.name}
                        fill
                        className={`object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 ${
                            flex && "w-full h-full "
                        } `}
                    />
                    <div
                        className="absolute top-0 w-full h-full
                    "
                        style={{
                            background:
                                "linear-gradient(187.83deg, rgba(0, 0, 0, 0) 34.08%, rgba(0, 0, 0, 0.4) 92.08%)",
                        }}
                    ></div>
                    <div
                        className={`absolute p-4 lg:p-8 bottom-0 mt-4 space-y-1 lg:space-y-2`}
                    >
                        <h3 className="text-2xl md:text-3xl 2xl:text-4xl font-semibold ">
                            {category?.name}
                        </h3>
                        <p className="text-sm sm:text-base lg:text-lg 2xl:text-xl">
                            {category?.description}
                        </p>
                    </div>
                </div>
            </a>
        </section>
    );
}
