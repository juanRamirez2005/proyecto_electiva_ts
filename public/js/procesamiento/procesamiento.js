/**
 * Clase para manejar el procesamiento de pedidos
 * Convierte las funciones JavaScript en métodos de clase TypeScript
 */
export class ProcesamientoPedidos {
    constructor() {
        this.totalPedidos = 5;
        this.resumenElement = null;
        this.btnConfirmarElement = null;
        this.initializeElements();
    }
    /**
     * Inicializa los elementos del DOM necesarios
     */
    initializeElements() {
        this.resumenElement = document.getElementById('resumenProcesamiento');
        this.btnConfirmarElement = document.getElementById('btnConfirmarProcesamiento');
    }
    /**
     * Maneja la selección múltiple de empleados para un pedido específico
     * @param pedidoNumero - Número del pedido (1-5)
     */
    manejarSeleccionEmpleado(pedidoNumero) {
        const select = document.getElementById(`empleado${pedidoNumero}Select`);
        const contenedor = document.getElementById(`empleado${pedidoNumero}Seleccionado`);
        if (!select || !contenedor) {
            console.error(`Elementos no encontrados para el pedido ${pedidoNumero}`);
            return;
        }
        // Agregar instrucciones al select
        select.setAttribute('title', 'Mantén presionado Ctrl (Cmd en Mac) y haz clic para seleccionar múltiples empleados');
        select.addEventListener('change', () => {
            this.actualizarSeleccionEmpleado(select, contenedor, pedidoNumero);
        });
    }
    /**
     * Actualiza la visualización de empleados seleccionados
     * @param select - Elemento select del empleado
     * @param contenedor - Contenedor donde mostrar los empleados seleccionados
     * @param pedidoNumero - Número del pedido
     */
    actualizarSeleccionEmpleado(select, contenedor, pedidoNumero) {
        // Limpiar contenedor
        contenedor.innerHTML = '';
        // Obtener opciones seleccionadas
        const opcionesSeleccionadas = Array.from(select.selectedOptions);
        if (opcionesSeleccionadas.length > 0) {
            // Mostrar mensaje de cantidad
            const mensaje = document.createElement('div');
            mensaje.className = 'mensaje-seleccion';
            mensaje.textContent = `${opcionesSeleccionadas.length} empleado(s) seleccionado(s):`;
            contenedor.appendChild(mensaje);
            opcionesSeleccionadas.forEach((opcion) => {
                const empleadoCard = this.crearEmpleadoCard(opcion, pedidoNumero);
                contenedor.appendChild(empleadoCard);
            });
        }
        else {
            // Mostrar mensaje cuando no hay selección
            const mensaje = document.createElement('div');
            mensaje.className = 'mensaje-vacio';
            mensaje.textContent = 'Ningún empleado seleccionado';
            contenedor.appendChild(mensaje);
        }
        // Actualizar resumen
        this.actualizarResumen();
    }
    /**
     * Crea un card de empleado seleccionado
     * @param opcion - Opción seleccionada del select
     * @param pedidoNumero - Número del pedido
     * @returns Elemento HTML del card del empleado
     */
    crearEmpleadoCard(opcion, pedidoNumero) {
        const empleadoCard = document.createElement('div');
        empleadoCard.className = 'empleado-card-mini';
        const icono = opcion.getAttribute('data-icon') || '👤';
        const textoCompleto = opcion.textContent || '';
        const partes = textoCompleto.split(' - ');
        empleadoCard.innerHTML = `
            <div class="empleado-avatar-mini">${icono}</div>
            <div class="empleado-info-mini">
                <div class="empleado-nombre-mini">${partes[0]}</div>
                <div class="empleado-cargo-mini">${partes[1] || 'Empleado'}</div>
            </div>
            <button type="button" class="btn-remover" onclick="procesamientoPedidos.removerEmpleado(${pedidoNumero}, '${opcion.value}')">×</button>
        `;
        return empleadoCard;
    }
    /**
     * Remueve un empleado específico de la selección
     * @param pedidoNumero - Número del pedido
     * @param valorEmpleado - Valor del empleado a remover
     */
    removerEmpleado(pedidoNumero, valorEmpleado) {
        const select = document.getElementById(`empleado${pedidoNumero}Select`);
        if (!select) {
            console.error(`Select no encontrado para el pedido ${pedidoNumero}`);
            return;
        }
        const opcion = select.querySelector(`option[value="${valorEmpleado}"]`);
        if (opcion) {
            opcion.selected = false;
            // Disparar evento change
            select.dispatchEvent(new Event('change'));
        }
    }
    /**
     * Actualiza el resumen general del procesamiento
     */
    actualizarResumen() {
        const selects = document.querySelectorAll('.empleado-select');
        if (!this.resumenElement) {
            console.error('Elemento de resumen no encontrado');
            return;
        }
        let asignados = 0;
        let total = selects.length;
        let totalEmpleados = 0;
        selects.forEach(select => {
            if (select.selectedOptions.length > 0) {
                asignados++;
                totalEmpleados += select.selectedOptions.length;
            }
        });
        if (asignados === 0) {
            this.resumenElement.textContent = 'Selecciona empleados para procesar los pedidos.';
            this.resumenElement.className = 'summary';
        }
        else if (asignados < total) {
            this.resumenElement.textContent = `${asignados} de ${total} pedidos asignados (${totalEmpleados} empleados). Completa las asignaciones.`;
            this.resumenElement.className = 'summary procesando';
        }
        else {
            this.resumenElement.textContent = `✅ Todos los pedidos asignados (${total} pedidos, ${totalEmpleados} empleados). Listo para procesar.`;
            this.resumenElement.className = 'summary completado';
        }
    }
    /**
     * Valida que todos los formularios estén completos
     * @returns true si el formulario es válido, false en caso contrario
     */
    validarFormulario() {
        const selects = document.querySelectorAll('.empleado-select');
        let valido = true;
        selects.forEach(select => {
            if (select.selectedOptions.length === 0) {
                select.classList.add('error-border');
                valido = false;
            }
            else {
                select.classList.remove('error-border');
            }
        });
        return valido;
    }
    /**
     * Confirma el procesamiento de los pedidos
     */
    confirmarProcesamiento() {
        if (!this.validarFormulario()) {
            alert('Por favor, asigna al menos un empleado a todos los pedidos antes de continuar.');
            return;
        }
        if (!this.resumenElement || !this.btnConfirmarElement) {
            console.error('Elementos necesarios no encontrados');
            return;
        }
        // Simular procesamiento
        this.resumenElement.textContent = '🔄 Procesando pedidos...';
        this.resumenElement.className = 'summary procesando';
        this.btnConfirmarElement.disabled = true;
        this.btnConfirmarElement.textContent = 'Procesando...';
        setTimeout(() => {
            this.resumenElement.textContent = '✅ Todos los pedidos procesados exitosamente. Los empleados han sido notificados.';
            this.resumenElement.className = 'summary completado';
            this.btnConfirmarElement.textContent = 'Procesado';
            this.btnConfirmarElement.style.background = '#6c757d';
            // Mostrar mensaje de éxito
            alert('¡Todos los pedidos han sido procesados exitosamente!');
        }, 2000);
    }
    /**
     * Limpia el formulario completo
     */
    limpiarFormulario() {
        const selects = document.querySelectorAll('.empleado-select');
        const contenedores = document.querySelectorAll('.empleado-seleccionado');
        selects.forEach(select => {
            select.selectedIndex = -1;
            select.classList.remove('error-border');
        });
        contenedores.forEach(contenedor => {
            contenedor.innerHTML = '';
        });
        if (this.resumenElement) {
            this.resumenElement.textContent = 'Selecciona empleados para procesar los pedidos.';
            this.resumenElement.className = 'summary';
        }
        if (this.btnConfirmarElement) {
            this.btnConfirmarElement.disabled = false;
            this.btnConfirmarElement.textContent = 'Confirmar Procesamiento';
            this.btnConfirmarElement.style.background = '#10b981';
        }
    }
    /**
     * Resalta grupos de clientes que tienen múltiples pedidos
     */
    resaltarGruposClientes() {
        const grupos = document.querySelectorAll('.cliente-grupo');
        grupos.forEach(grupo => {
            const pedidos = grupo.querySelectorAll('.pedido-card-large');
            if (pedidos.length > 1) {
                // Si hay más de un pedido, resaltar el grupo
                grupo.style.background = '#f0f9ff';
                grupo.style.borderColor = '#0ea5e9';
            }
        });
    }
    /**
     * Ordena los pedidos por hora dentro de cada grupo de cliente
     */
    ordenarPedidosPorHora() {
        const grupos = document.querySelectorAll('.cliente-grupo');
        grupos.forEach(grupo => {
            const pedidos = Array.from(grupo.querySelectorAll('.pedido-card-large'));
            // Extraer hora de cada pedido
            pedidos.forEach(pedido => {
                var _a;
                const titulo = ((_a = pedido.querySelector('h3')) === null || _a === void 0 ? void 0 : _a.textContent) || '';
                const horaMatch = titulo.match(/(\d{2}:\d{2})/);
                if (horaMatch) {
                    pedido.dataset.hora = horaMatch[1];
                }
            });
            // Ordenar por hora (más reciente primero)
            pedidos.sort((a, b) => {
                const horaA = a.dataset.hora || '00:00';
                const horaB = b.dataset.hora || '00:00';
                return horaB.localeCompare(horaA);
            });
            // Reordenar en el DOM
            pedidos.forEach(pedido => {
                grupo.appendChild(pedido);
            });
        });
    }
    /**
     * Inicializa todos los event listeners y configura la página
     */
    inicializar() {
        // Configurar event listeners para cada pedido
        for (let i = 1; i <= this.totalPedidos; i++) {
            this.manejarSeleccionEmpleado(i);
        }
        // Event listener para el botón de confirmar
        if (this.btnConfirmarElement) {
            this.btnConfirmarElement.addEventListener('click', (e) => {
                e.preventDefault();
                this.confirmarProcesamiento();
            });
        }
        // Event listeners para los selects
        const selects = document.querySelectorAll('.empleado-select');
        selects.forEach(select => {
            select.addEventListener('change', () => this.actualizarResumen());
        });
        // Resaltar grupos de clientes
        this.resaltarGruposClientes();
        // Ordenar pedidos por hora
        this.ordenarPedidosPorHora();
        // Inicializar resumen
        this.actualizarResumen();
    }
}
// Crear instancia global cuando se carga el DOM
document.addEventListener('DOMContentLoaded', () => {
    window.procesamientoPedidos = new ProcesamientoPedidos();
    window.procesamientoPedidos.inicializar();
});
// Exportar la clase para uso en módulos
export default ProcesamientoPedidos;
