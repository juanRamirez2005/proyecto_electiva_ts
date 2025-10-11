// paso por parámetros el id que capturo en el la página de despacho ajustando a cada atributo del pedido . 
export function verTirilla(orderId) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    // Capturar la información usando el ID del pedido
    const inicial = 123;
    const clienteNombre = ((_a = document.querySelector(`#cliente-${orderId} strong`)) === null || _a === void 0 ? void 0 : _a.textContent) || ""; // Se usa querySelector porque permite seleccionar elementos anidados con CSS selectors más específicos (ej: '#id strong'), mientras getElementById solo acepta IDs simples
    const clienteTelefono = ((_b = document.querySelector(`#cliente-${orderId} small`)) === null || _b === void 0 ? void 0 : _b.textContent) || "";
    const producto = ((_c = document.querySelector(`#producto-${orderId} strong`)) === null || _c === void 0 ? void 0 : _c.textContent) || "";
    const destNombre = ((_d = document.querySelector(`#destinatario-${orderId} strong`)) === null || _d === void 0 ? void 0 : _d.textContent) || "";
    const destTelefono = ((_e = document.querySelector(`#destinatario-${orderId} small`)) === null || _e === void 0 ? void 0 : _e.textContent) || "";
    const destDireccion = ((_f = document.querySelector(`#direccion-${orderId} strong`)) === null || _f === void 0 ? void 0 : _f.textContent) || "";
    const fechaHoraCompleta = ((_h = (_g = document.querySelector(`#fecha-${orderId} strong`)) === null || _g === void 0 ? void 0 : _g.textContent) === null || _h === void 0 ? void 0 : _h.toString()) || "";
    const observaciones = ((_j = document.querySelector(`#nota-${orderId}`)) === null || _j === void 0 ? void 0 : _j.value) || "";
    // Separar fecha y hora
    const [fechaEntrega = '', horaEntrega = ''] = fechaHoraCompleta.split(' - ');
    // Construir URL con los parámetros
    const url = `./tirilla.html?` +
        `clienteNombre=${encodeURIComponent(clienteNombre)}` +
        `&clienteTelefono=${encodeURIComponent(clienteTelefono)}` +
        `&producto=${encodeURIComponent(producto)}` +
        `&fechaEntrega=${encodeURIComponent(fechaEntrega)}` +
        `&horaEntrega=${encodeURIComponent(horaEntrega)}` +
        `&destNombre=${encodeURIComponent(destNombre)}` +
        `&destDireccion=${encodeURIComponent(destDireccion)}` +
        `&destTelefono=${encodeURIComponent(destTelefono)}` +
        `&observaciones=${encodeURIComponent(observaciones)}`;
    // Abrir la ventana de la tirilla
    window.open(url, "_blank", "width=400,height=600");
}
// esto es para que funcione el onclick del HTML, lo que hace es --> Exponer la función al ámbito global para el HTML
window.verTirilla = verTirilla;
