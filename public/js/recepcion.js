var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { calcularTotalOpciones, calcularTotalAdicionales, haversine, calcularValorDomicilio } from "./recepcion/calculos.js";
import { Cliente } from "./recepcion/components/Cliente.js";
import { Destinatario } from "./recepcion/components/Destinatario.js";
import { Pedido } from "./recepcion/components/Pedido.js";
import { Adicional } from "./recepcion/components/Adicional.js";
import { verTirilla } from "./despacho/tirilla.js";
import { DetallePedido } from "./recepcion/components/DetallePedido.js";
export class Recepcion {
    constructor() {
        this.pedidos = [];
        this.coordenadasNegocio = { lat: 4.52491, lon: -75.69787 };
        this.detallePedido = new DetallePedido();
        this.form = document.getElementById("orderForm");
        this.inicializarEventos();
        this.setProductoSelector();
        this.insertExtra();
    }
    inicializarEventos() {
        var _a, _b;
        (_a = this.form) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", (e) => {
            e.preventDefault();
            const { cliente, pedido, destinatario } = this.obtenerDatosFormulario();
            this.calcularTotales(cliente, pedido, destinatario);
        });
        (_b = document.getElementById("btnAgregarPedido")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", (e) => {
            e.preventDefault();
            if (!this.validarCamposPedido())
                return;
            const pedido = this.construirPedido();
            this.pedidos.unshift(pedido);
            // usar nombre del cliente y destinatario para el detalle
            const cliente = document.getElementById("clienteNombre").value;
            const destinatario = document.getElementById("destNombre").value;
            this.detallePedido.agregarPedido(pedido, cliente, destinatario);
            this.limpiarCamposPedido();
        });
        // control de cantidad de extras
        const extrasList = document.querySelectorAll(".quantity-control button");
        extrasList.forEach((button) => {
            button.addEventListener("click", () => {
                const input = document.querySelector("#extraQty");
                const currentValue = Number(input.textContent);
                if (button.classList.contains("increase")) {
                    input.textContent = (currentValue + 1).toString();
                }
                else {
                    input.textContent = (currentValue > 1 ? currentValue - 1 : 1).toString();
                }
            });
        });
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
    }
    obtenerDatosFormulario() {
        var _a;
        const cliente = new Cliente(document.getElementById("clienteNombre").value, document.getElementById("clienteTelefono").value);
        const pedido = {
            producto: document.getElementById("producto").value,
            personalizacion: document.getElementById("personalizacion").value,
            extras: Array.from(document.querySelectorAll("#extrasList li")).map((li) => Number(li.id)),
            fechaEntrega: document.getElementById("fechaEntrega").value,
            horaEntrega: document.getElementById("horaEntrega").value,
            sorpresa: (_a = document.querySelector("input[name='sorpresa']:checked")) === null || _a === void 0 ? void 0 : _a.checked
        };
        const destinatario = new Destinatario(document.getElementById("destNombre").value, document.getElementById("destTelefono").value, document.getElementById("destDireccion").value);
        return { cliente, pedido, destinatario };
    }
    calcularTotales(cliente, pedido, destinatario) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { opciones, adicionales } = yield this.getJsonData();
                const producto = opciones.find((o) => o.opcion === Number(pedido.producto));
                const totalOpciones = producto ? producto.precio : 0;
                const extrasSeleccionados = adicionales.filter((a) => pedido.extras.includes(a.id));
                const totalAdicionales = extrasSeleccionados.reduce((sum, e) => sum + e.precio, 0);
                const coordenadasCliente = { lat: 4.58138, lon: -75.63532 };
                const distancia = haversine(this.coordenadasNegocio.lat, this.coordenadasNegocio.lon, coordenadasCliente.lat, coordenadasCliente.lon);
                const totalDomicilio = calcularValorDomicilio(distancia);
                const totalPedido = totalOpciones + totalAdicionales + totalDomicilio;
                console.log("📦 Producto:", producto === null || producto === void 0 ? void 0 : producto.opcion, "→ $" + totalOpciones);
                console.log("➕ Extras:", extrasSeleccionados.map((e) => e.nombre), "→ $" + totalAdicionales);
                console.log("🚚 Domicilio:", distancia.toFixed(2) + " km → $" + totalDomicilio);
                console.log("🧾 TOTAL PEDIDO: $" + totalPedido);
            }
            catch (err) {
                console.error("❌ Error al calcular totales:", err);
            }
        });
    }
    setProductoSelector() {
        return __awaiter(this, void 0, void 0, function* () {
            const productoSelect = document.getElementById("producto");
            const adicionalesSelect = document.getElementById("extraSelect");
            const { opciones, adicionales } = yield this.getJsonData();
            productoSelect.innerHTML += opciones
                .map((opcion) => `<option value="${opcion.opcion}">Opción ${opcion.opcion}</option>`)
                .join("");
            adicionalesSelect.innerHTML += adicionales
                .map((adicional) => `<option value="${adicional.id}">${adicional.nombre} (+$${adicional.precio})</option>`)
                .join("");
        });
    }
    insertExtra() {
        const button = document.getElementById("addExtraBtn");
        const extraSelect = document.getElementById("extraSelect");
        button.addEventListener("click", () => {
            const selectedOption = extraSelect.options[extraSelect.selectedIndex];
            if (selectedOption && selectedOption.value !== "") {
                const li = document.createElement("li");
                li.textContent = `${selectedOption.text} (${document.getElementById("extraQty").textContent})`;
                document.getElementById("extrasList").appendChild(li);
            }
        });
    }
    getJsonData() {
        return __awaiter(this, void 0, void 0, function* () {
            const [opcionesRes, adicionalesRes] = yield Promise.all([
                fetch("../json/opciones.json"),
                fetch("../json/adicionales.json"),
            ]);
            const opciones = (yield opcionesRes.json()).opciones;
            const adicionales = (yield adicionalesRes.json()).adicionales;
            return { opciones, adicionales };
        });
    }
    construirPedido() {
        var _a;
        return new Pedido(document.getElementById("producto").value, document.getElementById("personalizacion").value, [], // aquí puedes mapear extras seleccionados
        document.getElementById("de").value, document.getElementById("para").value, document.getElementById("tarjeta").value, new Date(document.getElementById("fechaEntrega").value), new Date(document.getElementById("horaEntrega").value), ((_a = (document.querySelector('input[name="sorpresa"]:checked'))) === null || _a === void 0 ? void 0 : _a.value) === "si", document.getElementById("observaciones").value);
    }
    limpiarCamposPedido() {
        document.getElementById("producto").value = "";
        document.getElementById("personalizacion").value = "";
        document.getElementById("extraSelect").value = "";
        document.getElementById("extrasList").innerHTML = "";
        document.getElementById("de").value = "";
        document.getElementById("para").value = "";
        document.getElementById("tarjeta").value = "";
        document.getElementById("fechaEntrega").value = "";
        document.getElementById("horaEntrega").value = "";
        document.getElementById("observaciones").value = "";
        document.getElementById("extraQty").textContent = "1";
    }
    // ---------------- VALIDACIONES ----------------
    setError(input, errorId, mensaje) {
        input.classList.add("error-border");
        const errorDiv = document.getElementById(errorId);
        if (errorDiv)
            errorDiv.textContent = mensaje;
    }
    resetErrores() {
        document.querySelectorAll(".error").forEach((el) => (el.textContent = ""));
        document.querySelectorAll(".error-border").forEach((el) => el.classList.remove("error-border"));
    }
    validarCamposPedido() {
        let valido = true;
        this.resetErrores();
        const producto = document.getElementById("producto");
        if (producto && !producto.value) {
            valido = false;
            this.setError(producto, "err-producto", "Selecciona un producto");
        }
        const de = document.getElementById("de");
        if (de && !de.value.trim()) {
            valido = false;
            this.setError(de, "err-de", "Campo obligatorio");
        }
        const para = document.getElementById("para");
        if (para && !para.value.trim()) {
            valido = false;
            this.setError(para, "err-para", "Campo obligatorio");
        }
        const fecha = document.getElementById("fechaEntrega");
        if (fecha) {
            if (!fecha.value) {
                valido = false;
                this.setError(fecha, "err-fechaEntrega", "Campo obligatorio");
            }
            else {
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);
                const fechaIngresada = new Date(fecha.value);
                if (fechaIngresada < hoy) {
                    valido = false;
                    this.setError(fecha, "err-fechaEntrega", "No se permiten fechas pasadas");
                }
            }
        }
        const hora = document.getElementById("horaEntrega");
        if (hora && !hora.value) {
            valido = false;
            this.setError(hora, "err-horaEntrega", "Campo obligatorio");
        }
        const sorpresa = document.querySelector("input[name='sorpresa']:checked");
        if (!sorpresa) {
            valido = false;
            const errSorpresa = document.getElementById("err-sorpresa");
            if (errSorpresa)
                errSorpresa.textContent = "Selecciona una opción";
        }
        return valido;
    }
}
