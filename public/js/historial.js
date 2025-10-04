// Datos de ejemplo para el historial
const historialData = [
  {
    id: 1,
    empleado: 'maria',
    nombre: 'María García',
    cargo: 'Chef Principal',
    avatar: '👩‍🍳',
    tipo: 'procesamiento',
    estado: 'exitoso',
    fecha: '2024-01-15',
    hora: '14:30',
    descripcion: 'Procesó pedido #ORD001 - Chocolates Fresas',
    detalles: {
      pedidoId: 'ORD001',
      producto: 'Chocolates Fresas',
      cliente: 'Ana García',
      tiempoProcesamiento: '15 minutos',
      observaciones: 'Pedido completado sin incidencias'
    }
  },
  {
    id: 2,
    empleado: 'carlos',
    nombre: 'Carlos López',
    cargo: 'Chef Especialista',
    avatar: '👨‍🍳',
    tipo: 'entrega',
    estado: 'exitoso',
    fecha: '2024-01-15',
    hora: '16:45',
    descripcion: 'Entregó pedido #ORD002 - Desayunos Especiales',
    detalles: {
      pedidoId: 'ORD002',
      producto: 'Desayunos Especiales',
      destinatario: 'Patricia López',
      direccion: 'Calle 123 #45-67',
      tiempoEntrega: '25 minutos',
      observaciones: 'Entrega exitosa, cliente satisfecho'
    }
  },
  {
    id: 3,
    empleado: 'ana',
    nombre: 'Ana Rodríguez',
    cargo: 'Supervisora',
    avatar: '👩‍💼',
    tipo: 'configuracion',
    estado: 'exitoso',
    fecha: '2024-01-15',
    hora: '09:15',
    descripcion: 'Actualizó horarios de trabajo del personal',
    detalles: {
      accion: 'Actualización de horarios',
      empleadosAfectados: ['María García', 'Carlos López'],
      cambios: 'Ajuste de turno matutino de 8:00 a 8:30',
      observaciones: 'Cambio aprobado por gerencia'
    }
  },
  {
    id: 4,
    empleado: 'luis',
    nombre: 'Luis Martínez',
    cargo: 'Coordinador',
    avatar: '👨‍💼',
    tipo: 'procesamiento',
    estado: 'error',
    fecha: '2024-01-15',
    hora: '11:20',
    descripcion: 'Error al procesar pedido #ORD003 - Ramo de Rosas',
    detalles: {
      pedidoId: 'ORD003',
      producto: 'Ramo de Rosas',
      error: 'Material insuficiente para completar pedido',
      solucion: 'Solicitado material adicional a proveedor',
      observaciones: 'Error resuelto en 2 horas'
    }
  },
  {
    id: 5,
    empleado: 'sofia',
    nombre: 'Sofía Herrera',
    cargo: 'Decoradora',
    avatar: '👩‍🎨',
    tipo: 'procesamiento',
    estado: 'exitoso',
    fecha: '2024-01-14',
    hora: '15:30',
    descripcion: 'Decoró arreglo floral para pedido #ORD004',
    detalles: {
      pedidoId: 'ORD004',
      producto: 'Arreglo Floral',
      tecnica: 'Composición asimétrica con rosas rojas',
      materiales: 'Rosas rojas, hojas verdes, cinta dorada',
      tiempoDecoracion: '45 minutos',
      observaciones: 'Cliente muy satisfecho con el resultado'
    }
  },
  {
    id: 6,
    empleado: 'maria',
    nombre: 'María García',
    cargo: 'Chef Principal',
    avatar: '👩‍🍳',
    tipo: 'login',
    estado: 'exitoso',
    fecha: '2024-01-14',
    hora: '07:45',
    descripcion: 'Inició sesión en el sistema',
    detalles: {
      accion: 'Login',
      ip: '192.168.1.100',
      dispositivo: 'PC - Windows 10',
      navegador: 'Chrome 120.0',
      observaciones: 'Acceso normal'
    }
  },
  {
    id: 7,
    empleado: 'carlos',
    nombre: 'Carlos López',
    cargo: 'Chef Especialista',
    avatar: '👨‍🍳',
    tipo: 'procesamiento',
    estado: 'exitoso',
    fecha: '2024-01-14',
    hora: '13:15',
    descripcion: 'Procesó pedido #ORD005 - Cesta de Frutas',
    detalles: {
      pedidoId: 'ORD005',
      producto: 'Cesta de Frutas',
      cliente: 'Laura Méndez',
      tiempoProcesamiento: '20 minutos',
      observaciones: 'Pedido especial con frutas de temporada'
    }
  },
  {
    id: 8,
    empleado: 'ana',
    nombre: 'Ana Rodríguez',
    cargo: 'Supervisora',
    avatar: '👩‍💼',
    tipo: 'configuracion',
    estado: 'exitoso',
    fecha: '2024-01-13',
    hora: '16:00',
    descripcion: 'Configuró nuevos horarios de emergencia',
    detalles: {
      accion: 'Configuración de emergencia',
      horario: '24/7 para pedidos urgentes',
      costoAdicional: '25%',
      observaciones: 'Implementado para temporada alta'
    }
  }
];

