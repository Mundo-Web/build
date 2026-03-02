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
    const whatsappNumberRef = useRef();
    const whatsappMessageRef = useRef();

    const [session, setSession] = useState(props.session);

    const onFormSubmit = async (e) => {
        e.preventDefault();

        const request = {
            name: nameRef.current.value,
            lastname: lastnameRef.current.value,
            phone: phoneRef.current.value,
            whatsapp_number: whatsappNumberRef.current.value,
            whatsapp_message: whatsappMessageRef.current.value,
        };

        const result = await ProfileRest.save(request);

        if (!result) return;

        const newSession = structuredClone(session);
        newSession.name = request.name;
        newSession.lastname = request.lastname;
        newSession.phone = request.phone;
        newSession.whatsapp_number = request.whatsapp_number;
        newSession.whatsapp_message = request.whatsapp_message;
        setSession(newSession);

        // Recargar la página para reflejar los cambios en todos los componentes
        setTimeout(() => {
            window.location.reload();
        }, 1000); // Esperar 1 segundo para que se vea la notificación de éxito
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
            newSession.uuid = data.data.uuid; // Usar uuid en lugar de relative_id
            setSession(newSession);

            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Correcto",
                body: "La imagen de perfil se actualizó correctamente",
                type: "success",
            });

            // Recargar la página para reflejar los cambios en todos los componentes
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
                <form className="card border-primary" onSubmit={onFormSubmit}>
                    <div className="card-header bg-primary text-white">
                        <h4 className="card-title mb-0 text-white">
                            <i className="fas fa-user-circle me-2"></i> Mis
                            Datos Personales
                        </h4>
                    </div>
                    <div className="card-body p-4">
                        <div className="row">
                            <div className="col-md-4 text-center mb-4 mb-md-0 border-end">
                                <h5 className="mb-3 text-muted">
                                    Foto de Asesor
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
                                            className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2"
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
                                    Esta foto será visible en el botón de
                                    WhatsApp cuando tus clientes te contacten.
                                </p>
                            </div>

                            <div className="col-md-8 px-md-4">
                                <div className="row">
                                    <InputFormGroup
                                        eRef={nameRef}
                                        label="Nombres"
                                        col="col-md-6"
                                        value={session.name}
                                        required
                                    />
                                    <InputFormGroup
                                        eRef={lastnameRef}
                                        label="Apellidos"
                                        col="col-md-6"
                                        value={session.lastname}
                                        required
                                    />
                                    <InputFormGroup
                                        eRef={phoneRef}
                                        label="Celular Principal"
                                        col="col-12"
                                        value={session.phone}
                                    />
                                </div>

                                <div className="card border-success mt-4 bg-light shadow-sm">
                                    <div className="card-body p-3">
                                        <h5 className="text-success mb-2 fw-bold">
                                            <i className="mdi mdi-whatsapp me-1"></i>{" "}
                                            WhatsApp Personalizado
                                        </h5>
                                        <p className="text-muted small mb-3">
                                            Si dejas estos campos vacíos, los
                                            clientes te contactarán a tu Celular
                                            Principal por defecto con un mensaje
                                            estándar de tienda.
                                        </p>
                                        <div className="row">
                                            <InputFormGroup
                                                eRef={whatsappNumberRef}
                                                label="Número exclusivo WhatsApp"
                                                col="col-md-5"
                                                value={session.whatsapp_number}
                                                placeholder="Ej. 51922333444"
                                            />
                                            <InputFormGroup
                                                eRef={whatsappMessageRef}
                                                label="Mensaje de recibimiento por defecto"
                                                col="col-md-7"
                                                value={session.whatsapp_message}
                                                placeholder="Ej: ¡Hola Asesor! vengo de tu enlace..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="text-end mt-4">
                                    <button
                                        className="btn btn-primary px-4 shadow-sm"
                                        type="submit"
                                    >
                                        <i className="fa fa-save me-1"></i>{" "}
                                        Guardar Cambios
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
        <BaseAdminto {...properties} title="Mis Datos y WhatsApp">
            <Profile {...properties} />
        </BaseAdminto>,
    );
});
