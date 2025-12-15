import Number2Currency, { CurrencySymbol } from "../../../Utils/Number2Currency";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const DeliveryZonesKuchara = ({ data, items }) => {
    // Agrupar zonas por número de zona
    const zonesByNumber = items?.reduce((acc, zone) => {
        if (!acc[zone.zone]) {
            acc[zone.zone] = [];
        }
        acc[zone.zone].push(zone);
        return acc;
    }, {});

    // Ordenar distritos dentro de cada zona
    Object.keys(zonesByNumber).forEach(zone => {
        zonesByNumber[zone].sort((a, b) => a.district.localeCompare(b.district));
    });

    // Mapear días de la semana
    const weekDays = {
        'L': 'Lunes',
        'M': 'Martes',
        'X': 'Miércoles',
        'J': 'Jueves',
        'V': 'Viernes',
        'S': 'Sábado',
        'D': 'Domingo'
    };

    // Agrupar distritos por día de entrega
    const districtsByDay = items?.reduce((acc, zone) => {
        zone.delivery_days.forEach(day => {
            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(zone.district);
        });
        return acc;
    }, {});

    const renderMobileZone = (zone, districts) => (
        <div className="bg-primary rounded-lg overflow-hidden w-full">
            <div className="p-4 text-white">
                <h3 className="text-lg font-semibold">{zone}</h3>
                <p className="text-sm opacity-75">Distrito</p>
            </div>
            <div className="bg-accent p-4">
                {districts.map((district, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-black/10 last:border-0">
                        <span>{district.district}</span>
                        <span>{CurrencySymbol()} {Number2Currency(district.price)}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderMobileDay = (day, districts) => (
        <div className="bg-primary rounded-lg overflow-hidden">
            <div className="p-4 text-white">
                <h3 className="text-lg font-semibold">{weekDays[day]}</h3>
            </div>
            <div className="bg-accent p-4">
                {districts.map((district, index) => (
                    <div key={index} className="py-2 border-b border-black/10 last:border-0">
                        {district}
                    </div>
                ))}
            </div>
        </div>
    );

    const maxLength = Math.max(...Object.values(zonesByNumber || {}).map(zone => zone.length))
    const maxLength2 = Math.max(...Object.values(districtsByDay || {}).map(districts => districts.length))

    return <div className="w-full mx-auto p-[5%]">
        <div>
            <div>

                {/* Vista Desktop */}
                <div className="hidden md:flex gap-8 mb-12">
                    <div className="w-8/12 z-[15]">
                        <h1 className="customtext-primary text-4xl md:text-5xl font-bold mb-2 font-title">COBERTURA DE DELIVERY</h1>
                        <p className="text-lg mb-8">Conecta con tu Agro Interior</p>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-primary rounded-t-2xl">
                                    {Object.keys(zonesByNumber || {}).sort().map((zone, jndex) => (
                                        <>
                                            <th className={`text-white p-3 ${jndex == 0 && 'rounded-tl-2xl'} ${jndex > 0 && 'border-l border-white'} text-left w-[20%]`}>
                                                <small className="block font-light">{zone}</small>
                                                Distrito
                                            </th>
                                            <th className={`text-white p-3 border-l border-white text-start align-bottom w-[13.333%] ${Object.keys(zonesByNumber || {}).length == (jndex + 1) && 'rounded-tr-2xl'}`}>Precios</th>
                                        </>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-accent rounded-b-2xl">
                                {Array.from({
                                    length: maxLength
                                }).map((_, index) => (
                                    <tr key={index}>
                                        {Object.keys(zonesByNumber || {}).sort().map((zone, jndex) => (
                                            <>
                                                <td className={`p-3 ${index == (maxLength - 1) && jndex == 0 && 'rounded-bl-2xl'} ${jndex > 0 && 'border-l border-black'}`}>
                                                    {zonesByNumber[zone]?.[index]?.district || ''}
                                                </td>
                                                <td className={`p-3 border-l border-black text-start ${index == (maxLength - 1) && Object.keys(zonesByNumber || {}).length == (jndex + 1) && 'rounded-br-2xl'}`}>
                                                    {zonesByNumber[zone]?.[index] ? `${CurrencySymbol()} ${Number2Currency(zonesByNumber[zone][index].price)}` : ''}
                                                </td>
                                            </>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="w-4/12 relative z-10">
                        <img
                            className="absolute object-cover object-center -bottom-32 -left-20 w-[calc(100%+160px)] h-[calc(100%+80px)]"
                            src={data?.image}
                            alt="Delivery"
                        />
                    </div>
                </div>

                {/* Vista Mobile */}
                <div className="block md:hidden mb-12 w-full overflow-hidden">
                    <h1 className="customtext-primary text-4xl md:text-5xl font-bold mb-2 font-title w-full">COBERTURA DE DELIVERY</h1>
                    <p className="text-lg mb-8 w-full">Conecta con tu Agro Interior</p>
                    <div className="relative w-full">
                        <Swiper
                            spaceBetween={16}
                            slidesPerView={1.2}
                            className="pb-8"
                        >
                            {Object.keys(zonesByNumber || {}).sort().map(zone => (
                                <SwiperSlide key={zone}>
                                    {renderMobileZone(zone, zonesByNumber[zone])}
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>

                <h2 className="text-[#007a4c] text-4xl md:text-5xl font-bold mb-8 font-title">ZONA DE REPARTO</h2>

                {/* Vista Desktop */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-primary rounded-t-2xl">
                                {Object.entries(weekDays).map(([code, day], index) => {
                                    // Get array of days that have districts
                                    const activeDays = Object.keys(weekDays).filter(day => districtsByDay?.[day]?.length > 0);
                                    const activeIndex = activeDays.indexOf(code);
                                    
                                    return districtsByDay?.[code]?.length > 0 && (
                                        <th key={day} className={`text-white p-3 text-start 
                                            ${activeIndex === 0 && 'rounded-tl-2xl'} 
                                            ${activeIndex > 0 && 'border-l border-white'} 
                                            ${activeIndex === activeDays.length - 1 && 'rounded-tr-2xl'}`}
                                            style={{ width: `${100 / activeDays.length}%` }}
                                        >
                                            {day}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody className="bg-accent rounded-b-2xl">
                            {Array.from({
                                length: Math.max(
                                    ...Object.values(districtsByDay || {}).map(districts => districts?.length || 0)
                                )
                            }).map((_, index) => {
                                // Get array of days that have districts
                                const activeDays = Object.keys(weekDays).filter(day => districtsByDay?.[day]?.length > 0);
                                
                                return (
                                    <tr key={index}>
                                        {Object.keys(weekDays).map(dayCode => {
                                            const activeIndex = activeDays.indexOf(dayCode);
                                            
                                            return districtsByDay?.[dayCode]?.length > 0 && (
                                                <td key={dayCode} className={`p-3 
                                                    ${activeIndex > 0 && 'border-l border-black'}
                                                    ${index === maxLength2 - 1 && activeIndex === 0 && 'rounded-bl-2xl'}
                                                    ${index === maxLength2 - 1 && activeIndex === activeDays.length - 1 && 'rounded-br-2xl'}
                                                `}>
                                                    {districtsByDay?.[dayCode]?.[index] || ''}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Vista Mobile */}
                <div className="block md:hidden w-full overflow-hidden">
                    <div className="relative w-full">
                        <Swiper
                            spaceBetween={16}
                            slidesPerView={1.2}
                            className="pb-8"
                        >
                            {Object.keys(weekDays).map(day => (
                                districtsByDay?.[day]?.length > 0 && (
                                    <SwiperSlide key={day}>
                                        {renderMobileDay(day, districtsByDay[day] || [])}
                                    </SwiperSlide>
                                )
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </div>
    </div>
};

export default DeliveryZonesKuchara;