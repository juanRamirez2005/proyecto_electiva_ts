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
  debugger
  const adicionalesHTML = adicionales.map(adicional => `
    <option value="${adicional.id}">
      ${adicional.nombre} (+$${adicional.precio})
    </option>
  `).join("");
  adicionalesSelect.innerHTML += adicionalesHTML;
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

function agregarPedido() {
  document.getElementById("btnAgregarPedido")?.addEventListener("click", () => {
    console.log("entró?");
    
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

    console.log(pedido);
    
    pedidos.push(pedido);
  });
}

function renderizarPedidos() {
  const resumenDiv = document.getElementById("resumenPedidos")!;
  resumenDiv.innerHTML = "";

  pedidos.forEach((p, index) => {
    const card = document.createElement("div");
    card.className = "pedido-card";
    card.style.display = "inline-block";
    card.style.margin = "0 10px";
    card.style.padding = "10px";
    card.style.border = "1px solid #ccc";
    card.style.borderRadius = "8px";

    card.innerHTML = `
      <strong>${p.producto}</strong><br>
      De: ${p.de} → Para: ${p.para}<br>
      Fecha: ${p.fechaEntrega} ${p.horaEntrega}<br>
    `;

    resumenDiv.appendChild(card)
  })
}