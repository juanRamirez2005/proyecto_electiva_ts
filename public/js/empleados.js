// Datos de empleados de ejemplo
let empleados = [
  {
    id: 'maria',
    nombre: 'María García López',
    cargo: 'Chef Principal',
    email: 'maria.garcia@empresa.com',
    telefono: '+57 300 123 4567',
    fechaNacimiento: '1985-03-15',
    fechaIngreso: '2020-01-15',
    salario: 3500000,
    estado: 'activo',
    departamento: 'cocina',
    turno: 'matutino',
    notas: 'Especialista en repostería y decoración de tortas.',
    icono: '👩‍🍳',
    fechaCreacion: '2024-01-15T10:30:00Z'
  },
  {
    id: 'carlos',
    nombre: 'Carlos López Martínez',
    cargo: 'Chef Especialista',
    email: 'carlos.lopez@empresa.com',
    telefono: '+57 310 555 1234',
    fechaNacimiento: '1988-07-22',
    fechaIngreso: '2021-03-10',
    salario: 3200000,
    estado: 'activo',
    departamento: 'cocina',
    turno: 'vespertino',
    notas: 'Experto en cocina internacional y fusion.',
    icono: '👨‍🍳',
    fechaCreacion: '2024-01-15T10:30:00Z'
  },
  {
    id: 'ana',
    nombre: 'Ana Rodríguez Silva',
    cargo: 'Supervisora',
    email: 'ana.rodriguez@empresa.com',
    telefono: '+57 302 789 4321',
    fechaNacimiento: '1982-11-08',
    fechaIngreso: '2019-06-01',
    salario: 4000000,
    estado: 'activo',
    departamento: 'administracion',
    turno: 'matutino',
    notas: 'Supervisora general con 5 años de experiencia.',
    icono: '👩‍💼',
    fechaCreacion: '2024-01-15T10:30:00Z'
  },
  {
    id: 'luis',
    nombre: 'Luis Martínez Herrera',
    cargo: 'Coordinador de Entregas',
    email: 'luis.martinez@empresa.com',
    telefono: '+57 315 666 7890',
    fechaNacimiento: '1990-05-12',
    fechaIngreso: '2022-02-20',
    salario: 2800000,
    estado: 'activo',
    departamento: 'entrega',
    turno: 'mixto',
    notas: 'Coordinador de entregas y logística.',
    icono: '👨‍💼',
    fechaCreacion: '2024-01-15T10:30:00Z'
  },
  {
    id: 'sofia',
    nombre: 'Sofía Herrera Torres',
    cargo: 'Decoradora',
    email: 'sofia.herrera@empresa.com',
    telefono: '+57 320 444 5555',
    fechaNacimiento: '1993-09-30',
    fechaIngreso: '2023-01-10',
    salario: 2500000,
    estado: 'activo',
    departamento: 'decoracion',
    turno: 'matutino',
    notas: 'Especialista en decoración floral y arreglos.',
    icono: '👩‍🎨',
    fechaCreacion: '2024-01-15T10:30:00Z'
  }
];

