var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
import { calcularTotalOpciones, calcularTotalAdicionales, haversine, calcularValorDomicilio } from "./recepcion/calculos.js";
import { Pedido } from "./recepcion/components/Pedido.js";
import { verTirilla } from "./despacho/tirilla.js";
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
const pedidos = [];
(_a = document.getElementById("btnAgregarPedido")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (e) => {
    var _a;
    e.preventDefault();
    if (!validarCamposPedido())
        return;
    const producto = document.getElementById("producto").value;
    const personalizacion = document.getElementById("personalizacion").value;
    //const extras = (document.getElementById("extrasList") as HTMLSelectElement).value;
    const extras = [];
    const de = document.getElementById("de").value;
    const para = document.getElementById("para").value;
    const tarjeta = document.getElementById("tarjeta").value;
    const fechaEntrega = new Date(document.getElementById("fechaEntrega").value);
    const horaEntrega = new Date(document.getElementById("horaEntrega").value);
    const isSorpresa = ((_a = (document.querySelector('input[name="sorpresa"]:checked'))) === null || _a === void 0 ? void 0 : _a.value) === "si";
    const observacionesDespachador = document.getElementById("observaciones").value;
    const pedido = {
        producto: producto,
        personalizacion: personalizacion,
        extras: extras,
        de: de,
        para: para,
        mensajeTarjeta: tarjeta,
        fechaEntrega: fechaEntrega,
        horaEntrega: horaEntrega,
        isSorpresa: isSorpresa,
        observacionesDespachador: observacionesDespachador
    };
    pedidos.unshift(pedido);
    renderizarPedidos();
    limpiarCamposPedido();
});
function setError(input, errorId, mensaje) {
    input.classList.add("error-border");
    const errorDiv = document.getElementById(errorId);
    if (errorDiv)
        errorDiv.textContent = mensaje;
}
function resetErrores() {
    document.querySelectorAll(".error").forEach(el => el.textContent = "");
    document.querySelectorAll(".error-border").forEach(el => el.classList.remove("error-border"));
}
function validarCamposDestinatario() {
    let valido = true;
    resetErrores();
    const nombreDestino = document.getElementById("destNombre");
    if (nombreDestino && !nombreDestino.value.trim()) {
        valido = false;
        setError(nombreDestino, "err-nombreDestino", "Campo obligatorio");
    }
    const direccionDestino = document.getElementById("destDireccion");
    if (direccionDestino && !direccionDestino.value.trim()) {
        valido = false;
        setError(direccionDestino, "err-direccionDestino", "Campo obligatorio");
    }
    const telefonoDestino = document.getElementById("destTelefono");
    if (telefonoDestino && !(telefonoDestino === null || telefonoDestino === void 0 ? void 0 : telefonoDestino.value.trim())) {
        valido = false;
        setError(telefonoDestino, "err-telefonoDestino", "Campo obligatorio");
    }
    return valido;
}
function validarCamposCliente() {
    let valido = true;
    resetErrores();
    const nombre = document.getElementById("clienteTitle");
    if (nombre && !nombre.value.trim()) {
        valido = false;
        setError(nombre, "err-nombreCliente", "Campo obligatorio");
    }
    const telefono = document.getElementById("clienteTelefono");
    if (telefono && !(telefono === null || telefono === void 0 ? void 0 : telefono.value.trim())) {
        valido = false;
        setError(telefono, "err-telefonoCliente", "Campo obligatorio");
    }
    return valido;
}
function validarCamposPedido() {
    let valido = true;
    resetErrores();
    // Valicación de producto
    const producto = document.getElementById("producto");
    if (producto && !producto.value) {
        valido = false;
        setError(producto, "err-producto", "Selecciona un producto");
    }
    // Validación de "de"
    const de = document.getElementById("de");
    if (de && !de.value.trim()) {
        valido = false;
        setError(de, "err-de", "Campo obligatorio");
    }
    // Validación de "para"
    const para = document.getElementById("para");
    if (para && !para.value.trim()) {
        valido = false;
        setError(para, "err-para", "Campo obligatorio");
    }
    // Validación de fecha
    const fecha = document.getElementById("fechaEntrega");
    if (fecha) {
        if (!fecha.value) {
            valido = false;
            setError(fecha, "err-fechaEntrega", "Campo obligatorio");
        }
        else {
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            const fechaIngresada = new Date(fecha.value);
            if (fechaIngresada < hoy) {
                valido = false;
                setError(fecha, "err-fechaEntrega", "No se permiten fechas pasadas");
            }
        }
    }
    // Validación de hora
    const hora = document.getElementById("horaEntrega");
    if (hora && !hora.value) {
        valido = false;
        setError(hora, "err-horaEntrega", "Campo obligatorio");
    }
    // Validación de isSorpresa
    const sorpresa = document.querySelector("input[name='sorpresa']:checked");
    if (!sorpresa) {
        valido = false;
        const errSorpresa = document.getElementById("err-sorpresa");
        if (errSorpresa)
            errSorpresa.textContent = "Selecciona una opción";
    }
    return valido;
}
function limpiarCamposPedido() {
    document.getElementById("producto").value = "";
    document.getElementById("personalizacion").value = "";
    document.getElementById("extraSelect").value = "";
    document.getElementById("extrasList").innerHTML = "";
    document.getElementById("de").value = "";
    document.getElementById("para").value = "";
    document.getElementById("tarjeta").value = "";
    document.getElementById("fechaEntrega").value = "";
    document.getElementById("horaEntrega").value = "";
    //(document.querySelector<HTMLInputElement>('input[name="sorpresa"]:checked'))?.checked = false;
    document.getElementById("observaciones").value = "";
    document.getElementById("extraQty").textContent = "1";
}
function renderizarPedidos() {
    const resumenDiv = document.getElementById("resumenPedidos");
    resumenDiv.innerHTML = "";
    pedidos.forEach((p, index) => {
        const card = document.createElement("div");
        card.className = "pedido-card";
        card.innerHTML = `
      <strong>${p.producto}</strong><br>
      De: ${p.de} → Para: ${p.para}<br>
      Fecha: ${p.fechaEntrega} ${p.horaEntrega}<br>
    `;
        resumenDiv.appendChild(card);
    });
}
function cargarSidebar() {
    return __awaiter(this, arguments, void 0, function* (jsonPath = "../json/opciones.json") {
        try {
            const response = yield fetch(jsonPath);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data = yield response.json();
            const sidebarList = document.getElementById("sidebar-list");
            if (!sidebarList)
                return;
            sidebarList.innerHTML = "";
            data.opciones.forEach((item) => {
                const li = document.createElement("li");
                // Título de la opción
                const title = document.createElement("strong");
                title.textContent = `Opción ${item.opcion} - $${item.precio.toLocaleString()}`;
                // Frutas
                const frutas = Object.keys(item.fruta)
                    .map(nombre => `${nombre} (${item.fruta[nombre]})`)
                    .join(", ");
                // Flores
                const flores = Object.keys(item.flores)
                    .map(nombre => `${nombre} (${item.flores[nombre]})`)
                    .join(", ");
                const details = document.createElement("small");
                details.textContent = `Frutas: ${frutas} | Flores: ${flores}`;
                li.appendChild(title);
                li.appendChild(details);
                sidebarList.appendChild(li);
            });
        }
        catch (error) {
            console.error("Error cargando menú:", error);
        }
    });
}
function initSidebarToggle(toggleBtnId = "menu-toggle", sidebarId = "sidebar") {
    const toggleBtn = document.getElementById(toggleBtnId);
    const sidebar = document.getElementById(sidebarId);
    if (!toggleBtn || !sidebar) {
        console.error("No se encontró el botón o el sidebar");
        return;
    }
    toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("active");
    });
}
document.addEventListener("DOMContentLoaded", () => {
    cargarSidebar();
    initSidebarToggle();
});
