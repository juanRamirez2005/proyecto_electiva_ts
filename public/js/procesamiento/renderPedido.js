function obtenerPedidosDesdeLocalStorage() {
    const pedidos = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // Filtrar solo keys que empiecen con "ORD"
        if (key && key.startsWith('ORD')) {
            try {
                const pedido = JSON.parse(localStorage.getItem(key) || '{}');
                pedido.key = key; // Guardar la key original
                pedidos.push(pedido);
            }
            catch (e) {
                console.error(`Error parseando ${key}:`, e);
            }
        }
    }
    return pedidos;
}
/**
 * Función para agrupar pedidos por cliente
 */
function agruparPorCliente(pedidos) {
    const grupos = {};
    pedidos.forEach(pedido => {
        var _a;
        const nombreCliente = ((_a = pedido.cliente) === null || _a === void 0 ? void 0 : _a.nombre) || 'Cliente desconocido';
        if (!grupos[nombreCliente]) {
            grupos[nombreCliente] = [];
        }
        grupos[nombreCliente].push(pedido);
    });
    return grupos;
}
/**
 * Función para crear un elemento de pedido usando DOM
 */
function crearElementoPedido(pedido) {
    var _a, _b;
    const section = document.createElement('section');
    section.className = 'section pedido-card-large pedido-dos-col';
    section.setAttribute('aria-labelledby', `pedido${pedido.key}Title`);
    // Título
    const h3 = document.createElement('h3');
    h3.id = `pedido${pedido.key}Title`;
    h3.textContent = `Pedido #${pedido.key} - ${pedido.hora || 'Sin hora'}`;
    section.appendChild(h3);
    // Grid interno
    const pedidoGrid = document.createElement('div');
    pedidoGrid.className = 'pedido-grid';
    pedidoGrid.style.gridTemplateColumns = '1fr';
    pedidoGrid.style.gap = '1rem';
    // ZONA 1: Cliente
    const zonaCliente = document.createElement('div');
    zonaCliente.className = 'pedido-zona';
    zonaCliente.innerHTML = `
    <h4>👤 Cliente</h4>
    <div class="zona-content">
      <div class="cliente-info">
        <strong>${((_a = pedido.cliente) === null || _a === void 0 ? void 0 : _a.nombre) || 'N/A'}</strong>
        <p>${((_b = pedido.cliente) === null || _b === void 0 ? void 0 : _b.telefono) || 'N/A'}</p>
      </div>
    </div>
  `;
    pedidoGrid.appendChild(zonaCliente);
    // ZONA 2: Materiales
    const zonaMateriales = document.createElement('div');
    zonaMateriales.className = 'pedido-zona';
    const extrasHTML = (pedido.extras || []).map(e => `<span class="extra-tag">🎁 ${e}</span>`).join('') || '<span class="extra-tag">Sin extras</span>';
    zonaMateriales.innerHTML = `
    <h4>📦 Materiales</h4>
    <div class="zona-content">
      <div class="materiales-info">
        <strong>${pedido.producto || 'Sin producto'}</strong>
        ${pedido.personalizacion ? `<p>Personalización: "${pedido.personalizacion}"</p>` : ''}
        <div class="extras-list">${extrasHTML}</div>
        ${pedido.isSorpresa ? '<p class="sorpresa-badge">🎉 Es sorpresa</p>' : ''}
      </div>
    </div>
  `;
    pedidoGrid.appendChild(zonaMateriales);
    // ZONA 3: Empleados
    const zonaEmpleados = document.createElement('div');
    zonaEmpleados.className = 'pedido-zona';
    zonaEmpleados.innerHTML = `
    <h4>👨‍🍳 Asignar Empleados</h4>
    <div class="zona-content">
      <select class="empleado-select" multiple required>
        <option value="maria">👩‍🍳 María García - Chef Principal</option>
        <option value="carlos">👨‍🍳 Carlos López - Chef Especialista</option>
        <option value="ana">👩‍💼 Ana Rodríguez - Supervisora</option>
        <option value="luis">👨‍💼 Luis Martínez - Coordinador</option>
        <option value="sofia">👩‍🎨 Sofía Herrera - Decoradora</option>
      </select>
      <div class="instrucciones-seleccion">
        💡 Mantén presionado Ctrl (Cmd en Mac) y haz clic para seleccionar múltiples empleados
      </div>
    </div>
  `;
    pedidoGrid.appendChild(zonaEmpleados);
    section.appendChild(pedidoGrid);
    // Información adicional
    if (pedido.destinatario) {
        const infoAdicional = document.createElement('div');
        infoAdicional.className = 'pedido-info-adicional';
        infoAdicional.style.cssText = 'margin-top: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;';
        infoAdicional.innerHTML = `
      <div><strong>📍 Destinatario:</strong> ${pedido.destinatario.nombre} - ${pedido.destinatario.direccion}</div>
      <div><strong>📞 Teléfono destino:</strong> ${pedido.destinatario.telefono}</div>
      <div><strong>📅 Fecha entrega:</strong> ${pedido.fechaEntrega || 'Sin fecha'}</div>
      ${pedido.observaciones ? `<div><strong>📝 Observaciones:</strong> ${pedido.observaciones}</div>` : ''}
    `;
        section.appendChild(infoAdicional);
    }
    return section;
}
/**
 * Función principal para renderizar todos los pedidos
 */
