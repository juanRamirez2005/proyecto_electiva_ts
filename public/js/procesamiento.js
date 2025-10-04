// Función para manejar la selección múltiple de empleados
function manejarSeleccionEmpleado(pedidoNumero) {
    const select = document.getElementById(`empleado${pedidoNumero}Select`);
    const contenedor = document.getElementById(`empleado${pedidoNumero}Seleccionado`);
    
    // Agregar instrucciones al select
    select.setAttribute('title', 'Mantén presionado Ctrl (Cmd en Mac) y haz clic para seleccionar múltiples empleados');
    
    select.addEventListener('change', function() {
        // Limpiar contenedor
        contenedor.innerHTML = '';
        
        // Obtener opciones seleccionadas
        const opcionesSeleccionadas = Array.from(this.selectedOptions);
        
        if (opcionesSeleccionadas.length > 0) {
            // Mostrar mensaje de cantidad
            const mensaje = document.createElement('div');
            mensaje.className = 'mensaje-seleccion';
            mensaje.textContent = `${opcionesSeleccionadas.length} empleado(s) seleccionado(s):`;
            contenedor.appendChild(mensaje);
            
            opcionesSeleccionadas.forEach((opcion, index) => {
                const empleadoCard = document.createElement('div');
                empleadoCard.className = 'empleado-card-mini';
                
                const icono = opcion.getAttribute('data-icon');
                const textoCompleto = opcion.textContent;
                const partes = textoCompleto.split(' - ');
                
                empleadoCard.innerHTML = `
                    <div class="empleado-avatar-mini">${icono}</div>
                    <div class="empleado-info-mini">
                        <div class="empleado-nombre-mini">${partes[0]}</div>
                        <div class="empleado-cargo-mini">${partes[1] || 'Empleado'}</div>
                    </div>
                    <button type="button" class="btn-remover" onclick="removerEmpleado(${pedidoNumero}, '${opcion.value}')">×</button>
                `;
                
                contenedor.appendChild(empleadoCard);
            });
        } else {
            // Mostrar mensaje cuando no hay selección
            const mensaje = document.createElement('div');
            mensaje.className = 'mensaje-vacio';
            mensaje.textContent = 'Ningún empleado seleccionado';
            contenedor.appendChild(mensaje);
        }
        
        // Actualizar resumen
        actualizarResumen();
    });
}

// Función para remover un empleado específico
function removerEmpleado(pedidoNumero, valorEmpleado) {
    const select = document.getElementById(`empleado${pedidoNumero}Select`);
    const opcion = select.querySelector(`option[value="${valorEmpleado}"]`);
    
    if (opcion) {
        opcion.selected = false;
        // Disparar evento change
        select.dispatchEvent(new Event('change'));
    }
}

// Función para actualizar el resumen general
function actualizarResumen() {
    const selects = document.querySelectorAll('.empleado-select');
    const resumen = document.getElementById('resumenProcesamiento');
    
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
        resumen.textContent = 'Selecciona empleados para procesar los pedidos.';
        resumen.className = 'summary';
    } else if (asignados < total) {
        resumen.textContent = `${asignados} de ${total} pedidos asignados (${totalEmpleados} empleados). Completa las asignaciones.`;
        resumen.className = 'summary procesando';
    } else {
        resumen.textContent = `✅ Todos los pedidos asignados (${total} pedidos, ${totalEmpleados} empleados). Listo para procesar.`;
        resumen.className = 'summary completado';
    }
}

// Función para validar el formulario
function validarFormulario() {
    const selects = document.querySelectorAll('.empleado-select');
    let valido = true;
    
    selects.forEach(select => {
        if (select.selectedOptions.length === 0) {
            select.classList.add('error-border');
            valido = false;
        } else {
            select.classList.remove('error-border');
        }
    });
    
    return valido;
}

// Función para confirmar procesamiento
function confirmarProcesamiento() {
    if (!validarFormulario()) {
        alert('Por favor, asigna al menos un empleado a todos los pedidos antes de continuar.');
        return;
    }
    
    const resumen = document.getElementById('resumenProcesamiento');
    const btnConfirmar = document.getElementById('btnConfirmarProcesamiento');
    
    // Simular procesamiento
    resumen.textContent = '🔄 Procesando pedidos...';
    resumen.className = 'summary procesando';
    btnConfirmar.disabled = true;
    btnConfirmar.textContent = 'Procesando...';
    
    setTimeout(() => {
        resumen.textContent = '✅ Todos los pedidos procesados exitosamente. Los empleados han sido notificados.';
        resumen.className = 'summary completado';
        btnConfirmar.textContent = 'Procesado';
        btnConfirmar.style.background = '#6c757d';
        
        // Mostrar mensaje de éxito
        alert('¡Todos los pedidos han sido procesados exitosamente!');
    }, 2000);
}

// Función para limpiar formulario
function limpiarFormulario() {
    const selects = document.querySelectorAll('.empleado-select');
    const contenedores = document.querySelectorAll('.empleado-seleccionado');
    
    selects.forEach(select => {
        select.selectedIndex = -1;
        select.classList.remove('error-border');
    });
    
    contenedores.forEach(contenedor => {
        contenedor.innerHTML = '';
    });
    
    const resumen = document.getElementById('resumenProcesamiento');
    resumen.textContent = 'Selecciona empleados para procesar los pedidos.';
    resumen.className = 'summary';
    
    const btnConfirmar = document.getElementById('btnConfirmarProcesamiento');
    btnConfirmar.disabled = false;
    btnConfirmar.textContent = 'Confirmar Procesamiento';
    btnConfirmar.style.background = '#10b981';
}

// Función para resaltar grupos de clientes
function resaltarGruposClientes() {
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

// Función para ordenar pedidos por hora
function ordenarPedidosPorHora() {
    const grupos = document.querySelectorAll('.cliente-grupo');
    
    grupos.forEach(grupo => {
        const pedidos = Array.from(grupo.querySelectorAll('.pedido-card-large'));
        
        // Extraer hora de cada pedido
        pedidos.forEach(pedido => {
            const titulo = pedido.querySelector('h3').textContent;
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

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Configurar event listeners para cada pedido
    for (let i = 1; i <= 5; i++) {
        manejarSeleccionEmpleado(i);
    }
    
    // Event listener para el botón de confirmar
    document.getElementById('btnConfirmarProcesamiento').addEventListener('click', function(e) {
        e.preventDefault();
        confirmarProcesamiento();
    });
    
    // Event listeners para los selects
    document.querySelectorAll('.empleado-select').forEach(select => {
        select.addEventListener('change', actualizarResumen);
    });
    
    // Resaltar grupos de clientes
    resaltarGruposClientes();
    
    // Ordenar pedidos por hora
    ordenarPedidosPorHora();
    
    // Inicializar resumen
    actualizarResumen();
});
