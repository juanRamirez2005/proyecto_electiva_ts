import {
  calcularTotalOpciones,
  calcularTotalAdicionales,
  haversine,
  calcularValorDomicilio
} from "./recepcion/calculos.js";

import { Cliente } from "./recepcion/components/Cliente.js";
import { Destinatario } from "./recepcion/components/Destinatario.js";
import { Pedido } from "./recepcion/components/Pedido.js";
import { Adicional } from "./recepcion/components/Adicional.js";
import { verTirilla } from "./despacho/tirilla.js";
import { DetallePedido } from "./recepcion/components/DetallePedido.js";
import { guardarTarjeta } from "./recepcion/tarjetaStorage.js";

export class Recepcion {
  private form: HTMLDivElement | null;
  private pedidos: Pedido[] = [];
  private coordenadasNegocio = { lat: 4.52491, lon: -75.69787 };
  private detallePedido = new DetallePedido();

  constructor() {
    this.form = document.getElementById("orderForm") as HTMLDivElement | null;

    this.inicializarEventos();
    this.setProductoSelector();
    this.insertExtra();
  }

  private inicializarEventos() {
    this.form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const { cliente, pedido, destinatario } = this.obtenerDatosFormulario();
      this.calcularTotales(cliente, pedido, destinatario);
    });

    document.getElementById("btnAgregarPedido")?.addEventListener("click", (e) => {
      e.preventDefault();
      if (!this.validarCamposPedido()) return;

      const pedido = this.construirPedido();
      this.pedidos.unshift(pedido);

      // usar nombre del cliente y destinatario para el detalle
      const cliente = (document.getElementById("clienteNombre") as HTMLInputElement).value;
      const destinatario = (document.getElementById("destNombre") as HTMLInputElement).value;

      this.detallePedido.agregarPedido(pedido, cliente, destinatario);

      // guardar tarjeta en localStorage
      const para = (document.getElementById("para") as HTMLInputElement).value;
      const de = (document.getElementById("de") as HTMLInputElement).value;
      const mensaje = (document.getElementById("tarjeta") as HTMLTextAreaElement).value;

      if (para && de && mensaje) {
        guardarTarjeta(para, de, mensaje);
      }

      this.limpiarCamposPedido();
    });

    // control de cantidad de extras
    const extrasList = document.querySelectorAll(".quantity-control button");
    extrasList.forEach((button) => {
      button.addEventListener("click", () => {
        const input = document.querySelector("#extraQty") as HTMLSpanElement;
        const currentValue = Number(input.textContent);
        if (button.classList.contains("increase")) {
          input.textContent = (currentValue + 1).toString();
        } else {
          input.textContent = (currentValue > 1 ? currentValue - 1 : 1).toString();
        }
      });
    });

    interface Opcion {
      opcion: number;
      fruta: Record<string, number>;
      flores: Record<string, number>;
      color_cinta: string;
      color_papel: string;
      color_caja: string;
      precio: number;
      tamano_grande: boolean;
    }

    async function cargarSidebar(jsonPath: string = "../json/opciones.json"): Promise<void> {
      try {
        const response = await fetch(jsonPath);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data: { opciones: Opcion[] } = await response.json();

        const sidebarList = document.getElementById("sidebar-list") as HTMLUListElement | null;
        if (!sidebarList) return;

        sidebarList.innerHTML = "";

        data.opciones.forEach((item: Opcion) => {
          const li = document.createElement("li");

          // Título de la opción
          const title = document.createElement("strong");
          title.textContent = `Opción ${item.opcion} - $${item.precio.toLocaleString()}`;

          // Frutas
          const frutas = Object.keys(item.fruta)
            .map(nombre => `${nombre} (${(item.fruta as any)[nombre]})`)
            .join(", ");

          // Flores
          const flores = Object.keys(item.flores)
            .map(nombre => `${nombre} (${(item.flores as any)[nombre]})`)
            .join(", ");

          const details = document.createElement("small");
          details.textContent = `Frutas: ${frutas} | Flores: ${flores}`;

          li.appendChild(title);
          li.appendChild(details);

          sidebarList.appendChild(li);
        });
      } catch (error) {
        console.error("Error cargando menú:", error);
      }
    }

    function initSidebarToggle(toggleBtnId: string = "menu-toggle", sidebarId: string = "sidebar"): void {
      const toggleBtn = document.getElementById(toggleBtnId) as HTMLButtonElement | null;
      const sidebar = document.getElementById(sidebarId) as HTMLElement | null;

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

  private obtenerDatosFormulario() {
    const cliente = new Cliente(
      (document.getElementById("clienteNombre") as HTMLInputElement).value,
      (document.getElementById("clienteTelefono") as HTMLInputElement).value
    );

    const pedido = {
      producto: (document.getElementById("producto") as HTMLInputElement).value,
      personalizacion: (document.getElementById("personalizacion") as HTMLInputElement).value,
      extras: Array.from(document.querySelectorAll("#extrasList li")).map((li) => Number(li.id)),
      fechaEntrega: (document.getElementById("fechaEntrega") as HTMLInputElement).value,
      horaEntrega: (document.getElementById("horaEntrega") as HTMLInputElement).value,
      sorpresa: (document.querySelector("input[name='sorpresa']:checked") as HTMLInputElement)?.checked
    };

    const destinatario = new Destinatario(
      (document.getElementById("destNombre") as HTMLInputElement).value,
      (document.getElementById("destTelefono") as HTMLInputElement).value,
      (document.getElementById("destDireccion") as HTMLInputElement).value
    );

    return { cliente, pedido, destinatario };
  }

  private async calcularTotales(
    cliente: Cliente,
    pedido: {
      producto: string;
      personalizacion: string;
      extras: Array<number>;
      fechaEntrega: string;
      horaEntrega: string;
      sorpresa: boolean;
    },
    destinatario: Destinatario
  ) {
    try {
      const { opciones, adicionales } = await this.getJsonData();

      const producto = opciones.find((o) => o.opcion === Number(pedido.producto));
      const totalOpciones = producto ? producto.precio : 0;

      const extrasSeleccionados = adicionales.filter((a) =>
        pedido.extras.includes(a.id)
      );
      const totalAdicionales = extrasSeleccionados.reduce(
        (sum, e) => sum + e.precio,
        0
      );

      const coordenadasCliente = { lat: 4.58138, lon: -75.63532 };
      const distancia = haversine(
        this.coordenadasNegocio.lat,
        this.coordenadasNegocio.lon,
        coordenadasCliente.lat,
        coordenadasCliente.lon
      );
      const totalDomicilio = calcularValorDomicilio(distancia);

      const totalPedido = totalOpciones + totalAdicionales + totalDomicilio;

      console.log("📦 Producto:", producto?.opcion, "→ $" + totalOpciones);
      console.log("➕ Extras:", extrasSeleccionados.map((e) => e.nombre), "→ $" + totalAdicionales);
      console.log("🚚 Domicilio:", distancia.toFixed(2) + " km → $" + totalDomicilio);
      console.log("🧾 TOTAL PEDIDO: $" + totalPedido);
    } catch (err) {
      console.error("❌ Error al calcular totales:", err);
    }
  }

  private async setProductoSelector() {
    const productoSelect = document.getElementById("producto") as HTMLSelectElement;
    const adicionalesSelect = document.getElementById("extraSelect") as HTMLSelectElement;
    const { opciones, adicionales } = await this.getJsonData();

    productoSelect.innerHTML += opciones
      .map((opcion) => `<option value="${opcion.opcion}">Opción ${opcion.opcion}</option>`)
      .join("");

    adicionalesSelect.innerHTML += adicionales
      .map((adicional) => `<option value="${adicional.id}">${adicional.nombre} (+$${adicional.precio})</option>`)
      .join("");
  }

  private insertExtra() {
    const button = document.getElementById("addExtraBtn") as HTMLButtonElement;
    const extraSelect = document.getElementById("extraSelect") as HTMLSelectElement;

    button.addEventListener("click", () => {
      const selectedOption = extraSelect.options[extraSelect.selectedIndex];
      if (selectedOption && selectedOption.value !== "") {
        const li = document.createElement("li");
        li.textContent = `${selectedOption.text} (${(document.getElementById("extraQty") as HTMLSpanElement).textContent})`;
        (document.getElementById("extrasList") as HTMLUListElement).appendChild(li);
      }
    });
  }

  private async getJsonData(): Promise<{
    opciones: Array<{
      opcion: number;
      fruta: Record<string, number>;
      flores: Record<string, number>;
      color_cinta: string;
      color_papel: string;
      color_caja: string;
      precio: number;
      tamano_grande: boolean;
    }>;
    adicionales: Array<{ id: number; nombre: string; precio: number }>;
  }> {
    const [opcionesRes, adicionalesRes] = await Promise.all([
      fetch("../json/opciones.json"),
      fetch("../json/adicionales.json"),
    ]);

    const opciones = (await opcionesRes.json() as { opciones: any }).opciones;
    const adicionales = (await adicionalesRes.json() as { adicionales: any }).adicionales;

    return { opciones, adicionales };
  }

  private construirPedido(): Pedido {
    return new Pedido(
      (document.getElementById("producto") as HTMLSelectElement).value,
      (document.getElementById("personalizacion") as HTMLTextAreaElement).value,
      [], // aquí puedes mapear extras seleccionados
      (document.getElementById("de") as HTMLInputElement).value,
      (document.getElementById("para") as HTMLInputElement).value,
      (document.getElementById("tarjeta") as HTMLTextAreaElement).value,
      new Date((document.getElementById("fechaEntrega") as HTMLInputElement).value),
      new Date((document.getElementById("horaEntrega") as HTMLInputElement).value),
      (document.querySelector<HTMLInputElement>('input[name="sorpresa"]:checked'))?.value === "si",
      (document.getElementById("observaciones") as HTMLTextAreaElement).value
    );
  }

  private limpiarCamposPedido() {
    (document.getElementById("producto") as HTMLSelectElement).value = "";
    (document.getElementById("personalizacion") as HTMLTextAreaElement).value = "";
    (document.getElementById("extraSelect") as HTMLSelectElement).value = "";
    (document.getElementById("extrasList") as HTMLUListElement).innerHTML = "";
    (document.getElementById("de") as HTMLInputElement).value = "";
    (document.getElementById("para") as HTMLInputElement).value = "";
    (document.getElementById("tarjeta") as HTMLTextAreaElement).value = "";
    (document.getElementById("fechaEntrega") as HTMLInputElement).value = "";
    (document.getElementById("horaEntrega") as HTMLInputElement).value = "";
    (document.getElementById("observaciones") as HTMLTextAreaElement).value = "";
    (document.getElementById("extraQty") as HTMLElement).textContent = "1";
  }

  // ---------------- VALIDACIONES ----------------
  private setError(input: HTMLElement, errorId: string, mensaje: string) {
    input.classList.add("error-border");
    const errorDiv = document.getElementById(errorId);
    if (errorDiv) errorDiv.textContent = mensaje;
  }

  private resetErrores() {
    document.querySelectorAll(".error").forEach((el) => (el.textContent = ""));
    document.querySelectorAll(".error-border").forEach((el) => el.classList.remove("error-border"));
  }

  private validarCamposPedido() {
    let valido = true;
    this.resetErrores();

    const producto = document.getElementById("producto") as HTMLSelectElement | null;
    if (producto && !producto.value) {
      valido = false;
      this.setError(producto, "err-producto", "Selecciona un producto");
    }

    const de = document.getElementById("de") as HTMLInputElement | null;
    if (de && !de.value.trim()) {
      valido = false;
      this.setError(de, "err-de", "Campo obligatorio");
    }

    const para = document.getElementById("para") as HTMLInputElement | null;
    if (para && !para.value.trim()) {
      valido = false;
      this.setError(para, "err-para", "Campo obligatorio");
    }

    const fecha = document.getElementById("fechaEntrega") as HTMLInputElement | null;
    if (fecha) {
      if (!fecha.value) {
        valido = false;
        this.setError(fecha, "err-fechaEntrega", "Campo obligatorio");
      } else {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const fechaIngresada = new Date(fecha.value);
        if (fechaIngresada < hoy) {
          valido = false;
          this.setError(fecha, "err-fechaEntrega", "No se permiten fechas pasadas");
        }
      }
    }

    const hora = document.getElementById("horaEntrega") as HTMLInputElement | null;
    if (hora && !hora.value) {
      valido = false;
      this.setError(hora, "err-horaEntrega", "Campo obligatorio");
    }

    const sorpresa = document.querySelector<HTMLInputElement>("input[name='sorpresa']:checked");
    if (!sorpresa) {
      valido = false;
      const errSorpresa = document.getElementById("err-sorpresa");
      if (errSorpresa) errSorpresa.textContent = "Selecciona una opción";
    }

    return valido;
  }
}
