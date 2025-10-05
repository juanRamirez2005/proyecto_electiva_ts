// Función para alternar la configuración de un empleado
function toggleEmpleado(empleadoId) {
    const config = document.getElementById(`config-${empleadoId}`);
    const button = event.target;
    
    if (config.style.display === 'none') {
        config.style.display = 'block';
        button.textContent = 'Ocultar';
        button.classList.add('active');
    } else {
        config.style.display = 'none';
        button.textContent = 'Configurar';
        button.classList.remove('active');
    }
    
    actualizarResumen();
}

// Función para manejar checkboxes de "Libre"
function manejarCheckboxLibre(empleadoId, dia) {
    const checkbox = document.getElementById(`${empleadoId}-${dia}-libre`);
    const inicioInput = document.getElementById(`${empleadoId}-${dia}-inicio`);
    const finInput = document.getElementById(`${empleadoId}-${dia}-fin`);
    
    if (checkbox.checked) {
        inicioInput.disabled = true;
        finInput.disabled = true;
        inicioInput.value = '';
        finInput.value = '';
    } else {
        inicioInput.disabled = false;
        finInput.disabled = false;
        // Restaurar valores por defecto
        inicioInput.value = getHorarioDefecto(empleadoId, dia, 'inicio');
        finInput.value = getHorarioDefecto(empleadoId, dia, 'fin');
    }
    
    actualizarResumen();
}

// Función para obtener horario por defecto
function getHorarioDefecto(empleadoId, dia, tipo) {
    const horariosDefecto = {
        'maria': {
            'lunes': { inicio: '08:00', fin: '16:00' },
            'martes': { inicio: '08:00', fin: '16:00' },
            'miercoles': { inicio: '08:00', fin: '16:00' },
            'jueves': { inicio: '08:00', fin: '16:00' },
            'viernes': { inicio: '08:00', fin: '16:00' },
            'sabado': { inicio: '09:00', fin: '15:00' },
            'domingo': { inicio: '10:00', fin: '14:00' }
        },
        'carlos': {
            'lunes': { inicio: '12:00', fin: '20:00' },
            'martes': { inicio: '12:00', fin: '20:00' },
            'miercoles': { inicio: '12:00', fin: '20:00' },
            'jueves': { inicio: '12:00', fin: '20:00' },
            'viernes': { inicio: '12:00', fin: '20:00' },
            'sabado': { inicio: '10:00', fin: '18:00' },
            'domingo': { inicio: '10:00', fin: '14:00' }
        },
        'ana': {
            'lunes': { inicio: '09:00', fin: '17:00' },
            'martes': { inicio: '09:00', fin: '17:00' },
            'miercoles': { inicio: '09:00', fin: '17:00' },
            'jueves': { inicio: '09:00', fin: '17:00' },
            'viernes': { inicio: '09:00', fin: '17:00' },
            'sabado': { inicio: '10:00', fin: '16:00' },
            'domingo': { inicio: '10:00', fin: '14:00' }
        },
        'luis': {
            'lunes': { inicio: '08:00', fin: '16:00' },
            'martes': { inicio: '08:00', fin: '16:00' },
            'miercoles': { inicio: '08:00', fin: '16:00' },
            'jueves': { inicio: '08:00', fin: '16:00' },
            'viernes': { inicio: '08:00', fin: '16:00' },
            'sabado': { inicio: '09:00', fin: '15:00' },
            'domingo': { inicio: '10:00', fin: '14:00' }
        },
        'sofia': {
            'lunes': { inicio: '10:00', fin: '18:00' },
            'martes': { inicio: '10:00', fin: '18:00' },
            'miercoles': { inicio: '10:00', fin: '18:00' },
            'jueves': { inicio: '10:00', fin: '18:00' },
            'viernes': { inicio: '10:00', fin: '18:00' },
            'sabado': { inicio: '11:00', fin: '17:00' },
            'domingo': { inicio: '10:00', fin: '14:00' }
        }
    };
    
    return horariosDefecto[empleadoId]?.[dia]?.[tipo] || '08:00';
}

