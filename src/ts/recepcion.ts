import {
  calcularTotalOpciones,
  calcularTotalAdicionales,
  haversine,
  calcularValorDomicilio
} from "./calculos.js";

import { Pedido } from "./recepcion/entity/Pedido.js";

setProductoSelector();
const form = document.getElementById("orderForm");
const coordenadasNegocio = { lat: 4.52491, lon: -75.69787 };
 insertExtra()

// Cuando el usuario envíe el formulario
form?.addEventListener("submit", async (e) => {
  e.preventDefault(); // evitar recargar página

  // 📌 1. Datos del cliente
  const cliente: { nombre: string, telefono: string } = {
    nombre: (document.getElementById("clienteNombre") as HTMLInputElement).value,
    telefono: (document.getElementById("clienteTelefono") as HTMLInputElement).value
  };;

  // 📌 2. Datos del pedido
  const pedido: { producto: string, personalizacion: string, extras: Array<number>, fechaEntrega: string, horaEntrega: string, sorpresa: boolean } = {
    producto: (document.getElementById("producto") as HTMLInputElement).value,
    personalizacion: (document.getElementById("personalizacion") as HTMLInputElement).value,
    extras: Array.from(document.querySelectorAll("#extrasList li")).map(li => Number(li.id)),
    fechaEntrega: (document.getElementById("fechaEntrega") as HTMLInputElement).value,
    horaEntrega: (document.getElementById("horaEntrega") as HTMLInputElement).value,
    sorpresa: (document.querySelector("input[name='sorpresa']:checked") as HTMLInputElement)?.checked
  };

  // 📌 3. Datos del destinatario
  const destinatario = {
    nombre: (document.getElementById("destNombre") as HTMLInputElement).value,
    direccion: (document.getElementById("destDireccion") as HTMLInputElement).value,
    telefono: (document.getElementById("destTelefono") as HTMLInputElement).value,
  };

  console.log("Cliente:", cliente);
  console.log("Pedido:", pedido);
  console.log("Destinatario:", destinatario);

  // 📌 4. Llamar función que calcule totales
  await calcularTotales(cliente, pedido, destinatario);
});


async function calcularTotales(cliente: { nombre: string, telefono: string }, pedido: { producto: string, personalizacion: string, extras: Array<number>, fechaEntrega: string, horaEntrega: string, sorpresa: boolean }, destinatario: { nombre: string, direccion: string, telefono: string }) {
  try {
    const { opciones, adicionales } = await getJsonData();

    // Buscar el producto elegido
    const producto = opciones.find(o => o.opcion === Number(pedido.producto));
    const totalOpciones = producto ? producto.precio : 0;

    // Extras seleccionados (si usas IDs en lugar de texto en el <ul>, mejor)
    const extrasSeleccionados = adicionales.filter(a =>
      pedido.extras.includes(a.id)
    );
    const totalAdicionales = extrasSeleccionados.reduce((sum, e) => sum + e.precio, 0);

    // Distancia ficticia (aquí podrías obtener coords reales con API de geocoding)
    const coordenadasCliente = { lat: 4.58138, lon: -75.63532 };
    const distancia = haversine(
      coordenadasNegocio.lat, coordenadasNegocio.lon,
      coordenadasCliente.lat, coordenadasCliente.lon
    );
    const totalDomicilio = calcularValorDomicilio(distancia);

    // Total general
    const totalPedido = totalOpciones + totalAdicionales + totalDomicilio;

    console.log("📦 Producto:", producto?.opcion, "→ $" + totalOpciones);
    console.log("➕ Extras:", extrasSeleccionados.map(e => e.nombre), "→ $" + totalAdicionales);
    console.log("🚚 Domicilio:", distancia.toFixed(2) + " km → $" + totalDomicilio);
    console.log("🧾 TOTAL PEDIDO: $" + totalPedido);
  } catch (err) {
    console.error("❌ Error al calcular totales:", err);
  }
}

