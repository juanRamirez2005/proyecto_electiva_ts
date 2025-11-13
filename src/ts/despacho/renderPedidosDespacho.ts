import type { PedidoLocalStorage } from '../procesamiento/PedidoLocalStorage.js';
import { verTirilla } from './tirilla.js';

function obtenerPedidosDesdeLocalStorage(): PedidoLocalStorage[] {
    const pedidos: PedidoLocalStorage[] = [];

    for(let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('ORD')) {
            try {
                const pedido = JSON.parse(localStorage.getItem(key) || '{}') as PedidoLocalStorage;
                pedido.key = key;
                pedidos.push(pedido)
            } catch (e) {
                console.error(`Error parseando ${key}:`, e);
            }
        }
    }

    return pedidos;
}

function crearElementoPedido(pedido: PedidoLocalStorage): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'pedido';

    // Header
    const header = document.createElement('div');
    header.className = 'pedido-header';
    
    const h3 = document.createElement('h3');
    h3.id = `pedido${pedido.key}Title`;
    h3.textContent = `Pedido ${pedido.key}`;
    header.appendChild(h3);

    const span = document.createElement('span');
    span.className = `status ${pedido.estado || 'pending'}`;
    span.textContent = pedido.estado || 'Pendiente';
    header.appendChild(span);
    
    wrapper.appendChild(header);

    // Cliente
    const client = document.createElement('p');
    client.id = `cliente-${pedido.key}`;
    client.innerHTML = `
        Cliente:
        <br>
        <strong>${pedido.cliente?.nombre || 'N/A'}</strong>
        <br>
        <small>${pedido.cliente?.telefono || 'N/A'}</small>
    `;
    wrapper.appendChild(client);

    // Producto
    const product = document.createElement('p');
    product.id = `producto-${pedido.key}`;
    product.innerHTML = `
        Producto:
        <br>
        <strong>${pedido.producto || 'Sin producto'}</strong>
    `;
    wrapper.appendChild(product);

    // Destinatario
    const destinatario = document.createElement('p');
    destinatario.id = `destinatario-${pedido.key}`;
    destinatario.innerHTML = `
        Destinatario:
        <br>
        <strong>${pedido.destinatario?.nombre || 'N/A'}</strong>
        <br>
        <small>${pedido.destinatario?.telefono || 'N/A'}</small>
    `;
    wrapper.appendChild(destinatario);

    // Dirección
    const direccion = document.createElement('p');
    direccion.id = `direccion-${pedido.key}`;
    direccion.innerHTML = `
        Dirección de entrega:
        <br>
        <strong>${pedido.destinatario?.direccion || 'Sin dirección'}</strong>
    `;
    wrapper.appendChild(direccion);

    // Fecha
    const fecha = document.createElement('p');
    fecha.id = `fecha-${pedido.key}`;
    fecha.innerHTML = `
        Fecha Entrega:
        <br>
        <strong>${pedido.fechaEntrega || 'Sin fecha'}</strong>
    `;
    wrapper.appendChild(fecha);

    // Footer
    const pedido_footer = document.createElement('div');
    pedido_footer.className = 'pedido-footer';
    
    const precio = document.createElement('span');
    precio.className = "precio";
    precio.id = `precio-${pedido.key}`;
    precio.textContent = pedido.precio || '$0';
    
    const fecha_creacion = document.createElement('small');
    fecha_creacion.id = `fecha-creacion-${pedido.key}`;
    fecha_creacion.textContent = pedido.hora || 'sin fecha';
    
    pedido_footer.appendChild(precio);
    pedido_footer.appendChild(fecha_creacion);
    wrapper.appendChild(pedido_footer);

    // Nota pedido
    const nota = document.createElement('div');
    nota.className = "nota";
    nota.innerHTML = `
        <label for="nota-${pedido.key}">Nota:</label>
        <textarea id="nota-${pedido.key}" placeholder="Observaciones del despacho"></textarea>
    `;
    wrapper.appendChild(nota);

    // Acciones
    const acciones = document.createElement('div');
    acciones.className = 'acciones';
    
    const btn_eliminar = document.createElement('button');
    btn_eliminar.className = "btn btn-eliminar";
    btn_eliminar.textContent = "Eliminar";
    
    const btn_cambiarEstado = document.createElement('button');
    btn_cambiarEstado.className = "btn btn-cambiar-estado";
    btn_cambiarEstado.textContent = "Cambiar Estado";
    
    const btn_verTirilla = document.createElement('button');
    btn_verTirilla.className = "btn btn-ver-tirilla";
    btn_verTirilla.textContent = "Ver Tirilla";
    btn_verTirilla.addEventListener("click", () => {
        verTirilla(pedido.key || 'ORD000');
    });
    
    acciones.appendChild(btn_eliminar);
    acciones.appendChild(btn_cambiarEstado);
    acciones.appendChild(btn_verTirilla);
    wrapper.appendChild(acciones);

    return wrapper;
}

export function renderPedidosDespacho(): void {
    const container = document.getElementById('pedidos-container');

    if(!container) {
        console.error('Contenedor "pedidos-container" no encontrado');
        return;
    }

    const pedidos = obtenerPedidosDesdeLocalStorage();

    if(pedidos.length === 0) {
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

    // Limpiar contenedor
    container.innerHTML = '';

    // Renderizar cada pedido
    pedidos.forEach(pedido => {
        const pedidoElement = crearElementoPedido(pedido);
        container.appendChild(pedidoElement);
    });
}

// Inicializar cuando el DOM esté listo
export function inicializarRenderizadoDespacho(): void {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderPedidosDespacho);
    } else {
        renderPedidosDespacho();
    }
}

// Auto-inicializar
inicializarRenderizadoDespacho();