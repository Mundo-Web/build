import React, { useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import BaseAdminto from "@Adminto/Base";
import CreateReactScript from "../Utils/CreateReactScript";
import { CurrencySymbol } from "../Utils/Number2Currency";
import Table from "../Components/Adminto/Table";
import Modal from "../Components/Adminto/Modal";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import BasicRest from "../Actions/BasicRest";
import Swal from "sweetalert2";
import { toast, Toaster } from "sonner";

const walletRest = new BasicRest();
walletRest.path = "provider/wallet";

const Wallet = ({ wallet, history, user_financial_details }) => {
    const withdrawalModalRef = useRef();
    const [loading, setLoading] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState("bank_transfer");

    const amountRef = useRef();
    const bankNameRef = useRef();
    const accountNumberRef = useRef();
    const cciNumberRef = useRef();
    const yapeNumberRef = useRef();

    const openWithdrawalModal = () => {
        if (wallet.available < 50) {
            Swal.fire({
                icon: 'warning',
                title: 'Saldo insuficiente',
                text: 'El monto mínimo para solicitar un retiro es S/ 50.00',
                confirmButtonColor: '#3bafda'
            });
            return;
        }
        $(withdrawalModalRef.current).modal("show");
    };

    const handleWithdrawalSubmit = async (e) => {
        e.preventDefault();
        const amount = parseFloat(amountRef.current.value);

        if (amount > wallet.available) {
            toast.error("No puedes retirar más de tu saldo disponible");
            return;
        }

        setLoading(true);

        const details = selectedMethod === 'bank_transfer' ? {
            bank_name: bankNameRef.current?.value,
            account_number: accountNumberRef.current?.value,
            cci_number: cciNumberRef.current?.value
        } : {
            phone_number: yapeNumberRef.current?.value
        };

        // We use the same general endpoint for withdrawals
        const res = await walletRest.post('provider/wallet/withdraw', {
            amount,
            method: selectedMethod,
            details
        });

        if (res) {
            Swal.fire({
                icon: 'success',
                title: 'Solicitud enviada',
                text: 'Tu solicitud de retiro ha sido enviada y será procesada pronto.',
                confirmButtonColor: '#3bafda'
            }).then(() => {
                window.location.reload();
            });
        }
        setLoading(false);
    };

    return (
        <div className="container-fluid">
            <Toaster position="top-right" richColors />
            
            {/* Header section with Balance Cards */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <h4 className="page-title mb-0">Mi Billetera de Proveedor</h4>
                        <button 
                            className="btn btn-primary rounded-pill px-4 shadow-sm"
                            onClick={openWithdrawalModal}
                        >
                            <i className="mdi mdi-cash-minus me-1"></i> Solicitar Pago
                        </button>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card border-0 h-100 shadow-sm" style={{ borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', background: '#ffffff' }}>
                        <div className="card-body p-4 d-flex align-items-center gap-3">
                            <div 
                                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" 
                                style={{ width: "56px", height: "56px", background: "#eff6ff" }}
                            >
                                <i className="mdi mdi-wallet-outline text-primary fs-3"></i>
                            </div>
                            <div className="d-flex flex-column justify-content-center">
                                <h2 className="fw-black mb-1 text-primary" style={{ fontSize: "28px", lineHeight: "1", fontFamily: "'Outfit', sans-serif" }}>
                                    {CurrencySymbol()} {wallet.available.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                </h2>
                                <h6 className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>
                                    Saldo Liquidable
                                </h6>
                                <div className="text-muted small" style={{ fontSize: "11px" }}>
                                    Disponible para retiro
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card border-0 h-100 shadow-sm" style={{ borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', background: '#ffffff' }}>
                        <div className="card-body p-4 d-flex align-items-center gap-3">
                            <div 
                                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" 
                                style={{ width: "56px", height: "56px", background: "#fffbeb" }}
                            >
                                <i className="mdi mdi-clock-outline text-warning fs-3"></i>
                            </div>
                            <div className="d-flex flex-column justify-content-center">
                                <h2 className="fw-bold mb-1 text-dark" style={{ fontSize: "28px", lineHeight: "1", fontFamily: "'Outfit', sans-serif" }}>
                                    {CurrencySymbol()} {wallet.pending.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                </h2>
                                <h6 className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>
                                    Ganancias en Proceso
                                </h6>
                                <div className="text-muted small" style={{ fontSize: "11px" }}>
                                    Pendiente de validación
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card border-0 h-100 shadow-sm" style={{ borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', background: '#ffffff' }}>
                        <div className="card-body p-4 d-flex align-items-center gap-3">
                            <div 
                                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" 
                                style={{ width: "56px", height: "56px", background: "#ecfdf5" }}
                            >
                                <i className="mdi mdi-trending-up text-success fs-3"></i>
                            </div>
                            <div className="d-flex flex-column justify-content-center">
                                <h2 className="fw-bold mb-1 text-success" style={{ fontSize: "28px", lineHeight: "1", fontFamily: "'Outfit', sans-serif" }}>
                                    {CurrencySymbol()} {wallet.total_earned.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                </h2>
                                <h6 className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>
                                    Ventas Históricas
                                </h6>
                                <div className="text-muted small" style={{ fontSize: "11px" }}>
                                    Acumulado histórico total
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                        <div className="card-header bg-transparent border-0 pt-4 px-4 pb-2 d-flex align-items-center justify-content-between">
                            <h5 className="card-title mb-0 fw-bold text-dark" style={{ fontFamily: "'Outfit', sans-serif" }}>Historial Financiero</h5>
                            <span className="badge bg-light text-muted border px-2 py-1" style={{ fontSize: '11px' }}>
                                {history.length} {history.length === 1 ? 'movimiento' : 'movimientos'}
                            </span>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="bg-light" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                                        <tr>
                                            <th className="px-4 py-3 border-0 text-uppercase text-muted fw-bold" style={{ fontSize: '11px', letterSpacing: '0.05em', fontFamily: "'Outfit', sans-serif" }}>Fecha</th>
                                            <th className="py-3 border-0 text-uppercase text-muted fw-bold" style={{ fontSize: '11px', letterSpacing: '0.05em', fontFamily: "'Outfit', sans-serif" }}>Concepto</th>
                                            <th className="py-3 border-0 text-uppercase text-muted fw-bold" style={{ fontSize: '11px', letterSpacing: '0.05em', fontFamily: "'Outfit', sans-serif" }}>Tipo</th>
                                            <th className="py-3 border-0 text-uppercase text-muted fw-bold" style={{ fontSize: '11px', letterSpacing: '0.05em', fontFamily: "'Outfit', sans-serif" }}>Monto</th>
                                            <th className="px-4 py-3 border-0 text-uppercase text-muted fw-bold text-end" style={{ fontSize: '11px', letterSpacing: '0.05em', fontFamily: "'Outfit', sans-serif" }}>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((item, index) => {
                                            const isWithdrawal = item.type === 'withdrawal';
                                            return (
                                                <tr key={index} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                                                    <td className="px-4 text-secondary fw-medium" style={{ fontSize: '13px' }}>
                                                        {new Date(item.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                    </td>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <div 
                                                                className={`rounded-circle d-flex align-items-center justify-content-center me-2 flex-shrink-0`}
                                                                style={{ 
                                                                    width: '28px', 
                                                                    height: '28px', 
                                                                    background: isWithdrawal ? '#fff5f5' : '#f0fdf4',
                                                                    color: isWithdrawal ? '#ef4444' : '#22c55e'
                                                                }}
                                                            >
                                                                <i className={`mdi ${isWithdrawal ? 'mdi-minus-circle-outline' : 'mdi-plus-circle-outline'} fs-5`}></i>
                                                            </div>
                                                            <span className="fw-semibold text-dark-50" style={{ fontSize: '13px' }}>
                                                                {item.description}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {isWithdrawal ? (
                                                            <span className="badge bg-soft-danger text-danger rounded-pill px-2 py-1" style={{ fontSize: '10px', fontWeight: 'bold' }}>Retiro</span>
                                                        ) : (
                                                            <span className="badge bg-soft-success text-success rounded-pill px-2 py-1" style={{ fontSize: '10px', fontWeight: 'bold' }}>Ingreso</span>
                                                        )}
                                                    </td>
                                                    <td className={`${!isWithdrawal ? 'text-success' : 'text-danger'} fw-bold`} style={{ fontSize: '14px', fontFamily: "'Outfit', sans-serif" }}>
                                                        {!isWithdrawal ? '+' : '-'} {CurrencySymbol()} {parseFloat(item.amount).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="px-4 text-end">
                                                        <div className="d-flex align-items-center justify-content-end gap-2">
                                                            {item.receipt_path && (
                                                                <a 
                                                                    href={`/api/withdrawal/media/${item.receipt_path}`} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="btn btn-xs btn-soft-primary d-inline-flex align-items-center gap-1 border-0 rounded-pill px-2 py-1 transition-all"
                                                                    style={{ fontSize: '11px', fontWeight: '600' }}
                                                                    title="Ver Comprobante de Pago"
                                                                >
                                                                    <i className="mdi mdi-file-document-outline"></i>
                                                                    Comprobante
                                                                </a>
                                                            )}
                                                            {(() => {
                                                                const statusLower = String(item.status).toLowerCase();
                                                                switch(statusLower) {
                                                                    case 'completed':
                                                                    case 'paid':
                                                                    case 'approved':
                                                                        return <span className="badge bg-soft-success text-success rounded-pill px-3 py-1 fw-bold" style={{ fontSize: '11px' }}>Completado</span>;
                                                                    case 'pending':
                                                                        return <span className="badge bg-soft-warning text-warning rounded-pill px-3 py-1 fw-bold" style={{ fontSize: '11px' }}>Pendiente</span>;
                                                                    case 'rejected':
                                                                    case 'cancelled':
                                                                    case 'failed':
                                                                        return <span className="badge bg-soft-danger text-danger rounded-pill px-3 py-1 fw-bold" style={{ fontSize: '11px' }}>Rechazado</span>;
                                                                    default:
                                                                        return <span className="badge bg-soft-secondary text-secondary rounded-pill px-3 py-1 fw-bold" style={{ fontSize: '11px' }}>{item.status}</span>;
                                                                }
                                                            })()}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {history.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="text-center py-5 text-muted fw-medium italic" style={{ fontSize: '13px' }}>
                                                    <i className="mdi mdi-information-outline me-1 fs-5 align-middle"></i>
                                                    No se encontraron movimientos en tu billetera.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '1rem' }}>
                        <div className="card-body p-4 text-center">
                            <div className="bg-soft-primary rounded-circle p-3 d-inline-flex mb-3">
                                <i className="mdi mdi-bank fs-1 text-primary"></i>
                            </div>
                            <h5 className="fw-bold mb-1">Tus Datos de Pago</h5>
                            <p className="text-muted small mb-4">Configura dónde quieres recibir el pago de tus productos.</p>
                            
                            <div className="text-start space-y-3">
                                <div className="p-3 bg-light rounded-3 mb-2">
                                    <small className="text-muted d-block">Banco y Cuenta</small>
                                    <span className="fw-bold text-dark">{user_financial_details.bank_name || 'No configurado'}</span>
                                    <div className="small text-truncate">{user_financial_details.account_number || '-'}</div>
                                </div>
                                <div className="p-3 bg-light rounded-3">
                                    <small className="text-muted d-block">CCI o Yape/Plin</small>
                                    <span className="fw-bold text-dark">{user_financial_details.cci_number || user_financial_details.yape_plin_number || 'No configurado'}</span>
                                </div>
                            </div>

                            <a href="/provider/profile" className="btn btn-outline-primary btn-sm rounded-pill mt-4 px-4 w-100">
                                Editar Datos de Cobro
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Withdrawal Modal */}
            <Modal
                modalRef={withdrawalModalRef}
                title="Solicitar Pago de Ventas"
                size="md"
                onSubmit={handleWithdrawalSubmit}
                isSaving={loading}
            >
                <div className="p-2">
                    <div className="alert alert-info border-0 bg-soft-info text-info small">
                        <i className="mdi mdi-information-outline me-2"></i>
                        Recuerda que el monto mínimo para liquidar es <b>S/ 50.00</b>.
                    </div>

                    <div className="mb-4">
                        <InputFormGroup 
                            eRef={amountRef} 
                            label="Monto a Cobrar (S/.)" 
                            type="number" 
                            step="0.01" 
                            required 
                            placeholder={`Máx. ${wallet.available}`}
                        />
                        <div className="d-flex justify-content-between mt-1">
                            <small className="text-muted">Disponible: {CurrencySymbol()} {wallet.available}</small>
                            <button 
                                type="button"
                                className="btn btn-link btn-sm p-0 text-primary fw-bold"
                                onClick={() => amountRef.current.value = wallet.available}
                            >
                                Cobrar todo
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-bold">Método de Pago Preferido</label>
                        <div className="d-flex gap-2">
                            <button 
                                type="button" 
                                className={`btn flex-fill py-3 border-2 ${selectedMethod === 'bank_transfer' ? 'btn-primary border-primary' : 'btn-outline-light text-dark'}`}
                                onClick={() => setSelectedMethod('bank_transfer')}
                            >
                                <i className="mdi mdi-bank d-block fs-3"></i>
                                <small>Banco</small>
                            </button>
                            <button 
                                type="button" 
                                className={`btn flex-fill py-3 border-2 ${selectedMethod === 'yape' ? 'btn-primary border-primary' : 'btn-outline-light text-dark'}`}
                                onClick={() => setSelectedMethod('yape')}
                            >
                                <i className="mdi mdi-cellphone-check d-block fs-3"></i>
                                <small>Yape / Plin</small>
                            </button>
                        </div>
                    </div>

                    {selectedMethod === 'bank_transfer' ? (
                        <div className="space-y-3">
                            <InputFormGroup eRef={bankNameRef} label="Nombre del Banco" defaultValue={user_financial_details.bank_name} required />
                            <InputFormGroup eRef={accountNumberRef} label="Número de Cuenta" defaultValue={user_financial_details.account_number} required />
                            <InputFormGroup eRef={cciNumberRef} label="Número de CCI (Opcional)" defaultValue={user_financial_details.cci_number} />
                        </div>
                    ) : (
                        <InputFormGroup eRef={yapeNumberRef} label="Número de Teléfono" defaultValue={user_financial_details.yape_plin_number} required />
                    )}
                </div>
            </Modal>
        </div>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Billetera de Proveedor">
            <Wallet {...properties} />
        </BaseAdminto>,
    );
});
