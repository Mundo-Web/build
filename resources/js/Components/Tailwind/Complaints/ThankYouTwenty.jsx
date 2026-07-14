import React from "react";
import { CheckCircle, FileText, User, MapPin, Package, Calendar, Hash, MessageSquare, Printer, ArrowLeft } from "lucide-react";
import { CurrencySymbol } from "../../../Utils/Number2Currency";

export default function ThankYouTwenty({ complaintData, onBackToForm, data }) {
    const formatDate = (dateString) => {
        if (!dateString) return "No especificada";
        return new Date(dateString).toLocaleDateString("es-PE", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-black text-white w-full px-4 py-12 font-paragraph">
            {/* Estilos para impresión */}
            <style>{`
                @media print {
                    body { 
                        background: #000 !important;
                        color: #fff !important;
                        -webkit-print-color-adjust: exact; 
                        color-adjust: exact; 
                    }
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    .printable-area {
                        position: static !important;
                        margin: 0 !important;
                        padding: 20px !important;
                    }
                    .shadow-lg, .shadow-xl { 
                        box-shadow: none !important; 
                        border: 2px solid #fff !important;
                    }
                    .rounded-2xl, .rounded-xl { 
                        border-radius: 0px !important; 
                    }
                    .print-header {
                        border-bottom: 3px solid #fff;
                        margin-bottom: 20px;
                        padding-bottom: 15px;
                        text-align: center;
                    }
                    .print-section {
                        page-break-inside: avoid;
                        margin-bottom: 25px;
                        border: 2px solid #fff;
                        padding: 15px;
                    }
                }
            `}</style>

            <div className="max-w-4xl mx-auto">
                {/* Header de agradecimiento */}
                <div className="text-center mb-12 no-print">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white text-black mb-6">
                        <CheckCircle className="w-12 h-12 stroke-[2.5]" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
                        ¡RECLAMO REGISTRADO!
                    </h1>
                    <p className="text-sm text-white/50 max-w-xl mx-auto leading-relaxed uppercase tracking-wider font-mono">
                        Su reclamo ha sido registrado correctamente. Le daremos respuesta dentro de los próximos 15 días hábiles.
                    </p>
                </div>

                {/* Área imprimible */}
                <div className="printable-area">
                    {/* Header para impresión */}
                    <div className="print-header print-only hidden text-center border-b-4 border-white pb-6 mb-8">
                        <h1 className="text-3xl font-black tracking-tight uppercase">LIBRO DE RECLAMACIONES</h1>
                        <p className="text-sm text-white/60 font-mono mt-2 uppercase tracking-widest">Comprobante de Registro de Reclamo</p>
                        <p className="text-xs text-white/40 font-mono mt-1 uppercase tracking-widest">Fecha de registro: {formatDate(new Date())}</p>
                    </div>

                    {/* Tarjeta principal */}
                    <div className="bg-black border-4 border-white overflow-hidden shadow-[8px_8px_0px_rgba(255,255,255,0.15)] rounded-none">
                        {/* Header de la tarjeta */}
                        <div className="bg-white text-black p-6 border-b-4 border-white">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-black text-white flex items-center justify-center">
                                        <FileText className="w-8 h-8 stroke-[2.5]" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black uppercase tracking-tight">RESUMEN DEL RECLAMO</h2>
                                        <p className="text-xs uppercase font-mono tracking-widest opacity-70">Detalles registrados en el sistema</p>
                                    </div>
                                </div>
                                <div className="border-4 border-black p-3 bg-white text-black shrink-0">
                                    <p className="text-[9px] uppercase tracking-widest font-black mb-1">N° de Reclamo</p>
                                    <p className="text-2xl font-mono font-black tracking-tight">{complaintData.code}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 md:p-8 space-y-10">
                            {/* Datos del consumidor */}
                            <div className="print-section">
                                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-white/10">
                                    <div className="flex items-center justify-center w-10 h-10 border-2 border-white/20 text-white">
                                        <User className="w-5 h-5 stroke-[2]" />
                                    </div>
                                    <h3 className="text-lg font-black uppercase tracking-wider text-white">Datos del Consumidor</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="border border-white/15 bg-white/5 p-4 rounded-none">
                                        <label className="text-[9px] font-mono uppercase tracking-widest text-white/40 block mb-1">Nombre Completo</label>
                                        <p className="text-base font-bold text-white uppercase">{complaintData.nombre}</p>
                                    </div>
                                    <div className="border border-white/15 bg-white/5 p-4 rounded-none">
                                        <label className="text-[9px] font-mono uppercase tracking-widest text-white/40 block mb-1">Documento de Identidad</label>
                                        <p className="text-base font-bold text-white uppercase">{complaintData.tipo_documento} - {complaintData.numero_identidad}</p>
                                    </div>
                                    <div className="border border-white/15 bg-white/5 p-4 rounded-none">
                                        <label className="text-[9px] font-mono uppercase tracking-widest text-white/40 block mb-1">Correo Electrónico</label>
                                        <p className="text-base font-bold text-white">{complaintData.correo_electronico}</p>
                                    </div>
                                    <div className="border border-white/15 bg-white/5 p-4 rounded-none">
                                        <label className="text-[9px] font-mono uppercase tracking-widest text-white/40 block mb-1">Celular / Teléfono</label>
                                        <p className="text-base font-bold text-white uppercase">{complaintData.celular || "No proporcionado"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Ubicación */}
                            <div className="print-section">
                                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-white/10">
                                    <div className="flex items-center justify-center w-10 h-10 border-2 border-white/20 text-white">
                                        <MapPin className="w-5 h-5 stroke-[2]" />
                                    </div>
                                    <h3 className="text-lg font-black uppercase tracking-wider text-white">Ubicación del Consumidor</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="border border-white/15 bg-white/5 p-4 rounded-none">
                                            <label className="text-[9px] font-mono uppercase tracking-widest text-white/40 block mb-1">Departamento</label>
                                            <p className="text-base font-bold text-white uppercase">{complaintData.departamento}</p>
                                        </div>
                                        <div className="border border-white/15 bg-white/5 p-4 rounded-none">
                                            <label className="text-[9px] font-mono uppercase tracking-widest text-white/40 block mb-1">Provincia</label>
                                            <p className="text-base font-bold text-white uppercase">{complaintData.provincia}</p>
                                        </div>
                                        <div className="border border-white/15 bg-white/5 p-4 rounded-none">
                                            <label className="text-[9px] font-mono uppercase tracking-widest text-white/40 block mb-1">Distrito</label>
                                            <p className="text-base font-bold text-white uppercase">{complaintData.distrito}</p>
                                        </div>
                                    </div>
                                    <div className="border border-white/15 bg-white/5 p-4 rounded-none">
                                        <label className="text-[9px] font-mono uppercase tracking-widest text-white/40 block mb-1">Dirección Completa</label>
                                        <p className="text-base font-bold text-white uppercase">{complaintData.direccion}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Detalles del producto/servicio */}
                            <div className="print-section">
                                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-white/10">
                                    <div className="flex items-center justify-center w-10 h-10 border-2 border-white/20 text-white">
                                        <Package className="w-5 h-5 stroke-[2]" />
                                    </div>
                                    <h3 className="text-lg font-black uppercase tracking-wider text-white">Detalle del Bien Contratado</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="border border-white/15 bg-white/5 p-4 rounded-none">
                                            <label className="text-[9px] font-mono uppercase tracking-widest text-white/40 block mb-1">Tipo de Bien</label>
                                            <p className="text-base font-bold text-white uppercase">{complaintData.tipo_producto}</p>
                                        </div>
                                        <div className="border border-white/15 bg-white/5 p-4 rounded-none">
                                            <label className="text-[9px] font-mono uppercase tracking-widest text-white/40 block mb-1">Monto Reclamado</label>
                                            <p className="text-base font-mono font-bold text-white">{CurrencySymbol()} {complaintData.monto_reclamado || "0.00"}</p>
                                        </div>
                                    </div>
                                    <div className="border border-white/15 bg-white/5 p-4 rounded-none">
                                        <label className="text-[9px] font-mono uppercase tracking-widest text-white/40 block mb-1">Descripción del Producto/Servicio</label>
                                        <p className="text-sm text-white/80 leading-relaxed uppercase">{complaintData.descripcion_producto}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Detalles del reclamo */}
                            <div className="print-section">
                                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-white/10">
                                    <div className="flex items-center justify-center w-10 h-10 border-2 border-white/20 text-white">
                                        <MessageSquare className="w-5 h-5 stroke-[2]" />
                                    </div>
                                    <h3 className="text-lg font-black uppercase tracking-wider text-white">Detalles de la Reclamación</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="border border-white/15 bg-white/5 p-4 rounded-none">
                                            <label className="text-[9px] font-mono uppercase tracking-widest text-white/40 block mb-1">Tipo de Solicitud</label>
                                            <p className="text-base font-bold text-white uppercase">{complaintData.tipo_reclamo}</p>
                                        </div>
                                        <div className="border border-white/15 bg-white/5 p-4 rounded-none">
                                            <label className="text-[9px] font-mono uppercase tracking-widest text-white/40 block mb-1">Fecha de Ocurrencia</label>
                                            <p className="text-base font-bold text-white">{formatDate(complaintData.fecha_ocurrencia)}</p>
                                        </div>
                                    </div>
                                    <div className="border border-white/15 bg-white/5 p-4 rounded-none">
                                        <label className="text-[9px] font-mono uppercase tracking-widest text-white/40 block mb-1">Detalle del Reclamo o Queja</label>
                                        <p className="text-sm text-white/80 leading-relaxed whitespace-pre-line">{complaintData.detalle_reclamo}</p>
                                    </div>
                                    {complaintData.numero_pedido && (
                                        <div className="border border-white/15 bg-white/5 p-4 rounded-none">
                                            <label className="text-[9px] font-mono uppercase tracking-widest text-white/40 block mb-1">Número de Pedido</label>
                                            <p className="text-base font-mono font-bold text-white uppercase">{complaintData.numero_pedido}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Información sobre próximos pasos */}
                <div className="mt-8 border-2 border-white/10 bg-white/5 p-6 rounded-none no-print">
                    <h4 className="text-sm font-black uppercase tracking-widest text-white mb-3">Próximos Pasos</h4>
                    <div className="space-y-2 text-xs font-mono uppercase tracking-wider text-white/60">
                        <p>✓ Guarde esta captura o imprima este comprobante como respaldo del registro</p>
                        <p>✓ El área correspondiente evaluará y responderá en un plazo máximo de 15 días hábiles</p>
                        <p>✓ Ante cualquier consulta, puede contactar al correo de soporte oficial</p>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 no-print">
                    <button
                        onClick={onBackToForm}
                        className="flex-1 bg-white text-black font-black uppercase text-xs tracking-widest py-4 px-6 hover:bg-white/95 transition-all duration-200 flex items-center justify-center gap-2 rounded-none active:scale-95"
                    >
                        <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                        Nuevo Registro
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex-1 border-2 border-white/20 hover:border-white bg-transparent text-white font-black uppercase text-xs tracking-widest py-4 px-6 transition-all duration-200 flex items-center justify-center gap-2 rounded-none active:scale-95"
                    >
                        <Printer className="w-4 h-4 stroke-[2.5]" />
                        Imprimir / Guardar PDF
                    </button>
                </div>
            </div>
        </div>
    );
}