// Variables globales
let historialFiltrado = [...historialData];
let paginaActual = 1;
const accionesPorPagina = 5;

// Función para aplicar filtros
function aplicarFiltros() {
  const empleado = document.getElementById('empleadoFiltro').value;
  const tipo = document.getElementById('tipoAccion').value;
  const fechaDesde = document.getElementById('fechaDesde').value;
  const fechaHasta = document.getElementById('fechaHasta').value;
  const busquedaTexto = document.getElementById('busquedaTexto').value.toLowerCase();

  historialFiltrado = historialData.filter(accion => {
    // Filtro por empleado
    if (empleado && accion.empleado !== empleado) return false;
    
    // Filtro por tipo
    if (tipo && accion.tipo !== tipo) return false;
    
    // Filtro por fecha
    if (fechaDesde && accion.fecha < fechaDesde) return false;
    if (fechaHasta && accion.fecha > fechaHasta) return false;
    
    // Filtro por texto
    if (busquedaTexto && !accion.descripcion.toLowerCase().includes(busquedaTexto)) return false;
    
    return true;
  });

  paginaActual = 1;
  renderizarHistorial();
  actualizarResumen();
  actualizarEstadisticas();
}

// Función para limpiar filtros
function limpiarFiltros() {
  document.getElementById('empleadoFiltro').value = '';
  document.getElementById('tipoAccion').value = '';
  document.getElementById('fechaDesde').value = '';
  document.getElementById('fechaHasta').value = '';
  document.getElementById('busquedaTexto').value = '';
  
  historialFiltrado = [...historialData];
  paginaActual = 1;
  renderizarHistorial();
  actualizarResumen();
  actualizarEstadisticas();
}

// Función para renderizar el historial
function renderizarHistorial() {
  const lista = document.getElementById('historialLista');
  const template = document.getElementById('accionTemplate');
  
  // Calcular índices de paginación
  const inicio = (paginaActual - 1) * accionesPorPagina;
  const fin = inicio + accionesPorPagina;
  const accionesPagina = historialFiltrado.slice(inicio, fin);
  
  // Limpiar lista
  lista.innerHTML = '';
  
  // Renderizar acciones
  accionesPagina.forEach(accion => {
    const clone = template.content.cloneNode(true);
    
    // Llenar datos
    clone.getElementById('accionAvatar').textContent = accion.avatar;
    clone.getElementById('accionNombre').textContent = accion.nombre;
    clone.getElementById('accionCargo').textContent = accion.cargo;
    clone.getElementById('accionFecha').textContent = accion.fecha;
    clone.getElementById('accionHora').textContent = accion.hora;
    clone.getElementById('accionTipo').textContent = getTipoTexto(accion.tipo);
    clone.getElementById('accionEstado').textContent = getEstadoTexto(accion.estado);
    clone.getElementById('accionDescripcion').textContent = accion.descripcion;
    
    // Configurar clases de estado
    const tipoBadge = clone.getElementById('accionTipo');
    const estadoBadge = clone.getElementById('accionEstado');
    
    tipoBadge.className = `tipo-badge tipo-${accion.tipo}`;
    estadoBadge.className = `estado-badge estado-${accion.estado}`;
    
    // Configurar detalles
    const detallesContent = clone.getElementById('detallesContent');
    detallesContent.innerHTML = generarDetallesHTML(accion.detalles);
    
    // Configurar botones
    const btnDetalles = clone.querySelector('.btn-detalles');
    const btnExportar = clone.querySelector('.btn-exportar');
    
    btnDetalles.setAttribute('data-accion-id', accion.id);
    btnExportar.setAttribute('data-accion-id', accion.id);
    
    lista.appendChild(clone);
  });
  
  // Actualizar controles de paginación
  actualizarPaginacion();
}

