const CategoryCardWithBanner = ({
    mainContainer,
    href,
    color,
    category,
    aspectRatio,
    borderRadius,
    buttonColor,
    buttonBackground,
    index
}) => {
    return (
        <section
            className={`relative font-paragraph text-white w-full h-full p-[3%]`}
            style={{
                aspectRatio,
                backgroundImage: `url(/storage/images/category/${category?.banner})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                borderRadius
            }}
        >
            <div
                className={`${mainContainer ? 'w-full justify-end' : 'w-3/5 justify-center'} h-full flex  ${index == 1 && 'translate-x-[65%]'} items-start flex-col gap-x-[5%]`}
            >
                <div className="mb-[5%]">
                    {
                        category?.name &&
                        <h3 className={`${mainContainer ? 'text-4xl xl:text-6xl' : 'text-2xl xl:text-4xl'} font-semibold ${!mainContainer && 'line-clamp-2'} ${color} font-title leading-none`}>
                            {category?.name}
                        </h3>
                    }
                    {
                        category?.description &&
                        <p className={`text-base line-clamp-2 mt-[2.5%] ${color} leading-none`}>
                            {category?.description}
                        </p>
                    }
                </div>
                <a href={href} className={`${buttonBackground || 'bg-primary'} ${buttonColor || 'text-white'} rounded-full px-6 py-3`}>Ver más productos</a>
            </div>
            {
                !mainContainer &&
                <img
                    src={`/storage/images/category/${category?.image}`}
                    className="absolute w-2/5"
                    style={{
                        position: "absolute",
                        bottom: 0,
                        right: index == 0 ? 0 : 'unset',
                        left: index == 0 ? 'unset' : 0,
                        zIndex: 1
                    }}
                />
            }
        </section>
    );
}

export default CategoryCardWithBanner;