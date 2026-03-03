import { Printer, ArrowLeft, Check, Download } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { CurrencySymbol } from "../../../Utils/Number2Currency";

const getDocLabel = (type) => {
    const types = [
        { id: "01", name: "DNI" },
        { id: "04", name: "CE" },
        { id: "06", name: "RUC" },
        { id: "07", name: "PASAPORTE" },
        { id: "11", name: "P. NAC." },
        { id: "00", name: "OTROS" },
        { id: "dni", name: "DNI" },
        { id: "ce", name: "CE" },
        { id: "ruc", name: "RUC" },
        { id: "pasaporte", name: "PASAPORTE" },
    ];
    return types.find((t) => t.id === type)?.name || type;
};

const formatDate = (dateString) => {
    if (!dateString) return "No especificada";
    return new Date(dateString).toLocaleDateString("es-PE", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const InfoField = ({ label, value }) => (
    <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-neutral-400 block tracking-[0.15em] uppercase leading-none">
            {label}
        </span>
        <p className="text-[13px] font-black text-neutral-dark tracking-tight leading-tight">
            {value || "—"}
        </p>
    </div>
);

export default function ThankYouRainstar({ complaintData, onBackToForm }) {
    const printRef = useRef();
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!complaintData) return null;

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = () => {
        if (!complaintData || !printRef.current) return;
        setIsGenerating(true);

        const styleLinks = Array.from(
            document.querySelectorAll("link[rel='stylesheet']"),
        )
            .map((l) => `<link rel="stylesheet" href="${l.href}">`)
            .join("\n");

        const rootStyles = getComputedStyle(document.documentElement);
        const primaryColor = rootStyles.getPropertyValue("--bg-primary").trim();
        const neutralDark = rootStyles
            .getPropertyValue("--bg-neutral-dark")
            .trim();

        const receiptHTML = printRef.current.outerHTML;

        const pw = window.open("", "_blank", "width=900,height=700");
        if (!pw) {
            setIsGenerating(false);
            alert(
                "Tu navegador bloqueó la ventana emergente. " +
                    "Permite popups para este sitio e inténtalo de nuevo.",
            );
            return;
        }

        pw.document.write(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Reclamo ${complaintData.code}</title>
  ${styleLinks}
  <style>
    :root {
      --bg-primary: ${primaryColor || "#000000"};
      --bg-neutral-dark: ${neutralDark || "#1a1a1a"};
    }
    @page {
      size: A4 portrait;
      margin: 0;
    }
    html, body {
      background: #ffffff !important;
      margin: 0;
      padding: 14mm 10mm;
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    .no-print { display: none !important; }
    /* Force background for tracking code and indicators */
    .bg-neutral-dark { background-color: var(--bg-neutral-dark) !important; color: #ffffff !important; }
    .bg-primary { background-color: var(--bg-primary) !important; color: #ffffff !important; }
  </style>
</head>
<body>
  ${receiptHTML}
  <script>
    window.addEventListener('load', function () {
      setTimeout(function () { window.print(); window.close(); }, 700);
    });
  <\/script>
</body>
</html>`);
        pw.document.close();
        setIsGenerating(false);
    };

    return (
        <div className="bg-neutral-100 min-h-screen py-16 sm:py-24">
            {/* Loading Overlay */}
            {isGenerating && (
                <div className="fixed inset-0 z-[100] bg-white bg-opacity-95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
                    <div className="relative w-24 h-24 mb-10">
                        <div className="absolute inset-0 border-4 border-neutral-100 rounded-none"></div>
                        <div className="absolute inset-0 border-4 border-black border-t-transparent animate-spin rounded-none"></div>
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">
                        Generando Documento
                    </h2>
                    <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-[0.3em] max-w-xs leading-relaxed">
                        Estamos preparando tu hoja de reclamación en formato
                        oficial. Por favor, no cierres esta ventana.
                    </p>
                </div>
            )}

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @media print {
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    body { 
                        background: white !important; 
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    @page {
                        size: A4;
                        margin: 15mm;
                    }
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
            `,
                }}
            />

            <div className="w-full px-primary 2xl:px-0 2xl:max-w-7xl mx-auto overflow-hidden">
                <div ref={printRef} className="bg-white overflow-hidden">
                    <div className="p-8 md:p-16 print:p-0 space-y-14">
                        {/* Printable Header - Only visible in Print/PDF */}
                        <div className="hidden print-only print:flex flex-col items-center gap-4 border-b-2 border-black pb-8 text-center">
                            <h2 className="text-2xl font-black uppercase tracking-tighter">
                                Libro de Reclamaciones
                            </h2>
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500">
                                Hoja de Reclamación Virtual — Rainstar Store
                            </p>
                        </div>

                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b-[6px] border-neutral-dark pb-12">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-[0.2em]">
                                    <Check size={10} strokeWidth={4} />{" "}
                                    Registrado
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-neutral-dark">
                                    Solicitud <br /> Procesada
                                </h1>
                                <p className="text-neutral-500 text-sm max-w-md leading-relaxed font-medium italic">
                                    Gracias por tu comunicación. El equipo de
                                    Rainstar revisará tu caso con la prioridad
                                    debida.
                                </p>
                            </div>
                            <div className="text-right flex flex-col items-end gap-2">
                                <span className="text-[11px] font-bold text-primary block leading-none mb-1 uppercase tracking-wider">
                                    Código de Seguimiento
                                </span>
                                <span className="text-4xl font-black tracking-tighter tabular-nums bg-neutral-dark text-white px-8 py-4 shadow-xl">
                                    {complaintData.code}
                                </span>
                            </div>
                        </div>

                        {/* Quick Info Bar */}
                        <div className="no-print flex flex-col md:flex-row items-center justify-between p-8 bg-neutral-50 border-l-[6px] border-neutral-dark gap-6">
                            <div className="space-y-1">
                                <p className="text-[11px] font-black text-neutral-dark uppercase tracking-wider">
                                    Conserve este código para futuras consultas.
                                </p>
                                <p className="text-[10px] font-medium text-neutral-400 italic">
                                    Tiempo estimado de respuesta: 15 días
                                    calendario.
                                </p>
                            </div>
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={handleDownloadPDF}
                                    className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest border-b-2 border-neutral-dark pb-1 hover:text-primary hover:border-primary transition-all duration-500"
                                >
                                    <Download size={16} /> Descargar PDF
                                </button>
                            </div>
                        </div>

                        {/* Columnar Data Rows */}
                        <div className="space-y-14">
                            {/* Row 1: 01 & 02 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 pb-14 border-b border-gray-100">
                                <div className="space-y-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 bg-neutral-dark text-white rounded-full flex items-center justify-center text-[10px] font-black shrink-0">
                                            01
                                        </div>
                                        <h3 className="text-sm font-black tracking-tight text-neutral-dark uppercase">
                                            Identificación
                                        </h3>
                                    </div>
                                    <div className="space-y-7 pl-12">
                                        <InfoField
                                            label="Nombre Completo"
                                            value={complaintData.nombre}
                                        />
                                        <InfoField
                                            label="Documento de Identidad"
                                            value={`${getDocLabel(complaintData.tipo_documento)} — ${complaintData.numero_identidad}`}
                                        />
                                        <InfoField
                                            label="Correo Electrónico"
                                            value={
                                                complaintData.correo_electronico
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 bg-neutral-dark text-white rounded-full flex items-center justify-center text-[10px] font-black shrink-0">
                                            02
                                        </div>
                                        <h3 className="text-sm font-black tracking-tight text-neutral-dark uppercase">
                                            Ubicación
                                        </h3>
                                    </div>
                                    <div className="space-y-7 pl-12">
                                        <InfoField
                                            label="Ubigeo"
                                            value={`${complaintData.departamento} / ${complaintData.provincia} / ${complaintData.distrito}`}
                                        />
                                        <InfoField
                                            label="Dirección"
                                            value={complaintData.direccion}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: 03 & 04 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 pb-14 border-b border-gray-100">
                                <div className="space-y-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 bg-neutral-dark text-white rounded-full flex items-center justify-center text-[10px] font-black shrink-0">
                                            03
                                        </div>
                                        <h3 className="text-sm font-black tracking-tight text-neutral-dark uppercase">
                                            Bien Contratado
                                        </h3>
                                    </div>
                                    <div className="space-y-7 pl-12">
                                        <div className="grid grid-cols-2 gap-8">
                                            <InfoField
                                                label="Tipo"
                                                value={
                                                    complaintData.tipo_producto
                                                }
                                            />
                                            <InfoField
                                                label="Monto"
                                                value={`${CurrencySymbol()} ${complaintData.monto_reclamado || "0.00"}`}
                                            />
                                        </div>
                                        <InfoField
                                            label="Descripción del Bien"
                                            value={
                                                complaintData.descripcion_producto
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 bg-neutral-dark text-white rounded-full flex items-center justify-center text-[10px] font-black shrink-0">
                                            04
                                        </div>
                                        <h3 className="text-sm font-black tracking-tight text-neutral-dark uppercase">
                                            Detalles de Solicitud
                                        </h3>
                                    </div>
                                    <div className="space-y-7 pl-12">
                                        <div className="grid grid-cols-2 gap-8">
                                            <InfoField
                                                label="Tipo de Solicitud"
                                                value={
                                                    complaintData.tipo_reclamo
                                                }
                                            />
                                            <InfoField
                                                label="Fecha"
                                                value={formatDate(
                                                    complaintData.fecha_ocurrencia,
                                                )}
                                            />
                                        </div>
                                        <InfoField
                                            label="Número de Pedido"
                                            value={complaintData.numero_pedido}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Row 3: 05 Full Case */}
                            <div className="space-y-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-neutral-dark text-white rounded-full flex items-center justify-center text-[10px] font-black shrink-0">
                                        05
                                    </div>
                                    <h3 className="text-sm font-black tracking-tight text-neutral-dark uppercase">
                                        Exposición del caso
                                    </h3>
                                </div>
                                <div className="pl-12">
                                    <div className="p-10 bg-neutral-50 border-l-[6px] border-primary text-sm font-medium leading-relaxed text-neutral-600 text-justify">
                                        {complaintData.detalle_reclamo}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Final Actions Footer */}
                    <div className="no-print p-8 md:p-16 pt-0 border-t border-neutral-100 flex flex-col sm:flex-row gap-6 justify-center bg-gray-50/50">
                        <button
                            onClick={onBackToForm}
                            className="px-12 py-5 text-[11px] font-black uppercase tracking-[0.2em] bg-neutral-dark text-white hover:bg-primary transition-all duration-500 flex items-center justify-center gap-4 group shadow-xl"
                        >
                            <ArrowLeft
                                size={16}
                                className="group-hover:-translate-x-2 transition-transform duration-500"
                            />
                            Volver al Formulario
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