// Función para generar HTML de detalles
function generarDetallesHTML(detalles) {
  let html = '';
  for (const [key, value] of Object.entries(detalles)) {
    const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
    html += `<div class="detalle-item"><strong>${label}:</strong> ${value}</div>`;
  }
  return html;
}

// Función para obtener texto del tipo
function getTipoTexto(tipo) {
  const tipos = {
    'procesamiento': 'Procesamiento',
    'entrega': 'Entrega',
    'configuracion': 'Configuración',
    'login': 'Inicio de Sesión',
    'error': 'Error'
  };
  return tipos[tipo] || tipo;
}

// Función para obtener texto del estado
function getEstadoTexto(estado) {
  const estados = {
    'exitoso': 'Exitoso',
    'error': 'Error',
    'pendiente': 'Pendiente'
  };
  return estados[estado] || estado;
}

// Función para actualizar paginación
function actualizarPaginacion() {
  const totalPaginas = Math.ceil(historialFiltrado.length / accionesPorPagina);
  const btnAnterior = document.getElementById('btnAnterior');
  const btnSiguiente = document.getElementById('btnSiguiente');
  const paginaActualSpan = document.getElementById('paginaActual');
  const paginationInfo = document.getElementById('paginationInfo');
  
  // Actualizar botones
  btnAnterior.disabled = paginaActual === 1;
  btnSiguiente.disabled = paginaActual === totalPaginas || totalPaginas === 0;
  
  // Actualizar información
  paginaActualSpan.textContent = `${paginaActual} de ${totalPaginas}`;
  paginationInfo.textContent = `Mostrando ${((paginaActual - 1) * accionesPorPagina) + 1}-${Math.min(paginaActual * accionesPorPagina, historialFiltrado.length)} de ${historialFiltrado.length} acciones`;
}

// Función para cambiar página
function cambiarPagina(direccion) {
  const totalPaginas = Math.ceil(historialFiltrado.length / accionesPorPagina);
  const nuevaPagina = paginaActual + direccion;
  
  if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
    paginaActual = nuevaPagina;
    renderizarHistorial();
  }
}

// Función para alternar detalles
function toggleDetalles(boton) {
  const accionItem = boton.closest('.accion-item');
  const detalles = accionItem.querySelector('.accion-detalles');
  
  if (detalles.style.display === 'none') {
    detalles.style.display = 'block';
    boton.textContent = 'Ocultar Detalles';
  } else {
    detalles.style.display = 'none';
    boton.textContent = 'Ver Detalles';
  }
}

// Función para exportar acción individual
function exportarAccion(boton) {
  const accionId = parseInt(boton.getAttribute('data-accion-id'));
  const accion = historialData.find(a => a.id === accionId);
  
  if (accion) {
    const contenido = generarReporteAccion(accion);
    descargarArchivo(contenido, `accion_${accion.id}_${accion.fecha}.txt`);
  }
}

// Función para exportar historial completo
function exportarHistorial() {
  const contenido = generarReporteCompleto();
  const fecha = new Date().toISOString().split('T')[0];
  descargarArchivo(contenido, `historial_empleados_${fecha}.txt`);
}

// Función para generar reporte de acción individual
function generarReporteAccion(accion) {
  let reporte = `REPORTE DE ACCIÓN - ${accion.fecha} ${accion.hora}\n`;
  reporte += `==========================================\n\n`;
  reporte += `Empleado: ${accion.nombre} (${accion.cargo})\n`;
  reporte += `Tipo: ${getTipoTexto(accion.tipo)}\n`;
  reporte += `Estado: ${getEstadoTexto(accion.estado)}\n`;
  reporte += `Descripción: ${accion.descripcion}\n\n`;
  reporte += `Detalles:\n`;
  
  for (const [key, value] of Object.entries(accion.detalles)) {
    const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
    reporte += `  ${label}: ${value}\n`;
  }
  
  return reporte;
}

// Función para generar reporte completo
function generarReporteCompleto() {
  let reporte = `HISTORIAL DE EMPLEADOS - ${new Date().toLocaleDateString()}\n`;
  reporte += `==============================================\n\n`;
  
  historialFiltrado.forEach(accion => {
    reporte += generarReporteAccion(accion);
    reporte += `\n${'='.repeat(50)}\n\n`;
  });
  
  return reporte;
}

