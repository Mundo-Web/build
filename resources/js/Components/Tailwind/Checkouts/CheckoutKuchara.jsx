"use client"

import React, { useEffect, useState } from "react"
import Number2Currency, { CurrencySymbol } from "../../../Utils/Number2Currency"
import { ShoppingBag, Gift } from "lucide-react"
import { renderToString } from "react-dom/server"
import LaravelSession from "../../../Utils/LaravelSession"
import Tippy from "@tippyjs/react"
import CulqiRest from "../../../Actions/CulqiRest"
import General from "../../../Utils/General"
import PaymentMethods from './Images/PaymentMethods.svg'
import SalesRest from "../../../Actions/SalesRest"
import Swal from "sweetalert2"
import { Local } from "sode-extend-react"
import Global from "../../../Utils/Global"

const salesRest = new SalesRest()

const CheckoutCulqi = ({ data, cart, setCart, items, prefixes }) => {

  const [deliveryMethod, setDeliveryMethod] = useState("express")
  const [contactInfo, setContactInfo] = useState({
    name: LaravelSession.name,
    lastname: LaravelSession.lastname,
    email: LaravelSession.email,
    phone_prefix: LaravelSession.phone_prefix || '51',
    phone: LaravelSession.phone,
  })
  const [shippingAddress, setShippingAddress] = useState({
    departamento: "",
    provincia: "",
    distrito: "",
    calle: "",
    numero: "",
    referencia: "",
  })
  const [billing, setBilling] = useState({
    type: "boleta",
    number: "",
    fullname: "",
    name: "",
    lastname: ""
  })
  // Add these states at the top with other states
  const [paymentMethod, setPaymentMethod] = useState(
    General.get('checkout_culqi') == 'true' ? 'culqi' :
      General.get('checkout_dwallet') == 'true' ? 'dwallet' :
        General.get('checkout_transfer') == 'true' ? 'transfer' : null
  )
  const [voucher, setVoucher] = useState(null)

  const totalPrice = cart.reduce((acc, item) => {
    const finalPrice = item.discount > 0 ? Math.min(item.price, item.discount) : item.price
    return acc + finalPrice * item.quantity
  }, 0)

  const handleContactInfoChange = (e) => {
    const { name, value } = e.target
    setContactInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Add this with other state declarations
  const [shippingPrice, setShippingPrice] = useState(0)

  // Add this function after other handlers
  const getShippingPrice = (district) => {
    if (deliveryMethod === 'pickup') return 0;

    const selectedDistrict = districts.find(d => d.id == district);
    if (!selectedDistrict) return null;

  

    if (selectedDistrict.price === null) return 'destination';
    return selectedDistrict.price === 0 ? 0 : selectedDistrict.price;
  }

  // Modify handleShippingAddressChange
  const handleShippingAddressChange = (e) => {
    const { name, value } = e.target
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (name === 'distrito') {
  
      setShippingPrice(getShippingPrice(value))
    }
  }

  useEffect(() => {
    const htmlTemplate = (data) => {
      const prefix = data.element.dataset.code
      const flag = data.element.dataset.flag
      return renderToString(<span>
        <span className="inline-block w-8 font-emoji text-center">{flag}</span>
        <b className="me-1">{data.text}</b>
        <span className="text-sm text-opacity-20">{prefix}</span>
      </span>)
    }
    $('.select2-prefix-selector').select2({
      dropdownCssClass: 'py-1',
      containerCssClass: '!border !border-gray-300 !rounded p-2 !h-[42px]',
      arrowCssClass: '!text-primary top-1/2 -translate-y-1/2"',
      //minimumResultsForSearch: -1,
      templateResult: function (data) {
        if (!data.id) {
          return data.text;
        }
        var $container = $(htmlTemplate(data));
        return $container;
      },
      templateSelection: function (data) {
        if (!data.id) {
          return data.text;
        }
        var $container = $(htmlTemplate(data));
        return $container;
      }
    });
  }, [contactInfo.phone_prefix])

  const regions = [...new Set(items.map((item) => item.data?.region))]
  const provinces = [...new Set(items.filter(x => x.data?.region == shippingAddress.departamento).map((item) => item.data?.provincia))]
  const districts = [...new Set(items.filter(x => x.data?.region == shippingAddress.departamento && x.data?.provincia == shippingAddress.provincia).map((item) => ({
    id: item.data?.reniec,
    name: item.data?.distrito,
    price: item.price === null ? null : Number(item.price),
  })))]

  const onCheckoutSubmit = async (e) => {
    e.preventDefault()

    const { isConfirmed } = await Swal.fire({
      title: '¿Confirmar pedido?',
      text: '¿Estás seguro de realizar este pedido? Revise que todos los datos estén correctos antes de confirmar el pedido.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    });

    if (!isConfirmed) return

    const saleData = {
      user_id: LaravelSession.id,
      name: contactInfo.name,
      lastname: contactInfo.lastname,
      email: contactInfo.email,
      phone: contactInfo.phone,
      phone_prefix: contactInfo.phone_prefix,
      country: 'Perú',
      delivery_type: deliveryMethod,
      ubigeo: deliveryMethod == 'express' ? shippingAddress.distrito : null,
      address: shippingAddress.calle,
      number: shippingAddress.numero,
      reference: shippingAddress.referencia,
      payment_method: paymentMethod,
      invoiceType: billing.type,
      documentType: billing.type === 'factura' ? 'ruc' : 'dni',
      document: billing.number,
      businessName: billing.fullname,
      details: JSON.stringify(cart.map((item) => ({
        id: item.id,
        quantity: item.quantity
      }))),
      payment_proof: voucher,
    };

    const formData = new FormData();
    Object.keys(saleData).forEach(key => {
      formData.append(key, saleData[key]);
    });

    // Enviar la solicitud
    const result = await salesRest.save(formData);
    if (!result) return

    setCart([])
    Local.delete(`${Global.APP_CORRELATIVE}_cart`)

    location.href = `${location.origin}/${data.url_thanks}/${result.code}`
  }

  useEffect(() => {
    if (cart.length == 0) location.href = '/'
  }, [])

  const igv = Number(General.igv_checkout) / 100

  const finalPrice = totalPrice + (typeof shippingPrice === 'number' ? shippingPrice : 0)

  return (
    <form id={data?.element_id || null} className="bg-white" onSubmit={onCheckoutSubmit}>
      <div className="container mx-auto px-[5%] py-[2.5%]">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Información del contacto</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block text-sm mb-1">
                    Nombre <b className="text-red-500">*</b>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={contactInfo.name}
                    onChange={handleContactInfoChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Nombre"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="lastname" className="block text-sm mb-1">
                    Apellido <b className="text-red-500">*</b>
                  </label>
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    value={contactInfo.lastname}
                    onChange={handleContactInfoChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Apellido"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm mb-1">
                  E-mail <b className="text-red-500">*</b>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={contactInfo.email}
                  onChange={handleContactInfoChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Correo electrónico"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm mb-1">
                  Celular
                </label>
                <div className="flex gap-2">
                  <select
                    className="select2-prefix-selector w-[200px] p-2 border border-gray-300 rounded"
                    onChange={(e) => setSelectedPrefix(e.target.value)}
                    name="phone_prefix"
                    value={contactInfo.phone_prefix}
                  >
                    <option value="">Selecciona un país</option>
                    {
                      prefixes
                        .sort((a, b) => a.country.localeCompare(b.country))
                        .map((prefix, index) => (
                          <option
                            key={index}
                            value={prefix.realCode}
                            data-code={prefix.beautyCode}
                            data-flag={prefix.flag}
                          >
                            {prefix.country}
                          </option>
                        ))
                    }
                  </select>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={contactInfo.phone}
                    onChange={handleContactInfoChange}
                    className="flex-1 p-2 border border-gray-300 rounded"
                    placeholder="000 000 000"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Dirección de envío</h2>

              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div
                  className={`flex flex-col p-6 rounded-lg border-2 cursor-pointer ${deliveryMethod === "pickup" ? "border-primary bg-gray-100" : "border-gray-200"
                    }`}
                  onClick={() => setDeliveryMethod("pickup")}
                >
                  <div className="flex items-center mb-2">
                    <div
                      className={`w-5 h-5 rounded-full border-2 mr-2 flex items-center justify-center ${deliveryMethod === "pickup" ? "border-primary" : "border-gray-400"
                        }`}
                    >
                      {deliveryMethod === "pickup" && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                    </div>
                    <ShoppingBag className="w-5 h-5 mr-2 text-gray-700" />
                    <span className="font-medium">Recojo en tienda</span>
                  </div>
                  <p className="text-sm text-gray-500 ml-9">Envío gratis</p>
                </div>

                <div
                  className={`flex flex-col p-6 rounded-lg border-2 cursor-pointer ${deliveryMethod === "express" ? "border-primary bg-gray-100" : "border-gray-200"
                    }`}
                  onClick={() => setDeliveryMethod("express")}
                >
                  <div className="flex items-center mb-2">
                    <div
                      className={`w-5 h-5 rounded-full border-2 mr-2 flex items-center justify-center ${deliveryMethod === "express" ? "border-primary" : "border-gray-400"
                        }`}
                    >
                      {deliveryMethod === "express" && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                    </div>
                    <Gift className="w-5 h-5 mr-2 text-gray-700" />
                    <span className="font-medium">Envío express</span>
                  </div>
                  <p className="text-sm text-gray-500 ml-9">Sujeto a evaluación</p>
                </div>
              </div> */}

              {deliveryMethod === "express" && (
                <div className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label htmlFor="departamento" className="block text-sm mb-1">
                        Departamento <b className="text-red-500">*</b>
                      </label>
                      <div className="relative">
                        <select
                          id="departamento"
                          name="departamento"
                          value={shippingAddress.departamento}
                          onChange={handleShippingAddressChange}
                          className="w-full p-2 border border-gray-300 rounded appearance-none pr-8"
                          required={deliveryMethod === "express"}
                        >
                          <option value="">Selecciona un Departamento</option>
                          {
                            regions
                              .sort((a, b) => a.localeCompare(b))
                              .map((region, index) => (
                                <option key={index} value={region}>
                                  {region}
                                </option>
                              ))
                          }
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="provincia" className="block text-sm mb-1">
                        Provincia <b className="text-red-500">*</b>
                      </label>
                      <div className="relative">
                        <select
                          id="provincia"
                          name="provincia"
                          value={shippingAddress.provincia}
                          onChange={handleShippingAddressChange}
                          className="w-full p-2 border border-gray-300 rounded appearance-none pr-8"
                          required={deliveryMethod === "express"}
                        >
                          <option value="">Selecciona un Provincia</option>
                          {
                            provinces
                              .sort((a, b) => a.localeCompare(b))
                              .map((province, index) => (
                                <option key={index} value={province}>
                                  {province}
                                </option>
                              ))
                          }
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="distrito" className="block text-sm mb-1">
                        Distrito <b className="text-red-500">*</b>
                      </label>
                      <div className="relative">
                        <select
                          id="distrito"
                          name="distrito"
                          value={shippingAddress.distrito}
                          onChange={handleShippingAddressChange}
                          className="w-full p-2 border border-gray-300 rounded appearance-none pr-8"
                          required={deliveryMethod === "express"}
                        >
                          <option value="">Selecciona un distrito</option>
                          {
                            districts
                              .sort((a, b) => a.name.localeCompare(b))
                              .map((district, index) => (
                                <option key={index} value={district.id} data-price={district.price}>
                                  {district.name}
                                </option>
                              ))
                          }
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="calle" className="block text-sm mb-1">
                      Avenida / Calle / Jirón <b className="text-red-500">*</b>
                    </label>
                    <input
                      type="text"
                      id="calle"
                      name="calle"
                      value={shippingAddress.calle}
                      onChange={handleShippingAddressChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Ingresa el nombre de la calle"
                      required={deliveryMethod === "express"}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="numero" className="block text-sm mb-1">
                        Número <b className="text-red-500">*</b>
                      </label>
                      <input
                        type="text"
                        id="numero"
                        name="numero"
                        value={shippingAddress.numero}
                        onChange={handleShippingAddressChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Ingresa el número de la calle"
                        required={deliveryMethod === "express"}
                      />
                    </div>

                    <div>
                      <label htmlFor="referencia" className="block text-sm mb-1">
                        Dpto./ Interior/ Piso/ Lote/ Bloque (opcional)
                      </label>
                      <input
                        type="text"
                        id="referencia"
                        name="referencia"
                        value={shippingAddress.referencia}
                        onChange={handleShippingAddressChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Ejem. Casa 3, Dpto 101"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-gray-50 rounded-lg p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Método de pago</h2>

              <div className="space-y-3">
                {
                  General.get("checkout_culqi") == "true" &&
                  <div
                    className={`flex items-center justify-between px-4 py-2 border-2 rounded-lg cursor-pointer ${paymentMethod === 'culqi' ? 'border-primary bg-gray-100' : 'border-gray-200'
                      }`}
                    onClick={() => setPaymentMethod('culqi')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'culqi' ? 'border-primary' : 'border-gray-400'
                        }`}>
                        {paymentMethod === 'culqi' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                      </div>
                      <div className="flex flex-col">
                        <span>Pago con tarjeta</span>
                        <small className="text-xs text-opacity-60 text-black">Formulario Culqi</small>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <img src={PaymentMethods} alt='Métodos de pago - Culqi' className="h-[25px]" />
                    </div>
                  </div>
                }

                {
                  General.get("checkout_dwallet") == "true" &&
                  <>
                    <div
                      className={`flex items-center justify-between px-4 py-2 border-2 rounded-lg cursor-pointer ${paymentMethod === 'dwallet' ? 'border-primary bg-gray-100' : 'border-gray-200'
                        }`}
                      onClick={() => setPaymentMethod('dwallet')}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'dwallet' ? 'border-primary' : 'border-gray-400'
                          }`}>
                          {paymentMethod === 'dwallet' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                        </div>
                        <div className="flex flex-col">
                          <span>Yape / Plin</span>
                          <small className="text-xs text-opacity-60 text-black">Billeteras digitales</small>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Tippy content='Yape BCP'>
                          <img src="/assets/img/banks/yape.png" alt="Yape BCP" className="h-6" />
                        </Tippy>
                        <Tippy content='Plin Interbank'>
                          <img src="/assets/img/banks/plin.png" alt="Plin Interbank" className="h-6" />
                        </Tippy>
                      </div>
                    </div>
                    {(paymentMethod === 'dwallet') && (
                      <div className="mt-4 p-4 bg-white rounded-lg">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex-shrink-0">
                            <img src={`/assets/resources/${General.get('checkout_dwallet_qr')}`} alt={General.get('checkout_dwallet_name')} className="w-full lg:w-48 border rounded" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2">{General.get('checkout_dwallet_name')}</h3>
                            <p className="text-gray-600 mb-4">
                              {General.get('checkout_dwallet_description')}
                            </p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setVoucher(e.target.files[0])}
                              className="block w-full text-sm text-gray-800
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-full file:border-0
                              file:text-sm file:font-semibold
                              file:bg-primary file:text-white
                              hover:file:bg-primary/90 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                }

                {
                  General.get("checkout_transfer") == "true" &&
                  <>
                    <div
                      className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer ${paymentMethod === 'transfer' ? 'border-primary bg-gray-100' : 'border-gray-200'
                        }`}
                      onClick={() => setPaymentMethod('transfer')}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'transfer' ? 'border-primary' : 'border-gray-400'
                          }`}>
                          {paymentMethod === 'transfer' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                        </div>
                        <span>Transferencia</span>
                      </div>
                      <div className="flex gap-3">
                        <img src="/assets/img/banks/bcp.svg" alt="BCP" className="h-4" />
                        <img src="/assets/img/banks/interbank.svg" alt="Interbank" className="h-4" />
                        <img src="/assets/img/banks/bbva.svg" alt="BBVA" className="h-4" />
                      </div>
                    </div>
                    {(paymentMethod === 'transfer') && (
                      <div className="mt-4 p-4 bg-white rounded-lg">
                        <div className="space-y-2">
                          <p className="font-medium mb-0">{General.get('checkout_transfer_name')}</p>
                          <p className="text-gray-600 mb-4">{General.get('checkout_transfer_description')}</p>
                          <p className="text-sm">Código de Cuenta Interbancario (CCI)</p>
                          <p className="font-mono bg-gray-50 p-2 rounded select-all">{General.get('checkout_transfer_cci')}</p>
                          <a href="#" className="text-primary text-sm hover:underline">
                            Envía tu comprobante
                          </a>
                        </div>
                        <div className="mt-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setVoucher(e.target.files[0])}
                            className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-primary file:text-white
                            hover:file:bg-primary/90"
                          />
                        </div>
                      </div>
                    )}
                  </>
                }
              </div>

              <div className="space-y-3 mt-6 border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">Datos de facturación</h2>
                <div >
                  <div className="flex gap-2 w-full">
                    <label className="flex-1">
                      <input
                        type="radio"
                        name="document_type"
                        value="boleta"
                        checked={billing.type == 'boleta'}
                        className="hidden"
                        onChange={(e) => setBilling(old => ({ ...old, type: e.target.value }))}
                      />
                      <div className={`w-full flex gap-3 items-center text-center py-3 px-4 rounded-lg border-2 cursor-pointer transition-all ${billing.type == 'boleta' ? 'border-primary bg-gray-100' : 'border-gray-200'} `}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${billing.type === 'boleta' ? 'border-primary' : 'border-gray-400'
                          }`}>
                          {billing.type === 'boleta' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                        </div>
                        <span>Boleta</span>
                      </div>
                    </label>
                    <label className="flex-1">
                      <input
                        type="radio"
                        name="document_type"
                        value="factura"
                        checked={billing.type == 'factura'}
                        className="hidden"
                        onChange={(e) => setBilling(old => ({ ...old, type: e.target.value }))}
                      />
                      <div className={`w-full flex gap-3 items-center text-center py-3 px-4 rounded-lg border-2 cursor-pointer transition-all ${billing.type == 'factura' ? 'border-primary bg-gray-100' : 'border-gray-200'} `}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${billing.type === 'factura' ? 'border-primary' : 'border-gray-400'
                          }`}>
                          {billing.type === 'factura' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                        </div>
                        <span>Factura</span>
                      </div>
                    </label>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm mb-1">
                      <span>Número de {billing.type == 'factura' ? 'RUC' : 'DNI'}</span>
                      <b className="text-red-500 ms-1">*</b>
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder={billing.type == 'factura' ? '00000000000' : '00000000'}
                      maxLength={billing.type == 'factura' ? 11 : 8}
                      required
                      value={billing.number}
                      onChange={e => setBilling(old => ({ ...old, number: e.target.value }))}
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm mb-1">
                      {billing.type == 'factura' ? 'Razón Social' : 'Nombre completo'}
                      <b className="text-red-500 ms-1">*</b>
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Nombre de razón social"
                      value={billing.fullname}
                      onChange={e => setBilling(old => ({ ...old, fullname: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Resumen del pedido</h2>

              <div className="space-y-6 mb-6">
                {cart.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-16">
                      <img
                        src={`/storage/images/item/${item.image}`}
                        onError={(e) => e.target.src = "/assets/img/noimage/no_img.jpg"}
                        alt={item.name}
                        className="w-16 object-cover object-center aspect-[4/3] rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium line-clamp-2 leading-none mb-2">{item.name || `Producto ${index + 1}`}</h3>
                      <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="border border-gray-300 rounded w-12 text-center py-0.5 text-sm bg-white">
                          {item.quantity.toString().padStart(2, "0")}
                        </div>
                        <div className="leading-none text-end">
                          {
                            item.discount_percent > 0 &&
                            <small className="line-through text-xs text-gray-500">{CurrencySymbol()} {Number2Currency(item.price)}</small>
                          }
                          <span className="font-medium block">{CurrencySymbol()} {Number2Currency(item.final_price)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <p>Envío</p>
                  <span className="text-primary font-medium">
                    {deliveryMethod === 'pickup' && 'Gratis'}
                    {deliveryMethod === 'express' && (
                      shippingPrice === 0 ? 'Gratis' :
                        shippingPrice === null ? 'No disponible' :
                          shippingPrice === 'destination' ? 'Pago en destino' :
                            `{CurrencySymbol()} ${Number2Currency(shippingPrice)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <p>Subtotal</p>
                  <span>{CurrencySymbol()} {Number2Currency(igv > 0 ? finalPrice * (1 - igv) : finalPrice)}</span>
                </div>

                {
                  igv > 0 &&
                  <div className="flex justify-between items-center">
                    <p>IGV ({(igv * 100).toFixed(2)}%)</p>
                    <span>{CurrencySymbol()} {Number2Currency(finalPrice * igv)}</span>
                  </div>
                }

                <div className="flex justify-between items-center font-semibold text-lg pt-2 border-t border-gray-200">
                  <p>Total</p>
                  <span>{CurrencySymbol()} {Number2Currency(finalPrice)}</span>
                </div>

                <button
                  className={`text-white w-full px-4 py-3 rounded-full cursor-pointer inline-block text-center font-medium mt-4 ${(deliveryMethod === 'express' && (shippingPrice === null || shippingPrice === 'destination'))
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary'
                    }`}
                >
                  Pagar ({CurrencySymbol()} {Number2Currency(totalPrice + (typeof shippingPrice === 'number' ? shippingPrice : 0))})
                </button>
              </div>

              {/* <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <p>Envío</p>
                  <span className="text-primary font-medium">Gratis</span>
                </div>

                <div className="flex justify-between items-center">
                  <p>Subtotal</p>
                  <span>{CurrencySymbol()} {Number2Currency(totalPrice)}</span>
                </div>

                <div className="flex justify-between items-center font-semibold text-lg pt-2 border-t border-gray-200">
                  <p>Total</p>
                  <span>{CurrencySymbol()} {Number2Currency(totalPrice)}</span>
                </div>

                <button className="text-white bg-primary w-full px-4 py-3 rounded-full cursor-pointer inline-block text-center font-medium mt-4">
                  Siguiente
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default CheckoutCulqi