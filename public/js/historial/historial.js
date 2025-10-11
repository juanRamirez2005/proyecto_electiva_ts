/**
 * Clase para manejar el historial de empleados
 * Funcionalidad simplificada para buscar por empleado
 */
export class HistorialEmpleados {
    constructor() {
        this.empleadoFiltro = null;
        this.historialLista = null;
        this.resultadosBusqueda = null;
        this.resumenHistorial = null;
        // Datos de ejemplo para el historial
        this.historialData = [];
        this.initializeElements();
        this.loadSampleData();
    }
    /**
     * Inicializa los elementos del DOM necesarios
     */
    initializeElements() {
        this.empleadoFiltro = document.getElementById('empleadoFiltro');
        this.historialLista = document.getElementById('historialLista');
        this.resultadosBusqueda = document.getElementById('resultadosBusqueda');
        this.resumenHistorial = document.getElementById('resumenHistorial');
    }
    /**
     * Carga datos de ejemplo para el historial
     */
    loadSampleData() {
        this.historialData = [
            // Acciones de María García
            {
                id: '1',
                empleado: 'maria',
                nombre: 'María García',
                cargo: 'Chef Principal',
                fecha: '2024-01-15',
                hora: '14:30',
                tipo: 'Procesamiento',
                estado: 'Exitoso',
                descripcion: 'Procesó pedido #ORD001 - Chocolates Fresas con personalización "Feliz cumpleaños"',
                detalles: 'Elaboración de chocolates artesanales con fresas frescas. Tiempo de preparación: 45 minutos. Cliente muy satisfecho con la calidad.'
            },
            {
                id: '2',
                empleado: 'maria',
                nombre: 'María García',
                cargo: 'Chef Principal',
                fecha: '2024-01-15',
                hora: '09:15',
                tipo: 'Procesamiento',
                estado: 'Exitoso',
                descripcion: 'Procesó pedido #ORD008 - Desayuno Especial "Buenos días mi amor"',
                detalles: 'Desayuno completo con jugo natural, croissants, frutas y café. Tiempo de preparación: 30 minutos. Entrega puntual a las 9:45 AM.'
            },
            {
                id: '3',
                empleado: 'maria',
                nombre: 'María García',
                cargo: 'Chef Principal',
                fecha: '2024-01-14',
                hora: '16:20',
                tipo: 'Procesamiento',
                estado: 'Exitoso',
                descripcion: 'Procesó pedido #ORD012 - Cesta de Frutas Premium',
                detalles: 'Selección cuidadosa de frutas de temporada: mango, papaya, fresas, uvas. Presentación elegante en cesta de mimbre.'
            },
            {
                id: '4',
                empleado: 'maria',
                nombre: 'María García',
                cargo: 'Chef Principal',
                fecha: '2024-01-14',
                hora: '11:45',
                tipo: 'Supervisión',
                estado: 'Exitoso',
                descripcion: 'Supervisó preparación de pedido #ORD015 - Arreglo Floral Mixto',
                detalles: 'Revisó calidad de flores, coordinó con decoradora Sofía. Verificó cumplimiento de estándares de calidad.'
            },
            // Acciones de Carlos López
            {
                id: '5',
                empleado: 'carlos',
                nombre: 'Carlos López',
                cargo: 'Chef Especialista',
                fecha: '2024-01-15',
                hora: '15:45',
                tipo: 'Procesamiento',
                estado: 'Exitoso',
                descripcion: 'Procesó pedido #ORD002 - Ramo de Rosas Rojas "Te amo"',
                detalles: 'Arreglo floral con 24 rosas rojas, follaje verde y cinta dorada. Técnica de espiral aplicada. Cliente emocionado con el resultado.'
            },
            {
                id: '6',
                empleado: 'carlos',
                nombre: 'Carlos López',
                cargo: 'Chef Especialista',
                fecha: '2024-01-15',
                hora: '08:30',
                tipo: 'Procesamiento',
                estado: 'Exitoso',
                descripcion: 'Procesó pedido #ORD009 - Desayuno Romántico',
                detalles: 'Desayuno para dos con pancakes, frutas, jugo de naranja y café. Decoración especial con corazones de chocolate.'
            },
            {
                id: '7',
                empleado: 'carlos',
                nombre: 'Carlos López',
                cargo: 'Chef Especialista',
                fecha: '2024-01-14',
                hora: '13:20',
                tipo: 'Procesamiento',
                estado: 'Exitoso',
                descripcion: 'Procesó pedido #ORD013 - Cesta Gourmet',
                detalles: 'Cesta con quesos artesanales, vino, frutas secas y pan. Presentación elegante con moño dorado.'
            },
            // Acciones de Ana Rodríguez
            {
                id: '8',
                empleado: 'ana',
                nombre: 'Ana Rodríguez',
                cargo: 'Supervisora',
                fecha: '2024-01-15',
                hora: '16:20',
                tipo: 'Supervisión',
                estado: 'Exitoso',
                descripcion: 'Supervisó proceso completo de pedido #ORD003 - Desayunos Especiales',
                detalles: 'Verificó calidad de ingredientes, tiempo de preparación y presentación final. Coordinó con equipo de cocina.'
            },
            {
                id: '9',
                empleado: 'ana',
                nombre: 'Ana Rodríguez',
                cargo: 'Supervisora',
                fecha: '2024-01-15',
                hora: '10:00',
                tipo: 'Supervisión',
                estado: 'Exitoso',
                descripcion: 'Supervisó entrega de pedido #ORD010 - Arreglo Floral',
                detalles: 'Verificó estado de flores, coordinó horario de entrega y confirmó recepción con cliente.'
            },
            {
                id: '10',
                empleado: 'ana',
                nombre: 'Ana Rodríguez',
                cargo: 'Supervisora',
                fecha: '2024-01-14',
                hora: '14:15',
                tipo: 'Gestión',
                estado: 'Exitoso',
                descripcion: 'Revisó inventario de ingredientes y materiales',
                detalles: 'Actualizó stock de flores frescas, verificó disponibilidad de chocolates y frutas. Generó reporte de inventario.'
            },
            // Acciones de Luis Martínez
            {
                id: '11',
                empleado: 'luis',
                nombre: 'Luis Martínez',
                cargo: 'Coordinador',
                fecha: '2024-01-15',
                hora: '17:10',
                tipo: 'Coordinación',
                estado: 'Exitoso',
                descripcion: 'Coordinó entrega de pedido #ORD004 - Cesta de Frutas',
                detalles: 'Organizó ruta de entrega, coordinó con repartidor y confirmó recepción. Cliente notificado 30 minutos antes.'
            },
            {
                id: '12',
                empleado: 'luis',
                nombre: 'Luis Martínez',
                cargo: 'Coordinador',
                fecha: '2024-01-15',
                hora: '12:30',
                tipo: 'Coordinación',
                estado: 'Exitoso',
                descripcion: 'Coordinó entrega de pedido #ORD011 - Ramo de Rosas',
                detalles: 'Programó entrega sorpresa, coordinó con cliente para horario óptimo. Entrega exitosa en oficina.'
            },
            {
                id: '13',
                empleado: 'luis',
                nombre: 'Luis Martínez',
                cargo: 'Coordinador',
                fecha: '2024-01-14',
                hora: '15:45',
                tipo: 'Gestión',
                estado: 'Exitoso',
                descripcion: 'Actualizó sistema de seguimiento de pedidos',
                detalles: 'Implementó nuevas funcionalidades en el sistema, capacitó al equipo en uso de nuevas herramientas.'
            },
            // Acciones de Sofía Herrera
            {
                id: '14',
                empleado: 'sofia',
                nombre: 'Sofía Herrera',
                cargo: 'Decoradora',
                fecha: '2024-01-15',
                hora: '18:30',
                tipo: 'Decoración',
                estado: 'Exitoso',
                descripcion: 'Decoró pedido #ORD005 - Arreglo Floral "Gracias por todo"',
                detalles: 'Aplicó técnicas avanzadas de Ikebana, combinó flores de temporada con follaje tropical. Resultado excepcional que superó expectativas.'
            },
            {
                id: '15',
                empleado: 'sofia',
                nombre: 'Sofía Herrera',
                cargo: 'Decoradora',
                fecha: '2024-01-15',
                hora: '11:20',
                tipo: 'Decoración',
                estado: 'Exitoso',
                descripcion: 'Decoró pedido #ORD007 - Cesta de Frutas con arreglo especial',
                detalles: 'Creó composición artística con frutas, agregó elementos decorativos y tarjeta personalizada. Presentación premium.'
            },
            {
                id: '16',
                empleado: 'sofia',
                nombre: 'Sofía Herrera',
                cargo: 'Decoradora',
                fecha: '2024-01-14',
                hora: '16:00',
                tipo: 'Decoración',
                estado: 'Exitoso',
                descripcion: 'Decoró pedido #ORD014 - Desayuno con presentación especial',
                detalles: 'Aplicó técnicas de food styling, creó composición visual atractiva. Cliente impresionado con la presentación.'
            }
        ];
    }
    /**
     * Busca acciones por empleado seleccionado
     */
    buscarPorEmpleado() {
        console.log('🔍 Función buscarPorEmpleado() ejecutada');
        if (!this.empleadoFiltro || !this.historialLista || !this.resultadosBusqueda) {
            console.error('Elementos necesarios no encontrados');
            return;
        }
        const empleadoSeleccionado = this.empleadoFiltro.value;
        console.log('👤 Empleado seleccionado:', empleadoSeleccionado);
        let accionesFiltradas = this.historialData;
        if (empleadoSeleccionado) {
            accionesFiltradas = this.historialData.filter(accion => accion.empleado === empleadoSeleccionado);
            console.log('📊 Acciones filtradas:', accionesFiltradas.length);
        }
        else {
            console.log('📊 Mostrando todas las acciones:', accionesFiltradas.length);
        }
        // Mostrar la sección de resultados
        this.resultadosBusqueda.style.display = 'block';
        console.log('✅ Sección de resultados mostrada');
        this.mostrarAcciones(accionesFiltradas);
        this.actualizarResumen(accionesFiltradas);
    }
    /**
     * Muestra las acciones en la lista
     * @param acciones - Array de acciones a mostrar
     */
    mostrarAcciones(acciones) {
        console.log('📋 Mostrando acciones:', acciones.length);
        if (!this.historialLista) {
            console.error('Elemento historialLista no encontrado');
            return;
        }
        this.historialLista.innerHTML = '';
        if (acciones.length === 0) {
            console.log('❌ No hay acciones para mostrar');
            this.historialLista.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">🔍</div>
                    <h3>No se encontraron acciones</h3>
                    <p>No hay acciones registradas para el empleado seleccionado.</p>
                </div>
            `;
            return;
        }
        console.log('✅ Creando elementos de acciones...');
        acciones.forEach((accion, index) => {
            console.log(`📝 Creando acción ${index + 1}:`, accion.descripcion);
            const accionElement = this.crearElementoAccion(accion);
            this.historialLista.appendChild(accionElement);
        });
        console.log('✅ Todas las acciones mostradas');
    }
    /**
     * Crea un elemento HTML para una acción
     * @param accion - Datos de la acción
     * @returns Elemento HTML de la acción
     */
    crearElementoAccion(accion) {
        const accionDiv = document.createElement('div');
        accionDiv.className = 'accion-item';
        accionDiv.innerHTML = `
            <div class="accion-header">
                <div class="accion-empleado">
                    <div class="empleado-avatar">${this.getEmpleadoIcon(accion.empleado)}</div>
                    <div class="empleado-info">
                        <h4>${accion.nombre}</h4>
                        <p>${accion.cargo}</p>
                    </div>
                </div>
                <div class="accion-meta">
                    <span class="accion-fecha">${accion.fecha}</span>
                    <span class="accion-hora">${accion.hora}</span>
                </div>
            </div>
            <div class="accion-content">
                <div class="accion-tipo">
                    <span class="tipo-badge">${accion.tipo}</span>
                    <span class="estado-badge ${accion.estado.toLowerCase()}">${accion.estado}</span>
                </div>
                <div class="accion-descripcion">
                    <h5>Descripción:</h5>
                    <p>${accion.descripcion}</p>
                </div>
                <div class="accion-detalles" style="display: none;">
                    <h5>Detalles:</h5>
                    <div class="detalles-content">
                        <p>${accion.detalles}</p>
                    </div>
                </div>
                <div class="accion-actions">
                    <button type="button" class="btn-detalles" onclick="historialEmpleados.toggleDetalles(this)">Ver Detalles</button>
                    <button type="button" class="btn-exportar" onclick="historialEmpleados.exportarAccion('${accion.id}')">Exportar</button>
                </div>
            </div>
        `;
        return accionDiv;
    }
    /**
     * Obtiene el icono del empleado
     * @param empleado - ID del empleado
     * @returns Icono del empleado
     */
    getEmpleadoIcon(empleado) {
        const iconos = {
            'maria': '👩‍🍳',
            'carlos': '👨‍🍳',
            'ana': '👩‍💼',
            'luis': '👨‍💼',
            'sofia': '👩‍🎨'
        };
        return iconos[empleado] || '👤';
    }
    /**
     * Actualiza el resumen con las acciones filtradas
     * @param acciones - Acciones filtradas
     */
    actualizarResumen(acciones) {
        var _a;
        if (!this.resumenHistorial)
            return;
        if (acciones.length === 0) {
            this.resumenHistorial.textContent = 'Selecciona un empleado para ver sus acciones registradas.';
            return;
        }
        const totalAcciones = acciones.length;
        const empleadosUnicos = new Set(acciones.map(a => a.empleado)).size;
        const accionesExitosas = acciones.filter(a => a.estado === 'Exitoso').length;
        const tiposAcciones = [...new Set(acciones.map(a => a.tipo))];
        if (empleadosUnicos === 1 && acciones.length > 0) {
            const empleado = ((_a = acciones[0]) === null || _a === void 0 ? void 0 : _a.nombre) || 'Empleado';
            this.resumenHistorial.textContent =
                `📊 ${empleado}: ${totalAcciones} acciones registradas (${accionesExitosas} exitosas). Tipos: ${tiposAcciones.join(', ')}.`;
        }
        else {
            this.resumenHistorial.textContent =
                `📊 Mostrando ${totalAcciones} acciones de ${empleadosUnicos} empleado(s). ${accionesExitosas} exitosas.`;
        }
    }
    /**
     * Limpia todos los filtros
     */
    limpiarFiltros() {
        if (this.empleadoFiltro) {
            this.empleadoFiltro.value = '';
        }
        if (this.resultadosBusqueda) {
            this.resultadosBusqueda.style.display = 'none';
        }
        this.actualizarResumen([]);
    }
    /**
     * Alterna la visualización de detalles de una acción
     * @param button - Botón que activó la función
     */
    toggleDetalles(button) {
        const accionItem = button.closest('.accion-item');
        const detalles = accionItem === null || accionItem === void 0 ? void 0 : accionItem.querySelector('.accion-detalles');
        if (detalles) {
            const isVisible = detalles.style.display !== 'none';
            detalles.style.display = isVisible ? 'none' : 'block';
            button.textContent = isVisible ? 'Ver Detalles' : 'Ocultar Detalles';
        }
    }
    /**
     * Exporta una acción específica
     * @param accionId - ID de la acción a exportar
     */
    exportarAccion(accionId) {
        const accion = this.historialData.find(a => a.id === accionId);
        if (accion) {
            const datos = {
                empleado: accion.nombre,
                cargo: accion.cargo,
                fecha: accion.fecha,
                hora: accion.hora,
                tipo: accion.tipo,
                estado: accion.estado,
                descripcion: accion.descripcion,
                detalles: accion.detalles
            };
            const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `accion_${accionId}_${accion.fecha}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }
    }
    /**
     * Inicializa todos los event listeners
     */
    inicializar() {
        // Event listener para el botón de buscar
        const btnBuscar = document.querySelector('button[onclick="buscarPorEmpleado()"]');
        if (btnBuscar) {
            btnBuscar.addEventListener('click', () => this.buscarPorEmpleado());
        }
        // Event listener para el botón de limpiar
        const btnLimpiar = document.querySelector('button[onclick="limpiarFiltros()"]');
        if (btnLimpiar) {
            btnLimpiar.addEventListener('click', () => this.limpiarFiltros());
        }
        // Inicializar resumen
        this.actualizarResumen([]);
        // Hacer las funciones globales disponibles
        window.buscarPorEmpleado = () => this.buscarPorEmpleado();
        window.limpiarFiltros = () => this.limpiarFiltros();
    }
}
// Crear instancia global cuando se carga el DOM
document.addEventListener('DOMContentLoaded', () => {
    window.historialEmpleados = new HistorialEmpleados();
    window.historialEmpleados.inicializar();
});
// Exportar la clase para uso en módulos
export default HistorialEmpleados;
