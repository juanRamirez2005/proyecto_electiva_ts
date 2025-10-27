import { Tarjeta } from "../despacho/Tarjeta.js";
export function guardarTarjeta(para, de, mensaje) {
    const tarjetas = JSON.parse(localStorage.getItem("tarjetas") || "[]");
    const nuevaTarjeta = new Tarjeta(para, de, mensaje);
    tarjetas.push({
        para: nuevaTarjeta.getNombrePara(),
        de: nuevaTarjeta.getNombreDe(),
        mensaje: nuevaTarjeta.getMensaje(),
    });
    localStorage.setItem("tarjetas", JSON.stringify(tarjetas));
}
