/**
 * Demostración del sistema de cintillos con programación avanzada
 * 
 * Esta demostración muestra cómo:
 * 1. Configurar múltiples cintillos con horarios específicos
 * 2. Verificar el estado actual del sistema
 * 3. Simular diferentes horarios para pruebas
 */

import CintilloScheduler from '../Utils/CintilloScheduler';

// Ejemplo de configuración compleja de cintillos
const ejemploCintillos = [
    {
        text: "🔥 OFERTA ESPECIAL - 50% OFF en productos seleccionados",
        enabled: true,
        schedule: {
            lunes: { enabled: true, start: "08:00", end: "18:00" },
            martes: { enabled: true, start: "08:00", end: "18:00" },
            miercoles: { enabled: false },
            jueves: { enabled: true, start: "08:00", end: "18:00" },
            viernes: { enabled: true, start: "08:00", end: "20:00" },
            sabado: { enabled: true, start: "10:00", end: "22:00" },
            domingo: { enabled: false }
        }
    },
    {
        text: "🎉 PROMOCIÓN WEEKEND - Envío gratis en compras mayores a $50",
        enabled: true,
        schedule: {
            lunes: { enabled: false },
            martes: { enabled: false },
            miercoles: { enabled: false },
            jueves: { enabled: false },
            viernes: { enabled: true, start: "18:00", end: "23:59" },
            sabado: { enabled: true, start: "00:00", end: "23:59" },
            domingo: { enabled: true, start: "00:00", end: "20:00" }
        }
    },
    {
        text: "⚡ FLASH SALE - Últimas 24 horas para aprovechar descuentos",
        enabled: true,
        schedule: {
            lunes: { enabled: true, start: "12:00", end: "14:00" },
            martes: { enabled: true, start: "12:00", end: "14:00" },
            miercoles: { enabled: true, start: "12:00", end: "14:00" },
            jueves: { enabled: true, start: "12:00", end: "14:00" },
            viernes: { enabled: true, start: "12:00", end: "14:00" },
            sabado: { enabled: false },
            domingo: { enabled: false }
        }
    }
];

/**
 * Función de demostración para probar el sistema
 */
function demostrarSistemaCintillos() {
    console.log('🎯 === DEMOSTRACIÓN DEL SISTEMA DE CINTILLOS ===');
    console.log('');

    // 1. Mostrar configuración
    console.log('📋 Configuración de cintillos:');
    ejemploCintillos.forEach((cintillo, index) => {
        console.log(`${index + 1}. "${cintillo.text}"`);
        console.log(`   Estado: ${cintillo.enabled ? '✅ Habilitado' : '❌ Deshabilitado'}`);
        
        const diasActivos = Object.entries(cintillo.schedule)
            .filter(([dia, config]) => config.enabled)
            .map(([dia, config]) => `${dia} (${config.start}-${config.end})`);
        
        console.log(`   Programación: ${diasActivos.join(', ')}`);
        console.log('');
    });

    // 2. Verificar estado actual
    console.log('⏰ Estado actual del sistema:');
    const ahora = new Date();
    console.log(`Fecha/Hora actual: ${ahora.toLocaleString()}`);
    console.log(`Día de la semana: ${CintilloScheduler.getCurrentDayKey()}`);
    
    const activosAhora = CintilloScheduler.filterActiveCintillos(ejemploCintillos);
    console.log(`Cintillos activos ahora: ${activosAhora.length}`);
    
    if (activosAhora.length > 0) {
        activosAhora.forEach((cintillo, index) => {
            console.log(`  ${index + 1}. "${cintillo.text}"`);
        });
    } else {
        console.log('  ℹ️ No hay cintillos programados para este momento');
    }
    console.log('');

    // 3. Simular diferentes horarios
    console.log('🕐 Simulación de horarios:');
    
    const horariosTest = [
        { dia: 'lunes', hora: '09:00' },
        { dia: 'lunes', hora: '13:00' },
        { dia: 'viernes', hora: '19:00' },
        { dia: 'sabado', hora: '15:00' },
        { dia: 'domingo', hora: '10:00' },
        { dia: 'martes', hora: '22:00' }
    ];

    horariosTest.forEach(({ dia, hora }) => {
        // Crear fecha de prueba
        const fechaTest = new Date();
        const [horas, minutos] = hora.split(':').map(Number);
        fechaTest.setHours(horas, minutos, 0, 0);
        
        console.log(`\n📅 Simulando ${dia} a las ${hora}:`);
        
        let activosEnHorario = [];
        ejemploCintillos.forEach(cintillo => {
            if (cintillo.enabled && cintillo.schedule[dia]?.enabled) {
                const config = cintillo.schedule[dia];
                if (CintilloScheduler.isTimeInRange(hora, config.start, config.end)) {
                    activosEnHorario.push(cintillo);
                }
            }
        });
        
        if (activosEnHorario.length > 0) {
            activosEnHorario.forEach((cintillo, index) => {
                console.log(`  ✅ "${cintillo.text}"`);
            });
        } else {
            console.log('  ❌ No hay cintillos activos en este horario');
        }
    });

    console.log('\n🎯 === FIN DE LA DEMOSTRACIÓN ===');
}

/**
 * Función para generar configuración JSON para copiar al admin
 */
function generarConfiguracionParaAdmin() {
    console.log('\n📄 === CONFIGURACIÓN PARA COPIAR AL ADMIN ===');
    console.log('Copia esta configuración en el campo "Cintillos" del admin:');
    console.log('');
    console.log(JSON.stringify(ejemploCintillos, null, 2));
    console.log('\n💡 Tip: Esta configuración incluye ejemplos de horarios para diferentes días');
}

// Ejecutar demostración si este archivo se carga directamente
if (typeof window !== 'undefined') {
    window.demostrarSistemaCintillos = demostrarSistemaCintillos;
    window.generarConfiguracionParaAdmin = generarConfiguracionParaAdmin;
    
    console.log('🚀 Funciones de demostración cargadas:');
    console.log('- demostrarSistemaCintillos(): Muestra el funcionamiento completo');
    console.log('- generarConfiguracionParaAdmin(): Genera JSON para copiar al admin');
}

export { demostrarSistemaCintillos, generarConfiguracionParaAdmin, ejemploCintillos };