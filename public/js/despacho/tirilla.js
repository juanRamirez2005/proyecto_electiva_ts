export function verTirilla() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    // capturar la información 
    const inicial = 123;
    const clienteNombreInput = ((_a = document.getElementById("clienteNombre")) === null || _a === void 0 ? void 0 : _a.value) || "";
    const clienteTelefonoInput = ((_b = document.getElementById("clienteTelefono")) === null || _b === void 0 ? void 0 : _b.value) || "";
    const productoInput = ((_c = document.getElementById("producto")) === null || _c === void 0 ? void 0 : _c.value) || "";
    const fechaEntregaInput = ((_d = document.getElementById("fechaEntrega")) === null || _d === void 0 ? void 0 : _d.value) || "";
    const horaEntregaInput = ((_e = document.getElementById("horaEntrega")) === null || _e === void 0 ? void 0 : _e.value) || "";
    const destNombreInput = ((_f = document.getElementById("destNombre")) === null || _f === void 0 ? void 0 : _f.value) || "";
    const destDireccionInput = ((_g = document.getElementById("destDireccion")) === null || _g === void 0 ? void 0 : _g.value) || "";
    const destTelefonoInput = ((_h = document.getElementById("destTelefono")) === null || _h === void 0 ? void 0 : _h.value) || "";
    const observacionesInput = ((_j = document.getElementById("observaciones")) === null || _j === void 0 ? void 0 : _j.value) || "";
    const url = `/proyecto_electiva_ts/public/html/tirilla.html?
            
            inicial=${encodeURIComponent(clienteTelefonoInput)}
            &clienteTelefono=${encodeURIComponent(clienteTelefonoInput)}
            &clienteNombre=${encodeURIComponent(clienteNombreInput)}
            &producto=${encodeURIComponent(productoInput)}
            &fechaEntrega=${encodeURIComponent(fechaEntregaInput)}
            &horaEntrega=${encodeURIComponent(horaEntregaInput)}
            &destNombre=${encodeURIComponent(destNombreInput)}
            &destDireccion=${encodeURIComponent(destDireccionInput)}
            &destTelefono=${encodeURIComponent(destTelefonoInput)}
            &observaciones=${encodeURIComponent(observacionesInput)}`;
    window.open(url, "_blank", "width=400,height=600");
}
// esto es para que funcione el onclick del HTML
window.verTirilla = verTirilla;
