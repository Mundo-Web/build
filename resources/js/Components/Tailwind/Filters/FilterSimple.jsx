import React, { useEffect, useState } from "react";
import Select from "react-select";
import ItemsRest from "../../../Actions/ItemsRest";
import FilterPagination from "../../../Reutilizables/Pagination/FilterPagination";
import ArrayJoin from "../../../Utils/ArrayJoin";
import ProductCard from "../Components/ProductCard";

const itemsRest = new ItemsRest();

const FilterItem = ({
    summary,
    keyName,
    field,
    otherField,
    title,
    onChange,
    filter,
}) => {
    if ((summary[keyName] ?? []).length == 0) return;

    const filtering = filter.find((x) => x.field == field);

    return (
        <>
            <hr className="my-2" />
            <div>
                <b className="mb-1 block">{title}</b>
                <div className="flex flex-wrap gap-x-2 gap-y-1">
                    {summary[keyName]?.map((x, index) => {
                        const inFilter = filtering?.values?.includes(x.id);
                        return (
                            <label
                                key={index}
                                className="cursor-pointer border rounded-lg py-1 px-2 text-sm"
                            >
                                <input
                                    className="me-1 cursor-pointer"
                                    type="checkbox"
                                    name={field}
                                    value={x.id}
                                    other-field={otherField}
                                    other-field-value={x[otherField]}
                                    onChange={onChange}
                                    checked={inFilter}
                                />
                                <span>{x.name}</span>
                            </label>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

const FilterSimple = ({ data, category, subcategory, cart, setCart }) => {
    const filters = [
        "category_id",
        "subcategory_id",
        "brand_id",
        "item_tag.tag_id",
    ];
    const [filter, setFilter] = useState(
        filters.map((x) => {
            const values = [];
            if (x == "category_id" && category) values.push(category.id);
            if (x == "subcategory_id" && subcategory)
                values.push(subcategory.id);
            return { field: x, values };
        })
    );
    const [items, setItems] = useState([]);
    const [order, setOrder] = useState({
        value: "asc",
        label: (
            <>
                Menor a mayor <i className="mdi mdi-arrow-up"></i>
            </>
        ),
    });

    const [totalCount, setTotalCount] = useState(0);
    const [pages, setPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        reloadItems();
    }, [filter, order, currentPage]);

    const onFilterChange = ({ target }) => {
        const field = target.name;
        const value = target.value;
        const checked = target.checked;
        const otherField = target.getAttribute("other-field");
        const otherFieldValue = target.getAttribute("other-field-value");

        setFilter((old) => {
            return old.map((x) => {
                if (x.field == field) {
                    if (checked) x.values.push(value);
                    else {
                        x.values = x.values.filter((v) => v != value);
                    }
                }
                if (x.field == otherField) {
                    if (checked) x.values.push(otherFieldValue);
                    // else {
                    //   x.values = x.values.filter(v => v != otherFieldValue)
                    // }
                }
                return x;
            });
        });
    };

    const reloadItems = async () => {
        setLoading(true);
        setItems([]);
        const result = await itemsRest.paginate({
            filter: ArrayJoin(
                filter
                    .map((x) => {
                        if (x.values.length == 0) return;
                        return ArrayJoin(
                            x.values.map((value) => [x.field, "=", value]),
                            "or"
                        );
                    })
                    .filter(Boolean),
                "and"
            ),
            take: 12,
            skip: 12 * (currentPage - 1),
            requireTotalCount: true,
            sort: [
                {
                    selector: "final_price",
                    desc: order.value == "desc",
                },
                {
                    selector: "discount_percent",
                    desc: order.value != "desc",
                },
            ],
        });
        if (!result.status) return;
        setItems(result.data ?? []);
        setTotalCount(result.totalCount);
        setPages(Math.ceil(result.totalCount / 12));
        setSummary(result.summary);
        setLoading(false);
    };

    return (
        <section id={data?.element_id || null} className="bg-white">
            <div className="px-[5%] replace-max-w-here w-full mx-auto px-4 py-[5%] md:py-[2.5%]">
                {(data?.title || data?.description) && (
                    <div className="mb-[2%]">
                        {data?.title && (
                            <h1 className="text-2xl font-bold mb-[2%]">
                                {data?.title}
                            </h1>
                        )}
                        {data?.description && (
                            <p className="text-sm mb-[3%]">
                                {data?.description}
                            </p>
                        )}
                    </div>
                )}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[5px] sm:gap-[10px] md:gap-[15px] lg:gap-5">
                    <div className="w-full">
                        <div className="shadow-lg border h-max sticky top-4 p-4 rounded-3xl">
                            <h3 className="text-lg font-bold">
                                Filtros de items
                            </h3>
                            <FilterItem
                                filter={filter}
                                keyName="categories"
                                title="Categoria"
                                field="category_id"
                                summary={summary}
                                onChange={onFilterChange}
                            />
                            <FilterItem
                                filter={filter}
                                keyName="subcategories"
                                title="Subcategoria"
                                field="subcategory_id"
                                otherField="category_id"
                                summary={summary}
                                onChange={onFilterChange}
                            />
                            <FilterItem
                                filter={filter}
                                keyName="brands"
                                title="Marca"
                                field="brand_id"
                                summary={summary}
                                onChange={onFilterChange}
                            />
                            <FilterItem
                                filter={filter}
                                keyName="tags"
                                title="Tags"
                                field="item_tag.tag_id"
                                summary={summary}
                                onChange={onFilterChange}
                            />
                            <hr className="my-2" />
                            <div>
                                <b className="mb-1 block">Ordenar precio</b>
                                <Select
                                    className="text-sm"
                                    options={[
                                        {
                                            value: "asc",
                                            label: (
                                                <>
                                                    Menor a mayor{" "}
                                                    <i className="mdi mdi-arrow-up"></i>
                                                </>
                                            ),
                                        },
                                        {
                                            value: "desc",
                                            label: (
                                                <>
                                                    Mayor a menor{" "}
                                                    <i className="mdi mdi-arrow-down"></i>
                                                </>
                                            ),
                                        },
                                    ]}
                                    defaultValue={order}
                                    onChange={(selectedOption) =>
                                        setOrder(selectedOption)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:col-span-2 lg:col-span-3">
                        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[5px] sm:gap-[10px] md:gap-[15px] lg:gap-5 mb-[2.5%] items-center justify-between">
                            <div className="">
                                Mostrando <b>{items.length}</b> items de{" "}
                                <b>{totalCount}</b>
                            </div>
                            <div className="lg:col-span-2 flex justify-between w-full">
                                <div className="mx-auto"></div>
                                <FilterPagination
                                    pages={pages}
                                    current={currentPage}
                                    setCurrent={setCurrentPage}
                                />
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[5px] sm:gap-[10px] md:gap-[15px] lg:gap-5">
                            {items.map((item, index) => (
                                <ProductCard
                                    data={data}
                                    key={index}
                                    item={item}
                                    cart={cart}
                                    setCart={setCart}
                                />
                            ))}
                            {loading &&
                                [null, null, null].map((x) => <ProductCard />)}
                        </div>
                        <div className="mt-[5%] w-max max-w-full mx-auto">
                            <FilterPagination
                                pages={pages}
                                current={currentPage}
                                setCurrent={setCurrentPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FilterSimple;
