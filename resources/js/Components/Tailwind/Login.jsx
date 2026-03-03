import React from "react";

const LoginSimple = React.lazy(() => import("./Login/LoginSimple"));

const LoginRainstar = React.lazy(() => import("./Login/LoginRainstar"));

const Login = ({ data, which }) => {
    const getLogin = () => {
        switch (which) {
            case "LoginSimple":
                return <LoginSimple data={data} />;

            case "LoginRainstar":
                return <LoginRainstar data={data} />;
            default:
                return (
                    <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">
                        - No Hay componente <b>{which}</b> -
                    </div>
                );
        }
    };
    return getLogin();
};

export default Login;
