import React, { useState } from 'react';

const ContactLaPetaca = ({ data }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        checkIn: '',
        checkOut: '',
        guests: '1',
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Aquí iría la lógica de envío del formulario
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Data de prueba
    const contactInfo = data?.contactInfo || [
        {
            icon: 'phone',
            title: 'Teléfono',
            details: ['+51 987 654 321', '+51 912 345 678'],
        },
        {
            icon: 'mail',
            title: 'Email',
            details: ['info@lapetaca.com', 'reservas@lapetaca.com'],
        },
        {
            icon: 'map',
            title: 'Ubicación',
            details: ['Región Amazonas', 'Chachapoyas, Perú'],
        },
        {
            icon: 'clock',
            title: 'Horario',
            details: ['Lun - Dom: 24 horas', 'Atención continua'],
        },
    ];

    const socials = data?.socials || [
        { name: 'Facebook', icon: 'facebook', url: '#' },
        { name: 'Instagram', icon: 'instagram', url: '#' },
        { name: 'Twitter', icon: 'twitter', url: '#' },
    ];

    const accentColor = data?.accentColor || '#78673A';
    const locationImage = data?.locationImage || 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1200';

    const getIcon = (iconName) => {
        const icons = {
            'phone': <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
            'mail': <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
            'map': <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
            'clock': <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            'facebook': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
            'instagram': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
            'twitter': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>,
            'send': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
        };
        return icons[iconName] || icons['phone'];
    };

    return (
        <section className="py-20 px-4 bg-gradient-to-b from-[#0a0604] to-[#281409]">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: accentColor }}>
                            Contáctanos
                        </h2>
                        <div className="w-24 h-1 mx-auto mb-6" style={{ backgroundColor: accentColor }}></div>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                            Estamos aquí para ayudarte a planificar tu escapada perfecta al Amazonas
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                        {/* Left Column - Contact Info */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-3xl font-bold text-white mb-6">
                                    Información de Contacto
                                </h3>
                                <p className="text-gray-300 leading-relaxed mb-8">
                                    ¿Tienes preguntas sobre nuestras habitaciones, servicios o reservas? No dudes en contactarnos.
                                    Nuestro equipo está disponible 24/7 para asistirte.
                                </p>
                            </div>

                            {/* Contact Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {contactInfo.map((info, index) => (
                                    <div
                                        key={index}
                                        className="bg-gradient-to-br from-[#281409]/60 to-[#281409]/30 p-6 rounded-2xl border transition-all duration-300 hover:transform hover:scale-105"
                                        style={{ borderColor: `${accentColor}33` }}
                                        onMouseEnter={(e) => e.currentTarget.style.borderColor = `${accentColor}99`}
                                        onMouseLeave={(e) => e.currentTarget.style.borderColor = `${accentColor}33`}
                                    >
                                        <div 
                                            className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
                                            style={{ 
                                                backgroundColor: `${accentColor}33`,
                                                color: accentColor
                                            }}
                                        >
                                            {getIcon(info.icon)}
                                        </div>
                                        <h4 className="text-white font-semibold mb-2">{info.title}</h4>
                                        {info.details.map((detail, i) => (
                                            <p key={i} className="text-gray-400 text-sm">
                                                {detail}
                                            </p>
                                        ))}
                                    </div>
                                ))}
                            </div>

                            {/* Social Media */}
                            <div 
                                className="bg-gradient-to-br from-[#281409]/60 to-[#281409]/30 p-8 rounded-2xl border"
                                style={{ borderColor: `${accentColor}33` }}
                            >
                                <h4 className="text-white font-semibold mb-4 text-xl">Síguenos</h4>
                                <div className="flex gap-4">
                                    {socials.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.url}
                                            className="inline-flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 hover:scale-110"
                                            style={{ 
                                                backgroundColor: `${accentColor}33`,
                                                color: accentColor
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = accentColor;
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = `${accentColor}33`;
                                                e.currentTarget.style.color = accentColor;
                                            }}
                                        >
                                            {getIcon(social.icon)}
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Location Image */}
                            <div 
                                className="relative rounded-2xl overflow-hidden h-64 border"
                                style={{ borderColor: `${accentColor}33` }}
                            >
                                <img
                                    src={locationImage}
                                    alt="Ubicación"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#281409]/80 to-transparent flex items-end p-6">
                                    <div>
                                        <h4 className="text-white font-bold text-xl mb-1">
                                            En el Corazón del Amazonas
                                        </h4>
                                        <p className="text-gray-200 text-sm">
                                            Chachapoyas, Región Amazonas, Perú
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Form */}
                        <div 
                            className="bg-gradient-to-br from-[#281409]/60 to-[#281409]/30 p-8 rounded-2xl border"
                            style={{ borderColor: `${accentColor}33` }}
                        >
                            <h3 className="text-3xl font-bold text-white mb-6">
                                Solicita Información
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-gray-300 mb-2 text-sm font-medium">
                                        Nombre Completo *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-[#0a0604]/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all"
                                        style={{ borderColor: `${accentColor}4d` }}
                                        onFocus={(e) => e.target.style.borderColor = accentColor}
                                        onBlur={(e) => e.target.style.borderColor = `${accentColor}4d`}
                                        placeholder="Tu nombre"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="email" className="block text-gray-300 mb-2 text-sm font-medium">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-[#0a0604]/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all"
                                            style={{ borderColor: `${accentColor}4d` }}
                                            onFocus={(e) => e.target.style.borderColor = accentColor}
                                            onBlur={(e) => e.target.style.borderColor = `${accentColor}4d`}
                                            placeholder="tu@email.com"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-gray-300 mb-2 text-sm font-medium">
                                            Teléfono *
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-[#0a0604]/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all"
                                            style={{ borderColor: `${accentColor}4d` }}
                                            onFocus={(e) => e.target.style.borderColor = accentColor}
                                            onBlur={(e) => e.target.style.borderColor = `${accentColor}4d`}
                                            placeholder="+51 987 654 321"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="checkIn" className="block text-gray-300 mb-2 text-sm font-medium">
                                            Fecha de Llegada
                                        </label>
                                        <input
                                            type="date"
                                            id="checkIn"
                                            name="checkIn"
                                            value={formData.checkIn}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-[#0a0604]/50 border rounded-lg text-white focus:outline-none transition-all"
                                            style={{ borderColor: `${accentColor}4d` }}
                                            onFocus={(e) => e.target.style.borderColor = accentColor}
                                            onBlur={(e) => e.target.style.borderColor = `${accentColor}4d`}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="checkOut" className="block text-gray-300 mb-2 text-sm font-medium">
                                            Fecha de Salida
                                        </label>
                                        <input
                                            type="date"
                                            id="checkOut"
                                            name="checkOut"
                                            value={formData.checkOut}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-[#0a0604]/50 border rounded-lg text-white focus:outline-none transition-all"
                                            style={{ borderColor: `${accentColor}4d` }}
                                            onFocus={(e) => e.target.style.borderColor = accentColor}
                                            onBlur={(e) => e.target.style.borderColor = `${accentColor}4d`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="guests" className="block text-gray-300 mb-2 text-sm font-medium">
                                        Número de Huéspedes
                                    </label>
                                    <select
                                        id="guests"
                                        name="guests"
                                        value={formData.guests}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-[#0a0604]/50 border rounded-lg text-white focus:outline-none transition-all"
                                        style={{ borderColor: `${accentColor}4d` }}
                                        onFocus={(e) => e.target.style.borderColor = accentColor}
                                        onBlur={(e) => e.target.style.borderColor = `${accentColor}4d`}
                                    >
                                        <option value="1">1 Huésped</option>
                                        <option value="2">2 Huéspedes</option>
                                        <option value="3">3 Huéspedes</option>
                                        <option value="4">4 Huéspedes</option>
                                        <option value="5+">5+ Huéspedes</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-gray-300 mb-2 text-sm font-medium">
                                        Mensaje
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-[#0a0604]/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all resize-none"
                                        style={{ borderColor: `${accentColor}4d` }}
                                        onFocus={(e) => e.target.style.borderColor = accentColor}
                                        onBlur={(e) => e.target.style.borderColor = `${accentColor}4d`}
                                        placeholder="Cuéntanos sobre tus necesidades..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
                                    style={{ backgroundColor: accentColor }}
                                >
                                    {getIcon('send')}
                                    Enviar Mensaje
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
    );
};

export default ContactLaPetaca;