// Función para validar horarios
function validarHorarios() {
    let valido = true;
    const empleados = ['maria', 'carlos', 'ana', 'luis', 'sofia'];
    const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    
    empleados.forEach(empleadoId => {
        dias.forEach(dia => {
            const checkbox = document.getElementById(`${empleadoId}-${dia}-libre`);
            const inicioInput = document.getElementById(`${empleadoId}-${dia}-inicio`);
            const finInput = document.getElementById(`${empleadoId}-${dia}-fin`);
            
            if (!checkbox.checked) {
                if (!inicioInput.value || !finInput.value) {
                    valido = false;
                    setError(inicioInput, `err-${empleadoId}-${dia}`, 'Debe especificar horario de inicio y fin');
                } else if (inicioInput.value >= finInput.value) {
                    valido = false;
                    setError(finInput, `err-${empleadoId}-${dia}`, 'La hora de fin debe ser posterior a la de inicio');
                }
            }
        });
    });
    
    return valido;
}

// Función para validar formulario general
function validarFormulario() {
    let valido = true;
    resetErrores();
    
    // Validar horarios generales
    const horaApertura = document.getElementById('horaApertura');
    const horaCierre = document.getElementById('horaCierre');
    
    if (!horaApertura.value || !horaCierre.value) {
        valido = false;
        setError(horaApertura, 'err-horaApertura', 'Campo obligatorio');
        setError(horaCierre, 'err-horaCierre', 'Campo obligatorio');
    } else if (horaApertura.value >= horaCierre.value) {
        valido = false;
        setError(horaCierre, 'err-horaCierre', 'La hora de cierre debe ser posterior a la de apertura');
    }
    
    // Validar días laborales
    const diasLaborales = document.querySelectorAll('input[name="diasLaborales"]:checked');
    if (diasLaborales.length === 0) {
        valido = false;
        setError(document.querySelector('input[name="diasLaborales"]'), 'err-diasLaborales', 'Debe seleccionar al menos un día laboral');
    }
    
    // Validar horarios de empleados
    if (!validarHorarios()) {
        valido = false;
    }
    
    // Validar campos numéricos
    const tiempoMinimo = document.getElementById('tiempoMinimoPedido');
    const capacidadMaxima = document.getElementById('capacidadMaxima');
    
    if (!tiempoMinimo.value || tiempoMinimo.value < 1) {
        valido = false;
        setError(tiempoMinimo, 'err-tiempoMinimoPedido', 'Debe ser un número mayor a 0');
    }
    
    if (!capacidadMaxima.value || capacidadMaxima.value < 1) {
        valido = false;
        setError(capacidadMaxima, 'err-capacidadMaxima', 'Debe ser un número mayor a 0');
    }
    
    return valido;
}

// Función para guardar configuración
function guardarConfiguracion() {
    if (!validarFormulario()) {
        alert('Por favor, corrige los errores antes de guardar.');
        return;
    }
    
    const configuracion = {
        horariosGenerales: {
            apertura: document.getElementById('horaApertura').value,
            cierre: document.getElementById('horaCierre').value,
            diasLaborales: Array.from(document.querySelectorAll('input[name="diasLaborales"]:checked')).map(cb => cb.value)
        },
        empleados: {},
        configuracionesEspeciales: {
            tiempoMinimoPedido: parseInt(document.getElementById('tiempoMinimoPedido').value),
            capacidadMaxima: parseInt(document.getElementById('capacidadMaxima').value),
            emergenciaHabilitada: document.querySelector('input[name="emergencia"]').checked,
            costoEmergencia: parseInt(document.getElementById('costoEmergencia').value) || 0
        }
    };
    
    // Recopilar horarios de empleados
    const empleados = ['maria', 'carlos', 'ana', 'luis', 'sofia'];
    const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    
    empleados.forEach(empleadoId => {
        configuracion.empleados[empleadoId] = {};
        dias.forEach(dia => {
            const checkbox = document.getElementById(`${empleadoId}-${dia}-libre`);
            const inicioInput = document.getElementById(`${empleadoId}-${dia}-inicio`);
            const finInput = document.getElementById(`${empleadoId}-${dia}-fin`);
            
            configuracion.empleados[empleadoId][dia] = {
                libre: checkbox.checked,
                inicio: checkbox.checked ? null : inicioInput.value,
                fin: checkbox.checked ? null : finInput.value
            };
        });
    });
    
    // Guardar en localStorage
    localStorage.setItem('configuracionHorarios', JSON.stringify(configuracion));
    
    // Mostrar mensaje de éxito
    const resumen = document.getElementById('resumenHorarios');
    resumen.textContent = '✅ Configuración guardada exitosamente.';
    resumen.className = 'summary completado';
    
    setTimeout(() => {
        resumen.textContent = 'Configura los horarios de trabajo y guarda los cambios.';
        resumen.className = 'summary';
    }, 3000);
    
    console.log('Configuración guardada:', configuracion);
}