// Función para descargar archivo
function descargarArchivo(contenido, nombreArchivo) {
  const blob = new Blob([contenido], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

// Función para actualizar resumen
function actualizarResumen() {
  const totalAcciones = historialFiltrado.length;
  const empleadosActivos = new Set(historialFiltrado.map(a => a.empleado)).size;
  const accionesExitosas = historialFiltrado.filter(a => a.estado === 'exitoso').length;
  const totalErrores = historialFiltrado.filter(a => a.estado === 'error').length;
  
  document.getElementById('totalAcciones').textContent = totalAcciones;
  document.getElementById('empleadosActivos').textContent = empleadosActivos;
  document.getElementById('accionesExitosas').textContent = accionesExitosas;
  document.getElementById('totalErrores').textContent = totalErrores;
}

// Función para actualizar estadísticas
function actualizarEstadisticas() {
  const estadisticasGrid = document.getElementById('estadisticasGrid');
  const empleados = ['maria', 'carlos', 'ana', 'luis', 'sofia'];
  
  estadisticasGrid.innerHTML = '';
  
  empleados.forEach(empleadoId => {
    const accionesEmpleado = historialFiltrado.filter(a => a.empleado === empleadoId);
    if (accionesEmpleado.length === 0) return;
    
    const empleado = accionesEmpleado[0];
    const totalAcciones = accionesEmpleado.length;
    const accionesExitosas = accionesEmpleado.filter(a => a.estado === 'exitoso').length;
    const porcentajeExito = totalAcciones > 0 ? Math.round((accionesExitosas / totalAcciones) * 100) : 0;
    
    const estadisticaCard = document.createElement('div');
    estadisticaCard.className = 'estadistica-card';
    estadisticaCard.innerHTML = `
      <div class="estadistica-header">
        <div class="empleado-avatar">${empleado.avatar}</div>
        <div class="empleado-info">
          <h4>${empleado.nombre}</h4>
          <p>${empleado.cargo}</p>
        </div>
      </div>
      <div class="estadistica-content">
        <div class="estadistica-item">
          <span class="label">Total Acciones:</span>
          <span class="value">${totalAcciones}</span>
        </div>
        <div class="estadistica-item">
          <span class="label">Éxito:</span>
          <span class="value">${porcentajeExito}%</span>
        </div>
        <div class="estadistica-item">
          <span class="label">Última Actividad:</span>
          <span class="value">${obtenerUltimaActividad(accionesEmpleado)}</span>
        </div>
      </div>
    `;
    
    estadisticasGrid.appendChild(estadisticaCard);
  });
}

// Función para obtener última actividad
function obtenerUltimaActividad(acciones) {
  if (acciones.length === 0) return 'N/A';
  
  const ultimaAccion = acciones.sort((a, b) => {
    const fechaA = new Date(`${a.fecha} ${a.hora}`);
    const fechaB = new Date(`${b.fecha} ${b.hora}`);
    return fechaB - fechaA;
  })[0];
  
  return `${ultimaAccion.fecha} ${ultimaAccion.hora}`;
}

// Función para generar reporte
function generarReporte() {
  const reporte = generarReporteCompleto();
  const fecha = new Date().toISOString().split('T')[0];
  descargarArchivo(reporte, `reporte_historial_${fecha}.txt`);
  alert('Reporte generado y descargado exitosamente.');
}

// Función para actualizar historial
function actualizarHistorial() {
  // En una implementación real, aquí se haría una petición al servidor
  // Por ahora, solo recargamos los datos existentes
  renderizarHistorial();
  actualizarResumen();
  actualizarEstadisticas();
  
  const resumen = document.getElementById('resumenHistorial');
  resumen.textContent = 'Historial actualizado correctamente.';
  resumen.className = 'summary completado';
  
  setTimeout(() => {
    resumen.textContent = 'Historial cargado. Usa los filtros para buscar acciones específicas.';
    resumen.className = 'summary';
  }, 3000);
}

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
  // Establecer fecha por defecto (últimos 7 días)
  const hoy = new Date();
  const hace7Dias = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  document.getElementById('fechaDesde').value = hace7Dias.toISOString().split('T')[0];
  document.getElementById('fechaHasta').value = hoy.toISOString().split('T')[0];
  
  // Cargar historial inicial
  renderizarHistorial();
  actualizarResumen();
  actualizarEstadisticas();
  
  // Event listeners para filtros
  document.getElementById('empleadoFiltro').addEventListener('change', aplicarFiltros);
  document.getElementById('tipoAccion').addEventListener('change', aplicarFiltros);
  document.getElementById('fechaDesde').addEventListener('change', aplicarFiltros);
  document.getElementById('fechaHasta').addEventListener('change', aplicarFiltros);
  document.getElementById('busquedaTexto').addEventListener('input', aplicarFiltros);
});
