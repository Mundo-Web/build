import Swal from "sweetalert2";
import html2string from "../../../Utils/html2string";
import HtmlContent from "../../../Utils/HtmlContent";
import Number2Currency, {
    CurrencySymbol,
} from "../../../Utils/Number2Currency";
import { useRef } from "react";

const ProductDetailSimple = ({ item, data, cart, setCart }) => {
    const quantityRef = useRef();
    const isOutOfStock = !item?.stock_unlimited && (item?.stock <= 0 || !item?.stock);

    const onAddClicked = () => {
        if (isOutOfStock) {
            Swal.fire({
                title: "Producto Agotado",
                text: "Este producto se encuentra agotado.",
                icon: "warning",
                confirmButtonColor: "#000000"
            });
            return;
        }

        const quantity = Number(quantityRef.current.value || 1);
        if (!item.stock_unlimited) {
            const currentStock = item.stock || 0;
            if (currentStock < quantity) {
                Swal.fire({
                    title: "Stock Insuficiente",
                    text: `No hay suficiente stock disponible. Stock disponible: ${currentStock}`,
                    icon: "warning",
                    confirmButtonColor: "#000000"
                });
                return;
            }
        }

        const newCart = structuredClone(cart);
        const index = newCart.findIndex((x) => x.id == item.id);
        if (index == -1) {
            newCart.push({
                ...item,
                quantity: quantity,
            });
        } else {
            if (!item.stock_unlimited) {
                const currentStock = item.stock || 0;
                const newQty = newCart[index].quantity + quantity;
                if (newQty > currentStock) {
                    Swal.fire({
                        title: "Stock Insuficiente",
                        text: `No puedes agregar más de este producto. Stock total disponible: ${currentStock}. Ya tienes ${newCart[index].quantity} en el carrito.`,
                        icon: "warning",
                        confirmButtonColor: "#000000"
                    });
                    return;
                }
            }
            newCart[index].quantity += quantity;
        }
        setCart(newCart);

        Swal.fire({
            title: "Producto agregado",
            text: `Se agregó ${item?.name} al carrito`,
            icon: "success",
            timer: 1500,
        });
    };

    return (
        <section
            id={data?.element_id || null}
            className="w-full px-[5%] 2xl:px-0 2xl:max-w-7xl py-12 md:py20"
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
                <div className="flex flex-col md:flex-row justify-center items-center gap-5">
                    <div className="flex flex-row justify-between md:flex-col md:justify-start md:items-center h-full gap-4 md:gap-10 md:basis-1/4 order-2 md:order-1 w-full">
                        <img
                            src={`/storage/images/item/${item?.image}`}
                            alt={item?.name}
                            className="w-full aspect-square  aos-init aos-animate object-cover object-center rounded-lg"
                            data-aos="fade-up"
                            data-aos-offset="150"
                        />
                        {item?.gallery?.map((image, index) => (
                            <img
                                key={index}
                                src={`/storage/images/item/${image}`}
                                alt={`imagen-${index}`}
                                className="w-full aspect-square aos-init aos-animate object-cover object-center rounded-lg"
                                data-aos="fade-up"
                                data-aos-offset="150"
                            />
                        ))}
                    </div>

                    <div className="md:basis-3/4 flex justify-center items-center order-1 md:order-2 w-full">
                        <img
                            src={`/storage/images/item/${item?.image}`}
                            alt={item?.name}
                            className="w-full aspect-square aos-init aos-animate object-cover object-center rounded-lg"
                            data-aos="fade-up"
                            data-aos-offset="150"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-5">
                    <div
                        className="flex flex-col gap-5 pb-10 border-b-2 border-[#DDDDDD] aos-init aos-animate"
                        data-aos="fade-up"
                        data-aos-offset="150"
                    >
                        <div className="flex flex-col xl:flex-row justify-start md:justify-between items-start">
                            <div className="w-full xl:w-[70%] flex justify-start items-start">
                                <h2 className="font-poppins font-bold text-3xl text-colorJL">
                                    {item?.name ?? "Sin nombre"}
                                </h2>
                            </div>
                            <div className="w-full xl:w-[30%] flex justify-start xl:justify-end items-start">
                                <p className="font-poppins font-bold text-3xl text-color3JL">
                                    {CurrencySymbol()}{" "}
                                    {Number2Currency(item?.final_price)}
                                </p>
                            </div>
                        </div>
                        <div>
                            <input
                                ref={quantityRef}
                                type="number"
                                className="text-textPrimary px-2 py-1 border-2 rounded-lg w-16 border-[#FF3131]"
                                defaultValue={isOutOfStock ? 0 : 1}
                                min={isOutOfStock ? 0 : 1}
                                max={item?.stock_unlimited ? 99 : (item?.stock || 0)}
                                disabled={isOutOfStock}
                                step={1}
                                onChange={(e) => {
                                    let val = parseInt(e.target.value, 10);
                                    const maxVal = item?.stock_unlimited ? 99 : (item?.stock || 0);
                                    if (isNaN(val) || val < 1) val = 1;
                                    if (val > maxVal) val = maxVal;
                                    e.target.value = val;
                                }}
                            />
                        </div>

                        {item?.summary && (
                            <p className="text-[#565656] text-text16 md:text-text20 font-normal font-poppins">
                                {item?.summary}
                            </p>
                        )}

                        <div
                            className="flex justify-between items-center font-poppins font-semibold text-white text-sm md:text-base gap-5 pt-3 aos-init aos-animate"
                            data-aos="fade-up"
                            data-aos-offset="150"
                        >
                            <button
                                className={`w-full py-3 px-2 md:px-10 text-center rounded-3xl ${isOutOfStock ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#0051FF] text-white"}`}
                                onClick={onAddClicked}
                                disabled={isOutOfStock}
                            >
                                {isOutOfStock ? "Agotado" : "Quiero comprar"}
                            </button>
                            <a
                                href="#"
                                className="bg-[#25D366] flex justify-center items-center w-full py-3 px-2 md:px-10 text-center gap-2 rounded-3xl"
                            >
                                <span>Cotizar aquí</span>
                                <div>
                                    <i className="mdi mdi-whatsapp"></i>
                                </div>
                            </a>
                        </div>
                    </div>

                    <div
                        className="pt-5 aos-init aos-animate"
                        data-aos="fade-up"
                        data-aos-offset="150"
                    >
                        {item?.category && (
                            <p className="font-poppins font-medium text-sm md:text-base text-colorJL">
                                Categoría:{" "}
                                <span className="text-textPrimary">
                                    {item.category.name}
                                </span>
                            </p>
                        )}
                        {item?.subcategory && (
                            <p className="font-poppins font-medium text-sm md:text-base text-colorJL">
                                Subcategoría:{" "}
                                <span className="text-textPrimary">
                                    {item.subcategory.name}
                                </span>
                            </p>
                        )}
                        {item?.sku && (
                            <p className="font-poppins font-medium text-sm md:text-base text-colorJL">
                                SKU:{" "}
                                <span className="text-textPrimary">
                                    {item.sku}
                                </span>
                            </p>
                        )}
                        {item?.brand && (
                            <p className="font-poppins font-medium text-sm md:text-base text-colorJL">
                                Marca:{" "}
                                <span className="text-textPrimary">
                                    {item.brand.name}
                                </span>
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {html2string(item?.description).trim() && (
                <>
                    <div
                        className="flex flex-col gap-5 pt-10 md:pt-16 font-poppins font-bold text-3xl text-colorJL pb-5 aos-init aos-animate"
                        data-aos="fade-up"
                        data-aos-offset="150"
                    >
                        Descripción
                    </div>

                    <div
                        className="text-[#565656] text-base font-normal font-poppins aos-init aos-animate prose ql-editor"
                        data-aos="fade-up"
                        data-aos-offset="150"
                    >
                        <HtmlContent html={item?.description} />
                    </div>
                </>
            )}
        </section>
    );
};

export default ProductDetailSimple;
