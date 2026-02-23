import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import BaseAdminto from "@Adminto/Base";
import CreateReactScript from "../Utils/CreateReactScript";
import Swal from "sweetalert2";

const Home = ({ user, storeUrl }) => {
    const [copiedStore, setCopiedStore] = useState(false);
    const [copiedReferral, setCopiedReferral] = useState(false);

    const referralUrl = storeUrl; // El storeUrl es el link de la tienda (/{uuid})

    // El enlace de referido lleva al modal de "Únete a nosotros" con el código pre-llenado
    const baseUrl = window.location.origin;
    const inviteUrl = `${baseUrl}/?ref=${user?.uuid || ""}#une-a-nosotros`;

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text).then(() => {
            if (type === "store") {
                setCopiedStore(true);
                setTimeout(() => setCopiedStore(false), 2000);
            } else {
                setCopiedReferral(true);
                setTimeout(() => setCopiedReferral(false), 2000);
            }
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Enlace copiado",
                showConfirmButton: false,
                timer: 1500,
                toast: true,
            });
        });
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-10 col-lg-8">
                {/* Card Principal - Bienvenida */}
                <div className="card">
                    <div className="card-body text-center p-5">
                        <h2 className="mb-4">¡Bienvenido, {user.name}!</h2>
                        <p className="lead text-muted mb-5">
                            Aquí está tu enlace personalizado de tienda.
                            Compártelo con tus clientes para comenzar a recibir
                            pedidos.
                        </p>

                        <div className="form-group mb-4">
                            <label className="fw-bold mb-2">
                                Tu Enlace de Tienda
                            </label>
                            <div className="input-group input-group-lg">
                                <input
                                    type="text"
                                    className="form-control text-center bg-light"
                                    value={storeUrl}
                                    readOnly
                                />
                                <button
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={() =>
                                        copyToClipboard(storeUrl, "store")
                                    }
                                    title="Copiar enlace"
                                >
                                    {copiedStore ? (
                                        <i className="fa fa-check"></i>
                                    ) : (
                                        <i className="fa fa-copy"></i>
                                    )}{" "}
                                    Copiar
                                </button>
                                <a
                                    href={storeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline-secondary"
                                    title="Abrir enlace"
                                >
                                    <i className="fa fa-external-link-alt"></i>
                                </a>
                            </div>
                        </div>

                        <div className="mt-4">
                            <div
                                className="alert alert-info border-0 shadow-sm"
                                role="alert"
                            >
                                <i className="mdi mdi-information me-2"></i>
                                Cualquier compra realizada a través de este
                                enlace se registrará automáticamente en tu
                                cuenta.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card de Código de Referido */}
                <div className="card border-primary">
                    <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">
                            <i className="fas fa-users me-2"></i>
                            Tu Código de Referido
                        </h5>
                    </div>
                    <div className="card-body p-4">
                        <p className="text-muted mb-3">
                            Comparte tu código de referido con personas que
                            quieran ser proveedores. Cuando se registren a
                            través de tu enlace, quedarán asociados a ti en
                            nuestro sistema.
                        </p>

                        <div className="row align-items-center">
                            <div className="col-md-6 mb-3 mb-md-0">
                                <label className="fw-bold mb-2 text-muted small text-uppercase">
                                    Tu Código Único (UUID)
                                </label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control bg-light text-center fw-bold font-monospace"
                                        value={user.uuid || "Sin código"}
                                        readOnly
                                        style={{ fontSize: "0.85rem" }}
                                    />
                                    <button
                                        className="btn btn-outline-primary"
                                        type="button"
                                        onClick={() =>
                                            copyToClipboard(
                                                user.uuid,
                                                "referral",
                                            )
                                        }
                                        title="Copiar código"
                                    >
                                        {copiedReferral ? (
                                            <i className="fa fa-check"></i>
                                        ) : (
                                            <i className="fa fa-copy"></i>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="fw-bold mb-2 text-muted small text-uppercase">
                                    Enlace de Referido (Invitar)
                                </label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control bg-light text-center"
                                        value={inviteUrl}
                                        readOnly
                                        style={{ fontSize: "0.85rem" }}
                                    />
                                    <button
                                        className="btn btn-primary"
                                        type="button"
                                        onClick={() =>
                                            copyToClipboard(
                                                inviteUrl,
                                                "referral",
                                            )
                                        }
                                        title="Copiar enlace de referido"
                                    >
                                        <i className="fa fa-copy me-1"></i>{" "}
                                        Copiar
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 p-3 bg-light rounded-3">
                            <div className="d-flex align-items-start">
                                <i className="fas fa-lightbulb text-warning fs-4 me-3 mt-1"></i>
                                <div>
                                    <h6 className="mb-1">¿Cómo funciona?</h6>
                                    <ul className="mb-0 small text-muted">
                                        <li>
                                            <strong>Enlace de Tienda:</strong>{" "}
                                            Comparte <code>{referralUrl}</code>{" "}
                                            para que tus clientes vean la
                                            tienda.
                                        </li>
                                        <li>
                                            <strong>Enlace de Referido:</strong>{" "}
                                            Comparte el enlace de invitación
                                            para que un amigo se una como
                                            proveedor. Se abrirá un formulario
                                            con tu código pre-llenado.
                                        </li>
                                        <li>
                                            Al solicitar ser proveedor, su
                                            solicitud quedará vinculada a ti.
                                        </li>
                                        <li>
                                            El administrador verá que fue
                                            referido por ti en el panel de
                                            solicitudes.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Dashboard de Proveedor">
            <Home {...properties} />
        </BaseAdminto>,
    );
});