const extrasList = document.querySelectorAll('.quantity-control button');
extrasList.forEach(button => {
  button.addEventListener('click', () => {
    const input = document.querySelector('#extraQty') as HTMLInputElement;
    const currentValue = Number(input.textContent);

    if (button.classList.contains('increase')) {
      input.textContent = (currentValue + 1).toString();
    } else {
      input.textContent = (currentValue > 1 ? currentValue - 1 : 1).toString();
    }
  });
});

async function setProductoSelector() {
  const productoSelect = document.getElementById('producto') as HTMLSelectElement;
  const adicionalesSelect = document.getElementById('extraSelect') as HTMLSelectElement;
  const { opciones, adicionales } = await getJsonData();
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
}

function insertExtra() {
  const button = document.getElementById('addExtraBtn') as HTMLButtonElement;
  const extraSelect = document.getElementById('extraSelect') as HTMLSelectElement;

  button.addEventListener('click', () => {
    const selectedOption: HTMLOptionElement | undefined = extraSelect.options[extraSelect.selectedIndex];
    if (selectedOption && selectedOption.value !== "") {
      const li = document.createElement('li');
      li.textContent = `${selectedOption.text} (${(document.getElementById('extraQty') as HTMLSpanElement).textContent})`;
      (document.getElementById('extrasList') as HTMLUListElement).appendChild(li);
    }
  });
}

async function getJsonData(): Promise<{
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
  adicionales: Array<{
    id: number;
    nombre: string;
    precio: number;
  }>;
}> {

  const [opcionesRes, adicionalesRes] = await Promise.all([
    fetch("../json/opciones.json"),
    fetch("../json/adicionales.json")
  ]);

  const opciones = (await opcionesRes.json() as {
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
  }).opciones;
  const adicionales = (await adicionalesRes.json() as {
    adicionales: Array<{
      id: number;
      nombre: string;
      precio: number;
    }>;
  }
  ).adicionales;

  return {
    opciones,
    adicionales
  };
}

const pedidos: Pedido[] = [];

document.getElementById("btnAgregarPedido")?.addEventListener("click", (e) => {
  e.preventDefault();
  
  if(!validarCamposPedido()) return;

  const producto = (document.getElementById("producto") as HTMLSelectElement).value;
  const personalizacion = (document.getElementById("personalizacion") as HTMLSelectElement).value;
  //const extras = (document.getElementById("extrasList") as HTMLSelectElement).value;
  const extras: string[] = [];
  const de = (document.getElementById("de") as HTMLSelectElement).value;
  const para = (document.getElementById("para") as HTMLSelectElement).value;
  const tarjeta = (document.getElementById("tarjeta") as HTMLSelectElement).value;
  const fechaEntrega = new Date((document.getElementById("fechaEntrega") as HTMLSelectElement).value);
  const horaEntrega = new Date((document.getElementById("horaEntrega") as HTMLSelectElement).value);
  const isSorpresa = (document.querySelector<HTMLInputElement>('input[name="sorpresa"]:checked'))?.value === "si";
  const observacionesDespachador = (document.getElementById("observaciones") as HTMLSelectElement).value;

  const pedido: Pedido = {
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
  }

  pedidos.unshift(pedido);
  renderizarPedidos();
  limpiarCamposPedido();
});

function setError(input: HTMLElement, errorId: string, mensaje: string) {
  input.classList.add("error-border");
  const errorDiv = document.getElementById(errorId);
  if(errorDiv) errorDiv.textContent = mensaje;
}

function resetErrores() {
  document.querySelectorAll(".error").forEach(el => el.textContent = "");
  document.querySelectorAll(".error-border").forEach(el => el.classList.remove("error-border"));
}

function validarCamposDestinatario() {
  let valido = true;
  resetErrores();

  const nombreDestino = document.getElementById("destNombre") as HTMLSelectElement | null;
  if(nombreDestino && !nombreDestino.value.trim()) {
    valido = false;
    setError(nombreDestino, "err-nombreDestino", "Campo obligatorio");
  }

  const direccionDestino = document.getElementById("destDireccion") as HTMLSelectElement | null;
  if(direccionDestino && !direccionDestino.value.trim()) {
    valido = false;
    setError(direccionDestino, "err-direccionDestino", "Campo obligatorio");
  }

  const telefonoDestino = document.getElementById("destTelefono") as HTMLSelectElement | null;
  if(telefonoDestino && !telefonoDestino?.value.trim()) {
    valido = false;
    setError(telefonoDestino, "err-telefonoDestino", "Campo obligatorio");
  }

  
  return valido;
}

