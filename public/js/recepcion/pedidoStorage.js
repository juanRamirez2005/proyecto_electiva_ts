import { Pedido } from "./components/Pedido.js";
/**
 * Guarda un pedido completo en localStorage
 */
export function guardarPedido(cliente, destinatario, pedido) {
    const pedidos = obtenerPedidos();
    const nuevoPedido = {
        id: `ORD${Date.now()}`,
        cliente,
        destinatario,
        pedido: {
            producto: pedido.producto,
            personalizacion: pedido.personalizacion,
            extras: pedido.extras,
            de: pedido.de,
            para: pedido.para,
            mensajeTarjeta: pedido.mensajeTarjeta,
            fechaEntrega: pedido.fechaEntrega.toISOString(),
            horaEntrega: pedido.horaEntrega.toISOString(),
            isSorpresa: pedido.isSorpresa,
            observacionesDespachador: pedido.observacionesDespachador
        },
        fechaCreacion: new Date().toISOString()
    };
    pedidos.push(nuevoPedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
}
/**
 * Obtiene todos los pedidos guardados en localStorage
 */
export function obtenerPedidos() {
    const data = localStorage.getItem("pedidos");
    return data ? JSON.parse(data) : [];
}
/**
 * Elimina un pedido por su ID
 */
export function eliminarPedido(id) {
    const pedidos = obtenerPedidos().filter(p => p.id !== id);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
}
/**
 * Limpia todos los pedidos
 */
export function limpiarPedidos() {
    localStorage.removeItem("pedidos");
}
