import { obtenerPedidos } from "../recepcion/pedidoStorage.js";
/**
 * Renderiza dinámicamente las secciones de pedidos desde localStorage
 */
export function renderizarPedidosProcesamiento(contenedorId = "pedidos-container") {
    const container = document.getElementById(contenedorId);
    if (!container) {
        console.warn(`Contenedor ${contenedorId} no encontrado`);
        return;
    }
    const pedidos = obtenerPedidos();
    if (pedidos.length === 0) {
        container.innerHTML = `
      <div class="no-pedidos">
        <p>📭 No hay pedidos pendientes de procesamiento</p>
        <a href="./recepcion.html" class="btn-ir-recepcion">Ir a Recepción</a>
      </div>
    `;
        return;
    }
    // Agrupar pedidos por cliente
    const pedidosPorCliente = agruparPorCliente(pedidos);
    container.innerHTML = "";
    pedidosPorCliente.forEach((grupo, clienteNombre) => {
        const clienteGrupo = document.createElement("div");
        clienteGrupo.className = "cliente-grupo";
        clienteGrupo.innerHTML = `
      <div class="cliente-header">
        <h2>
          <span class="cliente-icon">👤</span>
          ${clienteNombre}
        </h2>
        <span class="pedidos-count">${grupo.length} ${grupo.length === 1 ? 'pedido' : 'pedidos'}</span>
      </div>
      <div class="pedidos-lista">
        ${grupo.map((pedidoData, index) => generarSeccionPedido(pedidoData, index)).join('')}
      </div>
    `;
        container.appendChild(clienteGrupo);
    });
}
/**
 * Agrupa pedidos por nombre de cliente
 */
function agruparPorCliente(pedidos) {
    const mapa = new Map();
    pedidos.forEach(pedido => {
        const nombreCliente = pedido.cliente.nombre;
        if (!mapa.has(nombreCliente)) {
            mapa.set(nombreCliente, []);
        }
        mapa.get(nombreCliente).push(pedido);
    });
    return mapa;
}
/**
 * Genera el HTML para una sección de pedido
 */
function generarSeccionPedido(pedidoData, index) {
    const fecha = new Date(pedidoData.pedido.fechaEntrega);
    const hora = new Date(pedidoData.pedido.horaEntrega);
    const horaFormateada = hora.toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    const extrasHTML = pedidoData.pedido.extras && pedidoData.pedido.extras.length > 0
        ? pedidoData.pedido.extras.map((extra) => `<span class="extra-tag">🎁 ${extra}</span>`).join('')
        : '<span class="extra-tag">Sin extras</span>';
    return `
    <section class="section pedido-card-large" aria-labelledby="pedido${pedidoData.id}Title" data-pedido-id="${pedidoData.id}">
      <h3 id="pedido${pedidoData.id}Title">Pedido #${pedidoData.id} - ${horaFormateada}</h3>
      <div class="pedido-grid">
        <!-- ZONA 1: CLIENTE -->
        <div class="pedido-zona">
          <h4>👤 Cliente</h4>
          <div class="zona-content">
            <div class="cliente-info">
              <strong id="cliente${pedidoData.id}Nombre">${pedidoData.cliente.nombre}</strong>
              <p id="cliente${pedidoData.id}Telefono">${pedidoData.cliente.telefono}</p>
            </div>
          </div>
        </div>

        <!-- ZONA 2: MATERIALES -->
        <div class="pedido-zona">
          <h4>📦 Materiales</h4>
          <div class="zona-content">
            <div class="materiales-info">
              <strong id="producto${pedidoData.id}Nombre">${pedidoData.pedido.producto}</strong>
              ${pedidoData.pedido.personalizacion ?
        `<p id="producto${pedidoData.id}Personalizacion">Personalización: "${pedidoData.pedido.personalizacion}"</p>`
        : ''}
              <div class="extras-list">
                ${extrasHTML}
              </div>
              ${pedidoData.pedido.isSorpresa ? '<p class="sorpresa-badge">🎉 Es sorpresa</p>' : ''}
            </div>
          </div>
        </div>

        <!-- ZONA 3: EMPLEADO -->
        <div class="pedido-zona">
          <h4>👨‍🍳 Asignar Empleados</h4>
          <div class="zona-content">
            <select id="empleado${pedidoData.id}Select" class="empleado-select" multiple required>
              <option value="maria" data-icon="👩‍🍳">María García - Chef Principal</option>
              <option value="carlos" data-icon="👨‍🍳">Carlos López - Chef Especialista</option>
              <option value="ana" data-icon="👩‍💼">Ana Rodríguez - Supervisora</option>
              <option value="luis" data-icon="👨‍💼">Luis Martínez - Coordinador</option>
              <option value="sofia" data-icon="👩‍🎨">Sofía Herrera - Decoradora</option>
            </select>
            <div class="instrucciones-seleccion">
              💡 Mantén presionado Ctrl (Cmd en Mac) y haz clic para seleccionar múltiples empleados
            </div>
            <div class="empleado-seleccionado" id="empleado${pedidoData.id}Seleccionado">
              <!-- Los empleados seleccionados aparecerán aquí -->
            </div>
          </div>
        </div>
      </div>

      <!-- Información adicional del pedido -->
      <div class="pedido-info-adicional">
        <div class="info-item">
          <strong>📍 Destinatario:</strong> ${pedidoData.destinatario.nombre} - ${pedidoData.destinatario.direccion}
        </div>
        <div class="info-item">
          <strong>📞 Teléfono destino:</strong> ${pedidoData.destinatario.telefono}
        </div>
        <div class="info-item">
          <strong>📅 Fecha entrega:</strong> ${fecha.toLocaleDateString('es-CO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}
        </div>
        ${pedidoData.pedido.observacionesDespachador ?
        `<div class="info-item">
            <strong>📝 Observaciones:</strong> ${pedidoData.pedido.observacionesDespachador}
          </div>`
        : ''}
      </div>
    </section>
  `;
}
/**
 * Inicializa los event listeners para los selects de empleados
 */
export function inicializarEventListeners() {
    const pedidos = obtenerPedidos();
    pedidos.forEach(pedido => {
        const select = document.getElementById(`empleado${pedido.id}Select`);
        const contenedorSeleccionados = document.getElementById(`empleado${pedido.id}Seleccionado`);
        if (select && contenedorSeleccionados) {
            select.addEventListener('change', () => {
                actualizarEmpleadosSeleccionados(select, contenedorSeleccionados);
            });
        }
    });
}
/**
 * Actualiza la visualización de empleados seleccionados
 */
function actualizarEmpleadosSeleccionados(select, contenedor) {
    const opcionesSeleccionadas = Array.from(select.selectedOptions);
    if (opcionesSeleccionadas.length === 0) {
        contenedor.innerHTML = '<p class="mensaje-vacio">No hay empleados seleccionados</p>';
        return;
    }
    contenedor.innerHTML = `
    <p class="mensaje-seleccion">Empleados asignados (${opcionesSeleccionadas.length}):</p>
    ${opcionesSeleccionadas.map(opcion => `
      <div class="empleado-card-mini">
        <span class="empleado-avatar-mini">${opcion.dataset.icon || '👤'}</span>
        <div class="empleado-info-mini">
          <div class="empleado-nombre-mini">${opcion.text.split(' - ')[0]}</div>
          <div class="empleado-cargo-mini">${opcion.text.split(' - ')[1] || ''}</div>
        </div>
      </div>
    `).join('')}
  `;
}
