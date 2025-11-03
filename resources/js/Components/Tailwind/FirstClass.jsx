import React from "react";

const CasilleroVirtual = React.lazy(() => import("./FirstClass/CasilleroVirtual"));
const EnviosUSAPeru = React.lazy(() => import("./FirstClass/EnviosUSAPeru"));

const FirstClass = ({
    data,
    which,
    items,
    generals = [],
    cart,
    setCart,
    pages,
    isUser,
    contacts,
}) => {
    const getFirstClassComponent = () => {
        switch (which) {
            case "CasilleroVirtual":
                return (
                    <CasilleroVirtual
                        data={data}
                        items={items}
                        generals={generals}
                        cart={cart}
                        setCart={setCart}
                        pages={pages}
                        isUser={isUser}
                        contacts={contacts}
                    />
                );
            case "EnviosUSAPeru":
                return (
                    <EnviosUSAPeru
                        data={data}
                        items={items}
                        generals={generals}
                        cart={cart}
                        setCart={setCart}
                        pages={pages}
                        isUser={isUser}
                        contacts={contacts}
                    />
                );
            default:
                return (
                    <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">
                        - No Hay componente <b>{which}</b> -
                    </div>
                );
        }
    };
    return getFirstClassComponent();
};

export default FirstClass;
