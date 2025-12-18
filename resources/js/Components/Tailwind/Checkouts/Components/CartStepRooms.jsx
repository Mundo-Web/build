import React, { useState } from 'react';
import Number2Currency, { CurrencySymbol } from "../../../../Utils/Number2Currency.jsx";
import ButtonPrimary from "./ButtonPrimary";
import ButtonSecondary from "./ButtonSecondary";
import CardItemRooms from "./CardItemRooms";
import { ShieldCheck, Clock, Award } from 'lucide-react';

export default function CartStepRooms({
    data,
    cart,
    setCart,
    onContinue,
    subTotal,
    igv,
    totalFinal,
    openModal,
    totalWithoutDiscounts
}) {
    const isCartEmpty = cart.length === 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-paragraph">
            {/* Cart Items */}
            <div className="lg:col-span-2">
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        {isCartEmpty ? 'Tu carrito está vacío' : 'Revisa tu reserva'}
                    </h1>
                    {!isCartEmpty && (
                        <p className="text-gray-600">
                            {cart.length} {cart.length === 1 ? 'habitación seleccionada' : 'habitaciones seleccionadas'}
                        </p>
                    )}
                </div>
                
                {/* Room Cards */}
                <div className="space-y-4">
                    {isCartEmpty ? (
                        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-2xl">
                            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay habitaciones seleccionadas</h3>
                            <p className="text-gray-500 mb-6">Explora nuestras opciones de alojamiento</p>
                            <a href="/habitaciones" className="px-6 py-3 bg-primary text-white rounded-full hover:opacity-90 transition-all">
                                Ver habitaciones disponibles
                            </a>
                        </div>
                    ) : (
                        cart.map((room, index) => (
                            <CardItemRooms
                                key={`${room.id}-${room.checkIn}-${index}`}
                                {...room}
                                setCart={setCart}
                            />
                        ))
                    )}
                </div>

                {/* Trust Badges */}
                {!isCartEmpty && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                            <ShieldCheck className="w-6 h-6 text-green-600 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-sm text-green-900">Reserva segura</p>
                                <p className="text-xs text-green-700">Pago 100% protegido</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                            <Clock className="w-6 h-6 text-blue-600 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-sm text-blue-900">Confirmación inmediata</p>
                                <p className="text-xs text-blue-700">Por email y SMS</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                            <Award className="w-6 h-6 text-purple-600 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-sm text-purple-900">Mejor precio</p>
                                <p className="text-xs text-purple-700">Garantizado</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Checkout Summary - Sticky Sidebar */}
            <div className="lg:col-span-1">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sticky top-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Resumen de reserva</h3>
                    
                    {!isCartEmpty && (
                        <div className="space-y-4 mb-6">
                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-3 pb-6 border-b">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">{cart.length}</div>
                                    <div className="text-xs text-gray-600 mt-1">
                                        {cart.length === 1 ? 'Habitación' : 'Habitaciones'}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">
                                        {cart.reduce((acc, room) => acc + (room.nights || 1), 0)}
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1">Noches</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">
                                        {cart.reduce((acc, room) => acc + (room.guests || 2), 0)}
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1">Huéspedes</div>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium text-gray-900">
                                        {CurrencySymbol()} {Number2Currency(subTotal)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Impuestos y cargos</span>
                                    <span className="font-medium text-gray-900">
                                        {CurrencySymbol()} {Number2Currency(igv)}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-primary">
                                            {CurrencySymbol()} {Number2Currency(totalFinal)}
                                        </div>
                                        <div className="text-xs text-gray-500">Incluye impuestos</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="space-y-3">
                        <button
                            onClick={onContinue}
                            disabled={isCartEmpty}
                            className={`w-full py-4 px-6 rounded-xl font-semibold text-base transition-all duration-300 ${
                                isCartEmpty 
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                    : 'bg-primary text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                            } ${data?.class_button || ''}`}
                        >
                            {isCartEmpty ? 'Carrito vacío' : 'Continuar con la reserva'}
                        </button>
                        
                        <a 
                            href="/habitaciones" 
                            className="block w-full py-3 px-6 text-center rounded-xl font-medium text-gray-700 border-2 border-gray-300 hover:border-primary hover:text-primary transition-all"
                        >
                            {isCartEmpty ? 'Explorar habitaciones' : 'Agregar más habitaciones'}
                        </a>
                    </div>

                    {/* Info Box */}
                    <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                        <div className="flex items-start gap-3">
                            <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-green-900 mb-1">
                                    ¡Excelente elección!
                                </p>
                                <p className="text-xs text-green-700 leading-relaxed">
                                    Reserva ahora y asegura tu estadía. Confirmación inmediata por email.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Policy Links */}
                    <div className="mt-6 pt-6 border-t">
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Al proceder, aceptas nuestros{' '}
                            <button 
                                onClick={() => openModal && openModal(1)} 
                                className="text-primary font-medium hover:underline"
                            >
                                Términos y Condiciones
                            </button>
                            {' '}y{' '}
                            <button 
                                onClick={() => openModal && openModal(0)} 
                                className="text-primary font-medium hover:underline"
                            >
                                Política de Privacidad
                            </button>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
