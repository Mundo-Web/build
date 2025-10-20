import { Minus, Plus, PlusCircle, Trash2 } from "lucide-react";
import { CurrencySymbol } from "../../../../Utils/Number2Currency";

const CardItemSF = ({ setCart, ...item }) => {

    const onDeleteClicked = () => {
        setCart(old => old.filter(x => x.id !== item.id));
    }

    const onPlusClicked = () => {
        setCart(old =>
            old.map(x =>
                x.id === item.id ? { ...x, quantity: (x.quantity || 1) + 1 } : x
            )
        );
    }

    const onMinusClicked = () => {
        setCart(old =>
            old.map(x => {
                if (x.id === item.id) {
                    const newQuantity = (x.quantity || 1) - 1;
                    if (newQuantity <= 0) {
                        onDeleteClicked(item.id);
                        return null;
                    }
                    return { ...x, quantity: newQuantity };
                }
                return x;
            }).filter(Boolean)
        );
    }

    return (
        <>  
            {/* Versión para desktop (tabla) */}
            <tr key={item.id} className="hidden md:table-row border-b bg-gray-50 font-paragraph">
                {/* Columna Producto */}
                <td className="px-4 py-3">
                    <div className="flex items-center">
                        <img
                            src={`/storage/images/item/${item.image}`}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded mr-4"
                        />
                        <div>
                            <h3 className="text-sm 2xl:text-base font-semibold customtext-neutral-dark">{item.name}</h3>
                            <div className="text-[12px] 2xl:text-sm customtext-neutral-dark space-y-1 mt-1">
                                <p>Color: {item.color}</p>
                                <button
                                    onClick={onDeleteClicked}
                                    className=" text-red-500 transition-colors duration-200 rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
                                    aria-label="Remove item"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </td>
                
                {/* Columna Cantidad */}
                <td className="px-4 py-4">
                    <div className="flex justify-center">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                            <button
                                type="button"
                                onClick={onMinusClicked}
                                className="p-2 text-gray-600 hover:bg-gray-100 transition-colors"
                                aria-label="Decrease quantity"
                            >
                                <Minus size={16} />
                            </button>
                            <div className="w-8 h-8 flex justify-center items-center bg-white">
                                <span className="font-semibold text-sm">{item.quantity || 1}</span>
                            </div>
                            <button
                                type="button"
                                onClick={onPlusClicked}
                                className="p-2 text-gray-600 hover:bg-gray-100 transition-colors"
                                aria-label="Increase quantity"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                </td>
                
                {/* Columna Precio Unitario */}
                <td className="px-4 py-4 text-right min-w-32">
                    <div className="text-xs text-gray-500 line-through">{CurrencySymbol()} {Number(item.price).toFixed(2)}</div>
                    <div className="font-bold">{CurrencySymbol()} {Number(item.final_price).toFixed(2)}</div>
                </td>
                
                {/* Columna Subtotal */}
                <td className="px-4 py-4 text-right font-bold">
                    {CurrencySymbol()} {Number(item.final_price * item.quantity).toFixed(2)}
                </td>
            </tr>

            {/* Versión para mobile (tarjeta) */}
            <div className="md:hidden bg-gray-50  rounded-lg shadow p-4 mb-4 w-full font-paragraph">
                <div className="flex items-start gap-4 relative">
                    <img
                        src={`/storage/images/item/${item.image}`}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1 leading-tight customtext-neutral-dark">{item.name}</h3>
                        <p className="text-sm text-gray-500">Color: {item.color}</p>
                        
                        <div className="mt-1 flex flex-col">
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shadow-sm w-20">
                                <button onClick={onMinusClicked} className="p-2 text-gray-600 hover:bg-gray-100">
                                    <Minus size={16} />
                                </button>
                                <div className="w-12 h-8 flex justify-center items-center bg-white">
                                    <span className="font-semibold text-sm">{item.quantity || 1}</span>
                                </div>
                                <button onClick={onPlusClicked} className="p-2 text-gray-600 hover:bg-gray-100">
                                    <Plus size={16} />
                                </button>
                            </div>

                            <div className="text-right mt-2">
                                <div className="text-xs text-gray-500 line-through">
                                    {CurrencySymbol()} {Number(item.price).toFixed(2)}
                                </div>
                                <div className="font-bold">
                                    {CurrencySymbol()} {Number(item.final_price).toFixed(2)}
                                </div>
                                <div className="text-sm font-bold mt-1">
                                    Subtotal: {CurrencySymbol()} {Number(item.final_price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onDeleteClicked}
                        className="absolute -top-2 -right-2 text-red-500 transition-colors duration-200 rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
                        aria-label="Remove item"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
    </>
    );
}

export default CardItemSF;