// Iconos disponibles
const iconosDisponibles = [
  '👩‍🍳', '👨‍🍳', '👩‍💼', '👨‍💼', '👩‍🎨', '👨‍🎨',
  '👩‍💻', '👨‍💻', '👩‍🔬', '👨‍🔬', '👩‍⚕️', '👨‍⚕️',
  '👩‍✈️', '👨‍✈️', '👩‍🚀', '👨‍🚀', '👩‍🏫', '👨‍🏫',
  '👩‍🏭', '👨‍🏭', '👩‍💼', '👨‍💼', '👩‍🔧', '👨‍🔧',
  '👩‍🎓', '👨‍🎓', '👩‍🎤', '👨‍🎤', '👩‍🎨', '👨‍🎨',
  '👩‍🚒', '👨‍🚒', '👩‍🚑', '👨‍🚑', '👩‍⚖️', '👨‍⚖️',
  '👩‍🌾', '👨‍🌾', '👩‍🍳', '👨‍🍳', '👩‍💻', '👨‍💻',
  '👩‍🔬', '👨‍🔬', '👩‍⚕️', '👨‍⚕️', '👩‍✈️', '👨‍✈️',
  '👩‍🚀', '👨‍🚀', '👩‍🏫', '👨‍🏫', '👩‍🏭', '👨‍🏭',
  '👩‍💼', '👨‍💼', '👩‍🔧', '👨‍🔧', '👩‍🎓', '👨‍🎓',
  '👩‍🎤', '👨‍🎤', '👩‍🎨', '👨‍🎨', '👩‍🚒', '👨‍🚒',
  '👩‍🚑', '👨‍🚑', '👩‍⚖️', '👨‍⚖️', '👩‍🌾', '👨‍🌾',
  '👤', '👥', '👨', '👩', '🧑', '👧', '👦', '👶',
  '👴', '👵', '🧓', '👱‍♀️', '👱‍♂️', '👲', '🧔', '👳‍♀️',
  '👳‍♂️', '👮‍♀️', '👮‍♂️', '👷‍♀️', '👷‍♂️', '💂‍♀️', '💂‍♂️',
  '🕵️‍♀️', '🕵️‍♂️', '👩‍⚕️', '👨‍⚕️', '👩‍🌾', '👨‍🌾',
  '👩‍🍳', '👨‍🍳', '👩‍🎓', '👨‍🎓', '👩‍🎤', '👨‍🎤',
  '👩‍🏫', '👨‍🏫', '👩‍🏭', '👨‍🏭', '👩‍💻', '👨‍💻',
  '👩‍💼', '👨‍💼', '👩‍🔧', '👨‍🔧', '👩‍🔬', '👨‍🔬',
  '👩‍🎨', '👨‍🎨', '👩‍🚒', '👨‍🚒', '👩‍✈️', '👨‍✈️',
  '👩‍🚀', '👨‍🚀', '👩‍⚖️', '👨‍⚖️', '👩‍🚑', '👨‍🚑'
];

// Variables globales
let empleadoSeleccionado = null;
let iconoSeleccionado = null;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
  cargarEmpleados();
  cargarIconos();
  actualizarEstadisticas();
  configurarFechas();
});

// Configurar fechas por defecto
function configurarFechas() {
  const hoy = new Date().toISOString().split('T')[0];
  document.getElementById('fechaIngreso').value = hoy;
}

// Cargar lista de empleados
function cargarEmpleados() {
  const selector = document.getElementById('empleadoSelector');
  selector.innerHTML = '<option value="">-- Seleccionar empleado --</option>';
  
  empleados.forEach(empleado => {
    const option = document.createElement('option');
    option.value = empleado.id;
    option.textContent = `${empleado.icono} ${empleado.nombre} - ${empleado.cargo}`;
    selector.appendChild(option);
  });
  
  renderizarListaEmpleados();
}

// Cargar iconos disponibles
function cargarIconos() {
  const grid = document.getElementById('iconosGrid');
  grid.innerHTML = '';
  
  iconosDisponibles.forEach(icono => {
    const iconoDiv = document.createElement('div');
    iconoDiv.className = 'icono-item';
    iconoDiv.innerHTML = `
      <div class="icono-display">${icono}</div>
    `;
    iconoDiv.onclick = () => seleccionarIcono(icono, iconoDiv);
    grid.appendChild(iconoDiv);
  });
}

// Seleccionar icono
function seleccionarIcono(icono, elemento) {
  // Remover selección anterior
  document.querySelectorAll('.icono-item').forEach(item => {
    item.classList.remove('selected');
  });
  
  // Seleccionar nuevo icono
  elemento.classList.add('selected');
  iconoSeleccionado = icono;
  
  // Actualizar preview
  if (empleadoSeleccionado) {
    document.getElementById('previewAvatar').textContent = icono;
    document.getElementById('iconoActions').style.display = 'block';
  }
}

