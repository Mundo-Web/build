import React from "react";


const CheckoutCulqi = React.lazy(() => import("./Checkouts/CheckoutCulqi"));
const CheckoutKuchara = React.lazy(() => import("./Checkouts/CheckoutKuchara"));
const CheckoutSteps = React.lazy(() => import("./Checkouts/CheckoutSteps"));
const CheckoutStepsSF = React.lazy(() => import("./Checkouts/CheckoutStepsSF"));
const CheckoutStepsPidelo = React.lazy(() => import("./Checkouts/CheckoutStepsPidelo"));
const CheckoutStepsIbegruas = React.lazy(() => import("./Checkouts/CheckoutStepsIbegruas"));
const Checkout = ({
    which,
    data,
    items,
    cart,
    setCart,
    isUser,
    prefixes = [],
    ubigeos = [],
    contacts,
    generals= [],
    categorias,
}) => {
    const getCheckout = () => {
        switch (which) {
            case "CheckoutCulqi":
                return (
                    <CheckoutCulqi data={data} cart={cart} setCart={setCart} />
                );
            case "CheckoutKuchara":
                return (
                    <CheckoutKuchara
                        data={data}
                        cart={cart}
                        setCart={setCart}
                        items={items}
                        prefixes={prefixes}
                    />
                );
            case "CheckoutSteps":
                return (
                    <CheckoutSteps
                        data={data}
                        cart={cart}
                        setCart={setCart}
                        user={isUser}
                        ubigeos={ubigeos}
                        items={items}
                        generals={generals}
                        categorias={categorias}
                    />
                );
             case "CheckoutStepsPidelo":
                return (
                    <CheckoutStepsPidelo
                        data={data}
                        cart={cart}
                        setCart={setCart}
                        user={isUser}
                        ubigeos={ubigeos}
                        items={items}
                        generals={generals}
                        categorias={categorias}
                    />
                );
            case "CheckoutStepsSF":
                return (
                    <CheckoutStepsSF
                        data={data}
                        cart={cart}
                        setCart={setCart}
                        user={isUser}
                        ubigeos={ubigeos}
                        prefixes={prefixes}
                        contacts={contacts}
                        items={items}
                    />
                );
            case "CheckoutStepsIbegruas":
                return (
                    <CheckoutStepsIbegruas
                        data={data}
                        cart={cart}
                        setCart={setCart}
                        user={isUser}
                        ubigeos={ubigeos}
                        prefixes={prefixes}
                        contacts={contacts}
                        items={items}
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
    return getCheckout();
};

export default Checkout;