// Función para aplicar horario estándar
function aplicarHorarioEstandar() {
    if (confirm('¿Estás seguro de que quieres aplicar el horario estándar? Esto sobrescribirá la configuración actual.')) {
        // Aplicar horarios estándar a todos los empleados
        const empleados = ['maria', 'carlos', 'ana', 'luis', 'sofia'];
        const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
        
        empleados.forEach(empleadoId => {
            dias.forEach(dia => {
                const checkbox = document.getElementById(`${empleadoId}-${dia}-libre`);
                const inicioInput = document.getElementById(`${empleadoId}-${dia}-inicio`);
                const finInput = document.getElementById(`${empleadoId}-${dia}-fin`);
                
                // Domingo libre por defecto
                if (dia === 'domingo') {
                    checkbox.checked = true;
                    inicioInput.disabled = true;
                    finInput.disabled = true;
                    inicioInput.value = '';
                    finInput.value = '';
                } else {
                    checkbox.checked = false;
                    inicioInput.disabled = false;
                    finInput.disabled = false;
                    inicioInput.value = getHorarioDefecto(empleadoId, dia, 'inicio');
                    finInput.value = getHorarioDefecto(empleadoId, dia, 'fin');
                }
            });
        });
        
        actualizarResumen();
        alert('Horario estándar aplicado correctamente.');
    }
}

// Función para limpiar formulario
function limpiarFormulario() {
    if (confirm('¿Estás seguro de que quieres limpiar todos los campos?')) {
        // Limpiar horarios generales
        document.getElementById('horaApertura').value = '08:00';
        document.getElementById('horaCierre').value = '20:00';
        
        // Desmarcar todos los días laborales
        document.querySelectorAll('input[name="diasLaborales"]').forEach(cb => {
            cb.checked = cb.value !== 'domingo';
        });
        
        // Limpiar horarios de empleados
        const empleados = ['maria', 'carlos', 'ana', 'luis', 'sofia'];
        const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
        
        empleados.forEach(empleadoId => {
            dias.forEach(dia => {
                const checkbox = document.getElementById(`${empleadoId}-${dia}-libre`);
                const inicioInput = document.getElementById(`${empleadoId}-${dia}-inicio`);
                const finInput = document.getElementById(`${empleadoId}-${dia}-fin`);
                
                if (dia === 'domingo') {
                    checkbox.checked = true;
                    inicioInput.disabled = true;
                    finInput.disabled = true;
                    inicioInput.value = '';
                    finInput.value = '';
                } else {
                    checkbox.checked = false;
                    inicioInput.disabled = false;
                    finInput.disabled = false;
                    inicioInput.value = '';
                    finInput.value = '';
                }
            });
        });
        
        // Limpiar configuraciones especiales
        document.getElementById('tiempoMinimoPedido').value = '2';
        document.getElementById('capacidadMaxima').value = '50';
        document.querySelector('input[name="emergencia"]').checked = false;
        document.getElementById('costoEmergencia').value = '25';
        
        resetErrores();
        actualizarResumen();
    }
}

// Función para actualizar resumen
function actualizarResumen() {
    const resumen = document.getElementById('resumenHorarios');
    const empleados = ['maria', 'carlos', 'ana', 'luis', 'sofia'];
    const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    
    let totalHoras = 0;
    let empleadosConfigurados = 0;
    
    empleados.forEach(empleadoId => {
        let empleadoConfigurado = false;
        let horasEmpleado = 0;
        
        dias.forEach(dia => {
            const checkbox = document.getElementById(`${empleadoId}-${dia}-libre`);
            const inicioInput = document.getElementById(`${empleadoId}-${dia}-inicio`);
            const finInput = document.getElementById(`${empleadoId}-${dia}-fin`);
            
            if (!checkbox.checked && inicioInput.value && finInput.value) {
                empleadoConfigurado = true;
                const inicio = new Date(`2000-01-01T${inicioInput.value}`);
                const fin = new Date(`2000-01-01T${finInput.value}`);
                const horas = (fin - inicio) / (1000 * 60 * 60);
                horasEmpleado += horas;
            }
        });
        
        if (empleadoConfigurado) {
            empleadosConfigurados++;
            totalHoras += horasEmpleado;
        }
    });
    
    if (empleadosConfigurados === 0) {
        resumen.textContent = 'Configura los horarios de trabajo y guarda los cambios.';
        resumen.className = 'summary';
    } else {
        resumen.textContent = `${empleadosConfigurados} empleados configurados. Total de horas semanales: ${totalHoras.toFixed(1)}h`;
        resumen.className = 'summary procesando';
    }
}