// Cargar empleado seleccionado
function cargarEmpleadoSeleccionado() {
  const selector = document.getElementById('empleadoSelector');
  const empleadoId = selector.value;
  
  if (empleadoId) {
    empleadoSeleccionado = empleados.find(e => e.id === empleadoId);
    mostrarPreviewEmpleado();
  } else {
    ocultarPreviewEmpleado();
  }
}

// Mostrar preview del empleado
function mostrarPreviewEmpleado() {
  if (empleadoSeleccionado) {
    document.getElementById('previewNombre').textContent = empleadoSeleccionado.nombre;
    document.getElementById('previewCargo').textContent = empleadoSeleccionado.cargo;
    document.getElementById('previewAvatar').textContent = empleadoSeleccionado.icono;
    document.getElementById('iconoPreview').style.display = 'block';
  }
}

// Ocultar preview del empleado
function ocultarPreviewEmpleado() {
  document.getElementById('iconoPreview').style.display = 'none';
  document.getElementById('iconoActions').style.display = 'none';
  empleadoSeleccionado = null;
  iconoSeleccionado = null;
}

// Guardar icono
function guardarIcono() {
  if (empleadoSeleccionado && iconoSeleccionado) {
    empleadoSeleccionado.icono = iconoSeleccionado;
    guardarEmpleados();
    cargarEmpleados();
    mostrarNotificacion('Icono actualizado correctamente', 'success');
    cancelarSeleccion();
  }
}

// Cancelar selección
function cancelarSeleccion() {
  document.getElementById('empleadoSelector').value = '';
  ocultarPreviewEmpleado();
  document.querySelectorAll('.icono-item').forEach(item => {
    item.classList.remove('selected');
  });
  iconoSeleccionado = null;
}

// Agregar empleado
function agregarEmpleado() {
  const form = document.getElementById('empleadosForm');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  
  const nuevoEmpleado = {
    id: generarId(),
    nombre: document.getElementById('nombreEmpleado').value,
    cargo: document.getElementById('cargoEmpleado').value,
    email: document.getElementById('emailEmpleado').value,
    telefono: document.getElementById('telefonoEmpleado').value,
    fechaNacimiento: document.getElementById('fechaNacimiento').value,
    fechaIngreso: document.getElementById('fechaIngreso').value,
    salario: parseFloat(document.getElementById('salarioEmpleado').value),
    estado: document.getElementById('estadoEmpleado').value,
    departamento: document.getElementById('departamentoEmpleado').value,
    turno: document.getElementById('turnoEmpleado').value,
    notas: document.getElementById('notasEmpleado').value,
    icono: '👤',
    fechaCreacion: new Date().toISOString()
  };
  
  empleados.push(nuevoEmpleado);
  guardarEmpleados();
  cargarEmpleados();
  actualizarEstadisticas();
  limpiarFormulario();
  mostrarNotificacion('Empleado agregado correctamente', 'success');
}

