import CategoryCardWithBanner from "./Components/CategoryCardWithBanner";

const CategoryPrettyGrid = ({ data, items }) => {
    return (
      <section className={`font-paragraph ${data?.class_section || ""}`}>
          <div className={`px-primary mx-auto p-[5%]  2xl:px-0 2xl:max-w-7xl`}>
            <h2 className="text-4xl text-center font-bold mb-16">{data?.title}</h2>
            <div className="flex flex-col md:flex-row gap-[2.5%]">

                <div className="w-full md:w-1/2">
                    <CategoryCardWithBanner
                        href={`/${data?.path}/${items[0].slug}`}
                        borderRadius={data?.borderRadius}
                        aspectRatio={616 / 500}
                        category={items[0]}
                        mainContainer
                    />
                </div>
                <div className="flex flex-col justify-between gap-[5%] w-full md:w-1/2">
                    {items.slice(1, 3).map((category, index) => (
                        <CategoryCardWithBanner
                        href={`/${data?.path}/${category.slug}`}
                            borderRadius={data?.borderRadius}
                            aspectRatio={44 / 17}
                            key={category.id}
                            index={index}
                            buttonBackground={index == 0 ? 'bg-white' : ''}
                            buttonColor={index == 0 ? 'customtext-primary' : ''}
                            color={index == 1 ? 'customtext-primary' : ''}
                            category={category}
                        />
                    ))}
                </div>
            </div>
        </div>
      </section>

    );
}

export default CategoryPrettyGrid;