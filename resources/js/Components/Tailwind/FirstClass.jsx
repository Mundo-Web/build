import React from "react";

const CasilleroVirtual = React.lazy(() => import("./FirstClass/CasilleroVirtual"));
const EnviosUSAPeru = React.lazy(() => import("./FirstClass/EnviosUSAPeru"));
const EnviosPeruUSA = React.lazy(() => import("./FirstClass/EnviosPeruUSA"));
const ImportacionCourier = React.lazy(() => import("./FirstClass/ImportacionCourier"));
const ExportacionCourier = React.lazy(() => import("./FirstClass/ExportacionCourier"));
const TarifasNormativas = React.lazy(() => import("./FirstClass/TarifasNormativas"));
const PQRS = React.lazy(() => import("./FirstClass/PQRS"));
const FAQ = React.lazy(() => import("./FirstClass/FAQ"));

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
            case "EnviosPeruUSA":
                return (
                    <EnviosPeruUSA
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
            case "ImportacionCourier":
                return (
                    <ImportacionCourier
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
            case "ExportacionCourier":
                return (
                    <ExportacionCourier
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
            case "TarifasNormativas":
                return (
                    <TarifasNormativas
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
            case "PQRS":
                return (
                    <PQRS
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
            case "FAQ":
                return (
                    <FAQ
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