// Generar ID único
function generarId() {
  return 'emp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Limpiar formulario
function limpiarFormulario() {
  document.getElementById('empleadosForm').reset();
  configurarFechas();
}

// Renderizar lista de empleados
function renderizarListaEmpleados() {
  const lista = document.getElementById('empleadosLista');
  const empleadosFiltrados = obtenerEmpleadosFiltrados();
  
  lista.innerHTML = '';
  
  empleadosFiltrados.forEach(empleado => {
    const empleadoDiv = document.createElement('div');
    empleadoDiv.className = 'empleado-card';
    empleadoDiv.innerHTML = `
      <div class="empleado-header">
        <div class="empleado-avatar">${empleado.icono}</div>
        <div class="empleado-info">
          <h3>${empleado.nombre}</h3>
          <p>${empleado.cargo}</p>
          <span class="departamento-badge">${getDepartamentoTexto(empleado.departamento)}</span>
        </div>
        <div class="empleado-actions">
          <button class="btn-edit" onclick="editarEmpleado('${empleado.id}')">✏️</button>
          <button class="btn-delete" onclick="eliminarEmpleado('${empleado.id}')">🗑️</button>
        </div>
      </div>
      <div class="empleado-details">
        <div class="detail-item">
          <strong>Email:</strong> ${empleado.email}
        </div>
        <div class="detail-item">
          <strong>Teléfono:</strong> ${empleado.telefono}
        </div>
        <div class="detail-item">
          <strong>Estado:</strong> <span class="estado-badge estado-${empleado.estado}">${getEstadoTexto(empleado.estado)}</span>
        </div>
        <div class="detail-item">
          <strong>Salario:</strong> $${empleado.salario.toLocaleString()}
        </div>
        <div class="detail-item">
          <strong>Turno:</strong> ${getTurnoTexto(empleado.turno)}
        </div>
        ${empleado.notas ? `<div class="detail-item"><strong>Notas:</strong> ${empleado.notas}</div>` : ''}
      </div>
    `;
    lista.appendChild(empleadoDiv);
  });
}

// Obtener empleados filtrados
function obtenerEmpleadosFiltrados() {
  const departamento = document.getElementById('filtroDepartamento').value;
  const estado = document.getElementById('filtroEstado').value;
  const busqueda = document.getElementById('busquedaEmpleado').value.toLowerCase();
  
  return empleados.filter(empleado => {
    const matchDepartamento = !departamento || empleado.departamento === departamento;
    const matchEstado = !estado || empleado.estado === estado;
    const matchBusqueda = !busqueda || 
      empleado.nombre.toLowerCase().includes(busqueda) ||
      empleado.cargo.toLowerCase().includes(busqueda) ||
      empleado.email.toLowerCase().includes(busqueda);
    
    return matchDepartamento && matchEstado && matchBusqueda;
  });
}

// Filtrar empleados
function filtrarEmpleados() {
  renderizarListaEmpleados();
}

// Editar empleado
function editarEmpleado(id) {
  const empleado = empleados.find(e => e.id === id);
  if (empleado) {
    // Llenar formulario con datos del empleado
    document.getElementById('nombreEmpleado').value = empleado.nombre;
    document.getElementById('cargoEmpleado').value = empleado.cargo;
    document.getElementById('emailEmpleado').value = empleado.email;
    document.getElementById('telefonoEmpleado').value = empleado.telefono;
    document.getElementById('fechaNacimiento').value = empleado.fechaNacimiento;
    document.getElementById('fechaIngreso').value = empleado.fechaIngreso;
    document.getElementById('salarioEmpleado').value = empleado.salario;
    document.getElementById('estadoEmpleado').value = empleado.estado;
    document.getElementById('departamentoEmpleado').value = empleado.departamento;
    document.getElementById('turnoEmpleado').value = empleado.turno;
    document.getElementById('notasEmpleado').value = empleado.notas || '';
    
    // Cambiar botón a "Actualizar"
    const boton = document.querySelector('.button-container .primary');
    boton.textContent = 'Actualizar Empleado';
    boton.onclick = () => actualizarEmpleado(id);
    
    // Scroll al formulario
    document.getElementById('agregarTitle').scrollIntoView({ behavior: 'smooth' });
  }
}

// Actualizar empleado
function actualizarEmpleado(id) {
  const empleado = empleados.find(e => e.id === id);
  if (empleado) {
    empleado.nombre = document.getElementById('nombreEmpleado').value;
    empleado.cargo = document.getElementById('cargoEmpleado').value;
    empleado.email = document.getElementById('emailEmpleado').value;
    empleado.telefono = document.getElementById('telefonoEmpleado').value;
    empleado.fechaNacimiento = document.getElementById('fechaNacimiento').value;
    empleado.fechaIngreso = document.getElementById('fechaIngreso').value;
    empleado.salario = parseFloat(document.getElementById('salarioEmpleado').value);
    empleado.estado = document.getElementById('estadoEmpleado').value;
    empleado.departamento = document.getElementById('departamentoEmpleado').value;
    empleado.turno = document.getElementById('turnoEmpleado').value;
    empleado.notas = document.getElementById('notasEmpleado').value;
    
    guardarEmpleados();
    cargarEmpleados();
    actualizarEstadisticas();
    limpiarFormulario();
    mostrarNotificacion('Empleado actualizado correctamente', 'success');
  }
}

// Eliminar empleado
function eliminarEmpleado(id) {
  if (confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
    empleados = empleados.filter(e => e.id !== id);
    guardarEmpleados();
    cargarEmpleados();
    actualizarEstadisticas();
    mostrarNotificacion('Empleado eliminado correctamente', 'success');
  }
}

// Actualizar estadísticas
function actualizarEstadisticas() {
  const stats = document.getElementById('estadisticasEmpleados');
  const total = empleados.length;
  const activos = empleados.filter(e => e.estado === 'activo').length;
  const porDepartamento = {};
  
  empleados.forEach(emp => {
    porDepartamento[emp.departamento] = (porDepartamento[emp.departamento] || 0) + 1;
  });
  
  stats.innerHTML = `
    <div class="stat-card">
      <h3>Total Empleados</h3>
      <p>${total}</p>
    </div>
    <div class="stat-card">
      <h3>Empleados Activos</h3>
      <p>${activos}</p>
    </div>
    <div class="stat-card">
      <h3>Promedio Salarial</h3>
      <p>$${Math.round(empleados.reduce((sum, emp) => sum + emp.salario, 0) / total).toLocaleString()}</p>
    </div>
    <div class="stat-card">
      <h3>Departamentos</h3>
      <p>${Object.keys(porDepartamento).length}</p>
    </div>
  `;
}

// Funciones de utilidad
function getDepartamentoTexto(departamento) {
  const departamentos = {
    'cocina': 'Cocina',
    'atencion': 'Atención al Cliente',
    'administracion': 'Administración',
    'entrega': 'Entrega',
    'decoracion': 'Decoración'
  };
  return departamentos[departamento] || departamento;
}

function getEstadoTexto(estado) {
  const estados = {
    'activo': 'Activo',
    'inactivo': 'Inactivo',
    'vacaciones': 'Vacaciones',
    'licencia': 'Licencia'
  };
  return estados[estado] || estado;
}

function getTurnoTexto(turno) {
  const turnos = {
    'matutino': 'Matutino (6:00 - 14:00)',
    'vespertino': 'Vespertino (14:00 - 22:00)',
    'nocturno': 'Nocturno (22:00 - 6:00)',
    'mixto': 'Mixto'
  };
  return turnos[turno] || turno;
}

// Guardar empleados en localStorage
function guardarEmpleados() {
  localStorage.setItem('empleados', JSON.stringify(empleados));
}

// Cargar empleados desde localStorage
function cargarEmpleadosDesdeStorage() {
  const saved = localStorage.getItem('empleados');
  if (saved) {
    try {
      empleados = JSON.parse(saved);
    } catch (error) {
      console.error('Error al cargar empleados:', error);
    }
  }
}

// Exportar empleados
function exportarEmpleados() {
  const data = JSON.stringify(empleados, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'empleados.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Importar empleados
function importarEmpleados() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          empleados = imported;
          guardarEmpleados();
          cargarEmpleados();
          actualizarEstadisticas();
          mostrarNotificacion('Empleados importados correctamente', 'success');
        } catch (error) {
          mostrarNotificacion('Error al importar archivo', 'error');
        }
      };
      reader.readAsText(file);
    }
  };
  input.click();
}

// Actualizar lista
function actualizarLista() {
  cargarEmpleados();
  actualizarEstadisticas();
  mostrarNotificacion('Lista actualizada', 'success');
}

// Mostrar notificación
function mostrarNotificacion(mensaje, tipo = 'info') {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${tipo === 'success' ? '#10b981' : tipo === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    padding: 1rem 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    font-weight: 500;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;
  notification.textContent = mensaje;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '1';
  }, 100);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Cargar datos iniciales
cargarEmpleadosDesdeStorage();