function validarCamposCliente() {
  let valido = true;
  resetErrores();

  const nombre = document.getElementById("clienteTitle") as HTMLSelectElement | null;
  if(nombre && !nombre.value.trim()) {
    valido = false;
    setError(nombre, "err-nombreCliente", "Campo obligatorio");
  }

  const telefono = document.getElementById("clienteTelefono") as HTMLSelectElement | null;
  if(telefono && !telefono?.value.trim()) {
    valido = false;
    setError(telefono, "err-telefonoCliente", "Campo obligatorio");
  }


  return valido;
}

function validarCamposPedido() {
  let valido = true;
  resetErrores();

  // Valicación de producto
  const producto = document.getElementById("producto") as HTMLSelectElement | null;
  if(producto && !producto.value) {
    valido = false;
    setError(producto, "err-producto", "Selecciona un producto")
  }

  // Validación de "de"
  const de = document.getElementById("de") as HTMLSelectElement | null;
  if(de && !de.value.trim()) {
    valido = false;
    setError(de, "err-de", "Campo obligatorio")
  }

  // Validación de "para"
  const para = document.getElementById("para") as HTMLSelectElement | null;
  if(para && !para.value.trim()) {
    valido = false;
    setError(para, "err-para", "Campo obligatorio");
  }

  // Validación de fecha
  const fecha = document.getElementById("fechaEntrega") as HTMLSelectElement | null;
  if(fecha) {
    if(!fecha.value) {
      valido = false;
      setError(fecha, "err-fechaEntrega", "Campo obligatorio");
    } else {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const fechaIngresada = new Date(fecha.value);
      if(fechaIngresada < hoy) {
        valido = false;
        setError(fecha, "err-fechaEntrega", "No se permiten fechas pasadas");
      }
    }
  }

  // Validación de hora
  const hora = document.getElementById("horaEntrega") as HTMLInputElement | null;
  if (hora && !hora.value) {
    valido = false;
    setError(hora, "err-horaEntrega", "Campo obligatorio");
  }

  // Validación de isSorpresa
  const sorpresa = document.querySelector<HTMLInputElement>("input[name='sorpresa']:checked");
  if (!sorpresa) {
    valido = false;
    const errSorpresa = document.getElementById("err-sorpresa");
    if (errSorpresa) errSorpresa.textContent = "Selecciona una opción";
  }


  return valido;
}

function limpiarCamposPedido() {
  (document.getElementById("producto") as HTMLSelectElement).value = "";
  (document.getElementById("personalizacion") as HTMLTextAreaElement).value = "";
  (document.getElementById("extraSelect") as HTMLSelectElement).value = "";
  (document.getElementById("extrasList") as HTMLUListElement).innerHTML = "";
  (document.getElementById("de") as HTMLInputElement).value = "";
  (document.getElementById("para") as HTMLInputElement).value = "";
  (document.getElementById("tarjeta") as HTMLTextAreaElement).value = "";
  (document.getElementById("fechaEntrega") as HTMLInputElement).value = "";
  (document.getElementById("horaEntrega") as HTMLInputElement).value = "";
  //(document.querySelector<HTMLInputElement>('input[name="sorpresa"]:checked'))?.checked = false;
  (document.getElementById("observaciones") as HTMLTextAreaElement).value = "";
  (document.getElementById("extraQty") as HTMLElement).textContent = "1";
}

function renderizarPedidos() {
  const resumenDiv = document.getElementById("resumenPedidos")!;
  resumenDiv.innerHTML = "";

  pedidos.forEach((p, index) => {
    const card = document.createElement("div");
    card.className = "pedido-card";
    card.innerHTML = `
      <strong>${p.producto}</strong><br>
      De: ${p.de} → Para: ${p.para}<br>
      Fecha: ${p.fechaEntrega} ${p.horaEntrega}<br>
    `;

    resumenDiv.appendChild(card)
  })
}