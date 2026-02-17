import {
    CheckCircle,
    FileText,
    User,
    MapPin,
    Package,
    MessageSquare,
    Hash,
    Printer,
    ArrowLeft,
    Check,
    Download,
} from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { CurrencySymbol } from "../../../Utils/Number2Currency";
import { useRef, useState } from "react";

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

export default function ThankYouRainstar({ complaintData, onBackToForm }) {
    const printRef = useRef();
    const [isGenerating, setIsGenerating] = useState(false);

    if (!complaintData) return null;

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = async () => {
        setIsGenerating(true);
        // Pequeño delay para que la UI se renderice antes de capturar el canvas
        await new Promise((resolve) => setTimeout(resolve, 500));

        try {
            const element = printRef.current;
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff",
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`reclamacion-${complaintData.code}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="bg-neutral-100 min-h-screen py-24 sm:py-32 px-6 sm:px-12 no-print-bg">
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
                    .print-container {
                        width: 100% !important;
                        max-width: none !important;
                        padding: 20mm !important;
                        margin: 0 !important;
                    }
                }
            `,
                }}
            />

            <div className="w-full max-w-4xl mx-auto shadow-2xl overflow-hidden">
                <div
                    ref={printRef}
                    className="print-container w-full space-y-20 bg-white p-12 md:p-24"
                >
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
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-neutral-900 pb-12">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[9px] font-bold uppercase tracking-[0.3em]">
                                <Check size={10} strokeWidth={4} /> Registrado
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                                Solicitud <br /> Procesada
                            </h1>
                            <p className="text-neutral-500 text-lg max-w-md leading-relaxed">
                                Gracias por tu comunicación. El equipo de
                                Rainstar Store revisará tu caso con la prioridad
                                debida.
                            </p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                                Nº de Reclamo
                            </span>
                            <span className="text-3xl font-black uppercase tracking-tighter tabular-nums bg-neutral-100 px-6 py-2">
                                {complaintData.code}
                            </span>
                        </div>
                    </div>

                    <div className="no-print flex flex-col md:flex-row items-center justify-between p-6 bg-neutral-50 border border-neutral-100 gap-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                            Conserva este código para futuras consultas. Tiempo
                            de respuesta: 15 días.
                        </p>
                        <div className="flex items-center gap-6">
                            <button
                                onClick={handleDownloadPDF}
                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border-b border-black pb-1 hover:border-b-2 transition-all"
                            >
                                <Download size={14} /> Descargar PDF
                            </button>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
                        {/* Consumer Information */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 border-b border-neutral-200 pb-4">
                                <span className="text-[10px] font-black opacity-30 italic">
                                    01
                                </span>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em]">
                                    Identificación
                                </h3>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 block mb-1">
                                        Nombre
                                    </span>
                                    <p className="text-xs font-black uppercase tracking-widest">
                                        {complaintData.nombre}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 block mb-1">
                                        Documento
                                    </span>
                                    <p className="text-xs font-black uppercase tracking-widest">
                                        {getDocLabel(
                                            complaintData.tipo_documento,
                                        )}{" "}
                                        — {complaintData.numero_identidad}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 block mb-1">
                                        Email
                                    </span>
                                    <p className="text-xs font-black uppercase tracking-widest">
                                        {complaintData.correo_electronico}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Location Information */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 border-b border-neutral-200 pb-4">
                                <span className="text-[10px] font-black opacity-30 italic">
                                    02
                                </span>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em]">
                                    Ubicación
                                </h3>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 block mb-1">
                                        Ubigeo
                                    </span>
                                    <p className="text-xs font-black uppercase tracking-widest">
                                        {complaintData.departamento} /{" "}
                                        {complaintData.provincia} /{" "}
                                        {complaintData.distrito}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 block mb-1">
                                        Dirección
                                    </span>
                                    <p className="text-xs font-black uppercase tracking-widest leading-relaxed">
                                        {complaintData.direccion}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Product Information */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 border-b border-neutral-200 pb-4">
                                <span className="text-[10px] font-black opacity-30 italic">
                                    03
                                </span>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em]">
                                    Bien Contratado
                                </h3>
                            </div>
                            <div className="space-y-6">
                                <div className="flex gap-12">
                                    <div>
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 block mb-1">
                                            Tipo
                                        </span>
                                        <p className="text-xs font-black uppercase tracking-widest">
                                            {complaintData.tipo_producto}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 block mb-1">
                                            Monto
                                        </span>
                                        <p className="text-xs font-black uppercase tracking-widest">
                                            {CurrencySymbol()}{" "}
                                            {complaintData.monto_reclamado ||
                                                "0.00"}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 block mb-1">
                                        Descripción
                                    </span>
                                    <p className="text-xs font-black uppercase tracking-widest leading-relaxed">
                                        {complaintData.descripcion_producto}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Complaint Details */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 border-b border-neutral-200 pb-4">
                                <span className="text-[10px] font-black opacity-30 italic">
                                    04
                                </span>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em]">
                                    Detalles
                                </h3>
                            </div>
                            <div className="space-y-6">
                                <div className="flex gap-12">
                                    <div>
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 block mb-1">
                                            Solicitud
                                        </span>
                                        <p className="text-xs font-black uppercase tracking-widest">
                                            {complaintData.tipo_reclamo}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 block mb-1">
                                            Fecha
                                        </span>
                                        <p className="text-xs font-black uppercase tracking-widest">
                                            {formatDate(
                                                complaintData.fecha_ocurrencia,
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 block mb-1">
                                        Nº Pedido
                                    </span>
                                    <p className="text-xs font-black uppercase tracking-widest">
                                        {complaintData.numero_pedido || "—"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Full Detail */}
                        <div className="md:col-span-2 space-y-8">
                            <div className="flex items-center gap-3 border-b border-neutral-200 pb-4">
                                <span className="text-[10px] font-black opacity-30 italic">
                                    05
                                </span>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em]">
                                    Exposición del caso
                                </h3>
                            </div>
                            <div className="p-10 bg-neutral-50 border border-neutral-100 text-xs font-medium uppercase tracking-[0.15em] leading-[2.5] text-neutral-600 text-justify">
                                {complaintData.detalle_reclamo}
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="no-print pt-20 border-t border-neutral-100 flex flex-col sm:flex-row gap-6 justify-center">
                        <button
                            onClick={onBackToForm}
                            className="px-12 py-5 text-[10px] font-black uppercase tracking-[0.2em] bg-black text-white hover:brightness-125 transition-all flex items-center justify-center gap-4 group"
                        >
                            <ArrowLeft
                                size={16}
                                className="group-hover:-translate-x-1 transition-transform"
                            />
                            Volver al Formulario
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