export function renderizarPedidos() {
    const container = document.getElementById('pedidos-container');
    if (!container) {
        console.error('Contenedor "pedidos-container" no encontrado');
        return;
    }
    const pedidos = obtenerPedidosDesdeLocalStorage();
    if (pedidos.length === 0) {
        container.innerHTML = `
      <div class="no-pedidos" style="text-align: center; padding: 3rem; background: #f9fafb; border: 2px dashed #d1d5db; border-radius: 12px;">
        <p style="font-size: 1.2rem; color: #6b7280; margin-bottom: 1rem;">📭 No hay pedidos pendientes</p>
        <a href="./recepcion.html" style="display: inline-block; background: #3b82f6; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Ir a Recepción
        </a>
      </div>
    `;
        return;
    }
    // Agrupar por cliente
    const grupos = agruparPorCliente(pedidos);
    // Limpiar contenedor
    container.innerHTML = '';
    for (const nombreCliente in grupos) {
        if (grupos.hasOwnProperty(nombreCliente)) {
            const pedidosCliente = grupos[nombreCliente];
            if (!pedidosCliente)
                continue;
            // Crear grupo de cliente
            const grupoDiv = document.createElement('div');
            grupoDiv.className = 'cliente-grupo';
            grupoDiv.style.cssText = 'margin-bottom: 2rem; padding: 1.5rem; background: #f5f5f5; border-radius: 16px;';
            // Header del grupo
            const headerDiv = document.createElement('div');
            headerDiv.className = 'cliente-header';
            headerDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding: 1rem; background: #e5e7eb; border-radius: 12px;';
            headerDiv.innerHTML = `
        <h2 style="margin: 0; color: #1e3a8a; font-size: 1.4rem;">
          <span style="margin-right: 0.5rem;">👤</span>Cliente: ${nombreCliente}
        </h2>
        <span style="background: #3b82f6; color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.9rem; font-weight: bold;">
          ${pedidosCliente.length} ${pedidosCliente.length === 1 ? 'pedido' : 'pedidos'}
        </span>
      `;
            grupoDiv.appendChild(headerDiv);
            // Grid de pedidos
            const gridDiv = document.createElement('div');
            gridDiv.className = 'pedidos-grid-dos-columnas';
            gridDiv.style.display = 'grid';
            gridDiv.style.gridTemplateColumns = 'repeat(2, 1fr)';
            gridDiv.style.gap = '1.5rem';
            // Agregar cada pedido al grid
            for (let i = 0; i < pedidosCliente.length; i++) {
                const pedido = pedidosCliente[i];
                if (pedido) {
                    const pedidoElement = crearElementoPedido(pedido);
                    gridDiv.appendChild(pedidoElement);
                }
            }
            grupoDiv.appendChild(gridDiv);
            container.appendChild(grupoDiv);
        }
    }
}
/**
 * Inicializa el renderizado al cargar el DOM
 */
export function inicializarRenderizadoPedidos() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderizarPedidos);
    }
    else {
        renderizarPedidos();
    }
}
// Auto-inicializar si se importa como módulo
