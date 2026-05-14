import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { Cookies, JSON, Notify } from "sode-extend-react";
import CreateReactScript from "../Utils/CreateReactScript";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import BaseAdminto from "@Adminto/Base";
import ProfileRest from "../Actions/Admin/ProfileRest";

const Profile = (props) => {
    const nameRef = useRef();
    const lastnameRef = useRef();
    const phoneRef = useRef();
    const bankNameRef = useRef();
    const accountNumberRef = useRef();
    const cciNumberRef = useRef();
    const yapeNumberRef = useRef();

    const [session, setSession] = useState(props.session);

    const onFormSubmit = async (e) => {
        e.preventDefault();

        const request = {
            name: nameRef.current.value,
            lastname: lastnameRef.current.value,
            phone: phoneRef.current.value,
            bank_name: bankNameRef.current.value,
            account_number: accountNumberRef.current.value,
            cci_number: cciNumberRef.current.value,
            yape_plin_number: yapeNumberRef.current.value,
        };

        const result = await ProfileRest.save(request);

        if (!result) return;

        const newSession = structuredClone(session);
        newSession.name = request.name;
        newSession.lastname = request.lastname;
        newSession.phone = request.phone;
        newSession.bank_name = request.bank_name;
        newSession.account_number = request.account_number;
        newSession.cci_number = request.cci_number;
        newSession.yape_plin_number = request.yape_plin_number;
        setSession(newSession);

        Notify.add({
            icon: "/assets/img/icon.svg",
            title: "Perfil Actualizado",
            body: "Tus datos han sido guardados correctamente.",
            type: "success",
        });

        // Recargar la página para reflejar los cambios en todos los componentes
        setTimeout(() => {
            window.location.reload();
        }, 1000); 
    };

    const onProfileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const { full, thumbnail, type, ok } = await File.compress(file);

            if (!ok)
                throw new Error(
                    "Ocurrió un error al comprimir la imagen. Intenta con otra.",
                );

            const request = new FormData();
            request.append(
                "thumbnail",
                await File.fromURL(`data:${type};base64,${thumbnail}`),
            );
            request.append(
                "full",
                await File.fromURL(`data:${type};base64,${full}`),
            );

            const res = await fetch("/api/profile", {
                method: "POST",
                headers: {
                    "X-Xsrf-Token": decodeURIComponent(
                        Cookies.get("XSRF-TOKEN"),
                    ),
                },
                body: request,
            });
            const data = JSON.parseable(await res.text());
            if (!res.ok)
                throw new Error(
                    data?.message ??
                        "Ocurrió un error inesperado al actualizar la foto",
                );

            const newSession = structuredClone(session);
            newSession.uuid = data.data.uuid; 
            setSession(newSession);

            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Correcto",
                body: "La imagen de perfil se actualizó correctamente",
                type: "success",
            });

            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Error",
                body: error.message,
                type: "danger",
            });
        }
    };

    return (
        <div className="row justify-content-center mt-3">
            <div className="col-lg-10 col-xl-8">
                <form className="card border-info" onSubmit={onFormSubmit}>
                    <div className="card-header bg-info text-white">
                        <h4 className="card-title mb-0 text-white">
                            <i className="fas fa-user-circle me-2"></i> Perfil de Proveedor
                        </h4>
                    </div>
                    <div className="card-body p-4">
                        <div className="row">
                            <div className="col-md-4 text-center mb-4 mb-md-0 border-end">
                                <h5 className="mb-3 text-muted">
                                    Logo o Foto
                                </h5>
                                <Tippy
                                    content="Clic para cambiar foto"
                                    arrow={true}
                                >
                                    <label
                                        htmlFor="avatar"
                                        className="rounded-circle mx-auto d-block position-relative"
                                        style={{
                                            cursor: "pointer",
                                            width: "140px",
                                            height: "140px",
                                        }}
                                    >
                                        <input
                                            className="d-none"
                                            type="file"
                                            name="avatar"
                                            id="avatar"
                                            accept="image/*"
                                            onChange={onProfileChange}
                                        />
                                        <img
                                            className="rounded-circle shadow"
                                            src={`/api/profile/thumbnail/${session.uuid}`}
                                            alt={`Perfil de ${session.name} ${session.lastname}`}
                                            style={{
                                                width: "140px",
                                                height: "140px",
                                                objectFit: "cover",
                                                objectPosition: "center",
                                                border: "4px solid #fff",
                                            }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src =
                                                    "/api/cover/thumbnail/null";
                                            }}
                                        />
                                        <div
                                            className="position-absolute bottom-0 end-0 bg-info text-white rounded-circle p-2"
                                            style={{
                                                transform:
                                                    "translate(-10px, -10px)",
                                            }}
                                        >
                                            <i className="fas fa-camera"></i>
                                        </div>
                                    </label>
                                </Tippy>
                                <p className="text-muted small mt-2">
                                    Esta imagen identifica tus productos en la plataforma.
                                </p>
                            </div>

                            <div className="col-md-8 px-md-4">
                                <div className="row">
                                    <InputFormGroup
                                        eRef={nameRef}
                                        label="Nombres / Razón Social"
                                        col="col-md-6"
                                        defaultValue={session.name}
                                        required
                                    />
                                    <InputFormGroup
                                        eRef={lastnameRef}
                                        label="Apellidos / Nombre Comercial"
                                        col="col-md-6"
                                        defaultValue={session.lastname}
                                        required
                                    />
                                    <InputFormGroup
                                        eRef={phoneRef}
                                        label="Celular de Contacto"
                                        col="col-12"
                                        defaultValue={session.phone}
                                    />
                                </div>

                                <div className="card border-primary mt-4 bg-light shadow-sm">
                                    <div className="card-body p-3">
                                        <h5 className="text-primary mb-2 fw-bold">
                                            <i className="mdi mdi-bank me-1"></i>{" "}
                                            Configuración de Pagos
                                        </h5>
                                        <p className="text-muted small mb-3">
                                            Ingresa los datos bancarios donde deseas recibir la liquidación de tus ventas.
                                        </p>
                                        <div className="row">
                                            <InputFormGroup
                                                eRef={bankNameRef}
                                                label="Banco"
                                                col="col-md-6"
                                                defaultValue={session.bank_name}
                                                placeholder="Ej: BCP, BBVA, Interbank"
                                            />
                                            <InputFormGroup
                                                eRef={accountNumberRef}
                                                label="Número de Cuenta"
                                                col="col-md-6"
                                                defaultValue={session.account_number}
                                            />
                                            <InputFormGroup
                                                eRef={cciNumberRef}
                                                label="CCI (Cuenta Interbancaria)"
                                                col="col-md-6"
                                                defaultValue={session.cci_number}
                                            />
                                            <InputFormGroup
                                                eRef={yapeNumberRef}
                                                label="Celular Yape / Plin"
                                                col="col-md-6"
                                                defaultValue={session.yape_plin_number}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="text-end mt-4">
                                    <button
                                        className="btn btn-info px-4 shadow-sm text-white"
                                        type="submit"
                                    >
                                        <i className="fa fa-save me-1"></i>{" "}
                                        Guardar Perfil
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Perfil de Proveedor">
            <Profile {...properties} />
        </BaseAdminto>,
    );
});
