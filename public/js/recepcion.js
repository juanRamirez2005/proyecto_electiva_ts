var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { calcularTotalOpciones, calcularTotalAdicionales, haversine, calcularValorDomicilio } from "./calculos.js";
setProductoSelector();
const form = document.getElementById("orderForm");
const coordenadasNegocio = { lat: 4.52491, lon: -75.69787 };
insertExtra();
// Cuando el usuario envíe el formulario
form === null || form === void 0 ? void 0 : form.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    e.preventDefault(); // evitar recargar página
    // 📌 1. Datos del cliente
    const cliente = {
        nombre: document.getElementById("clienteNombre").value,
        telefono: document.getElementById("clienteTelefono").value
    };
    ;
    // 📌 2. Datos del pedido
    const pedido = {
        producto: document.getElementById("producto").value,
        personalizacion: document.getElementById("personalizacion").value,
        extras: Array.from(document.querySelectorAll("#extrasList li")).map(li => Number(li.id)),
        fechaEntrega: document.getElementById("fechaEntrega").value,
        horaEntrega: document.getElementById("horaEntrega").value,
        sorpresa: (_a = document.querySelector("input[name='sorpresa']:checked")) === null || _a === void 0 ? void 0 : _a.checked
    };
    // 📌 3. Datos del destinatario
    const destinatario = {
        nombre: document.getElementById("destNombre").value,
        direccion: document.getElementById("destDireccion").value,
        telefono: document.getElementById("destTelefono").value,
    };
    console.log("Cliente:", cliente);
    console.log("Pedido:", pedido);
    console.log("Destinatario:", destinatario);
    // 📌 4. Llamar función que calcule totales
    yield calcularTotales(cliente, pedido, destinatario);
}));
function calcularTotales(cliente, pedido, destinatario) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { opciones, adicionales } = yield getJsonData();
            // Buscar el producto elegido
            const producto = opciones.find(o => o.opcion === Number(pedido.producto));
            const totalOpciones = producto ? producto.precio : 0;
            // Extras seleccionados (si usas IDs en lugar de texto en el <ul>, mejor)
            const extrasSeleccionados = adicionales.filter(a => pedido.extras.includes(a.id));
            const totalAdicionales = extrasSeleccionados.reduce((sum, e) => sum + e.precio, 0);
            // Distancia ficticia (aquí podrías obtener coords reales con API de geocoding)
            const coordenadasCliente = { lat: 4.58138, lon: -75.63532 };
            const distancia = haversine(coordenadasNegocio.lat, coordenadasNegocio.lon, coordenadasCliente.lat, coordenadasCliente.lon);
            const totalDomicilio = calcularValorDomicilio(distancia);
            // Total general
            const totalPedido = totalOpciones + totalAdicionales + totalDomicilio;
            console.log("📦 Producto:", producto === null || producto === void 0 ? void 0 : producto.opcion, "→ $" + totalOpciones);
            console.log("➕ Extras:", extrasSeleccionados.map(e => e.nombre), "→ $" + totalAdicionales);
            console.log("🚚 Domicilio:", distancia.toFixed(2) + " km → $" + totalDomicilio);
            console.log("🧾 TOTAL PEDIDO: $" + totalPedido);
        }
        catch (err) {
            console.error("❌ Error al calcular totales:", err);
        }
    });
}
const extrasList = document.querySelectorAll('.quantity-control button');
extrasList.forEach(button => {
    button.addEventListener('click', () => {
        const input = document.querySelector('#extraQty');
        const currentValue = Number(input.textContent);
        if (button.classList.contains('increase')) {
            input.textContent = (currentValue + 1).toString();
        }
        else {
            input.textContent = (currentValue > 1 ? currentValue - 1 : 1).toString();
        }
    });
});
function setProductoSelector() {
    return __awaiter(this, void 0, void 0, function* () {
        const productoSelect = document.getElementById('producto');
        const adicionalesSelect = document.getElementById('extraSelect');
        const { opciones, adicionales } = yield getJsonData();
        const opcionesHTML = opciones.map(opcion => `
    <option value="${opcion.opcion}">
      Opción ${opcion.opcion}
    </option>
  `).join("");
        productoSelect.innerHTML += opcionesHTML;
        debugger;
        const adicionalesHTML = adicionales.map(adicional => `
    <option value="${adicional.id}">
      ${adicional.nombre} (+$${adicional.precio})
    </option>
  `).join("");
        adicionalesSelect.innerHTML += adicionalesHTML;
    });
}
function insertExtra() {
    const button = document.getElementById('addExtraBtn');
    const extraSelect = document.getElementById('extraSelect');
    button.addEventListener('click', () => {
        const selectedOption = extraSelect.options[extraSelect.selectedIndex];
        if (selectedOption && selectedOption.value !== "") {
            const li = document.createElement('li');
            li.textContent = `${selectedOption.text} (${document.getElementById('extraQty').textContent})`;
            document.getElementById('extrasList').appendChild(li);
        }
    });
}
function getJsonData() {
    return __awaiter(this, void 0, void 0, function* () {
        const [opcionesRes, adicionalesRes] = yield Promise.all([
            fetch("../json/opciones.json"),
            fetch("../json/adicionales.json")
        ]);
        const opciones = (yield opcionesRes.json()).opciones;
        const adicionales = (yield adicionalesRes.json()).adicionales;
        return {
            opciones,
            adicionales
        };
    });
}