// Función para mostrar errores
function setError(input, errorId, mensaje) {
    input.classList.add('error-border');
    const errorDiv = document.getElementById(errorId);
    if (errorDiv) {
        errorDiv.textContent = mensaje;
    }
}

// Función para limpiar errores
function resetErrores() {
    document.querySelectorAll('.error').forEach(el => el.textContent = '');
    document.querySelectorAll('.error-border').forEach(el => el.classList.remove('error-border'));
}

// Función para cargar configuración guardada
function cargarConfiguracion() {
    const configuracion = localStorage.getItem('configuracionHorarios');
    if (configuracion) {
        try {
            const config = JSON.parse(configuracion);
            
            // Cargar horarios generales
            if (config.horariosGenerales) {
                document.getElementById('horaApertura').value = config.horariosGenerales.apertura || '08:00';
                document.getElementById('horaCierre').value = config.horariosGenerales.cierre || '20:00';
                
                // Marcar días laborales
                document.querySelectorAll('input[name="diasLaborales"]').forEach(cb => {
                    cb.checked = config.horariosGenerales.diasLaborales?.includes(cb.value) || false;
                });
            }
            
            // Cargar horarios de empleados
            if (config.empleados) {
                Object.keys(config.empleados).forEach(empleadoId => {
                    Object.keys(config.empleados[empleadoId]).forEach(dia => {
                        const horario = config.empleados[empleadoId][dia];
                        const checkbox = document.getElementById(`${empleadoId}-${dia}-libre`);
                        const inicioInput = document.getElementById(`${empleadoId}-${dia}-inicio`);
                        const finInput = document.getElementById(`${empleadoId}-${dia}-fin`);
                        
                        if (checkbox && inicioInput && finInput) {
                            checkbox.checked = horario.libre;
                            if (horario.libre) {
                                inicioInput.disabled = true;
                                finInput.disabled = true;
                                inicioInput.value = '';
                                finInput.value = '';
                            } else {
                                inicioInput.disabled = false;
                                finInput.disabled = false;
                                inicioInput.value = horario.inicio || '';
                                finInput.value = horario.fin || '';
                            }
                        }
                    });
                });
            }
            
            // Cargar configuraciones especiales
            if (config.configuracionesEspeciales) {
                document.getElementById('tiempoMinimoPedido').value = config.configuracionesEspeciales.tiempoMinimoPedido || '2';
                document.getElementById('capacidadMaxima').value = config.configuracionesEspeciales.capacidadMaxima || '50';
                document.querySelector('input[name="emergencia"]').checked = config.configuracionesEspeciales.emergenciaHabilitada || false;
                document.getElementById('costoEmergencia').value = config.configuracionesEspeciales.costoEmergencia || '25';
            }
            
            actualizarResumen();
        } catch (error) {
            console.error('Error al cargar configuración:', error);
        }
    }
}

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Cargar configuración guardada
    cargarConfiguracion();
    
    // Event listeners para checkboxes de "Libre"
    const empleados = ['maria', 'carlos', 'ana', 'luis', 'sofia'];
    const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    
    empleados.forEach(empleadoId => {
        dias.forEach(dia => {
            const checkbox = document.getElementById(`${empleadoId}-${dia}-libre`);
            if (checkbox) {
                checkbox.addEventListener('change', () => {
                    manejarCheckboxLibre(empleadoId, dia);
                });
            }
        });
    });
    
    // Event listener para el botón de guardar
    document.getElementById('btnGuardarHorarios').addEventListener('click', function(e) {
        e.preventDefault();
        guardarConfiguracion();
    });
    
    // Event listeners para actualizar resumen
    document.querySelectorAll('input[type="time"], input[type="checkbox"], input[type="number"]').forEach(input => {
        input.addEventListener('change', actualizarResumen);
    });
    
    // Inicializar resumen
    actualizarResumen();
});
